const express = require('express');
const router = express.Router();
const { isAdmin } = require('../middleware/auth');
const Quiz = require('../models/Quiz');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Google AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_KEY);

// Generate questions using Google AI
router.post('/generate', isAdmin, async (req, res) => {
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
router.post('/create', isAdmin, async (req, res) => {
  try {
    const { topic, difficulty, questions } = req.body;
    const createdBy = req.user._id;

    const quiz = new Quiz({
      topic,
      difficulty,
      questions,
      createdBy,
      status: 'active'
    });

    await quiz.save();

    res.status(201).json({
      message: 'Quiz created successfully',
      quizId: quiz._id
    });
  } catch (error) {
    console.error('Error creating quiz:', error);
    res.status(500).json({ message: 'Failed to create quiz' });
  }
});

// Get all quizzes created by the admin
router.get('/', isAdmin, async (req, res) => {
  try {
    const quizzes = await Quiz.find({ createdBy: req.user._id })
      .sort({ createdAt: -1 });

    res.json(quizzes);
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    res.status(500).json({ message: 'Failed to fetch quizzes' });
  }
});

// Get a specific quiz
router.get('/:quizId', isAdmin, async (req, res) => {
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

// Update a quiz
router.put('/:quizId', isAdmin, async (req, res) => {
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
router.delete('/:quizId', isAdmin, async (req, res) => {
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