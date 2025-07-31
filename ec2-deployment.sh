#!/bin/bash

# EC2 Deployment Script for User Registration API
# This script automates the deployment process on Amazon Linux 2

set -e  # Exit on any error

echo "🚀 Starting EC2 Deployment for User Registration API"
echo "=================================================="

# Configuration
APP_NAME="user-registration-api"
APP_DIR="/opt/$APP_NAME"
SERVICE_USER="nodejs"
NODE_VERSION="16"
PORT="3000"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running as root
if [[ $EUID -eq 0 ]]; then
    print_error "This script should not be run as root"
    exit 1
fi

print_status "Starting deployment process..."

# Step 1: Update system
print_status "Updating system packages..."
sudo yum update -y

# Step 2: Install Node.js
print_status "Installing Node.js $NODE_VERSION..."
if ! command -v node &> /dev/null; then
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
    source ~/.bashrc
    nvm install $NODE_VERSION
    nvm use $NODE_VERSION
    nvm alias default $NODE_VERSION
else
    print_warning "Node.js is already installed"
fi

# Step 3: Install PM2 globally
print_status "Installing PM2 process manager..."
npm install -g pm2

# Step 4: Create application directory
print_status "Creating application directory..."
sudo mkdir -p $APP_DIR
sudo chown $USER:$USER $APP_DIR

# Step 5: Copy application files
print_status "Copying application files..."
cp -r . $APP_DIR/
cd $APP_DIR

# Step 6: Install dependencies
print_status "Installing Node.js dependencies..."
npm install --production

# Step 7: Create logs directory
print_status "Creating logs directory..."
mkdir -p logs

# Step 8: Set up environment file
print_status "Setting up environment configuration..."
if [ ! -f .env ]; then
    cp env.example .env
    print_warning "Please edit .env file with your production settings:"
    print_warning "  - MONGODB_URI (use MongoDB Atlas for production)"
    print_warning "  - JWT_SECRET (generate a strong secret)"
    print_warning "  - NODE_ENV=production"
fi

# Step 9: Configure firewall
print_status "Configuring firewall..."
sudo yum install -y firewalld
sudo systemctl start firewalld
sudo systemctl enable firewalld
sudo firewall-cmd --permanent --add-port=$PORT/tcp
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload

# Step 10: Start application with PM2
print_status "Starting application with PM2..."
pm2 start ecosystem.config.js --env production

# Step 11: Save PM2 configuration
print_status "Saving PM2 configuration..."
pm2 save
pm2 startup

# Step 12: Configure Nginx (optional but recommended)
print_status "Installing and configuring Nginx..."
sudo yum install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Create Nginx configuration
sudo tee /etc/nginx/conf.d/$APP_NAME.conf > /dev/null <<EOF
server {
    listen 80;
    server_name _;

    location / {
        proxy_pass http://localhost:$PORT;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

# Test Nginx configuration
sudo nginx -t
sudo systemctl reload nginx

# Step 13: Set up SSL with Let's Encrypt (optional)
print_warning "To enable HTTPS, install Certbot and run:"
print_warning "sudo yum install -y certbot python3-certbot-nginx"
print_warning "sudo certbot --nginx -d your-domain.com"

# Step 14: Create monitoring script
print_status "Creating monitoring script..."
sudo tee /usr/local/bin/monitor-api.sh > /dev/null <<'EOF'
#!/bin/bash
echo "=== User Registration API Status ==="
pm2 status
echo ""
echo "=== System Resources ==="
free -h
echo ""
echo "=== Disk Usage ==="
df -h
echo ""
echo "=== Recent Logs ==="
tail -n 20 /opt/user-registration-api/logs/combined.log
EOF

sudo chmod +x /usr/local/bin/monitor-api.sh

# Step 15: Create deployment script
print_status "Creating deployment update script..."
sudo tee /usr/local/bin/update-api.sh > /dev/null <<'EOF'
#!/bin/bash
cd /opt/user-registration-api
git pull origin main
npm install --production
pm2 restart user-registration-api
echo "Application updated successfully!"
EOF

sudo chmod +x /usr/local/bin/update-api.sh

# Step 16: Final status check
print_status "Performing final status check..."
sleep 5

if pm2 list | grep -q "user-registration-api.*online"; then
    print_status "✅ Application is running successfully!"
else
    print_error "❌ Application failed to start. Check logs with: pm2 logs user-registration-api"
    exit 1
fi

# Display useful information
echo ""
echo "🎉 Deployment completed successfully!"
echo "=================================="
echo ""
echo "📋 Useful Commands:"
echo "  - Check status: pm2 status"
echo "  - View logs: pm2 logs user-registration-api"
echo "  - Monitor: monitor-api.sh"
echo "  - Update: update-api.sh"
echo "  - Restart: pm2 restart user-registration-api"
echo ""
echo "🌐 Access your API:"
echo "  - HTTP: http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4):$PORT"
echo "  - Health check: http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4):$PORT/health"
echo ""
echo "📝 Next Steps:"
echo "  1. Edit .env file with production settings"
echo "  2. Set up MongoDB Atlas for database"
echo "  3. Configure domain name and SSL"
echo "  4. Set up monitoring and alerts"
echo ""
print_status "Deployment script completed!" 