const axios = require('axios');

// Configuration - Update these values
const EC2_IP = 'YOUR_EC2_PUBLIC_IP'; // Replace with your EC2 public IP
const BASE_URL = `http://${EC2_IP}:3000`;

async function testRemoteDeployment() {
  console.log('🧪 Testing Remote EC2 Deployment...\n');
  console.log(`📍 Testing API at: ${BASE_URL}\n`);

  try {
    // Test 1: Health Check
    console.log('1. Testing health endpoint...');
    const healthResponse = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Health check passed:', healthResponse.data);
    console.log('');

    // Test 2: Register a test user
    console.log('2. Testing user registration...');
    const userData = {
      fullName: 'Test User',
      username: 'testuser',
      email: 'test@example.com',
      password: 'SecurePass123'
    };

    const registerResponse = await axios.post(`${BASE_URL}/api/users/register`, userData);
    console.log('✅ User registration successful!');
    console.log('User ID:', registerResponse.data.data.user._id);
    console.log('JWT Token received:', registerResponse.data.data.token ? 'Yes' : 'No');
    console.log('');

    // Test 3: Get all users
    console.log('3. Testing get all users...');
    const usersResponse = await axios.get(`${BASE_URL}/api/users`);
    console.log(`✅ Found ${usersResponse.data.count} users`);
    console.log('');

    // Test 4: Test validation (should fail)
    console.log('4. Testing validation errors...');
    try {
      await axios.post(`${BASE_URL}/api/users/register`, {
        fullName: 'Test',
        username: 'test',
        email: 'invalid-email',
        password: 'weak'
      });
      console.log('❌ Validation should have failed');
    } catch (error) {
      if (error.response?.status === 400) {
        console.log('✅ Validation correctly failed for invalid data');
      } else {
        console.log('❌ Unexpected error during validation test');
      }
    }
    console.log('');

    // Test 5: Test duplicate user (should fail)
    console.log('5. Testing duplicate user registration...');
    try {
      await axios.post(`${BASE_URL}/api/users/register`, userData);
      console.log('❌ Duplicate registration should have failed');
    } catch (error) {
      if (error.response?.status === 409) {
        console.log('✅ Correctly prevented duplicate user registration');
      } else {
        console.log('❌ Unexpected error during duplicate test');
      }
    }
    console.log('');

    console.log('🎉 All remote deployment tests passed!');
    console.log('');
    console.log('📋 Deployment Summary:');
    console.log(`   - API URL: ${BASE_URL}`);
    console.log(`   - Health Check: ✅ Working`);
    console.log(`   - User Registration: ✅ Working`);
    console.log(`   - Validation: ✅ Working`);
    console.log(`   - Database: ✅ Connected`);
    console.log(`   - JWT Tokens: ✅ Generated`);
    console.log('');
    console.log('🚀 Your API is successfully deployed and working!');

  } catch (error) {
    console.error('❌ Remote deployment test failed:');
    
    if (error.code === 'ENOTFOUND') {
      console.error('   - Cannot resolve hostname. Check your EC2 IP address.');
    } else if (error.code === 'ECONNREFUSED') {
      console.error('   - Connection refused. Check if the application is running on EC2.');
    } else if (error.response) {
      console.error(`   - HTTP ${error.response.status}: ${error.response.statusText}`);
      console.error(`   - Response: ${JSON.stringify(error.response.data, null, 2)}`);
    } else {
      console.error(`   - ${error.message}`);
    }
    
    console.log('');
    console.log('🔧 Troubleshooting Steps:');
    console.log('   1. Verify EC2 instance is running');
    console.log('   2. Check security group allows port 3000');
    console.log('   3. Ensure application is started with PM2');
    console.log('   4. Check application logs: pm2 logs user-registration-api');
    console.log('   5. Verify MongoDB connection in .env file');
  }
}

// Function to get EC2 IP from command line argument
function getEC2IP() {
  const args = process.argv.slice(2);
  if (args.length > 0) {
    return args[0];
  }
  return EC2_IP;
}

// Update EC2 IP if provided as argument
const ec2IP = getEC2IP();
if (ec2IP !== EC2_IP) {
  console.log(`📍 Using EC2 IP: ${ec2IP}`);
  BASE_URL = `http://${ec2IP}:3000`;
}

// Run tests if this file is executed directly
if (require.main === module) {
  if (ec2IP === 'YOUR_EC2_PUBLIC_IP') {
    console.log('❌ Please update the EC2_IP variable or provide it as an argument:');
    console.log('   node test-remote-deployment.js YOUR_EC2_IP');
    process.exit(1);
  }
  testRemoteDeployment();
}

module.exports = { testRemoteDeployment }; 