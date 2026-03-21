// ==========================================
// PayU Payment Integration
// ==========================================

class PayUIntegration {
    constructor() {
        // PayU Configuration (Replace with your actual credentials)
        this.config = {
            merchantKey: 'HSWnht',      // PayU production key
            merchantSalt: 'cMXguKayBU9yfIfwB3MQfkm8pjDKZZlP',    // PayU production salt
            mode: 'live', // 'test' or 'live'
            testUrl: 'https://test.payu.in/_payment',
            liveUrl: 'https://secure.payu.in/_payment'
        };

        this.paymentUrl = this.config.mode === 'live' ? this.config.liveUrl : this.config.testUrl;
    }

    // ==========================================
    // Generate Transaction ID
    // ==========================================
    
    generateTxnId() {
        const timestamp = Date.now();
        const random = Math.random().toString(36).substring(2, 9).toUpperCase();
        return `GLS2026_${timestamp}_${random}`;
    }

    // ==========================================
    // Calculate Hash (SHA512)
    // ==========================================
    
    async generateHash(params) {
        const hashString = `${this.config.merchantKey}|${params.txnid}|${params.amount}|${params.productinfo}|${params.firstname}|${params.email}|||||||||||${this.config.merchantSalt}`;
        
        // In production, generate hash on backend for security
        // This is a demo implementation
        return await this.sha512(hashString);
    }

