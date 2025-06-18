const mongoose = require('mongoose');
const Quiz = require('../models/Quiz');
const User = require('../models/User');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI;

async function checkQuizzes() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check all quizzes
    const allQuizzes = await Quiz.find({});
    console.log(`\nTotal quizzes in database: ${allQuizzes.length}`);

    if (allQuizzes.length > 0) {
      console.log('\nQuiz details:');
      for (const quiz of allQuizzes) {
        console.log(`- ID: ${quiz._id}`);
        console.log(`  Topic: ${quiz.topic}`);
        console.log(`  Difficulty: ${quiz.difficulty}`);
        console.log(`  Status: ${quiz.status}`);
        console.log(`  Created by: ${quiz.createdBy}`);
        console.log(`  Questions: ${quiz.questions.length}`);
        console.log(`  Participants: ${quiz.participants.length}`);
        console.log('---');
      }
    }

    // Check admin users
    const adminUsers = await User.find({ role: 'admin' });
    console.log(`\nAdmin users: ${adminUsers.length}`);
    
    if (adminUsers.length > 0) {
      console.log('\nAdmin user details:');
      for (const user of adminUsers) {
        console.log(`- ID: ${user._id}`);
        console.log(`  Name: ${user.name}`);
        console.log(`  Email: ${user.email}`);
        console.log(`  Role: ${user.role}`);
        console.log('---');
      }
    }

    // Check if any quizzes are orphaned (no valid createdBy)
    const orphanedQuizzes = await Quiz.find({ createdBy: { $exists: false } });
    console.log(`\nOrphaned quizzes (no createdBy): ${orphanedQuizzes.length}`);

    process.exit(0);
  } catch (error) {
    console.error('Error checking quizzes:', error);
    process.exit(1);
  }
}

checkQuizzes(); 