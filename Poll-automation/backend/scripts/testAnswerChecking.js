const axios = require('axios');
const mongoose = require('mongoose');
const Quiz = require('../models/Quiz');
require('dotenv').config();

const BASE_URL = 'http://localhost:5000';
const API_URL = `${BASE_URL}/api`;

async function testAnswerChecking() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Find an active quiz
    const quiz = await Quiz.findOne({ status: 'active' });
    
    if (!quiz) {
      console.log('❌ No active quiz found. Please create a quiz first.');
      return;
    }

    console.log(`✅ Found quiz: ${quiz.topic} (Code: ${quiz.quizCode})`);
    console.log(`📝 Questions: ${quiz.questions.length}`);

    // Test answer checking for each question
    console.log('\n🧪 Testing answer checking...');
    
    for (let i = 0; i < Math.min(3, quiz.questions.length); i++) {
      const question = quiz.questions[i];
      const correctAnswer = question.correctAnswer;
      const wrongAnswer = (correctAnswer + 1) % question.options.length;
      
      console.log(`\nQuestion ${i + 1}: ${question.question}`);
      console.log(`Options: ${question.options.join(', ')}`);
      console.log(`Correct answer: ${correctAnswer} (${question.options[correctAnswer]})`);
      
      // Test correct answer
      try {
        const correctResponse = await axios.post(`${API_URL}/quiz/${quiz.quizCode}/check-answer`, {
          questionIndex: i,
          selectedOption: correctAnswer
        });
        console.log(`✅ Correct answer test: ${correctResponse.data.isCorrect ? 'PASS' : 'FAIL'}`);
      } catch (error) {
        console.log(`❌ Correct answer test failed: ${error.response?.status} - ${error.response?.data?.message}`);
      }
      
      // Test wrong answer
      try {
        const wrongResponse = await axios.post(`${API_URL}/quiz/${quiz.quizCode}/check-answer`, {
          questionIndex: i,
          selectedOption: wrongAnswer
        });
        console.log(`✅ Wrong answer test: ${!wrongResponse.data.isCorrect ? 'PASS' : 'FAIL'}`);
        console.log(`   Expected correct option: ${wrongResponse.data.correctOption}`);
      } catch (error) {
        console.log(`❌ Wrong answer test failed: ${error.response?.status} - ${error.response?.data?.message}`);
      }
    }

    console.log('\n🎉 Answer checking test completed!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

testAnswerChecking(); 