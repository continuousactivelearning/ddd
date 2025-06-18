const axios = require('axios');
const mongoose = require('mongoose');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const BASE_URL = 'http://localhost:5000';
const API_URL = `${BASE_URL}/api`;

async function testAuthFlow() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Step 1: Check if any users exist
    console.log('\n🔍 Step 1: Checking existing users...');
    const users = await User.find({});
    console.log(`Found ${users.length} users in database`);

    if (users.length === 0) {
      console.log('❌ No users found. Please login via frontend first to create an admin user.');
      return;
    }

    // Step 2: Get the first admin user
    const adminUser = await User.findOne({ role: 'admin' });
    if (!adminUser) {
      console.log('❌ No admin user found. Please login via frontend first.');
      return;
    }

    console.log(`✅ Found admin user: ${adminUser.name} (${adminUser.email})`);

    // Step 3: Generate a fresh JWT token
    console.log('\n🔍 Step 3: Generating JWT token...');
    const token = jwt.sign(
      { userId: adminUser._id, role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    console.log(`✅ Token generated: ${token.substring(0, 20)}...`);

    // Step 4: Test /me endpoint
    console.log('\n🔍 Step 4: Testing /me endpoint...');
    try {
      const meResponse = await axios.get(`${API_URL}/admin/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      console.log(`✅ /me endpoint works: ${meResponse.status}`);
      console.log(`📄 User data: ${JSON.stringify(meResponse.data, null, 2)}`);
    } catch (error) {
      console.log(`❌ /me endpoint failed: ${error.response?.status} - ${error.response?.data?.message}`);
      return;
    }

    // Step 5: Test quiz endpoints
    console.log('\n🔍 Step 5: Testing quiz endpoints...');
    
    // Test GET /admin/quiz
    try {
      const quizResponse = await axios.get(`${API_URL}/admin/quiz`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      console.log(`✅ GET /admin/quiz works: ${quizResponse.status}`);
      console.log(`📄 Found ${quizResponse.data.length} quizzes`);
    } catch (error) {
      console.log(`❌ GET /admin/quiz failed: ${error.response?.status} - ${error.response?.data?.message}`);
    }

    // Test POST /admin/quiz/create
    const testQuizData = {
      topic: 'Test Quiz',
      difficulty: 'easy',
      questions: [
        {
          question: 'What is 2+2?',
          options: ['3', '4', '5', '6'],
          correctAnswer: 1
        }
      ]
    };

    try {
      const createResponse = await axios.post(`${API_URL}/admin/quiz/create`, testQuizData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      console.log(`✅ POST /admin/quiz/create works: ${createResponse.status}`);
      console.log(`📄 Created quiz ID: ${createResponse.data.quizId}`);
    } catch (error) {
      console.log(`❌ POST /admin/quiz/create failed: ${error.response?.status} - ${error.response?.data?.message}`);
    }

    console.log('\n🎉 Auth flow test completed!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

testAuthFlow(); 