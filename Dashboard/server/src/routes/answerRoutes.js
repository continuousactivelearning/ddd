const express = require("express");
const router = express.Router();
const Answer = require("../models/Answer");
const Question = require("../models/Question");
const User = require("../models/User");
const { authMiddleware } = require("../middleware/auth");


router.post("/submit", authMiddleware, async (req, res) => {
  try {
    const studentId = req.user.id;
    const answers = req.body;

    for (const [questionId, selectedOption] of Object.entries(answers)) {
      const question = await Question.findById(questionId);
      if (!question) continue;

      const isCorrect = question.correctAnswer === selectedOption;
      const score = isCorrect ? 1 : 0;

      await Answer.updateOne(
        { student: studentId, question: questionId },
        {
          $set: {
            answer: selectedOption,
            score: score,
          },
        },
        { upsert: true } 
      );
    }

    res.status(200).json({ message: "Answers submitted with score" });
  } catch (err) {
    console.error("Submit Error:", err);
    res.status(500).json({ error: "Failed to submit answers" });
  }
});


router.get("/mine", authMiddleware, async (req, res) => {
  try {
    const answers = await Answer.find({ student: req.user.id }).select("question answer");
    res.json(answers);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch your answers" });
  }
});

router.get("/score", authMiddleware, async (req, res) => {
  try {
    const studentId = req.user._id;

    const answers = await Answer.find({ student: studentId, score: 1 });
    const totalScore = answers.length;

    res.json({ score: totalScore });
  } catch (err) {
    console.error("Score Error:", err);
    res.status(500).json({ error: "Failed to fetch score" });
  }
});

// Get all answers for a specific question (for hosts to visualize responses)
router.get("/question/:questionId", authMiddleware, async (req, res) => {
  try {
    // Optional: if you want only hosts to access this
    if (req.user.role !== "host") {
      return res.status(403).json({ error: "Access denied" });
    }

    const questionId = req.params.questionId;
    const answers = await Answer.find({ question: questionId }).populate("student", "name email");
    res.json(answers);
  } catch (err) {
    console.error("Question Response Error:", err);
    res.status(500).json({ error: "Failed to fetch responses for this question" });
  }
});


module.exports = router;
