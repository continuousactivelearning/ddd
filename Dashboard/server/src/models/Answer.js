// models/Answer.js
const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  question: { type: mongoose.Schema.Types.ObjectId, ref: "Question", required: true },
  answer: { type: String, required: true }, 
  score: { type: Number, default: 0 },
});

module.exports = mongoose.model("Answer", answerSchema);