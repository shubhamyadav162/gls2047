/**
 * Authentication Routes
 * Handles signup, login, OTP verification, password reset
 */

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { sendOTPEmail, sendWelcomeEmail, sendPasswordResetEmail } = require('../utils/email');
const { authMiddleware } = require('../middleware/auth');

/**
 * @route   POST /api/auth/signup
 * @desc    Register new user and send OTP
 * @access  Public
 */
router.post('/signup', [
    body('fullName').trim().notEmpty().withMessage('Full name is required')
        .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2-100 characters'),
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('phone').matches(/^[0-9]{10}$/).withMessage('Valid 10-digit phone number is required'),
    body('password')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
        .withMessage('Password must contain uppercase, lowercase, number, and special character'),
    body('confirmPassword').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Passwords do not match');
        }
        return true;
    })
], async (req, res) => {
    try {
        // Validation
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const { fullName, email, phone, password, subscribeNewsletter } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
        
        if (existingUser) {
            if (existingUser.email === email) {
                return res.status(400).json({
                    success: false,
                    error: { message: 'Email already registered. Please login or use a different email.' }
                });
            }
            if (existingUser.phone === phone) {
                return res.status(400).json({
                    success: false,
                    error: { message: 'Phone number already registered. Please use a different number.' }
                });
            }
        }

        // Create new user (email not verified yet)
        const user = new User({
            fullName,
            email,
            phone,
            password,
            subscribeNewsletter: subscribeNewsletter || false,
            isEmailVerified: false
        });

        // Generate OTP
        const otp = user.generateOTP();
        
        // Save user
        await user.save();

        // Send OTP email
        await sendOTPEmail(email, fullName, otp);

        res.status(201).json({
            success: true,
            message: 'Account created successfully. Please verify your email with the OTP sent to your inbox.',
            data: {
                userId: user._id,
                email: user.email,
                otpSent: true,
                otpExpires: user.otpExpires
            }
        });

    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({
            success: false,
            error: {
                message: 'Failed to create account. Please try again.',
                details: process.env.NODE_ENV === 'development' ? error.message : undefined
            }
        });
    }
});

/**
 * @route   POST /api/auth/verify-otp
 * @desc    Verify email with OTP
 * @access  Public
 */
router.post('/verify-otp', [
    body('email').isEmail().withMessage('Valid email is required'),
    body('otp').isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const { email, otp } = req.body;

        // Find user
        const user = await User.findOne({ email }).select('+otp +otpExpires +otpAttempts');
        
        if (!user) {
            return res.status(404).json({
                success: false,
                error: { message: 'User not found' }
            });
        }

        if (user.isEmailVerified) {
            return res.status(400).json({
                success: false,
                error: { message: 'Email already verified. Please login.' }
            });
        }

        // Verify OTP
        const verificationResult = await user.verifyOTP(otp);

        if (!verificationResult.success) {
            return res.status(400).json({
                success: false,
                error: { message: verificationResult.message }
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRE || '7d' }
        );

        // Send welcome email
        await sendWelcomeEmail(user.email, user.fullName);

        res.json({
            success: true,
            message: 'Email verified successfully! Welcome to GLS Vision 2047.',
            data: {
                token,
                user: {
                    id: user._id,
                    fullName: user.fullName,
                    email: user.email,
                    phone: user.phone,
                    isEmailVerified: user.isEmailVerified
                }
            }
        });

    } catch (error) {
        console.error('OTP verification error:', error);
        res.status(500).json({
            success: false,
            error: { message: 'Failed to verify OTP. Please try again.' }
        });
    }
});

/**
 * @route   POST /api/auth/resend-otp
 * @desc    Resend OTP email
 * @access  Public
 */
