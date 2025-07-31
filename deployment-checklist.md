# EC2 Deployment Checklist

Use this checklist to ensure your User Registration API is properly deployed on EC2.

## Pre-Deployment Checklist

- [ ] AWS Account created and configured
- [ ] EC2 instance launched (Amazon Linux 2)
- [ ] Security group configured with required ports
- [ ] SSH key pair created/downloaded
- [ ] MongoDB Atlas account created (recommended)
- [ ] Domain name purchased (optional)

## EC2 Instance Setup

### Security Group Configuration
- [ ] SSH (22) - Your IP only
- [ ] HTTP (80) - 0.0.0.0/0
- [ ] HTTPS (443) - 0.0.0.0/0
- [ ] Custom TCP (3000) - 0.0.0.0/0 (temporary)

### Instance Specifications
- [ ] Instance Type: t2.micro (free tier) or t2.small (production)
- [ ] Storage: 8GB minimum
- [ ] Operating System: Amazon Linux 2

## Application Deployment

### Code Upload
- [ ] Application code uploaded to EC2
- [ ] Deployment script copied to EC2
- [ ] Script made executable (`chmod +x ec2-deployment.sh`)

### Environment Setup
- [ ] Node.js 16 installed
- [ ] PM2 process manager installed
- [ ] Application dependencies installed
- [ ] Environment file created and configured

### Configuration
- [ ] MongoDB Atlas connection string configured
- [ ] JWT secret set (32+ characters)
- [ ] NODE_ENV set to production
- [ ] PORT set to 3000

## Infrastructure Setup

### Firewall Configuration
- [ ] Firewalld installed and enabled
- [ ] Port 3000 opened
- [ ] HTTP and HTTPS services enabled

### Nginx Setup
- [ ] Nginx installed and enabled
- [ ] Reverse proxy configuration created
- [ ] Nginx configuration tested
- [ ] Nginx service started

### PM2 Configuration
- [ ] Application started with PM2
- [ ] PM2 configuration saved
- [ ] PM2 startup script configured
- [ ] Application running in production mode

## Testing and Verification

### Health Checks
- [ ] Application responds to health check
- [ ] MongoDB connection working
- [ ] API endpoints accessible

### API Testing
- [ ] User registration endpoint working
- [ ] Validation rules enforced
- [ ] JWT tokens generated correctly
- [ ] Error handling working properly

### Security Testing
- [ ] Firewall blocking unauthorized access
- [ ] Environment variables secured
- [ ] No sensitive data in logs

## Post-Deployment

### Monitoring Setup
- [ ] PM2 monitoring configured
- [ ] Log rotation set up
- [ ] System resource monitoring enabled

### SSL Certificate (Optional)
- [ ] Domain pointed to EC2 IP
- [ ] Certbot installed
- [ ] SSL certificate obtained
- [ ] HTTPS redirect configured

### Backup Strategy
- [ ] Application backup script created
- [ ] Database backup configured
- [ ] Log backup strategy implemented

## Performance Optimization

### System Optimization
- [ ] Node.js optimized for production
- [ ] PM2 cluster mode enabled
- [ ] Nginx caching configured
- [ ] Gzip compression enabled

### Security Hardening
- [ ] Security group rules tightened
- [ ] SSH key-based authentication only
- [ ] Regular security updates scheduled
- [ ] Monitoring alerts configured

## Documentation

### Deployment Documentation
- [ ] Deployment process documented
- [ ] Environment variables documented
- [ ] Troubleshooting guide created
- [ ] Maintenance procedures documented

### API Documentation
- [ ] API endpoints documented
- [ ] Request/response examples provided
- [ ] Error codes documented
- [ ] Authentication flow documented

## Final Verification

### End-to-End Testing
- [ ] Complete user registration flow tested
- [ ] API accessible from external clients
- [ ] Performance under load tested
- [ ] Error scenarios tested

### Monitoring Verification
- [ ] Application logs being generated
- [ ] System metrics being collected
- [ ] Alerts configured and tested
- [ ] Backup processes verified

## Go-Live Checklist

- [ ] All tests passing
- [ ] Monitoring active
- [ ] Backup strategy implemented
- [ ] Documentation complete
- [ ] Team trained on deployment process
- [ ] Rollback plan prepared
- [ ] Support contacts established

## Maintenance Schedule

### Daily
- [ ] Check application status
- [ ] Review error logs
- [ ] Monitor system resources

### Weekly
- [ ] Review performance metrics
- [ ] Update dependencies
- [ ] Backup verification

### Monthly
- [ ] Security updates
- [ ] Performance optimization
- [ ] Documentation updates

## Emergency Procedures

### Application Down
1. Check PM2 status: `pm2 status`
2. Restart application: `pm2 restart user-registration-api`
3. Check logs: `pm2 logs user-registration-api`
4. Verify MongoDB connection

### Server Issues
1. Check system resources: `htop`, `df -h`
2. Restart services: `sudo systemctl restart nginx`
3. Check network: `sudo netstat -tlnp`
4. Review system logs: `sudo journalctl -f`

### Database Issues
1. Test MongoDB connection
2. Check Atlas cluster status
3. Verify network access
4. Review connection string

## Contact Information

- **AWS Support**: Available in AWS Console
- **MongoDB Atlas Support**: Available in Atlas Dashboard
- **Application Logs**: `/opt/user-registration-api/logs/`
- **System Logs**: `/var/log/`
- **PM2 Logs**: `pm2 logs user-registration-api` 