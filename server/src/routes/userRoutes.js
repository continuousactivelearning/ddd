const express = require("express");
const router = express.Router();
const User = require("../models/User");
const {authMiddleware} = require("../middleware/auth");

router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: "Invalid token" });
  }
});

module.exports = router;