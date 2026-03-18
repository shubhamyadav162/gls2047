/**
 * Payment Routes - PayU and Easebuzz Integration
 */

const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const axios = require('axios');
const { body, validationResult } = require('express-validator');
const Ticket = require('../models/Ticket');
const Transaction = require('../models/Transaction');
const { sendPaymentConfirmation } = require('../utils/email');

/**
 * Generate PayU Hash
 */
function generatePayUHash(data) {
    const { key, txnid, amount, productinfo, firstname, email, salt } = data;
    const hashString = `${key}|${txnid}|${amount}|${productinfo}|${firstname}|${email}|||||||||||${salt}`;
    return crypto.createHash('sha512').update(hashString).digest('hex');
}

/**
 * Generate Easebuzz Hash
 */
function generateEasebuzzHash(data) {
    const { key, txnid, amount, productinfo, firstname, email, salt } = data;
    const hashString = `${key}|${txnid}|${amount}|${productinfo}|${firstname}|${email}|||||||||||${salt}`;
    return crypto.createHash('sha512').update(hashString).digest('hex');
}

/**
 * @route   POST /api/payment/initiate
 * @desc    Initiate payment (PayU or Easebuzz)
 * @access  Public
 */
router.post('/initiate', [
    body('ticketType').notEmpty().withMessage('Ticket type is required'),
    body('quantity').isInt({ min: 1, max: 10 }).withMessage('Quantity must be between 1 and 10'),
    body('amount').isFloat({ min: 0 }).withMessage('Amount must be valid'),
    body('firstName').notEmpty().withMessage('First name is required'),
    body('lastName').notEmpty().withMessage('Last name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('phone').matches(/^[0-9]{10}$/).withMessage('Valid 10-digit phone number is required'),
    body('gateway').isIn(['payu', 'easebuzz']).withMessage('Invalid payment gateway')
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

        const {
            ticketType,
            quantity,
            amount,
            firstName,
            lastName,
            email,
            phone,
            organization,
            designation,
            address,
            city,
            state,
            pincode,
            country,
            gstNumber,
            gateway
        } = req.body;

        // Generate unique transaction ID
        const txnid = `GLS${Date.now()}${Math.floor(Math.random() * 1000)}`;
        
        // Calculate total with GST
        const subtotal = parseFloat(amount) * parseInt(quantity);
        const gst = subtotal * 0.18;
        const total = subtotal + gst;

        // Create ticket entry in database
        const ticket = new Ticket({
            transactionId: txnid,
            ticketType,
            quantity,
            unitPrice: parseFloat(amount),
            subtotal,
            gst,
            totalAmount: total,
            firstName,
            lastName,
            email,
            phone,
            organization,
            designation,
            address,
            city,
            state,
            pincode,
            country,
            gstNumber,
            paymentGateway: gateway,
            paymentStatus: 'pending',
            registrationDate: new Date()
        });

        await ticket.save();

        // Prepare payment gateway data
        const productInfo = `GLS Vision 2047 ${ticketType.toUpperCase()} Pass x${quantity}`;
        
        let paymentData;
        
        if (gateway === 'payu') {
            // PayU Integration
            const key = process.env.PAYU_MERCHANT_KEY;
            const salt = process.env.PAYU_MERCHANT_SALT;
            
            const hash = generatePayUHash({
                key,
                txnid,
                amount: total.toFixed(2),
                productinfo: productInfo,
                firstname: firstName,
                email,
                salt
            });

            paymentData = {
                key,
                txnid,
                amount: total.toFixed(2),
                productinfo: productInfo,
                firstname: firstName,
                email,
                phone,
                surl: `${process.env.API_BASE_URL}/api/payment/payu/success`,
                furl: `${process.env.API_BASE_URL}/api/payment/payu/failure`,
                hash,
                service_provider: 'payu_paisa',
                action: process.env.PAYU_BASE_URL
            };
        } else {
            // Easebuzz Integration
            const key = process.env.EASEBUZZ_MERCHANT_KEY;
            const salt = process.env.EASEBUZZ_SALT;
            
            const hash = generateEasebuzzHash({
                key,
                txnid,
                amount: total.toFixed(2),
                productinfo: productInfo,
                firstname: firstName,
                email,
                salt
            });

            paymentData = {
                key,
                txnid,
                amount: total.toFixed(2),
                productinfo: productInfo,
                firstname: firstName,
                email,
                phone,
                surl: `${process.env.API_BASE_URL}/api/payment/easebuzz/success`,
                furl: `${process.env.API_BASE_URL}/api/payment/easebuzz/failure`,
                hash,
                action: process.env.EASEBUZZ_BASE_URL
            };
        }

        // Log transaction
        const transaction = new Transaction({
            transactionId: txnid,
            ticketId: ticket._id,
            gateway,
            amount: total,
            status: 'initiated',
            timestamp: new Date()
        });
        await transaction.save();

        res.json({
            success: true,
            message: 'Payment initiated successfully',
            data: paymentData
        });

    } catch (error) {
        console.error('Payment initiation error:', error);
        res.status(500).json({
            success: false,
            error: {
                message: 'Failed to initiate payment',
                details: error.message
            }
        });
    }
});

/**
 * @route   POST /api/payment/payu/success
 * @desc    PayU payment success callback
 * @access  Public
 */
