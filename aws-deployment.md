# AWS Deployment Guide

This guide provides step-by-step instructions for deploying the User Registration API to various AWS services.

## Prerequisites

- AWS Account
- AWS CLI installed and configured
- Node.js and npm installed locally
- MongoDB Atlas account (recommended for production)

## Option 1: AWS Elastic Beanstalk (Recommended)

### Step 1: Install EB CLI
```bash
pip install awsebcli
```

### Step 2: Initialize EB Application
```bash
eb init
```
Follow the prompts:
- Select your region
- Create new application: `user-registration-api`
- Select Node.js platform
- Use CodeCommit (optional)

### Step 3: Create Environment
```bash
eb create user-registration-api-prod
```

### Step 4: Configure Environment Variables
```bash
eb setenv NODE_ENV=production
eb setenv MONGODB_URI=your-mongodb-atlas-connection-string
eb setenv JWT_SECRET=your-super-secure-jwt-secret
```

### Step 5: Deploy
```bash
eb deploy
```

### Step 6: Open Application
```bash
eb open
```

## Option 2: AWS EC2 with PM2

### Step 1: Launch EC2 Instance
1. Go to AWS Console → EC2
2. Launch Instance
3. Choose Amazon Linux 2 AMI
4. Select t2.micro (free tier) or larger
5. Configure Security Group:
   - HTTP (80)
   - HTTPS (443)
   - SSH (22)
   - Custom TCP (3000) for Node.js

### Step 2: Connect to Instance
```bash
ssh -i your-key.pem ec2-user@your-instance-ip
```

### Step 3: Install Node.js
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 16
nvm use 16
```

### Step 4: Install MongoDB (Optional - Use Atlas instead)
```bash
sudo yum update -y
sudo yum install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod
```

### Step 5: Deploy Application
```bash
# Clone repository
git clone your-repo-url
cd user-registration-api

# Install dependencies
npm install

# Create environment file
cp env.example .env
nano .env  # Edit with your values

# Install PM2
npm install -g pm2

# Start application
pm2 start server.js --name "user-api"

# Save PM2 configuration
pm2 startup
pm2 save
```

### Step 6: Configure Nginx (Optional)
```bash
sudo yum install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

Create nginx config:
```bash
sudo nano /etc/nginx/conf.d/user-api.conf
```

Add:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Option 3: Docker + AWS ECS

### Step 1: Create ECR Repository
```bash
aws ecr create-repository --repository-name user-registration-api
```

### Step 2: Build and Push Docker Image
```bash
# Get login token
aws ecr get-login-password --region your-region | docker login --username AWS --password-stdin your-account-id.dkr.ecr.your-region.amazonaws.com

# Build image
docker build -t user-registration-api .

# Tag image
docker tag user-registration-api:latest your-account-id.dkr.ecr.your-region.amazonaws.com/user-registration-api:latest

# Push image
docker push your-account-id.dkr.ecr.your-region.amazonaws.com/user-registration-api:latest
```

### Step 3: Create ECS Cluster
1. Go to AWS Console → ECS
2. Create Cluster: `user-api-cluster`
3. Choose Networking only

### Step 4: Create Task Definition
```json
{
  "family": "user-registration-api",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "256",
  "memory": "512",
  "executionRoleArn": "arn:aws:iam::your-account:role/ecsTaskExecutionRole",
  "containerDefinitions": [
    {
      "name": "user-api",
      "image": "your-account-id.dkr.ecr.your-region.amazonaws.com/user-registration-api:latest",
      "portMappings": [
        {
          "containerPort": 3000,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "NODE_ENV",
          "value": "production"
        },
        {
          "name": "MONGODB_URI",
          "value": "your-mongodb-atlas-uri"
        },
        {
          "name": "JWT_SECRET",
          "value": "your-jwt-secret"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/user-registration-api",
          "awslogs-region": "your-region",
          "awslogs-stream-prefix": "ecs"
        }
      }
    }
  ]
}
```

### Step 5: Create Service
1. Create Application Load Balancer
2. Create ECS Service
3. Configure target group
4. Set up auto-scaling

## Option 4: AWS Lambda + API Gateway

### Step 1: Install Serverless Framework
```bash
npm install -g serverless
```

### Step 2: Create serverless.yml
```yaml
service: user-registration-api

provider:
  name: aws
  runtime: nodejs16.x
  region: us-east-1
  environment:
    MONGODB_URI: ${env:MONGODB_URI}
    JWT_SECRET: ${env:JWT_SECRET}

functions:
  register:
    handler: handlers/register.handler
    events:
      - http:
          path: /api/users/register
          method: post
          cors: true

  getUsers:
    handler: handlers/getUsers.handler
    events:
      - http:
          path: /api/users
          method: get
          cors: true

  health:
    handler: handlers/health.handler
    events:
      - http:
          path: /health
          method: get
```

### Step 3: Deploy
```bash
serverless deploy
```

## Environment Variables for Production

Create a `.env` file with:
```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/user-registration-api?retryWrites=true&w=majority
JWT_SECRET=your-super-secure-jwt-secret-at-least-32-characters
PORT=3000
```

## Security Considerations

1. **Use MongoDB Atlas** instead of self-hosted MongoDB
2. **Generate strong JWT secrets** (32+ characters)
3. **Enable HTTPS** in production
4. **Set up proper CORS** for your domain
5. **Use AWS Secrets Manager** for sensitive data
6. **Enable CloudWatch logging**
7. **Set up monitoring and alerts**

## Monitoring and Logging

### CloudWatch Setup
```bash
# Create log group
aws logs create-log-group --log-group-name /aws/user-registration-api

# Set retention
aws logs put-retention-policy --log-group-name /aws/user-registration-api --retention-in-days 30
```

### Health Check
Your API includes a health check endpoint at `/health` that returns:
```json
{
  "status": "OK",
  "message": "User Registration API is running",
  "timestamp": "2023-01-01T00:00:00.000Z"
}
```

## Cost Optimization

1. **Use t2.micro** for development
2. **Enable auto-scaling** based on CPU/memory
3. **Use Spot Instances** for non-critical workloads
4. **Set up CloudWatch alarms** for cost monitoring
5. **Use AWS Free Tier** for testing

## Troubleshooting

### Common Issues

1. **Port 3000 not accessible**
   - Check security group rules
   - Verify application is running

2. **MongoDB connection failed**
   - Check connection string
   - Verify network access
   - Check IP whitelist in Atlas

3. **JWT errors**
   - Verify JWT_SECRET is set
   - Check token expiration

4. **CORS errors**
   - Configure CORS for your domain
   - Check preflight requests

### Useful Commands

```bash
# Check application logs
eb logs

# SSH into EB environment
eb ssh

# Check PM2 status
pm2 status

# View application logs
pm2 logs user-api

# Restart application
pm2 restart user-api
``` 