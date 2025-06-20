const mongoose = require('mongoose');

const studentStatSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  totalQuizzesAttempted: {
    type: Number,
    default: 0
  },
  totalScore: {
    type: Number,
    default: 0
  },
  averageScore: {
    type: Number,
    default: 0
  },
  totalQuestions: {
    type: Number,
    default: 0
  },
  correctAnswers: {
    type: Number,
    default: 0
  },
  accuracy: {
    type: Number,
    default: 0
  },
  totalTimeTaken: {
    type: Number,
    default: 0 // in seconds
  },
  averageTimePerQuiz: {
    type: Number,
    default: 0 // in seconds
  },
  lastQuizAt: {
    type: Date
  },
  activity: [
    {
      type: {
        type: String, // e.g., 'quiz_added', 'quiz_attempted', 'notification'
        required: true
      },
      message: String,
      quizId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quiz'
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    }
  ]
}, {
  timestamps: true
});

module.exports = mongoose.model('StudentStat', studentStatSchema); 