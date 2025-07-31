const axios = require('axios');
const fs = require('fs');

const BASE_URL = 'http://localhost:3000';

async function testWithData() {
  console.log('🧪 Testing API with test data...\n');

  try {
    // Load test data
    const testData = JSON.parse(fs.readFileSync('test-data.json', 'utf8'));
    
    // Test 1: Health Check
    console.log('1. Testing health endpoint...');
    const healthResponse = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Health check passed:', healthResponse.data);
    console.log('');

    // Test 2: Register multiple users
    console.log('2. Testing user registration with sample data...');
    for (let i = 0; i < testData.sample_test_users.length; i++) {
      const user = testData.sample_test_users[i];
      try {
        const response = await axios.post(`${BASE_URL}/api/users/register`, user);
        console.log(`✅ User ${i + 1} registered: ${user.fullName}`);
      } catch (error) {
        if (error.response?.status === 409) {
          console.log(`⚠️  User ${i + 1} already exists: ${user.fullName}`);
        } else {
          console.log(`❌ Failed to register user ${i + 1}: ${error.response?.data?.message || error.message}`);
        }
      }
    }
    console.log('');

    // Test 3: Get all users
    console.log('3. Testing get all users...');
    const usersResponse = await axios.get(`${BASE_URL}/api/users`);
    console.log(`✅ Found ${usersResponse.data.count} users`);
    console.log('');

    // Test 4: Test validation errors
    console.log('4. Testing validation errors...');
    for (const errorTest of testData.user_registration.validation_error_examples) {
      try {
        await axios.post(`${BASE_URL}/api/users/register`, errorTest.request_body);
        console.log(`❌ Validation should have failed for: ${errorTest.description}`);
      } catch (error) {
        if (error.response?.status === 400) {
          console.log(`✅ Validation correctly failed for: ${errorTest.description}`);
        } else {
          console.log(`❌ Unexpected error for: ${errorTest.description}`);
        }
      }
    }
    console.log('');

    // Test 5: Get specific user (if users exist)
    if (usersResponse.data.count > 0) {
      console.log('5. Testing get user by ID...');
      const firstUserId = usersResponse.data.data[0]._id;
      try {
        const userResponse = await axios.get(`${BASE_URL}/api/users/${firstUserId}`);
        console.log(`✅ Retrieved user: ${userResponse.data.data.fullName}`);
      } catch (error) {
        console.log(`❌ Failed to get user: ${error.response?.data?.message || error.message}`);
      }
      console.log('');
    }

    console.log('🎉 All tests completed!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.code === 'ENOENT') {
      console.error('Make sure test-data.json exists in the current directory');
    }
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  testWithData();
}

module.exports = { testWithData }; 