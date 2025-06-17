const express = require("express");
const router = express.Router();
const Question = require("../models/Question");
const Answer = require("../models/Answer");
const {authMiddleware,requireHost} = require("../middleware/auth");


router.post("/", authMiddleware, requireHost, async (req, res) => {
  const { questionText, options, correctAnswer } = req.body;

  const validOptions = ["A", "B", "C", "D"];
  if (!validOptions.includes(correctAnswer)) {
    return res.status(400).json({ error: "Correct answer must be A, B, C, or D" });
  }

  if (options.length !== 4) {
    return res.status(400).json({ error: "Exactly 4 options are required" });
  }

  try {
    const question = await Question.create({
      questionText,
      options,
      correctAnswer,
      createdBy: req.user.id
    });
    res.status(201).json(question);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get("/",authMiddleware,async (req, res) => {
  try {
    const questions = await Question.find();
    res.json(questions);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch questions" });
  }
});

router.get("/responses/:questionId", authMiddleware, requireHost, async (req, res) => {
  try {
    const questionId = req.params.questionId;
    const responses = await Answer.find({ question: questionId }).populate("student", "name email");
    res.json(responses);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch responses for the question" });
  }
});

module.exports = router;
