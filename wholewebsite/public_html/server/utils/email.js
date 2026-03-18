/**
 * Email Utilities
 * Handles all email sending functionality
 */

const nodemailer = require('nodemailer');

// Create reusable transporter
const createTransporter = () => {
    return nodemailer.createTransporter({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    });
};

/**
 * Send OTP Email
 */
const sendOTPEmail = async (email, fullName, otp) => {
    try {
        const transporter = createTransporter();

        const mailOptions = {
            from: process.env.EMAIL_FROM || `"GLS Vision 2047" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Verify Your Email - Global Leadership Summit Vision 2047',
            html: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #0D47A1, #D4AF37); padding: 30px; text-align: center; color: white; }
        .logo { font-size: 24px; font-weight: bold; }
        .content { background: #fff; padding: 30px; border: 1px solid #ddd; }
        .otp-box { background: #f5f5f5; border: 2px dashed #0D47A1; padding: 20px; text-align: center; margin: 20px 0; }
        .otp-code { font-size: 32px; font-weight: bold; color: #0D47A1; letter-spacing: 8px; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        .button { display: inline-block; padding: 12px 30px; background: #D4AF37; color: #111; text-decoration: none; border-radius: 5px; font-weight: bold; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">GLS Vision 2047</div>
            <p>Global Leadership Summit</p>
        </div>
        
        <div class="content">
            <h2>Verify Your Email Address</h2>
            <p>Dear ${fullName},</p>
            <p>Thank you for registering for Global Leadership Summit Vision 2047!</p>
            <p>To complete your registration, please use the following One-Time Password (OTP):</p>
            
            <div class="otp-box">
                <p style="margin: 0; font-size: 14px; color: #666;">Your OTP Code</p>
                <div class="otp-code">${otp}</div>
                <p style="margin: 10px 0 0 0; font-size: 12px; color: #999;">Valid for 10 minutes</p>
            </div>
            
            <p><strong>Important:</strong></p>
            <ul>
                <li>This OTP is valid for 10 minutes only</li>
                <li>Do not share this OTP with anyone</li>
                <li>If you didn't request this, please ignore this email</li>
            </ul>
            
            <p>Need help? Contact us at <a href="mailto:care@glsvision2047.com">care@glsvision2047.com</a></p>
            
            <p>Best regards,<br>Team GLS Vision 2047</p>
        </div>
        
        <div class="footer">
            <p>Global Leadership Summit Vision 2047</p>
            <p>March, 2026 | Bharat Mandapam, Delhi</p>
            <p>Organized by GLS Vision 2047 Leaders & NextGen Ventures</p>
            <p>&copy; 2026 Global Leadership Summit. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log(`✅ OTP email sent to ${email}`);
        
    } catch (error) {
        console.error('Send OTP email error:', error);
        throw new Error('Failed to send OTP email');
    }
};

/**
 * Send Welcome Email
 */
const sendWelcomeEmail = async (email, fullName) => {
    try {
        const transporter = createTransporter();

        const mailOptions = {
            from: process.env.EMAIL_FROM || `"GLS Vision 2047" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Welcome to Global Leadership Summit Vision 2047!',
            html: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #0D47A1, #D4AF37); padding: 30px; text-align: center; color: white; }
        .content { background: #fff; padding: 30px; border: 1px solid #ddd; }
        .button { display: inline-block; padding: 12px 30px; background: #D4AF37; color: #111; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 10px 5px; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        .features { background: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0; }
        .feature-item { margin: 10px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Welcome to GLS Vision 2047!</h1>
            <p>Your account is now active</p>
        </div>
        
        <div class="content">
            <h2>Hello ${fullName}!</h2>
            <p>🎉 Congratulations! Your account has been successfully created.</p>
            <p>You're now part of India's most prestigious leadership and innovation platform.</p>
            
            <div class="features">
                <h3>What's Next?</h3>
                <div class="feature-item">✓ Browse our stellar lineup of speakers</div>
                <div class="feature-item">✓ Book your delegate pass</div>
                <div class="feature-item">✓ Explore the conference agenda</div>
                <div class="feature-item">✓ Network with industry leaders</div>
                <div class="feature-item">✓ Access exclusive content & resources</div>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.FRONTEND_URL}/dashboard" class="button">Go to Dashboard</a>
                <a href="${process.env.FRONTEND_URL}/tickets" class="button">Book Tickets</a>
            </div>
            
            <h3>Event Details</h3>
            <p><strong>Date:</strong> March, 2026<br>
            <strong>Venue:</strong> Bharat Mandapam, Delhi<br>
            <strong>Theme:</strong> Leadership • Innovation • Vision 2047</p>
            
            <p>Expected Attendees: <strong>5,000+</strong> delegates including IIT alumni, unicorn founders, VCs, and policymakers.</p>
            
            <p>Need assistance? We're here to help!<br>
            📧 Email: <a href="mailto:care@glsvision2047.com">care@glsvision2047.com</a><br>
            📞 Phone: <a href="tel:+919026181492">+91 9026181492</a></p>
            
            <p>See you at the summit!</p>
            <p>Best regards,<br><strong>Team GLS Vision 2047</strong></p>
        </div>
        
        <div class="footer">
            <p>Global Leadership Summit Vision 2047</p>
            <p>Organized by GLS Vision 2047 Leaders & NextGen Ventures</p>
            <p>&copy; 2026 Global Leadership Summit. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log(`✅ Welcome email sent to ${email}`);
        
    } catch (error) {
        console.error('Send welcome email error:', error);
        // Don't throw error - welcome email is not critical
    }
};

/**
 * Send Password Reset Email
 */
const sendPasswordResetEmail = async (email, fullName, resetURL) => {
    try {
        const transporter = createTransporter();

        const mailOptions = {
            from: process.env.EMAIL_FROM || `"GLS Vision 2047" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Reset Your Password - Global Leadership Summit Vision 2047',
            html: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #0D47A1, #D4AF37); padding: 30px; text-align: center; color: white; }
        .content { background: #fff; padding: 30px; border: 1px solid #ddd; }
        .button { display: inline-block; padding: 12px 30px; background: #D4AF37; color: #111; text-decoration: none; border-radius: 5px; font-weight: bold; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🔐 Password Reset Request</h1>
        </div>
        
        <div class="content">
            <h2>Hello ${fullName},</h2>
            <p>We received a request to reset your password for your GLS Vision 2047 account.</p>
            <p>Click the button below to create a new password:</p>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="${resetURL}" class="button">Reset Password</a>
            </div>
            
            <p>Or copy and paste this link into your browser:</p>
            <p style="word-break: break-all; background: #f5f5f5; padding: 10px;">${resetURL}</p>
            
            <div class="warning">
                <p style="margin: 0;"><strong>⚠️ Security Notice:</strong></p>
                <ul style="margin: 10px 0 0 0;">
                    <li>This link will expire in 1 hour</li>
                    <li>If you didn't request this, please ignore this email</li>
                    <li>Your password won't change until you create a new one</li>
                </ul>
            </div>
            
            <p>If you're having trouble, contact our support team at <a href="mailto:care@glsvision2047.com">care@glsvision2047.com</a></p>
            
            <p>Best regards,<br>Team GLS Vision 2047</p>
        </div>
        
        <div class="footer">
            <p>Global Leadership Summit Vision 2047</p>
            <p>&copy; 2026 Global Leadership Summit. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log(`✅ Password reset email sent to ${email}`);
        
    } catch (error) {
        console.error('Send password reset email error:', error);
        throw new Error('Failed to send password reset email');
    }
};

/**
 * Send Payment Confirmation Email (existing function - enhanced)
 */
const sendPaymentConfirmation = async (ticket) => {
    try {
        const transporter = createTransporter();

        const mailOptions = {
            from: process.env.EMAIL_FROM || `"GLS Vision 2047" <${process.env.EMAIL_USER}>`,
            to: ticket.email,
            subject: '✅ Booking Confirmed - Global Leadership Summit Vision 2047',
            html: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #0D47A1, #D4AF37); padding: 30px; text-align: center; color: white; }
        .content { background: #fff; padding: 30px; border: 1px solid #ddd; }
        .ticket-details { background: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0; }
        .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #ddd; }
        .button { display: inline-block; padding: 12px 30px; background: #D4AF37; color: #111; text-decoration: none; border-radius: 5px; font-weight: bold; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎉 Booking Confirmed!</h1>
            <p>Global Leadership Summit Vision 2047</p>
        </div>
        
        <div class="content">
            <h2>Thank you, ${ticket.firstName} ${ticket.lastName}!</h2>
            <p>Your registration for GLS Vision 2047 has been confirmed.</p>
            
            <div class="ticket-details">
                <h3>Ticket Details</h3>
                <div class="detail-row">
                    <span>Ticket Type:</span>
                    <strong>${ticket.ticketType.toUpperCase()}</strong>
                </div>
                <div class="detail-row">
                    <span>Quantity:</span>
                    <strong>${ticket.quantity}</strong>
                </div>
                <div class="detail-row">
                    <span>Total Amount:</span>
                    <strong>₹${ticket.totalAmount.toLocaleString('en-IN')}</strong>
                </div>
                <div class="detail-row">
                    <span>Transaction ID:</span>
                    <strong>${ticket.transactionId}</strong>
                </div>
                <div class="detail-row">
                    <span>Ticket Code:</span>
                    <strong>${ticket.ticketCode || 'Generating...'}</strong>
                </div>
            </div>
            
            <h3>Event Details</h3>
            <p><strong>Date:</strong> March, 2026<br>
            <strong>Venue:</strong> Bharat Mandapam, New Delhi<br>
            <strong>Time:</strong> 8:00 AM onwards</p>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.FRONTEND_URL}/dashboard" class="button">View My Tickets</a>
            </div>
            
            <p><strong>What's Next?</strong></p>
            <ul>
                <li>You'll receive your e-ticket with QR code separately</li>
                <li>Download the event app for updates</li>
                <li>Check out the speakers and agenda</li>
                <li>Plan your travel and accommodation</li>
            </ul>
            
            <p>See you at the summit!</p>
            <p>Team GLS Vision 2047</p>
        </div>
        
        <div class="footer">
            <p>Global Leadership Summit Vision 2047</p>
            <p>For queries: care@glsvision2047.com | +91 9026181492</p>
            <p>&copy; 2026 Global Leadership Summit. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log(`✅ Payment confirmation email sent to ${ticket.email}`);
        
    } catch (error) {
        console.error('Send payment confirmation email error:', error);
        // Don't throw - let payment succeed even if email fails
    }
};

module.exports = {
    sendOTPEmail,
    sendWelcomeEmail,
    sendPasswordResetEmail,
    sendPaymentConfirmation
};
