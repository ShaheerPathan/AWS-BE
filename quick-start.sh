#!/bin/bash

echo "🚀 User Registration API - Quick Start"
echo "======================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are installed"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cp env.example .env
    echo "✅ .env file created. Please edit it with your configuration."
else
    echo "✅ .env file already exists"
fi

echo ""
echo "🎯 Next steps:"
echo "1. Edit .env file with your MongoDB URI and JWT secret"
echo "2. Start MongoDB (local or use MongoDB Atlas)"
echo "3. Run: npm run dev"
echo "4. Test the API with: node test-api.js"
echo ""
echo "📚 For AWS deployment, see aws-deployment.md"
echo "📖 For API documentation, see README.md" 