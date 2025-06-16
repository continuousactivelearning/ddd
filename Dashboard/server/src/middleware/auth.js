const jwt = require("jsonwebtoken");
const User = require("../models/User"); // optional if you want to fetch full user

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id }; // This makes `req.user.id` available
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
};

module.exports = authMiddleware;