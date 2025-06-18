const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI;

async function clearAllData() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    const collections = await mongoose.connection.db.collections();
    for (const collection of collections) {
      await collection.drop();
      console.log(`🗑️ Dropped collection: ${collection.collectionName}`);
    }
    console.log('🎉 All collections dropped. Database is now empty.');
  } catch (error) {
    if (error.message === 'ns not found') {
      console.log('Some collections did not exist, skipped.');
    } else {
      console.error('❌ Error clearing data:', error);
    }
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

clearAllData(); 