router.post('/resend-otp', [
    body('email').isEmail().withMessage('Valid email is required')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const { email } = req.body;

        const user = await User.findOne({ email });
        
        if (!user) {
            return res.status(404).json({
                success: false,
                error: { message: 'User not found' }
            });
        }

        if (user.isEmailVerified) {
            return res.status(400).json({
                success: false,
                error: { message: 'Email already verified' }
            });
        }

        // Generate new OTP
        const otp = user.generateOTP();
        await user.save();

        // Send OTP email
        await sendOTPEmail(email, user.fullName, otp);

        res.json({
            success: true,
            message: 'OTP resent successfully. Please check your email.',
            data: {
                otpExpires: user.otpExpires
            }
        });

    } catch (error) {
        console.error('Resend OTP error:', error);
        res.status(500).json({
            success: false,
            error: { message: 'Failed to resend OTP. Please try again.' }
        });
    }
});

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post('/login', [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const { email, password, rememberMe } = req.body;

        // Find user by credentials (includes password validation)
        const user = await User.findByCredentials(email, password);

        // Update last login
        const ipAddress = req.ip || req.connection.remoteAddress;
        await user.updateLastLogin(ipAddress);

        // Generate JWT token
        const expiresIn = rememberMe ? '30d' : (process.env.JWT_EXPIRE || '7d');
        const token = jwt.sign(
            { userId: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn }
        );

        res.json({
            success: true,
            message: 'Login successful',
            data: {
                token,
                expiresIn,
                user: {
                    id: user._id,
                    fullName: user.fullName,
                    email: user.email,
                    phone: user.phone,
                    profilePicture: user.profilePicture,
                    organization: user.organization,
                    isEmailVerified: user.isEmailVerified,
                    role: user.role
                }
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(401).json({
            success: false,
            error: { message: error.message || 'Login failed. Please check your credentials.' }
        });
    }
});

/**
 * @route   POST /api/auth/forgot-password
 * @desc    Send password reset link
 * @access  Public
 */
router.post('/forgot-password', [
    body('email').isEmail().withMessage('Valid email is required')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const { email } = req.body;

        const user = await User.findOne({ email });
        
        if (!user) {
            // Don't reveal if user exists
            return res.json({
                success: true,
                message: 'If an account exists with this email, a password reset link has been sent.'
            });
        }

        // Generate password reset token
        const resetToken = user.generatePasswordResetToken();
        await user.save();

        // Create reset URL
        const resetURL = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

        // Send password reset email
        await sendPasswordResetEmail(user.email, user.fullName, resetURL);

        res.json({
            success: true,
            message: 'Password reset link sent to your email. Please check your inbox.'
        });

    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({
            success: false,
            error: { message: 'Failed to send password reset email. Please try again.' }
        });
    }
});

/**
 * @route   POST /api/auth/reset-password
 * @desc    Reset password with token
 * @access  Public
 */
router.post('/reset-password', [
    body('token').notEmpty().withMessage('Reset token is required'),
    body('password')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
        .withMessage('Password must contain uppercase, lowercase, number, and special character'),
    body('confirmPassword').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Passwords do not match');
        }
        return true;
    })
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const { token, password } = req.body;

        // Hash the token to compare with stored hash
        const hashedToken = crypto
            .createHash('sha256')
            .update(token)
            .digest('hex');

        // Find user with valid reset token
        const user = await User.findOne({
            passwordResetToken: hashedToken,
            passwordResetExpires: { $gt: Date.now() }
        }).select('+passwordResetToken +passwordResetExpires');

        if (!user) {
            return res.status(400).json({
                success: false,
                error: { message: 'Invalid or expired reset token. Please request a new password reset link.' }
            });
        }

        // Set new password
        user.password = password;
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        user.loginAttempts = 0;
        user.accountLocked = false;
        user.lockUntil = undefined;

        await user.save();

        res.json({
            success: true,
            message: 'Password reset successful. You can now login with your new password.'
        });

    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({
            success: false,
            error: { message: 'Failed to reset password. Please try again.' }
        });
    }
});

/**
 * @route   GET /api/auth/me
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/me', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId)
            .populate('tickets', 'ticketType ticketCode totalAmount registrationDate');

        if (!user) {
            return res.status(404).json({
                success: false,
                error: { message: 'User not found' }
            });
        }

        res.json({
            success: true,
            data: { user }
        });

    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({
            success: false,
            error: { message: 'Failed to fetch profile' }
        });
    }
});

/**
 * @route   PUT /api/auth/update-profile
 * @desc    Update user profile
 * @access  Private
 */
router.put('/update-profile', authMiddleware, [
    body('fullName').optional().trim().isLength({ min: 2, max: 100 }),
    body('phone').optional().matches(/^[0-9]{10}$/),
    body('organization').optional().trim(),
    body('designation').optional().trim()
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const allowedUpdates = ['fullName', 'phone', 'organization', 'designation', 'industry', 'city', 'state', 'country', 'subscribeNewsletter', 'notificationsEnabled'];
        const updates = {};

        Object.keys(req.body).forEach(key => {
            if (allowedUpdates.includes(key)) {
                updates[key] = req.body[key];
            }
        });

        const user = await User.findByIdAndUpdate(
            req.user.userId,
            updates,
            { new: true, runValidators: true }
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                error: { message: 'User not found' }
            });
        }

        res.json({
            success: true,
            message: 'Profile updated successfully',
            data: { user }
        });

    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({
            success: false,
            error: { message: 'Failed to update profile' }
        });
    }
});

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user (client-side token removal)
 * @access  Private
 */
router.post('/logout', authMiddleware, async (req, res) => {
    // With JWT, logout is handled client-side by removing the token
    // This endpoint is for logging purposes
    res.json({
        success: true,
        message: 'Logged out successfully'
    });
});

module.exports = router;
