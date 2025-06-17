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
    const cachedUser = userCache.get(req.user._id.toString());
    if (cachedUser && Date.now() - cachedUser.timestamp < CACHE_DURATION) {
      return res.json(cachedUser.data);
    }

    const user = await User.findById(req.user._id).select('-__v');
    userCache.set(req.user._id.toString(), {
      data: user,
      timestamp: Date.now()
    });

    res.json(user);
  } catch (error) {
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

module.exports = router; 