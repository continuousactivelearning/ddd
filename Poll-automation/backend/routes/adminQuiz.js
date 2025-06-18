const express = require('express');
const router = express.Router();
const { auth, isAdmin } = require('../middleware/auth');
const Quiz = require('../models/Quiz');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Google AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_KEY);

// Generate questions using Google AI
router.post('/generate', auth, isAdmin, async (req, res) => {
  try {
    const { topic, difficulty, numQuestions } = req.body;

    // Initialize the model with standard Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-1.0" });

    // Create the prompt
    const prompt = `Generate ${numQuestions} multiple choice questions about ${topic} with difficulty level ${difficulty}. 
    For each question, provide 4 options and mark the correct answer. 
    Format the response as a JSON array of objects with the following structure:
    [
      {
        "question": "question text",
        "options": ["option1", "option2", "option3", "option4"],
        "correctAnswer": 0 // index of correct option (0-3)
      }
    ]`;

    // Generate content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Parse the JSON response
    const questions = JSON.parse(text);

    res.json({ questions });
  } catch (error) {
    console.error('Error generating questions:', error);
    res.status(500).json({ 
      message: 'Failed to generate questions',
      error: error.message 
    });
  }
});

// Create a new quiz
router.post('/create', auth, isAdmin, async (req, res) => {
  try {
    const { topic, difficulty, questions } = req.body;
    const createdBy = req.user._id;

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

    const quiz = new Quiz({
      topic,
      difficulty,
      questions,
      createdBy,
      status: 'active',
      quizCode
    });

    await quiz.save();

    // Generate student-facing URL
    const studentUrl = `http://localhost:5173/quiz/${quizCode}`;

    res.status(201).json({
      message: 'Quiz created successfully',
      quizId: quiz._id,
      quizCode: quizCode,
      studentUrl: studentUrl
    });
  } catch (error) {
    console.error('Error creating quiz:', error);
    res.status(500).json({ message: 'Failed to create quiz' });
  }
});

// Get all quizzes created by the admin
router.get('/', auth, isAdmin, async (req, res) => {
  try {
    console.log('=== QUIZ FETCH REQUEST ===');
    console.log('User ID:', req.user._id);
    console.log('User role:', req.user.role);
    console.log('User email:', req.user.email);
    console.log('Auth header present:', !!req.headers.authorization);
    
    const quizzes = await Quiz.find({ createdBy: req.user._id })
      .sort({ createdAt: -1 });

    console.log(`Found ${quizzes.length} quizzes for admin`);
    console.log('=== END QUIZ FETCH ===');
    
    res.json(quizzes);
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    res.status(500).json({ message: 'Failed to fetch quizzes' });
  }
});

// Get a specific quiz
router.get('/:quizId', auth, isAdmin, async (req, res) => {
  try {
    const quiz = await Quiz.findOne({
      _id: req.params.quizId,
      createdBy: req.user._id
    });

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    res.json(quiz);
  } catch (error) {
    console.error('Error fetching quiz:', error);
    res.status(500).json({ message: 'Failed to fetch quiz' });
  }
});

// Get quiz analytics
router.get('/:quizId/analytics', auth, isAdmin, async (req, res) => {
  try {
    const quiz = await Quiz.findOne({
      _id: req.params.quizId,
      createdBy: req.user._id
    }).populate('participants.user', 'name email');

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    const totalParticipants = quiz.participants.length;
    const completedParticipants = quiz.participants.filter(p => p.completedAt).length;
    const completedParticipantsData = quiz.participants.filter(p => p.completedAt);

    const analytics = {
      totalParticipants,
      completedParticipants,
      averageScore: 0,
      highestScore: 0,
      lowestScore: 0,
      completionRate: totalParticipants > 0 ? Math.round((completedParticipants / totalParticipants) * 100) : 0,
      recentParticipants: quiz.participants
        .sort((a, b) => new Date(b.completedAt || 0) - new Date(a.completedAt || 0))
        .slice(0, 5)
        .map(p => ({
          name: p.user?.name || 'Unknown User',
          email: p.user?.email || 'No email',
          score: p.score || 0,
          completedAt: p.completedAt
        }))
    };

    if (completedParticipantsData.length > 0) {
      const scores = completedParticipantsData.map(p => p.score || 0);
      analytics.averageScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
      analytics.highestScore = Math.max(...scores);
      analytics.lowestScore = Math.min(...scores);
    }

    res.json(analytics);
  } catch (error) {
    console.error('Error fetching quiz analytics:', error);
    res.status(500).json({ message: 'Failed to fetch quiz analytics' });
  }
});

// Get quiz leaderboard
router.get('/:quizId/leaderboard', auth, isAdmin, async (req, res) => {
  try {
    const quiz = await Quiz.findOne({
      _id: req.params.quizId,
      createdBy: req.user._id
    }).populate('participants.user', 'name email');

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    // Sort participants by score (highest first) and completion time
    const leaderboard = quiz.participants
      .filter(p => p.completedAt && p.user) // Only completed attempts with valid user
      .sort((a, b) => {
        if (b.score !== a.score) {
          return b.score - a.score; // Higher score first
        }
        return new Date(a.completedAt) - new Date(b.completedAt); // Earlier completion first
      })
      .map((participant, index) => ({
        rank: index + 1,
        name: participant.user.name || 'Unknown User',
        email: participant.user.email || 'No email',
        score: participant.score || 0,
        completedAt: participant.completedAt
      }));

    res.json({
      quizTopic: quiz.topic,
      totalParticipants: leaderboard.length,
      leaderboard: leaderboard
    });
  } catch (error) {
    console.error('Error fetching quiz leaderboard:', error);
    res.status(500).json({ message: 'Failed to fetch quiz leaderboard' });
  }
});

// Update quiz status
router.patch('/:quizId/status', auth, isAdmin, async (req, res) => {
  try {
    const { status } = req.body;

    if (!['active', 'inactive', 'archived'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const quiz = await Quiz.findOneAndUpdate(
      {
        _id: req.params.quizId,
        createdBy: req.user._id
      },
      { status },
      { new: true }
    );

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    res.json({ message: 'Quiz status updated successfully', quiz });
  } catch (error) {
    console.error('Error updating quiz status:', error);
    res.status(500).json({ message: 'Failed to update quiz status' });
  }
});

// Update a quiz
router.put('/:quizId', auth, isAdmin, async (req, res) => {
  try {
    const { topic, difficulty, questions, status } = req.body;

    const quiz = await Quiz.findOneAndUpdate(
      {
        _id: req.params.quizId,
        createdBy: req.user._id
      },
      {
        topic,
        difficulty,
        questions,
        status
      },
      { new: true }
    );

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    res.json(quiz);
  } catch (error) {
    console.error('Error updating quiz:', error);
    res.status(500).json({ message: 'Failed to update quiz' });
  }
});

// Delete a quiz
router.delete('/:quizId', auth, isAdmin, async (req, res) => {
  try {
    const quiz = await Quiz.findOneAndDelete({
      _id: req.params.quizId,
      createdBy: req.user._id
    });

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    res.json({ message: 'Quiz deleted successfully' });
  } catch (error) {
    console.error('Error deleting quiz:', error);
    res.status(500).json({ message: 'Failed to delete quiz' });
  }
});

module.exports = router; 