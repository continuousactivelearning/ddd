/**
 * Authentication Middleware
 * Verifies JWT tokens and attaches user information to requests
 * Used to protect routes that require authentication
 */

const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
    try {
        // Get token from header
        const authHeader = req.headers.authorization;
        console.log('Auth header:', authHeader ? 'Present' : 'Missing');
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            console.log('No valid auth header found');
            return res.status(401).json({ message: 'No token provided' });
        }

        const token = authHeader.split(' ')[1];
        console.log('Token extracted:', token ? 'Present' : 'Missing');
        
        if (!token) {
            console.log('No token found in header');
            return res.status(401).json({ message: 'No token provided' });
        }

        // Verify token
        console.log('Verifying JWT token...');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Token verified, user ID:', decoded.userId);
        
        // Get user from database
        const user = await User.findById(decoded.userId);
        console.log('User found in database:', user ? 'Yes' : 'No');
        
        if (!user) {
            console.log('User not found in database');
            return res.status(401).json({ message: 'User not found' });
        }

        // Add user to request object
        req.user = user;
        req.token = token;

        // Log for debugging
        console.log('User authenticated:', {
            userId: user._id,
            email: user.email,
            role: user.role,
            path: req.path
        });

        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        if (error.name === 'JsonWebTokenError') {
            console.log('JWT verification failed');
            return res.status(401).json({ message: 'Invalid token' });
        }
        res.status(401).json({ message: 'Please authenticate' });
    }
};

const isAdmin = async (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Not authenticated' });
        }
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Access denied. Admin only.' });
        }
        next();
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = { auth, isAdmin }; 