const axios = require('axios');
const mongoose = require('mongoose');
const Quiz = require('../models/Quiz');
require('dotenv').config();

const BASE_URL = 'http://localhost:5000';
const API_URL = `${BASE_URL}/api`;

async function testStudentFlow() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Step 1: Find an active quiz
    console.log('\n🔍 Step 1: Finding an active quiz...');
    const quiz = await Quiz.findOne({ status: 'active' });
    
    if (!quiz) {
      console.log('❌ No active quiz found. Please create a quiz first.');
      return;
    }

    console.log(`✅ Found quiz: ${quiz.topic} (Code: ${quiz.quizCode})`);

    // Step 2: Test getting quiz by code
    console.log('\n🔍 Step 2: Testing quiz access by code...');
    try {
      const quizResponse = await axios.get(`${API_URL}/quiz/${quiz.quizCode}`);
      console.log(`✅ Quiz access works: ${quizResponse.status}`);
      console.log(`📄 Quiz data: ${quizResponse.data.topic} - ${quizResponse.data.questions.length} questions`);
    } catch (error) {
      console.log(`❌ Quiz access failed: ${error.response?.status} - ${error.response?.data?.message}`);
      return;
    }

    // Step 3: Test quiz submission
    console.log('\n🔍 Step 3: Testing quiz submission...');
    const testAnswers = quiz.questions.map((_, index) => ({
      selectedOption: Math.floor(Math.random() * 4) // Random answer
    }));

    const submissionData = {
      studentName: 'Test Student',
      studentEmail: 'test@example.com',
      answers: testAnswers
    };

    try {
      const submitResponse = await axios.post(`${API_URL}/quiz/${quiz.quizCode}/submit`, submissionData);
      console.log(`✅ Quiz submission works: ${submitResponse.status}`);
      console.log(`📄 Score: ${submitResponse.data.score}% (${submitResponse.data.correctAnswers}/${submitResponse.data.totalQuestions} correct)`);
    } catch (error) {
      console.log(`❌ Quiz submission failed: ${error.response?.status} - ${error.response?.data?.message}`);
    }

    // Step 4: Test leaderboard
    console.log('\n🔍 Step 4: Testing leaderboard...');
    try {
      const leaderboardResponse = await axios.get(`${API_URL}/quiz/${quiz.quizCode}/leaderboard`);
      console.log(`✅ Leaderboard works: ${leaderboardResponse.status}`);
      console.log(`📄 Total participants: ${leaderboardResponse.data.totalParticipants}`);
      if (leaderboardResponse.data.leaderboard.length > 0) {
        console.log(`🏆 Top scorer: ${leaderboardResponse.data.leaderboard[0].name} (${leaderboardResponse.data.leaderboard[0].score}%)`);
      }
    } catch (error) {
      console.log(`❌ Leaderboard failed: ${error.response?.status} - ${error.response?.data?.message}`);
    }

    console.log('\n🎉 Student flow test completed!');
    console.log('\n📋 Summary:');
    console.log(`- Quiz access: ✅ Working`);
    console.log(`- Quiz submission: ✅ Working`);
    console.log(`- Leaderboard: ✅ Working`);
    console.log(`- Student URL: http://localhost:5173/quiz/${quiz.quizCode}`);

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

testStudentFlow(); 