    async sha512(str) {
        // Use Web Crypto API for hashing
        const buffer = new TextEncoder().encode(str);
        const hashBuffer = await crypto.subtle.digest('SHA-512', buffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    // ==========================================
    // Initiate Ticket Payment
    // ==========================================
    
    async initiateTicketPayment(ticketData) {
        const user = authSystem?.currentUser;
        
        if (!user) {
            alert('Please login to purchase tickets');
            return { success: false, message: 'User not logged in' };
        }

        const txnid = this.generateTxnId();
        const amount = ticketData.totalAmount.toFixed(2);
        
        const paymentParams = {
            key: this.config.merchantKey,
            txnid: txnid,
            amount: amount,
            productinfo: `GLS Vision 2047 - ${ticketData.ticketType} - Qty: ${ticketData.quantity}`,
            firstname: user.name.split(' ')[0],
            email: user.email,
            phone: user.phone,
            surl: `${window.location.origin}/payment-success.html`,
            furl: `${window.location.origin}/payment-failure.html`,
            service_provider: 'payu_paisa',
            udf1: ticketData.ticketType,
            udf2: ticketData.quantity.toString(),
            udf3: ticketData.ticketId,
            udf4: user.id,
            udf5: 'ticket_purchase'
        };

        // Generate hash
        paymentParams.hash = await this.generateHash(paymentParams);

        // Store transaction data
        this.storeTransaction({
            txnid,
            type: 'ticket',
            user,
            ticketData,
            amount,
            status: 'initiated',
            timestamp: new Date().toISOString()
        });

        // Submit payment form
        this.submitPaymentForm(paymentParams);

        return { success: true, txnid };
    }

    // ==========================================
    // Initiate Donation Payment
    // ==========================================
    
    async initiateDonation(donationData) {
        const user = authSystem?.currentUser;
        
        if (!user) {
            alert('Please login to make a donation');
            return { success: false, message: 'User not logged in' };
        }

        const txnid = this.generateTxnId();
        const amount = donationData.amount.toFixed(2);
        
        const paymentParams = {
            key: this.config.merchantKey,
            txnid: txnid,
            amount: amount,
            productinfo: `GLS Vision 2047 - Donation - ${donationData.purpose || 'General Support'}`,
            firstname: user.name.split(' ')[0],
            email: user.email,
            phone: user.phone,
            surl: `${window.location.origin}/payment-success.html`,
            furl: `${window.location.origin}/payment-failure.html`,
            service_provider: 'payu_paisa',
            udf1: 'donation',
            udf2: amount,
            udf3: donationData.purpose || 'general',
            udf4: user.id,
            udf5: 'donation'
        };

        paymentParams.hash = await this.generateHash(paymentParams);

        this.storeTransaction({
            txnid,
            type: 'donation',
            user,
            donationData,
            amount,
            status: 'initiated',
            timestamp: new Date().toISOString()
        });

        this.submitPaymentForm(paymentParams);

        return { success: true, txnid };
    }

    // ==========================================
    // Initiate Sponsorship Payment
    // ==========================================
    
    async initiateSponsorshipPayment(sponsorshipData) {
        const txnid = this.generateTxnId();
        const amount = sponsorshipData.amount ? sponsorshipData.amount.toFixed(2) : '0.00';
        
        const paymentParams = {
            key: this.config.merchantKey,
            txnid: txnid,
            amount: amount || '1.00', // Minimum amount for inquiry
            productinfo: `GLS Vision 2047 - ${sponsorshipData.tier} Sponsorship Inquiry`,
            firstname: sponsorshipData.contactName.split(' ')[0],
            email: sponsorshipData.email,
            phone: sponsorshipData.phone,
            surl: `${window.location.origin}/payment-success.html`,
            furl: `${window.location.origin}/payment-failure.html`,
            service_provider: 'payu_paisa',
            udf1: 'sponsorship',
            udf2: sponsorshipData.tier,
            udf3: sponsorshipData.company,
            udf4: sponsorshipData.stallSize || '',
            udf5: 'sponsorship_inquiry'
        };

        paymentParams.hash = await this.generateHash(paymentParams);

        this.storeTransaction({
            txnid,
            type: 'sponsorship',
            sponsorshipData,
            amount,
            status: 'initiated',
            timestamp: new Date().toISOString()
        });

        // For sponsorship inquiries, just store data and redirect
        if (!amount || amount === '0.00') {
            alert('Thank you for your interest! Our team will contact you shortly.');
            return { success: true, message: 'Inquiry submitted' };
        }

        this.submitPaymentForm(paymentParams);

        return { success: true, txnid };
    }

    // ==========================================
    // Submit Payment Form
    // ==========================================
    
    submitPaymentForm(params) {
        // Create form dynamically
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = this.paymentUrl;
        form.name = 'payuForm';

        // Add all parameters as hidden fields
        for (const key in params) {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = key;
            input.value = params[key];
            form.appendChild(input);
        }

        // Append to body and submit
        document.body.appendChild(form);
        
        // Show loading message
        this.showLoadingMessage();
        
        // Submit form
        setTimeout(() => {
            form.submit();
        }, 500);
    }

    // ==========================================
    // Store Transaction
    // ==========================================
    
    storeTransaction(transactionData) {
        try {
            const transactions = this.getAllTransactions();
            transactions.push(transactionData);
            localStorage.setItem('gls2026_transactions', JSON.stringify(transactions));
        } catch (error) {
            console.error('Error storing transaction:', error);
        }
    }

    getAllTransactions() {
        try {
            const data = localStorage.getItem('gls2026_transactions');
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Error loading transactions:', error);
            return [];
        }
    }

    getTransaction(txnid) {
        const transactions = this.getAllTransactions();
        return transactions.find(t => t.txnid === txnid);
    }

    updateTransactionStatus(txnid, status, paymentData = {}) {
        try {
            const transactions = this.getAllTransactions();
            const index = transactions.findIndex(t => t.txnid === txnid);
            
            if (index !== -1) {
                transactions[index].status = status;
                transactions[index].paymentData = paymentData;
                transactions[index].completedAt = new Date().toISOString();
                localStorage.setItem('gls2026_transactions', JSON.stringify(transactions));
            }
        } catch (error) {
            console.error('Error updating transaction:', error);
        }
    }

    // ==========================================
    // Handle Payment Response
    // ==========================================
    
    handlePaymentResponse() {
        // Get URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const txnid = urlParams.get('txnid');
        const status = urlParams.get('status');
        const amount = urlParams.get('amount');
        const payuMoneyId = urlParams.get('mihpayid');

        if (!txnid) return null;

        // Update transaction status
        this.updateTransactionStatus(txnid, status, {
            amount,
            payuMoneyId,
            responseTime: new Date().toISOString()
        });

        // Get transaction details
        const transaction = this.getTransaction(txnid);

        return {
            txnid,
            status,
            amount,
            payuMoneyId,
            transaction
        };
    }

    // ==========================================
    // UI Helpers
    // ==========================================
    
    showLoadingMessage() {
        const overlay = document.createElement('div');
        overlay.id = 'paymentLoadingOverlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
        `;
        
        overlay.innerHTML = `
            <div style="text-align: center; color: white;">
                <div style="font-size: 48px; margin-bottom: 20px;">🔄</div>
                <h2>Redirecting to Payment Gateway...</h2>
                <p>Please wait, do not close this window.</p>
            </div>
        `;
        
        document.body.appendChild(overlay);
    }

    // ==========================================
    // Price Calculator with Discounts
    // ==========================================
    
    async calculateTicketPrice(ticketId, quantity, promoCode = '') {
        try {
            // Load tickets data
            const response = await fetch('/data/tickets.json');
            const ticketsData = await response.json();
            
            const ticket = ticketsData.tickets.find(t => t.id === ticketId);
            if (!ticket) {
                return { error: 'Ticket not found' };
            }

            let basePrice = ticket.price * quantity;
            let discount = 0;
            let discountDetails = [];

            // Apply group discounts
            if (quantity >= 5) {
                const groupDiscount = ticketsData.groupDiscounts.find(gd => 
                    quantity >= gd.minQuantity && (!gd.maxQuantity || quantity <= gd.maxQuantity)
                );
                
                if (groupDiscount) {
                    discount += (basePrice * groupDiscount.discountPercent / 100);
                    discountDetails.push(`Group Discount (${groupDiscount.discountPercent}%)`);
                }
            }

            // Apply promo code
            if (promoCode) {
                const promo = ticketsData.promoCodes.find(p => 
                    p.code.toUpperCase() === promoCode.toUpperCase() &&
                    new Date(p.validUntil) >= new Date()
                );

                if (promo) {
                    if (promo.type === 'percentage') {
                        discount += (basePrice * promo.discount / 100);
                    } else {
                        discount += promo.discount * quantity;
                    }
                    discountDetails.push(`Promo Code: ${promo.code}`);
                }
            }

            const totalAmount = basePrice - discount;

            return {
                basePrice,
                discount,
                totalAmount,
                discountDetails,
                ticket,
                quantity
            };
        } catch (error) {
            console.error('Error calculating price:', error);
            return { error: 'Failed to calculate price' };
        }
    }
}

// Initialize PayU Integration
const payuIntegration = new PayUIntegration();

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PayUIntegration;
}
