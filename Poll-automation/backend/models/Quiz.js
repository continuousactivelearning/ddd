const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  topic: {
    type: String,
    required: true,
    trim: true
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    required: true
  },
  questions: [{
    question: {
      type: String,
      required: true
    },
    options: [{
      type: String,
      required: true
    }],
    correctAnswer: {
      type: Number,
      required: true,
      min: 0,
      max: 3
    }
  }],
  transcript: {
    type: String,
    required: false
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'archived'],
    default: 'active'
  },
  quizCode: {
    type: String,
    unique: true,
    required: true
  },
  participants: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    score: {
      type: Number,
      default: 0
    },
    answers: [{
      questionIndex: Number,
      selectedOption: Number,
      isCorrect: Boolean
    }],
    completedAt: Date,
    timeTaken: Number // in seconds
  }]
}, {
  timestamps: true
});

// Add indexes for better query performance
quizSchema.index({ createdBy: 1, createdAt: -1 });
quizSchema.index({ status: 1 });
quizSchema.index({ quizCode: 1 });

const Quiz = mongoose.model('Quiz', quizSchema);

module.exports = Quiz; 