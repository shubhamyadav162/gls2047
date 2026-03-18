/**
 * Authentication Middleware
 * JWT token verification and route protection
 */

const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Verify JWT token and attach user to request
 */
const authMiddleware = async (req, res, next) => {
    try {
        // Get token from header
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({
                success: false,
                error: { message: 'Access denied. No token provided.' }
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Check if user still exists
        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(401).json({
                success: false,
                error: { message: 'Invalid token. User not found.' }
            });
        }

        // Check if user is active
        if (!user.isActive) {
            return res.status(401).json({
                success: false,
                error: { message: 'Account has been deactivated.' }
            });
        }

        // Check if account is locked
        if (user.isLocked) {
            return res.status(401).json({
                success: false,
                error: { message: 'Account is locked. Please try again later or reset your password.' }
            });
        }

        // Attach user info to request
        req.user = {
            userId: user._id,
            email: user.email,
            role: user.role,
            fullName: user.fullName
        };

        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                error: { message: 'Invalid token.' }
            });
        }

        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                error: { message: 'Token has expired. Please login again.' }
            });
        }

        console.error('Auth middleware error:', error);
        res.status(500).json({
            success: false,
            error: { message: 'Authentication failed.' }
        });
    }
};

/**
 * Check if user is admin
 */
const adminMiddleware = (req, res, next) => {
    if (req.user.role !== 'admin' && req.user.role !== 'super_admin') {
        return res.status(403).json({
            success: false,
            error: { message: 'Access denied. Admin privileges required.' }
        });
    }
    next();
};

/**
 * Optional auth - doesn't fail if no token, just sets user if available
 */
const optionalAuth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (token) {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.userId);

            if (user && user.isActive) {
                req.user = {
                    userId: user._id,
                    email: user.email,
                    role: user.role,
                    fullName: user.fullName
                };
            }
        }

        next();
    } catch (error) {
        // Token invalid or expired, continue without user
        next();
    }
};

module.exports = {
    authMiddleware,
    adminMiddleware,
    optionalAuth
};
