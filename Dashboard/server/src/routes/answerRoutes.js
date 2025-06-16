// routes/answerRoutes.js
const express = require("express");
const router = express.Router();
const Answer = require("../models/Answer");
const authMiddleware = require("../middleware/auth");

// Save student answers
router.post("/submit", authMiddleware, async (req, res) => {
  try {
    const studentId = req.user.id;
    const answers = req.body; // { questionId: answer }

    const answerDocs = Object.entries(answers).map(([questionId, answer]) => ({
      student: studentId,
      question: questionId,
      answer,
    }));

    await Answer.insertMany(answerDocs);
    res.status(200).json({ message: "Answers submitted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to submit answers" });
  }
});
// GET /responses (for hosts)
router.get("/responses", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch the user's role (assumes you don't already populate role in middleware)
    const user = await require("../models/User").findById(userId);
    if (!user || user.role !== "host") {
      return res.status(403).json({ error: "Access denied" });
    }

    // Fetch answers along with question and student info
    const responses = await Answer.find()
      .populate("student", "name email")
      .populate("question", "questionText");

    res.json(responses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch responses" });
  }
});


module.exports = router;
