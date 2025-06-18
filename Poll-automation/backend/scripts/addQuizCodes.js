const mongoose = require('mongoose');
const Quiz = require('../models/Quiz');
require('dotenv').config();

async function addQuizCodes() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Find quizzes without quiz codes
    const quizzesWithoutCodes = await Quiz.find({ 
      $or: [
        { quizCode: { $exists: false } },
        { quizCode: null }
      ]
    });

    console.log(`Found ${quizzesWithoutCodes.length} quizzes without quiz codes`);

    if (quizzesWithoutCodes.length === 0) {
      console.log('✅ All quizzes already have quiz codes');
      return;
    }

    // Generate quiz codes for each quiz
    for (const quiz of quizzesWithoutCodes) {
      // Generate a unique quiz code (6 characters, alphanumeric)
      const generateQuizCode = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < 6; i++) {
          result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
      };

      let quizCode;
      let isUnique = false;
      while (!isUnique) {
        quizCode = generateQuizCode();
        const existingQuiz = await Quiz.findOne({ quizCode });
        if (!existingQuiz) {
          isUnique = true;
        }
      }

      // Update the quiz with the new code
      quiz.quizCode = quizCode;
      await quiz.save();

      console.log(`✅ Added quiz code ${quizCode} to quiz: ${quiz.topic}`);
    }

    console.log('\n🎉 All quizzes now have quiz codes!');

  } catch (error) {
    console.error('❌ Error adding quiz codes:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

addQuizCodes(); 