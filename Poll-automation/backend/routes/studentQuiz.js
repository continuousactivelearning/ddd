const express = require('express');
const router = express.Router();
const Quiz = require('../models/Quiz');
const User = require('../models/User');
const { auth } = require('../middleware/auth');
const { handleQuizSubmission } = require('../services/quizSubmissionHandler');
const NotificationService = require('../services/notificationService');

// Get all active quizzes (for student dashboard) - MUST BE BEFORE /:quizCode route
router.get('/active', auth, async (req, res) => {
  try {
    const studentEmail = req.user.email;
    // Find all admins who have allowed this student
    const admins = await User.find({ role: 'admin', allowedStudents: studentEmail }).select('_id');
    const adminIds = admins.map(a => a._id);
    // Find quizzes created by these admins
    const quizzes = await Quiz.find({ status: 'active', createdBy: { $in: adminIds } })
      .select('topic difficulty quizCode createdBy createdAt')
      .populate('createdBy', 'name');
    res.json(quizzes);
  } catch (error) {
    console.error('Error fetching active quizzes:', error);
    res.status(500).json({ message: 'Failed to fetch active quizzes' });
  }
});

// Get quiz by quiz code (for students to access) - requires authentication
router.get('/:quizCode', auth, async (req, res) => {
  try {
    const { quizCode } = req.params;
    
    const quiz = await Quiz.findOne({ 
      quizCode: quizCode.toUpperCase(),
      status: 'active'
    }).populate('createdBy', 'name');

    if (!quiz) {
      return res.status(404).json({ 
        message: 'Quiz not found or inactive' 
      });
    }

    // Return quiz data without answers for students
    const quizData = {
      _id: quiz._id,
      topic: quiz.topic,
      difficulty: quiz.difficulty,
      quizCode: quiz.quizCode,
      questions: quiz.questions.map(q => ({
        question: q.question,
        options: q.options
        // Don't include correctAnswer for students
      })),
      totalQuestions: quiz.questions.length,
      createdBy: quiz.createdBy.name,
      createdAt: quiz.createdAt
    };

    res.json(quizData);
  } catch (error) {
    console.error('Error fetching quiz:', error);
    res.status(500).json({ message: 'Failed to fetch quiz' });
  }
});

// Check individual answer - requires authentication
router.post('/:quizCode/check-answer', auth, async (req, res) => {
  try {
    const { quizCode } = req.params;
    const { questionIndex, selectedOption } = req.body;

    const quiz = await Quiz.findOne({ 
      quizCode: quizCode.toUpperCase(),
      status: 'active'
    });

    if (!quiz) {
      return res.status(404).json({ 
        message: 'Quiz not found or inactive' 
      });
    }

    if (questionIndex >= quiz.questions.length) {
      return res.status(400).json({ 
        message: 'Invalid question index' 
      });
    }

    const question = quiz.questions[questionIndex];
    const isCorrect = selectedOption === question.correctAnswer;

    res.json({
      isCorrect: isCorrect,
      correctOption: question.correctAnswer,
      question: question.question,
      options: question.options
    });

  } catch (error) {
    console.error('Error checking answer:', error);
    res.status(500).json({ message: 'Failed to check answer' });
  }
});

// Submit quiz answers - requires authentication
router.post('/:quizCode/submit', auth, async (req, res) => {
  try {
    const { quizCode } = req.params;
    const { answers, timeTaken } = req.body;
    const { user } = req; // Get authenticated user

    const quiz = await Quiz.findOne({ 
      quizCode: quizCode.toUpperCase(),
      status: 'active'
    });

    if (!quiz) {
      return res.status(404).json({ 
        message: 'Quiz not found or inactive' 
      });
    }

    // Calculate score
    let correctAnswers = 0;
    const processedAnswers = answers.map((answer, index) => {
      const question = quiz.questions[index];
      const isCorrect = answer.selectedOption === question.correctAnswer;
      if (isCorrect) correctAnswers++;
      
      return {
        questionIndex: index,
        selectedOption: answer.selectedOption,
        isCorrect: isCorrect
      };
    });

    const score = Math.round((correctAnswers / quiz.questions.length) * 100);

    // Use authenticated user
    const student = user;

    // Prevent double submission: check if this user already submitted
    const alreadySubmitted = quiz.participants.some(p => p.user.toString() === student._id.toString());
    if (alreadySubmitted) {
      return res.status(400).json({ message: 'You have already submitted this quiz.' });
    }

    // Add participant to quiz
    const participant = {
      user: student._id,
      score: score,
      answers: processedAnswers,
      completedAt: new Date(),
      timeTaken: timeTaken
    };

    quiz.participants.push(participant);
    await quiz.save();

    // Update student stats after successful submission
    await handleQuizSubmission({
      userId: student._id,
      quizId: quiz._id,
      score: score,
      correctAnswers: correctAnswers,
      totalQuestions: quiz.questions.length,
      timeTaken: timeTaken
    });

    // Send notifications
    try {
      // Notify admin about quiz completion
      await NotificationService.notifyAdminForQuizCompletion(quiz, student, score);
      
      // Notify student about their result
      await NotificationService.notifyStudentForQuizResult(quiz, student, score);
      
      console.log(`Notifications sent for quiz completion: ${quiz.topic} by ${student.name}`);
    } catch (notificationError) {
      console.error('Error sending notifications:', notificationError);
      // Don't fail the quiz submission if notifications fail
    }

    res.json({
      message: 'Quiz submitted successfully',
      score: score,
      totalQuestions: quiz.questions.length,
      correctAnswers: correctAnswers,
      participantId: participant._id,
      detailedResults: processedAnswers.map((answer, index) => ({
        questionIndex: index,
        selectedOption: answer.selectedOption,
        correctOption: quiz.questions[index].correctAnswer,
        isCorrect: answer.isCorrect,
        question: quiz.questions[index].question,
        options: quiz.questions[index].options
      }))
    });

  } catch (error) {
    console.error('Error submitting quiz:', error);
    res.status(500).json({ message: 'Failed to submit quiz' });
  }
});

// Get quiz leaderboard - requires authentication
router.get('/:quizCode/leaderboard', auth, async (req, res) => {
  try {
    const { quizCode } = req.params;
    
    const quiz = await Quiz.findOne({ 
      quizCode: quizCode.toUpperCase(),
      status: 'active'
    }).populate('participants.user', 'name email');

    if (!quiz) {
      return res.status(404).json({ 
        message: 'Quiz not found or inactive' 
      });
    }

    // Sort participants by score (highest first) and completion time
    const leaderboard = quiz.participants
      .filter(p => p.completedAt) // Only completed attempts
      .sort((a, b) => {
        if (b.score !== a.score) {
          return b.score - a.score; // Higher score first
        }
        return new Date(a.completedAt) - new Date(b.completedAt); // Earlier completion first
      })
      .map((participant, index) => ({
        rank: index + 1,
        name: participant.user.name,
        score: participant.score,
        completedAt: participant.completedAt
      }));

    res.json({
      quizTopic: quiz.topic,
      totalParticipants: leaderboard.length,
      leaderboard: leaderboard
    });

  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ message: 'Failed to fetch leaderboard' });
  }
});

module.exports = router; 