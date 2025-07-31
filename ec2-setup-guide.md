# EC2 Deployment Guide for User Registration API

This guide will walk you through deploying your Node.js API on AWS EC2 step by step.

## Prerequisites

- AWS Account
- EC2 instance running Amazon Linux 2
- SSH access to your EC2 instance
- MongoDB Atlas account (recommended for production)

## Step 1: Launch EC2 Instance

### 1.1 Create EC2 Instance
1. Go to AWS Console → EC2
2. Click "Launch Instance"
3. Choose "Amazon Linux 2 AMI"
4. Select instance type:
   - **t2.micro** (free tier) for testing
   - **t2.small** or **t3.small** for production
5. Configure instance details (default settings are fine)
6. Add storage (8GB minimum recommended)
7. Configure Security Group:
   ```
   - SSH (22) - Your IP
   - HTTP (80) - 0.0.0.0/0
   - HTTPS (443) - 0.0.0.0/0
   - Custom TCP (3000) - 0.0.0.0/0
   ```
8. Review and launch
9. Create or select a key pair

### 1.2 Connect to Instance
```bash
ssh -i your-key.pem ec2-user@your-instance-ip
```

## Step 2: Prepare Your Code

### 2.1 Option A: Upload via SCP
```bash
# From your local machine
scp -r -i your-key.pem . ec2-user@your-instance-ip:/home/ec2-user/
```

### 2.2 Option B: Clone from Git
```bash
# On EC2 instance
sudo yum install -y git
git clone your-repo-url
cd your-repo-directory
```

### 2.3 Option C: Use the Deployment Script
```bash
# Copy the deployment script to EC2
scp -i your-key.pem ec2-deployment.sh ec2-user@your-instance-ip:/home/ec2-user/
```

## Step 3: Run Deployment Script

### 3.1 Make Script Executable
```bash
chmod +x ec2-deployment.sh
```

### 3.2 Run Deployment
```bash
./ec2-deployment.sh
```

The script will automatically:
- Install Node.js 16
- Install PM2 process manager
- Set up the application
- Configure Nginx
- Set up firewall
- Start the application

## Step 4: Configure Environment Variables

### 4.1 Edit .env File
```bash
nano /opt/user-registration-api/.env
```

### 4.2 Set Production Values
```env
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/user-registration-api?retryWrites=true&w=majority
JWT_SECRET=your-super-secure-jwt-secret-at-least-32-characters
```

### 4.3 Restart Application
```bash
pm2 restart user-registration-api
```

## Step 5: Set Up MongoDB Atlas (Recommended)

### 5.1 Create MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create free account
3. Create new cluster
4. Set up database access (username/password)
5. Set up network access (add your EC2 IP)

### 5.2 Get Connection String
1. Click "Connect" on your cluster
2. Choose "Connect your application"
3. Copy the connection string
4. Replace `<password>` with your database password
5. Add to your .env file

## Step 6: Test Your API

### 6.1 Health Check
```bash
curl http://your-ec2-ip:3000/health
```

### 6.2 Register a User
```bash
curl -X POST http://your-ec2-ip:3000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "John Doe",
    "username": "johndoe",
    "email": "john@example.com",
    "password": "SecurePass123"
  }'
```

## Step 7: Set Up Domain and SSL (Optional)

### 7.1 Point Domain to EC2
1. Go to your domain registrar
2. Create A record pointing to your EC2 IP
3. Wait for DNS propagation (up to 48 hours)

### 7.2 Install SSL Certificate
```bash
sudo yum install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

## Step 8: Monitoring and Maintenance

### 8.1 Check Application Status
```bash
pm2 status
pm2 logs user-registration-api
```

### 8.2 Monitor System Resources
```bash
monitor-api.sh
```

### 8.3 Update Application
```bash
update-api.sh
```

## Troubleshooting

### Common Issues

#### 1. Application Won't Start
```bash
# Check logs
pm2 logs user-registration-api

# Check if port is in use
sudo netstat -tlnp | grep :3000

# Restart application
pm2 restart user-registration-api
```

#### 2. MongoDB Connection Failed
```bash
# Test MongoDB connection
curl -X POST http://localhost:3000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"fullName":"Test","username":"test","email":"test@test.com","password":"Test123"}'

# Check .env file
cat /opt/user-registration-api/.env
```

#### 3. Port 3000 Not Accessible
```bash
# Check firewall
sudo firewall-cmd --list-all

# Check security group in AWS console
# Ensure port 3000 is open
```

#### 4. Nginx Issues
```bash
# Check Nginx status
sudo systemctl status nginx

# Check Nginx configuration
sudo nginx -t

# View Nginx logs
sudo tail -f /var/log/nginx/error.log
```

### Useful Commands

```bash
# View application logs
pm2 logs user-registration-api --lines 100

# Restart application
pm2 restart user-registration-api

# Stop application
pm2 stop user-registration-api

# Start application
pm2 start user-registration-api

# View system resources
htop
free -h
df -h

# Check network connections
sudo netstat -tlnp

# View recent system logs
sudo journalctl -f
```

## Security Best Practices

### 1. Update Security Group
- Remove port 3000 from security group
- Only allow HTTP (80) and HTTPS (443)
- Use Nginx as reverse proxy

### 2. Set Up Monitoring
```bash
# Install CloudWatch agent
sudo yum install -y amazon-cloudwatch-agent

# Configure monitoring
sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-config-wizard
```

### 3. Regular Updates
```bash
# Update system packages
sudo yum update -y

# Update Node.js dependencies
cd /opt/user-registration-api
npm update
pm2 restart user-registration-api
```

### 4. Backup Strategy
```bash
# Backup application
tar -czf backup-$(date +%Y%m%d).tar.gz /opt/user-registration-api

# Backup logs
tar -czf logs-$(date +%Y%m%d).tar.gz /opt/user-registration-api/logs
```

## Cost Optimization

### 1. Use Spot Instances
- For non-critical workloads
- Can save up to 90% compared to on-demand

### 2. Right-size Instance
- Monitor CPU and memory usage
- Scale down if underutilized

### 3. Use Reserved Instances
- For predictable workloads
- Save up to 75% compared to on-demand

## Next Steps

1. **Set up monitoring and alerts**
2. **Configure automated backups**
3. **Set up CI/CD pipeline**
4. **Implement rate limiting**
5. **Add API documentation**
6. **Set up staging environment**

## Support

If you encounter issues:
1. Check the logs: `pm2 logs user-registration-api`
2. Verify environment variables: `cat /opt/user-registration-api/.env`
3. Test MongoDB connection
4. Check system resources: `monitor-api.sh` 