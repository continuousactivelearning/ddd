/**
 * Main server file for the Dopamine Dashboard application
 * Sets up Express server, middleware, routes, and database connection
 */

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');

// Import route handlers
const authRoutes = require('./routes/auth');
const adminAuthRoutes = require('./routes/adminAuth');
const adminQuizRoutes = require('./routes/adminQuiz');
const studentQuizRoutes = require('./routes/studentQuiz');
const meetRoutes = require('./routes/meets');
const answerRoutes = require('./routes/answer');
const statsRoutes = require('./routes/stats');
const studentStatRoutes = require('./routes/studentStatRoutes');

// Initialize Express application
const app = express();

// Middleware Configuration
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'], // Allow both frontend and admin URLs
  credentials: true
})); // Enable CORS for all routes
app.use(express.json()); // Parse JSON request bodies

// Session Configuration (only needed for Google OAuth)
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Initialize Passport and restore authentication state from session
app.use(passport.initialize());
app.use(passport.session());

// Database Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/dopamine-dashboard')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// API Routes
app.use('/api/auth', authRoutes);    // Authentication routes
app.use('/api/admin/auth', adminAuthRoutes); // Admin authentication routes
app.use('/api/admin/quiz', adminQuizRoutes);
app.use('/api/quiz', studentQuizRoutes); // Student quiz routes
app.use('/api/meets', meetRoutes);   // Quiz/Meet management routes
app.use('/api/answers', answerRoutes); // Answer submission and leaderboard routes
app.use('/api/stats', statsRoutes);   // User statistics routes
app.use('/api/student-stats', studentStatRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 