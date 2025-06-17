const express = require("express");
const router = express.Router();
const Question = require("../models/Question");
const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Access denied" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(400).json({ error: "Invalid token" });
  }
};

router.post("/", authenticate, async (req, res) => {
  const { questionText, options, correctAnswer } = req.body;
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
router.get("/", async (req, res) => {
  try {
    const questions = await Question.find();
    res.json(questions);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch questions" });
  }
});


module.exports = router;