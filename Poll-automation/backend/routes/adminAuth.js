const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { auth, isAdmin } = require('../middleware/auth');

const router = express.Router();

// Configure Google Strategy for admin
passport.use('admin-google', new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:5000/api/admin/auth/google/callback'
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Check if user exists
      let user = await User.findOne({ googleId: profile.id });
      
      if (!user) {
        // Create new user if doesn't exist
        user = await User.create({
          googleId: profile.id,
          email: profile.emails[0].value,
          name: profile.displayName,
          avatar: profile.photos[0]?.value,
          role: 'admin'
        });
      } else if (user.role !== 'admin') {
        // Update role to admin if not already
        user.role = 'admin';
        await user.save();
      }
      
      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
  }
));

// Get current admin user with caching
const userCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

router.get('/me', auth, isAdmin, async (req, res) => {
  try {
    console.log('Admin auth check - User ID:', req.user._id);
    console.log('Admin auth check - User role:', req.user.role);
    
    const cachedUser = userCache.get(req.user._id.toString());
    if (cachedUser && Date.now() - cachedUser.timestamp < CACHE_DURATION) {
      console.log('Returning cached user data');
      return res.json(cachedUser.data);
    }

    const user = await User.findById(req.user._id).select('-__v');
    console.log('Fetched user from database:', user ? 'User found' : 'User not found');
    
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    userCache.set(req.user._id.toString(), {
      data: user,
      timestamp: Date.now()
    });

    console.log('Returning user data for admin');
    res.json(user);
  } catch (error) {
    console.error('Admin auth error:', error);
    res.status(401).json({ message: 'Not authenticated' });
  }
});

// Google OAuth routes for admin
router.get('/google',
  passport.authenticate('admin-google', { 
    scope: ['profile', 'email'],
    prompt: 'select_account'
  })
);

// Google OAuth callback for admin
router.get('/google/callback',
  passport.authenticate('admin-google', { session: false }),
  (req, res) => {
    const token = jwt.sign(
      { 
        userId: req.user._id,
        role: 'admin'
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Clear any existing cache for this user
    userCache.delete(req.user._id.toString());

    res.redirect(`http://localhost:5174/login?token=${token}`);
  }
);

// Logout
router.get('/logout', auth, isAdmin, (req, res) => {
  // Clear user cache on logout
  userCache.delete(req.user._id.toString());
  res.json({ message: 'Logged out successfully' });
});

// Add/Update allowed students for admin
router.get('/allowed-students', auth, isAdmin, async (req, res) => {
  try {
    const admin = await User.findById(req.user._id);
    if (!admin || admin.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    res.json({ allowedStudents: admin.allowedStudents || [] });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch allowed students' });
  }
});

router.post('/allowed-students', auth, isAdmin, async (req, res) => {
  try {
    const { allowedStudents } = req.body;
    if (!Array.isArray(allowedStudents)) {
      return res.status(400).json({ message: 'allowedStudents must be an array of emails' });
    }
    const admin = await User.findById(req.user._id);
    if (!admin || admin.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    admin.allowedStudents = allowedStudents;
    await admin.save();
    res.json({ message: 'Allowed students updated', allowedStudents });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update allowed students' });
  }
});

module.exports = router; 