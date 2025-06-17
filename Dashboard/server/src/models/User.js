// server/src/models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ["host", "student"], required: true }
});

module.exports = mongoose.model("User", userSchema);