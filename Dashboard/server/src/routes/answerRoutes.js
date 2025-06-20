const express = require("express");
const router = express.Router();
const Answer = require("../models/Answer");
const Question = require("../models/Question");
const User = require("../models/User");
const { authMiddleware, requireHost } = require("../middleware/auth");


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

router.get("/question/:questionId", authMiddleware,requireHost, async (req, res) => {
  try {
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

router.get("/leaderboard", authMiddleware,requireHost, async (req, res) => {
  try {
    const leaderboard = await Answer.aggregate([
      {
        $group: {
          _id: "$student",
          totalScore: { $sum: "$score" },
          lastSubmission: { $max: "$createdAt" }
        }
      },
      {
        $sort: {
          totalScore: -1,      
          lastSubmission: -1     
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "studentInfo"
        }
      },
      { $unwind: "$studentInfo" },
      {
        $project: {
          _id: 0,
          studentId: "$_id",
          name: "$studentInfo.name",
          totalScore: 1,
          lastSubmission: 1
        }
      }
    ]);

    res.status(200).json(leaderboard);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch leaderboard", error });
  }
});

module.exports = router;
