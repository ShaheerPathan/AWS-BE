const axios = require('axios');

const API_BASE_URL = 'http://localhost:3000/api';

// Test user data
const testUser = {
  fullName: 'John Doe',
  username: 'johndoe',
  email: 'john@example.com',
  password: 'Password123'
};

const loginData = {
  email: 'john@example.com',
  password: 'Password123'
};

async function testAPI() {
  console.log('🧪 Testing User Registration API...\n');

  try {
    // Test 1: Health Check
    console.log('1️⃣ Testing Health Check...');
    const healthResponse = await axios.get('http://localhost:3000/health');
    console.log('✅ Health Check:', healthResponse.data);
    console.log('');

    // Test 2: Register User
    console.log('2️⃣ Testing User Registration...');
    const registerResponse = await axios.post(`${API_BASE_URL}/users/register`, testUser);
    console.log('✅ Registration Response:', {
      success: registerResponse.data.success,
      message: registerResponse.data.message,
      user: {
        id: registerResponse.data.data.user._id,
        fullName: registerResponse.data.data.user.fullName,
        username: registerResponse.data.data.user.username,
        email: registerResponse.data.data.user.email
      },
      token: registerResponse.data.data.token ? 'JWT Token Generated' : 'No Token'
    });
    console.log('');

    // Test 3: Login User
    console.log('3️⃣ Testing User Login...');
    const loginResponse = await axios.post(`${API_BASE_URL}/users/login`, loginData);
    console.log('✅ Login Response:', {
      success: loginResponse.data.success,
      message: loginResponse.data.message,
      user: {
        id: loginResponse.data.data.user._id,
        fullName: loginResponse.data.data.user.fullName,
        username: loginResponse.data.data.user.username,
        email: loginResponse.data.data.user.email
      },
      token: loginResponse.data.data.token ? 'JWT Token Generated' : 'No Token'
    });
    console.log('');

    // Test 4: Get All Users
    console.log('4️⃣ Testing Get All Users...');
    const usersResponse = await axios.get(`${API_BASE_URL}/users`);
    console.log('✅ Get Users Response:', {
      success: usersResponse.data.success,
      count: usersResponse.data.count,
      users: usersResponse.data.data.map(user => ({
        id: user._id,
        fullName: user.fullName,
        username: user.username,
        email: user.email
      }))
    });
    console.log('');

    // Test 5: Get User by ID
    if (usersResponse.data.data.length > 0) {
      console.log('5️⃣ Testing Get User by ID...');
      const userId = usersResponse.data.data[0]._id;
      const userResponse = await axios.get(`${API_BASE_URL}/users/${userId}`);
      console.log('✅ Get User Response:', {
        success: userResponse.data.success,
        user: {
          id: userResponse.data.data._id,
          fullName: userResponse.data.data.fullName,
          username: userResponse.data.data.username,
          email: userResponse.data.data.email
        }
      });
      console.log('');
    }

    // Test 6: JWT Token Payload Analysis
    console.log('6️⃣ Testing JWT Token Payload...');
    if (registerResponse.data.data.token) {
      const token = registerResponse.data.data.token;
      const tokenParts = token.split('.');
      if (tokenParts.length === 3) {
        const payload = JSON.parse(Buffer.from(tokenParts[1], 'base64').toString());
        console.log('✅ JWT Token Payload:', {
          id: payload.id,
          username: payload.username,
          fullname: payload.fullname,
          email: payload.email,
          iat: new Date(payload.iat * 1000).toISOString(),
          exp: new Date(payload.exp * 1000).toISOString()
        });
      }
    }
    console.log('');

    console.log('🎉 All tests completed successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error.response ? {
      status: error.response.status,
      data: error.response.data
    } : error.message);
  }
}

// Run tests
testAPI(); 