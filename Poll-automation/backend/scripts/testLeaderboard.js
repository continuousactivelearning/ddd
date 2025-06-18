const mongoose = require('mongoose');
const axios = require('axios');

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/poll-automation', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const API_URL = 'http://localhost:5000';

// Test admin credentials
const adminCredentials = {
  email: 'admin@example.com',
  password: 'admin123'
};

let authToken = '';
let testQuizId = '';

async function loginAdmin() {
  try {
    const response = await axios.post(`${API_URL}/api/admin/auth/login`, adminCredentials);
    authToken = response.data.token;
    console.log('✅ Admin login successful');
    return true;
  } catch (error) {
    console.error('❌ Admin login failed:', error.response?.data || error.message);
    return false;
  }
}

async function getQuizzes() {
  try {
    const response = await axios.get(`${API_URL}/api/admin/quiz`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    if (response.data && response.data.length > 0) {
      testQuizId = response.data[0]._id;
      console.log(`✅ Found quiz with ID: ${testQuizId}`);
      return true;
    } else {
      console.log('⚠️ No quizzes found');
      return false;
    }
  } catch (error) {
    console.error('❌ Failed to get quizzes:', error.response?.data || error.message);
    return false;
  }
}

async function testAnalytics() {
  if (!testQuizId) {
    console.log('⚠️ No quiz ID available for analytics test');
    return false;
  }

  try {
    const response = await axios.get(`${API_URL}/api/admin/quiz/${testQuizId}/analytics`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    console.log('✅ Analytics endpoint working');
    console.log('Analytics data:', response.data);
    return true;
  } catch (error) {
    console.error('❌ Analytics test failed:', error.response?.data || error.message);
    return false;
  }
}

async function testLeaderboard() {
  if (!testQuizId) {
    console.log('⚠️ No quiz ID available for leaderboard test');
    return false;
  }

  try {
    const response = await axios.get(`${API_URL}/api/admin/quiz/${testQuizId}/leaderboard`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    console.log('✅ Leaderboard endpoint working');
    console.log('Leaderboard data:', response.data);
    return true;
  } catch (error) {
    console.error('❌ Leaderboard test failed:', error.response?.data || error.message);
    return false;
  }
}

async function runTests() {
  try {
    console.log('🚀 Starting Leaderboard and Analytics Tests...\n');

    // Test 1: Admin Login
    console.log('📋 Test 1: Admin Authentication');
    const loginSuccess = await loginAdmin();
    if (!loginSuccess) {
      console.log('❌ Cannot proceed without authentication');
      return;
    }

    // Test 2: Get Quizzes
    console.log('\n📋 Test 2: Get Quizzes');
    const quizzesSuccess = await getQuizzes();
    if (!quizzesSuccess) {
      console.log('⚠️ No quizzes available for testing');
      return;
    }

    // Test 3: Analytics
    console.log('\n📋 Test 3: Quiz Analytics');
    await testAnalytics();

    // Test 4: Leaderboard
    console.log('\n📋 Test 4: Quiz Leaderboard');
    await testLeaderboard();

    console.log('\n🎉 All tests completed!');

  } catch (error) {
    console.error('❌ Test execution failed:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

runTests(); 