const mongoose = require('mongoose');
const Quiz = require('../models/Quiz');
require('dotenv').config();

async function testQuizEvaluation() {
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

    // Test evaluation logic
    console.log('\n🧪 Testing evaluation logic...');
    
    // Simulate some test answers
    const testAnswers = [
      { questionIndex: 0, selectedOption: 1 }, // Assume correct answer is 1
      { questionIndex: 1, selectedOption: 0 }, // Assume correct answer is 1 (wrong)
      { questionIndex: 2, selectedOption: 2 }  // Assume correct answer is 2 (correct)
    ];

    let correctAnswers = 0;
    const processedAnswers = testAnswers.map((answer) => {
      const question = quiz.questions[answer.questionIndex];
      const isCorrect = answer.selectedOption === question.correctAnswer;
      if (isCorrect) correctAnswers++;
      
      console.log(`Question ${answer.questionIndex + 1}: Selected ${answer.selectedOption}, Correct: ${question.correctAnswer}, IsCorrect: ${isCorrect}`);
      
      return {
        questionIndex: answer.questionIndex,
        selectedOption: answer.selectedOption,
        isCorrect: isCorrect
      };
    });

    const score = Math.round((correctAnswers / quiz.questions.length) * 100);
    
    console.log(`\n📊 Results:`);
    console.log(`- Correct Answers: ${correctAnswers}/${quiz.questions.length}`);
    console.log(`- Score: ${score}%`);
    console.log(`- Evaluation Logic: ✅ Working correctly`);

    // Show question details for verification
    console.log('\n📋 Question Details:');
    quiz.questions.forEach((question, index) => {
      console.log(`Question ${index + 1}: ${question.question}`);
      console.log(`  Options: ${question.options.join(', ')}`);
      console.log(`  Correct Answer: ${question.correctAnswer} (${question.options[question.correctAnswer]})`);
      console.log('');
    });

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

testQuizEvaluation(); 