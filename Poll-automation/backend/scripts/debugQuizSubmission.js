const mongoose = require('mongoose');
const Quiz = require('../models/Quiz');
require('dotenv').config();

async function debugQuizSubmission() {
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

    // Show all questions and their correct answers
    console.log('\n📋 Quiz Questions:');
    quiz.questions.forEach((question, index) => {
      console.log(`\nQuestion ${index + 1}: ${question.question}`);
      console.log(`Options: ${question.options.join(', ')}`);
      console.log(`Correct Answer Index: ${question.correctAnswer}`);
      console.log(`Correct Answer Text: ${question.options[question.correctAnswer]}`);
    });

    // Test submission with all correct answers
    console.log('\n🧪 Testing submission with all correct answers...');
    const allCorrectAnswers = quiz.questions.map((question, index) => ({
      questionIndex: index,
      selectedOption: question.correctAnswer
    }));

    console.log('Submitting answers:', allCorrectAnswers);

    // Simulate the submission logic
    let correctAnswers = 0;
    const processedAnswers = allCorrectAnswers.map((answer, index) => {
      const question = quiz.questions[index];
      const isCorrect = answer.selectedOption === question.correctAnswer;
      if (isCorrect) correctAnswers++;
      
      console.log(`Question ${index + 1}: Selected ${answer.selectedOption}, Correct: ${question.correctAnswer}, IsCorrect: ${isCorrect}`);
      
      return {
        questionIndex: index,
        selectedOption: answer.selectedOption,
        isCorrect: isCorrect
      };
    });

    const score = Math.round((correctAnswers / quiz.questions.length) * 100);
    
    console.log(`\n📊 Results:`);
    console.log(`- Correct Answers: ${correctAnswers}/${quiz.questions.length}`);
    console.log(`- Score: ${score}%`);
    console.log(`- Expected: ${quiz.questions.length}/${quiz.questions.length} = 100%`);

    if (correctAnswers !== quiz.questions.length) {
      console.log('\n❌ ISSUE FOUND: Not all correct answers are being counted!');
      console.log('This suggests there might be an issue with the answer comparison logic.');
    } else {
      console.log('\n✅ All correct answers are being counted properly!');
    }

    // Test with some wrong answers
    console.log('\n🧪 Testing submission with mixed answers...');
    const mixedAnswers = quiz.questions.map((question, index) => ({
      questionIndex: index,
      selectedOption: index % 2 === 0 ? question.correctAnswer : (question.correctAnswer + 1) % question.options.length
    }));

    console.log('Submitting mixed answers:', mixedAnswers);

    correctAnswers = 0;
    const processedMixedAnswers = mixedAnswers.map((answer, index) => {
      const question = quiz.questions[index];
      const isCorrect = answer.selectedOption === question.correctAnswer;
      if (isCorrect) correctAnswers++;
      
      console.log(`Question ${index + 1}: Selected ${answer.selectedOption}, Correct: ${question.correctAnswer}, IsCorrect: ${isCorrect}`);
      
      return {
        questionIndex: index,
        selectedOption: answer.selectedOption,
        isCorrect: isCorrect
      };
    });

    const mixedScore = Math.round((correctAnswers / quiz.questions.length) * 100);
    
    console.log(`\n📊 Mixed Results:`);
    console.log(`- Correct Answers: ${correctAnswers}/${quiz.questions.length}`);
    console.log(`- Score: ${mixedScore}%`);

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

debugQuizSubmission(); 