const mongoose = require('mongoose');
const Quiz = require('../models/Quiz');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI;

async function testAdminSystem() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Test 1: Check if admin users exist
    console.log('\n🔍 Test 1: Checking admin users...');
    const adminUsers = await User.find({ role: 'admin' });
    console.log(`Found ${adminUsers.length} admin users`);
    
    if (adminUsers.length === 0) {
      console.log('❌ No admin users found. Please create an admin user first.');
      return;
    }

    const adminUser = adminUsers[0];
    console.log(`✅ Using admin: ${adminUser.name} (${adminUser.email})`);

    // Test 2: Check existing quizzes
    console.log('\n🔍 Test 2: Checking existing quizzes...');
    const allQuizzes = await Quiz.find({});
    console.log(`Total quizzes in database: ${allQuizzes.length}`);
    
    const adminQuizzes = await Quiz.find({ createdBy: adminUser._id });
    console.log(`Quizzes created by admin: ${adminQuizzes.length}`);

    // Test 3: Check quiz structure
    if (adminQuizzes.length > 0) {
      console.log('\n🔍 Test 3: Checking quiz structure...');
      const sampleQuiz = adminQuizzes[0];
      console.log('Sample quiz structure:');
      console.log(`- Topic: ${sampleQuiz.topic}`);
      console.log(`- Difficulty: ${sampleQuiz.difficulty}`);
      console.log(`- Status: ${sampleQuiz.status}`);
      console.log(`- Questions: ${sampleQuiz.questions.length}`);
      console.log(`- Participants: ${sampleQuiz.participants.length}`);
      console.log(`- Created by: ${sampleQuiz.createdBy}`);
      console.log(`- Created at: ${sampleQuiz.createdAt}`);
      
      // Check if questions have proper structure
      if (sampleQuiz.questions.length > 0) {
        const sampleQuestion = sampleQuiz.questions[0];
        console.log('Sample question structure:');
        console.log(`- Question: ${sampleQuestion.question}`);
        console.log(`- Options: ${sampleQuestion.options.length}`);
        console.log(`- Correct answer index: ${sampleQuestion.correctAnswer}`);
      }
    }

    // Test 4: Generate a test JWT token
    console.log('\n🔍 Test 4: Testing JWT token generation...');
    const testToken = jwt.sign(
      { userId: adminUser._id, role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    console.log(`✅ JWT token generated: ${testToken.substring(0, 20)}...`);

    // Test 5: Verify token
    console.log('\n🔍 Test 5: Verifying JWT token...');
    try {
      const decoded = jwt.verify(testToken, process.env.JWT_SECRET);
      console.log(`✅ Token verified for user: ${decoded.userId}`);
    } catch (error) {
      console.log(`❌ Token verification failed: ${error.message}`);
    }

    // Test 6: Check database indexes
    console.log('\n🔍 Test 6: Checking database indexes...');
    const quizIndexes = await Quiz.collection.getIndexes();
    console.log('Quiz collection indexes:');
    Object.keys(quizIndexes).forEach(indexName => {
      console.log(`- ${indexName}: ${JSON.stringify(quizIndexes[indexName].key)}`);
    });

    // Test 7: Check environment variables
    console.log('\n🔍 Test 7: Checking environment variables...');
    const requiredEnvVars = ['MONGODB_URI', 'JWT_SECRET', 'GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET'];
    requiredEnvVars.forEach(envVar => {
      if (process.env[envVar]) {
        console.log(`✅ ${envVar}: Set`);
      } else {
        console.log(`❌ ${envVar}: Missing`);
      }
    });

    console.log('\n🎉 Admin system test completed successfully!');
    console.log('\n📋 Summary:');
    console.log(`- Admin users: ${adminUsers.length}`);
    console.log(`- Total quizzes: ${allQuizzes.length}`);
    console.log(`- Admin quizzes: ${adminQuizzes.length}`);
    console.log(`- Database: Connected`);
    console.log(`- JWT: Working`);

  } catch (error) {
    console.error('❌ Error testing admin system:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

testAdminSystem(); 