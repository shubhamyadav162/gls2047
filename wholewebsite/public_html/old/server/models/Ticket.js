/**
 * Ticket Model
 * Stores ticket purchase information
 */

const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
    transactionId: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    ticketType: {
        type: String,
        required: true,
        enum: ['platinum', 'gold', 'startup'],
        index: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
        max: 10
    },
    unitPrice: {
        type: Number,
        required: true
    },
    subtotal: {
        type: Number,
        required: true
    },
    gst: {
        type: Number,
        required: true
    },
    totalAmount: {
        type: Number,
        required: true
    },
    
    // Personal Information
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        index: true
    },
    phone: {
        type: String,
        required: true,
        trim: true
    },
    
    // Professional Information
    organization: {
        type: String,
        required: true,
        trim: true
    },
    designation: {
        type: String,
        required: true,
        trim: true
    },
    industry: {
        type: String,
        trim: true
    },
    
    // Billing Address
    address: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    pincode: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true,
        default: 'India'
    },
    gstNumber: {
        type: String,
        trim: true
    },
    
    // Payment Information
    paymentGateway: {
        type: String,
        enum: ['payu', 'easebuzz'],
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'completed', 'failed', 'refunded'],
        default: 'pending',
        index: true
    },
    paymentId: {
        type: String
    },
    paymentDate: {
        type: Date
    },
    
    // Ticket Details
    ticketCode: {
        type: String,
        unique: true,
        sparse: true
    },
    qrCode: {
        type: String
    },
    isCheckedIn: {
        type: Boolean,
        default: false
    },
    checkedInAt: {
        type: Date
    },
    
    // Email Status
    confirmationEmailSent: {
        type: Boolean,
        default: false
    },
    reminderEmailSent: {
        type: Boolean,
        default: false
    },
    
    // Metadata
    registrationDate: {
        type: Date,
        default: Date.now,
        index: true
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    },
    notes: {
        type: String
    }
}, {
    timestamps: true
});

// Generate ticket code after successful payment
ticketSchema.pre('save', function(next) {
    if (this.paymentStatus === 'completed' && !this.ticketCode) {
        const prefix = this.ticketType.toUpperCase().substring(0, 2);
        const random = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
        this.ticketCode = `GLS2026-${prefix}-${random}`;
    }
    this.lastUpdated = Date.now();
    next();
});

// Indexes for better query performance
ticketSchema.index({ email: 1, paymentStatus: 1 });
ticketSchema.index({ registrationDate: -1 });
ticketSchema.index({ paymentStatus: 1, registrationDate: -1 });

const Ticket = mongoose.model('Ticket', ticketSchema);

module.exports = Ticket;
