const express = require('express');
const router = express.Router();
const StudentStat = require('../models/StudentStat');
const Quiz = require('../models/Quiz');
const { auth } = require('../middleware/auth');
const { handleQuizSubmission } = require('../services/quizSubmissionHandler');

// Get the logged-in student's stats and activity
router.get('/me', auth, async (req, res) => {
  try {
    const stat = await StudentStat.findOne({ userId: req.user._id });
    if (!stat) {
      // Return default stats if none found
      return res.json({
        totalQuizzesAttempted: 0,
        totalScore: 0,
        averageScore: 0,
        accuracy: 0,
        totalQuestions: 0,
        correctAnswers: 0,
        totalTimeTaken: 0,
        averageTimePerQuiz: 0,
        activity: []
      });
    }
    res.json(stat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get leaderboard for a quiz (sorted by score desc, then earliest completion)
router.get('/leaderboard/:quizId', auth, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.quizId).populate('participants.user', 'name email');
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found.' });
    }
    // Show all attempts (not just best per user)
    const leaderboard = quiz.participants
      .filter(p => p.completedAt)
      .sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        if ((a.timeTaken || Infinity) !== (b.timeTaken || Infinity)) return (a.timeTaken || Infinity) - (b.timeTaken || Infinity);
        return new Date(a.completedAt) - new Date(b.completedAt);
      })
      .map((p, idx) => ({
        rank: idx + 1,
        name: p.user.name,
        email: p.user.email,
        score: p.score,
        timeTaken: p.timeTaken,
        completedAt: p.completedAt
      }));
    res.json({ quizId: quiz._id, leaderboard });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Track a quiz attempt for student stats (called from frontend after quiz submit)
router.post('/track-quiz', auth, async (req, res) => {
  try {
    const { quizId, score, correctAnswers, totalQuestions, timeTaken } = req.body;
    await handleQuizSubmission({
      userId: req.user._id,
      quizId,
      score,
      correctAnswers,
      totalQuestions,
      timeTaken
    });
    res.json({ message: 'Student stats updated.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 