router.post('/payu/success', async (req, res) => {
    try {
        const {
            txnid,
            amount,
            productinfo,
            firstname,
            email,
            status,
            hash,
            mihpayid
        } = req.body;

        // Verify hash
        const salt = process.env.PAYU_MERCHANT_SALT;
        const key = process.env.PAYU_MERCHANT_KEY;
        
        // PayU sends reversed hash on response
        const verifyHashString = `${salt}|${status}|||||||||||${email}|${firstname}|${productinfo}|${amount}|${txnid}|${key}`;
        const verifyHash = crypto.createHash('sha512').update(verifyHashString).digest('hex');

        if (verifyHash !== hash) {
            throw new Error('Hash verification failed');
        }

        // Update ticket and transaction
        const ticket = await Ticket.findOne({ transactionId: txnid });
        if (!ticket) {
            throw new Error('Ticket not found');
        }

        ticket.paymentStatus = status === 'success' ? 'completed' : 'failed';
        ticket.paymentId = mihpayid;
        ticket.paymentDate = new Date();
        await ticket.save();

        const transaction = await Transaction.findOne({ transactionId: txnid });
        transaction.status = status === 'success' ? 'completed' : 'failed';
        transaction.gatewayTransactionId = mihpayid;
        transaction.response = req.body;
        await transaction.save();

        if (status === 'success') {
            // Send confirmation email
            await sendPaymentConfirmation(ticket);
        }

        // Redirect to frontend success page
        res.redirect(`${process.env.FRONTEND_URL}/payment-success?txnid=${txnid}`);

    } catch (error) {
        console.error('PayU success callback error:', error);
        res.redirect(`${process.env.FRONTEND_URL}/payment-failure?error=${encodeURIComponent(error.message)}`);
    }
});

/**
 * @route   POST /api/payment/payu/failure
 * @desc    PayU payment failure callback
 * @access  Public
 */
router.post('/payu/failure', async (req, res) => {
    try {
        const { txnid, status } = req.body;

        // Update records
        await Ticket.findOneAndUpdate(
            { transactionId: txnid },
            { paymentStatus: 'failed', paymentDate: new Date() }
        );

        await Transaction.findOneAndUpdate(
            { transactionId: txnid },
            { status: 'failed', response: req.body }
        );

        res.redirect(`${process.env.FRONTEND_URL}/payment-failure?txnid=${txnid}`);

    } catch (error) {
        console.error('PayU failure callback error:', error);
        res.redirect(`${process.env.FRONTEND_URL}/payment-failure`);
    }
});

/**
 * @route   POST /api/payment/easebuzz/success
 * @desc    Easebuzz payment success callback
 * @access  Public
 */
router.post('/easebuzz/success', async (req, res) => {
    try {
        const {
            txnid,
            amount,
            productinfo,
            firstname,
            email,
            status,
            hash,
            easepayid
        } = req.body;

        // Verify hash (similar to PayU)
        const salt = process.env.EASEBUZZ_SALT;
        const key = process.env.EASEBUZZ_MERCHANT_KEY;
        
        const verifyHashString = `${salt}|${status}|||||||||||${email}|${firstname}|${productinfo}|${amount}|${txnid}|${key}`;
        const verifyHash = crypto.createHash('sha512').update(verifyHashString).digest('hex');

        if (verifyHash !== hash) {
            throw new Error('Hash verification failed');
        }

        // Update ticket and transaction
        const ticket = await Ticket.findOne({ transactionId: txnid });
        ticket.paymentStatus = status === 'success' ? 'completed' : 'failed';
        ticket.paymentId = easepayid;
        ticket.paymentDate = new Date();
        await ticket.save();

        const transaction = await Transaction.findOne({ transactionId: txnid });
        transaction.status = status === 'success' ? 'completed' : 'failed';
        transaction.gatewayTransactionId = easepayid;
        transaction.response = req.body;
        await transaction.save();

        if (status === 'success') {
            await sendPaymentConfirmation(ticket);
        }

        res.redirect(`${process.env.FRONTEND_URL}/payment-success?txnid=${txnid}`);

    } catch (error) {
        console.error('Easebuzz success callback error:', error);
        res.redirect(`${process.env.FRONTEND_URL}/payment-failure?error=${encodeURIComponent(error.message)}`);
    }
});

/**
 * @route   POST /api/payment/easebuzz/failure
 * @desc    Easebuzz payment failure callback
 * @access  Public
 */
router.post('/easebuzz/failure', async (req, res) => {
    try {
        const { txnid } = req.body;

        await Ticket.findOneAndUpdate(
            { transactionId: txnid },
            { paymentStatus: 'failed', paymentDate: new Date() }
        );

        await Transaction.findOneAndUpdate(
            { transactionId: txnid },
            { status: 'failed', response: req.body }
        );

        res.redirect(`${process.env.FRONTEND_URL}/payment-failure?txnid=${txnid}`);

    } catch (error) {
        console.error('Easebuzz failure callback error:', error);
        res.redirect(`${process.env.FRONTEND_URL}/payment-failure`);
    }
});

/**
 * @route   GET /api/payment/status/:txnid
 * @desc    Check payment status
 * @access  Public
 */
router.get('/status/:txnid', async (req, res) => {
    try {
        const { txnid } = req.params;

        const ticket = await Ticket.findOne({ transactionId: txnid });
        if (!ticket) {
            return res.status(404).json({
                success: false,
                error: { message: 'Transaction not found' }
            });
        }

        res.json({
            success: true,
            data: {
                transactionId: ticket.transactionId,
                status: ticket.paymentStatus,
                amount: ticket.totalAmount,
                ticketType: ticket.ticketType,
                quantity: ticket.quantity
            }
        });

    } catch (error) {
        console.error('Payment status check error:', error);
        res.status(500).json({
            success: false,
            error: { message: 'Failed to check payment status' }
        });
    }
});

module.exports = router;
