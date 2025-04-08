const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Input validation middleware
const validateSignupInput = (req, res, next) => {
  const { name, email, password } = req.body;

  console.log('Validating signup input:', { name, email, passwordLength: password?.length });

  if (!name || !email || !password) {
    return res.status(400).json({ 
      message: 'All fields are required',
      missing: {
        name: !name,
        email: !email,
        password: !password
      }
    });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters long' });
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Please provide a valid email address' });
  }

  next();
};

// Admin code validation middleware
const validateAdminCode = (req, res, next) => {
    const { adminCode } = req.body;
    const validAdminCode = process.env.ADMIN_CODE || 'admin123'; // Default admin code, should be changed in production

    if (adminCode && adminCode === validAdminCode) {
        req.isAdmin = true;
    } else if (adminCode) {
        return res.status(400).json({ message: 'Invalid admin code' });
    }

    next();
};

// Sign Up
router.post('/signup', validateSignupInput, validateAdminCode, async (req, res) => {
  try {
    const { name, email, password, adminCode } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    const user = new User({
      name,
      email,
      password,
      isAdmin: req.isAdmin || false,
      adminCode: adminCode || undefined
    });

    // Save user (password will be hashed by pre-save middleware)
    await user.save();

    // Generate token
    const token = jwt.sign(
      { userId: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Error creating user' });
  }
});

// Sign In
router.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin
      }
    });
  } catch (error) {
    console.error('Signin error:', error);
    res.status(500).json({ 
      message: 'Error signing in', 
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

module.exports = router; 