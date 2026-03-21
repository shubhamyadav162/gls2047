/**
 * User Model
 * Handles user authentication, profile, and session management
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    // Basic Information
    fullName: {
        type: String,
        required: [true, 'Full name is required'],
        trim: true,
        minlength: [2, 'Name must be at least 2 characters'],
        maxlength: [100, 'Name cannot exceed 100 characters']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
        index: true
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required'],
        trim: true,
        match: [/^[0-9]{10}$/, 'Please provide a valid 10-digit phone number'],
        index: true
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [8, 'Password must be at least 8 characters'],
        select: false // Don't include password in queries by default
    },
    
    // Email Verification
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    emailVerificationToken: {
        type: String,
        select: false
    },
    emailVerificationExpires: {
        type: Date,
        select: false
    },
    
    // OTP for Email Verification
    otp: {
        type: String,
        select: false
    },
    otpExpires: {
        type: Date,
        select: false
    },
    otpAttempts: {
        type: Number,
        default: 0,
        select: false
    },
    
    // Password Reset
    passwordResetToken: {
        type: String,
        select: false
    },
    passwordResetExpires: {
        type: Date,
        select: false
    },
    
    // Profile Information
    profilePicture: {
        type: String,
        default: null
    },
    organization: {
        type: String,
        trim: true
    },
    designation: {
        type: String,
        trim: true
    },
    industry: {
        type: String,
        trim: true
    },
    city: {
        type: String,
        trim: true
    },
    state: {
        type: String,
        trim: true
    },
    country: {
        type: String,
        default: 'India'
    },
    
    // Preferences
    subscribeNewsletter: {
        type: Boolean,
        default: false
    },
    notificationsEnabled: {
        type: Boolean,
        default: true
    },
    
    // Social Login
    googleId: {
        type: String,
        sparse: true,
        unique: true
    },
    linkedinId: {
        type: String,
        sparse: true,
        unique: true
    },
    
    // Account Status
    isActive: {
        type: Boolean,
        default: true
    },
    accountLocked: {
        type: Boolean,
        default: false
    },
    lockUntil: {
        type: Date
    },
    
    // Login Tracking
    lastLogin: {
        type: Date
    },
    loginAttempts: {
        type: Number,
        default: 0
    },
    ipAddresses: [{
        ip: String,
        timestamp: Date
    }],
    
    // Tickets & Bookings Reference
    tickets: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ticket'
    }],
    
    // Role & Permissions
    role: {
        type: String,
        enum: ['user', 'admin', 'super_admin'],
        default: 'user'
    },
    
    // Metadata
    createdAt: {
        type: Date,
        default: Date.now,
        index: true
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    lastPasswordChange: {
        type: Date
    }
}, {
    timestamps: true
});

// Indexes for better performance
userSchema.index({ email: 1, isEmailVerified: 1 });
userSchema.index({ phone: 1 });
userSchema.index({ createdAt: -1 });

// Virtual for account lock status
userSchema.virtual('isLocked').get(function() {
    return !!(this.accountLocked && this.lockUntil && this.lockUntil > Date.now());
});

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
    // Only hash password if it's modified
    if (!this.isModified('password')) {
        return next();
    }
    
    try {
        // Generate salt and hash password
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        this.lastPasswordChange = new Date();
        next();
    } catch (error) {
        next(error);
    }
});

// Pre-save middleware to update timestamps
userSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        throw new Error('Password comparison failed');
    }
};

// Method to generate OTP
userSchema.methods.generateOTP = function() {
    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Hash OTP before storing
    this.otp = bcrypt.hashSync(otp, 10);
    
    // OTP expires in 10 minutes
    this.otpExpires = Date.now() + 10 * 60 * 1000;
    
    // Reset OTP attempts
    this.otpAttempts = 0;
    
    return otp; // Return plain OTP to send via email
};

// Method to verify OTP
userSchema.methods.verifyOTP = async function(candidateOTP) {
    // Check if OTP exists and hasn't expired
    if (!this.otp || !this.otpExpires) {
        return { success: false, message: 'No OTP found. Please request a new one.' };
    }
    
    if (Date.now() > this.otpExpires) {
        return { success: false, message: 'OTP has expired. Please request a new one.' };
    }
    
    // Check attempt limit (max 5 attempts)
    if (this.otpAttempts >= 5) {
        return { success: false, message: 'Maximum OTP attempts exceeded. Please request a new one.' };
    }
    
    // Verify OTP
    const isMatch = await bcrypt.compare(candidateOTP, this.otp);
    
    if (!isMatch) {
        this.otpAttempts += 1;
        await this.save();
        return { 
            success: false, 
            message: `Invalid OTP. ${5 - this.otpAttempts} attempts remaining.` 
        };
    }
    
    // OTP is valid - clear OTP fields
    this.otp = undefined;
    this.otpExpires = undefined;
    this.otpAttempts = 0;
    this.isEmailVerified = true;
    
    await this.save();
    
    return { success: true, message: 'OTP verified successfully' };
};

// Method to generate password reset token
userSchema.methods.generatePasswordResetToken = function() {
    const crypto = require('crypto');
    const resetToken = crypto.randomBytes(32).toString('hex');
    
    // Hash token before storing
    this.passwordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');
    
    // Token expires in 1 hour
    this.passwordResetExpires = Date.now() + 60 * 60 * 1000;
    
    return resetToken; // Return plain token to send via email
};

// Method to increment login attempts
userSchema.methods.incLoginAttempts = function() {
    // If we have a previous lock that has expired, restart at 1
    if (this.lockUntil && this.lockUntil < Date.now()) {
        return this.updateOne({
            $set: { loginAttempts: 1 },
            $unset: { lockUntil: 1 }
        });
    }
    
    // Otherwise increment attempts
    const updates = { $inc: { loginAttempts: 1 } };
    
    // Lock account after 5 failed attempts for 2 hours
    const maxAttempts = 5;
    const lockTime = 2 * 60 * 60 * 1000; // 2 hours
    
    if (this.loginAttempts + 1 >= maxAttempts && !this.isLocked) {
        updates.$set = { 
            accountLocked: true,
            lockUntil: Date.now() + lockTime 
        };
    }
    
    return this.updateOne(updates);
};

// Method to reset login attempts
userSchema.methods.resetLoginAttempts = function() {
    return this.updateOne({
        $set: { loginAttempts: 0, accountLocked: false },
        $unset: { lockUntil: 1 }
    });
};

// Method to update last login
userSchema.methods.updateLastLogin = function(ipAddress) {
    this.lastLogin = new Date();
    
    // Add IP address to tracking array
    if (ipAddress) {
        this.ipAddresses.push({
            ip: ipAddress,
            timestamp: new Date()
        });
        
        // Keep only last 10 IP addresses
        if (this.ipAddresses.length > 10) {
            this.ipAddresses = this.ipAddresses.slice(-10);
        }
    }
    
    return this.save();
};

// Static method to find user by credentials
userSchema.statics.findByCredentials = async function(email, password) {
    const user = await this.findOne({ email }).select('+password');
    
    if (!user) {
        throw new Error('Invalid email or password');
    }
    
    // Check if account is locked
    if (user.isLocked) {
        throw new Error('Account is locked due to too many failed login attempts. Please try again later or reset your password.');
    }
    
    // Check if email is verified
    if (!user.isEmailVerified) {
        throw new Error('Please verify your email before logging in');
    }
    
    // Check if account is active
    if (!user.isActive) {
        throw new Error('Account is deactivated. Please contact support.');
    }
    
    // Compare password
    const isPasswordMatch = await user.comparePassword(password);
    
    if (!isPasswordMatch) {
        await user.incLoginAttempts();
        throw new Error('Invalid email or password');
    }
    
    // Reset login attempts on successful login
    if (user.loginAttempts > 0) {
        await user.resetLoginAttempts();
    }
    
    return user;
};

// Method to sanitize user object (remove sensitive fields)
userSchema.methods.toJSON = function() {
    const user = this.toObject();
    
    // Remove sensitive fields
    delete user.password;
    delete user.otp;
    delete user.otpExpires;
    delete user.otpAttempts;
    delete user.passwordResetToken;
    delete user.passwordResetExpires;
    delete user.emailVerificationToken;
    delete user.emailVerificationExpires;
    delete user.loginAttempts;
    delete user.ipAddresses;
    delete user.__v;
    
    return user;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
