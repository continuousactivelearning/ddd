const mongoose = require('mongoose');
const Quiz = require('../models/Quiz');
const User = require('../models/User');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI;

async function fixOrphanedQuizzes() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find orphaned quizzes
    const orphanedQuizzes = await Quiz.find({ 
      $or: [
        { createdBy: { $exists: false } },
        { createdBy: null }
      ]
    });

    console.log(`Found ${orphanedQuizzes.length} orphaned quizzes`);

    if (orphanedQuizzes.length === 0) {
      console.log('No orphaned quizzes found');
      process.exit(0);
    }

    // Find an admin user to associate with
    const adminUser = await User.findOne({ role: 'admin' });
    
    if (!adminUser) {
      console.log('No admin user found');
      process.exit(1);
    }

    console.log(`Associating quizzes with admin: ${adminUser.name} (${adminUser.email})`);

    // Update orphaned quizzes
    const result = await Quiz.updateMany(
      { 
        $or: [
          { createdBy: { $exists: false } },
          { createdBy: null }
        ]
      },
      { createdBy: adminUser._id }
    );

    console.log(`Updated ${result.modifiedCount} quizzes`);

    // Verify the fix
    const remainingOrphaned = await Quiz.find({ 
      $or: [
        { createdBy: { $exists: false } },
        { createdBy: null }
      ]
    });

    console.log(`Remaining orphaned quizzes: ${remainingOrphaned.length}`);

    process.exit(0);
  } catch (error) {
    console.error('Error fixing orphaned quizzes:', error);
    process.exit(1);
  }
}

fixOrphanedQuizzes(); 