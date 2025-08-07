const express = require('express');
const { body, validationResult } = require('express-validator');
const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Validation middleware for admin registration
const validateAdminRegistration = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number')
];

// Generate JWT token for admin
const generateAdminToken = (admin) => {
  return jwt.sign(
    {
      id: admin._id,
      email: admin.email,
      role: 'admin'
    },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '24h' }
  );
};

// Admin registration
router.post('/signup', validateAdminRegistration, async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });

    if (existingAdmin) {
      return res.status(409).json({
        success: false,
        message: 'Admin already exists with this email'
      });
    }

    // Create new admin
    const admin = new Admin({
      email,
      password
    });

    await admin.save();

    // Generate token
    const token = generateAdminToken(admin);

    res.status(201).json({
      success: true,
      message: 'Admin registered successfully',
      data: {
        admin: admin.toJSON(),
        token
      }
    });

  } catch (error) {
    console.error('Admin registration error:', error);
    
    // Handle duplicate key errors
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'Email already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
});

// Admin login
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    // Find admin by email
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isPasswordValid = await admin.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate token
    const token = generateAdminToken(admin);

    res.json({
      success: true,
      message: 'Admin login successful',
      data: {
        admin: admin.toJSON(),
        token
      }
    });

  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router; 