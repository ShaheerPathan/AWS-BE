# MongoDB Atlas Setup Guide

This guide will walk you through setting up MongoDB Atlas for your User Registration API.

## Prerequisites

- A web browser
- Basic understanding of cloud databases
- Your Node.js application ready

## Step 1: Create MongoDB Atlas Account

1. **Visit MongoDB Atlas**
   - Go to [https://cloud.mongodb.com](https://cloud.mongodb.com)
   - Click "Try Free" or "Sign Up"

2. **Create Account**
   - Fill in your email, password, and account details
   - Accept the terms of service
   - Click "Create Account"

3. **Verify Email**
   - Check your email for verification link
   - Click the verification link

## Step 2: Create a Project

1. **Create New Project**
   - Click "New Project"
   - Enter a project name (e.g., "User Registration API")
   - Click "Next"

2. **Add Team Members (Optional)**
   - You can skip this step for now
   - Click "Create Project"

## Step 3: Create a Cluster

1. **Build a Database**
   - Click "Build a Database"
   - Choose "FREE" tier (M0 Sandbox)
   - Click "Create"

2. **Choose Cloud Provider & Region**
   - Select your preferred cloud provider (AWS, Google Cloud, or Azure)
   - Choose a region close to your users
   - Click "Create"

3. **Wait for Cluster Creation**
   - This may take 2-5 minutes
   - You'll see a green checkmark when ready

## Step 4: Set Up Database Access

1. **Navigate to Database Access**
   - In the left sidebar, click "Database Access"
   - Click "Add New Database User"

2. **Create Database User**
   - **Authentication Method**: Password
   - **Username**: Create a username (e.g., "api-user")
   - **Password**: Create a strong password (save this!)
   - **Database User Privileges**: "Read and write to any database"
   - Click "Add User"

3. **Save Credentials**
   - Note down your username and password
   - You'll need these for your connection string

## Step 5: Set Up Network Access

1. **Navigate to Network Access**
   - In the left sidebar, click "Network Access"
   - Click "Add IP Address"

2. **Configure IP Access**
   - **For Development**: Click "Allow Access from Anywhere" (0.0.0.0/0)
   - **For Production**: Add specific IP addresses
   - Click "Confirm"

## Step 6: Get Your Connection String

1. **Connect to Your Cluster**
   - Go back to "Database" in the left sidebar
   - Click "Connect"

2. **Choose Connection Method**
   - Click "Connect your application"
   - Choose "Node.js" as your driver
   - Copy the connection string

3. **Customize Connection String**
   - Replace `<username>` with your database username
   - Replace `<password>` with your database password
   - Replace `<dbname>` with your database name (e.g., "user-registration-api")

## Step 7: Configure Your Application

1. **Update Environment Variables**
   ```env
   MONGODB_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/user-registration-api?retryWrites=true&w=majority
   ```

2. **Test Connection**
   - Start your application
   - Check console for "MongoDB Atlas Connected" message

## Connection String Format

```
mongodb+srv://username:password@cluster-name.mongodb.net/database-name?retryWrites=true&w=majority
```

### Parameters Explained:
- `username`: Your Atlas database username
- `password`: Your Atlas database password
- `cluster-name`: Your cluster identifier
- `database-name`: Your database name
- `retryWrites=true`: Enables automatic retry for write operations
- `w=majority`: Ensures write acknowledgment from majority of replica set

## Security Best Practices

### 1. Password Security
- Use strong, unique passwords
- Store passwords securely (not in code)
- Rotate passwords regularly

### 2. Network Security
- **Development**: Allow access from anywhere (0.0.0.0/0)
- **Production**: Restrict to specific IP addresses
- Use VPN or private networks when possible

### 3. Database User Permissions
- Use least privilege principle
- Create separate users for different applications
- Regularly review and update permissions

### 4. Environment Variables
- Never commit credentials to version control
- Use environment variables for sensitive data
- Use different credentials for different environments

## Troubleshooting

### Common Issues

#### 1. Connection Timeout
**Symptoms**: Connection fails with timeout error
**Solutions**:
- Check your internet connection
- Verify IP address is whitelisted in Atlas
- Check if Atlas service is available

#### 2. Authentication Failed
**Symptoms**: "Authentication failed" error
**Solutions**:
- Verify username and password are correct
- Check if user has proper permissions
- Ensure user is not locked out

#### 3. Network Access Denied
**Symptoms**: "Network access denied" error
**Solutions**:
- Add your IP address to Atlas whitelist
- Check if you're behind a firewall/proxy
- Try allowing access from anywhere (for testing)

#### 4. SSL/TLS Issues
**Symptoms**: SSL certificate errors
**Solutions**:
- Ensure your connection string uses `mongodb+srv://`
- Check if your system trusts Atlas certificates
- Update your Node.js version if needed

### Debugging Steps

1. **Check Connection String**
   ```javascript
   console.log('MongoDB URI:', process.env.MONGODB_URI);
   ```

2. **Test Connection Manually**
   ```javascript
   const mongoose = require('mongoose');
   
   mongoose.connect(process.env.MONGODB_URI)
     .then(() => console.log('Connected successfully'))
     .catch(err => console.error('Connection error:', err));
   ```

3. **Check Atlas Dashboard**
   - Verify cluster is running
   - Check database user exists
   - Confirm IP is whitelisted

4. **Network Diagnostics**
   ```bash
   # Test connectivity to Atlas
   ping cluster-name.mongodb.net
   
   # Check if port 27017 is reachable
   telnet cluster-name.mongodb.net 27017
   ```

## Monitoring and Maintenance

### 1. Monitor Usage
- Check Atlas dashboard regularly
- Monitor connection count
- Watch for performance issues

### 2. Backup Strategy
- Atlas provides automatic backups
- Consider additional backup solutions
- Test restore procedures

### 3. Scaling Considerations
- Monitor database size
- Plan for scaling when needed
- Consider read replicas for high traffic

## Cost Optimization

### Free Tier Limits
- 512MB storage
- Shared RAM and vCPU
- 500 connections
- 1000 operations per second

### Upgrade Considerations
- Monitor usage metrics
- Plan upgrades before hitting limits
- Consider reserved instances for production

## Support Resources

- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [MongoDB Community Forums](https://developer.mongodb.com/community/forums/)
- [Atlas Status Page](https://status.cloud.mongodb.com/)

## Next Steps

After setting up Atlas:

1. **Test Your Application**
   - Run your API locally
   - Test all endpoints
   - Verify data persistence

2. **Deploy to Production**
   - Update environment variables
   - Configure production IP whitelist
   - Set up monitoring

3. **Security Review**
   - Audit user permissions
   - Review network access
   - Implement additional security measures

4. **Performance Optimization**
   - Monitor query performance
   - Add database indexes
   - Optimize connection pooling 