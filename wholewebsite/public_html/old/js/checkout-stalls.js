// Checkout functionality for stall bookings

let selectedStall = null;
let payuConfig = null;

// Load PayU configuration
async function loadPayUConfig() {
    try {
        const response = await fetch('data/site.json');
        const data = await response.json();
        payuConfig = data.payu;
    } catch (error) {
        console.error('Error loading PayU config:', error);
    }
}

// Initialize checkout page
async function initCheckout() {
    // Load PayU config
    await loadPayUConfig();

    // Get selected stall from sessionStorage
    const stallData = sessionStorage.getItem('selectedStall');
    
    if (!stallData) {
        alert('No stall selected. Redirecting to home page.');
        window.location.href = 'index.html#sponsorship';
        return;
    }

    selectedStall = JSON.parse(stallData);
    
    // Populate order summary
    populateOrderSummary();
    
    // Setup form submission
    setupCheckoutForm();
}

// Populate order summary with stall details
function populateOrderSummary() {
    if (!selectedStall) return;

    document.getElementById('stallName').textContent = selectedStall.name;
    document.getElementById('stallSize').textContent = `${selectedStall.size} (${selectedStall.sqm})`;
    document.getElementById('stallDuration').textContent = selectedStall.duration;
    document.getElementById('totalAmount').textContent = `₹${formatPrice(selectedStall.price)}`;

    // Populate features list
    const featuresList = document.getElementById('stallFeatures');
    featuresList.innerHTML = selectedStall.features.map(feature => `<li>${feature}</li>`).join('');
}

// Format price with commas
function formatPrice(price) {
    return price.toLocaleString('en-IN');
}

// Setup checkout form
function setupCheckoutForm() {
    const form = document.getElementById('checkoutForm');
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Validate form
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        // Get form data
        const formData = new FormData(form);
        const billingInfo = {
            fullName: formData.get('fullName'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            companyName: formData.get('companyName'),
            gst: formData.get('gst'),
            address: formData.get('address'),
            city: formData.get('city'),
            pincode: formData.get('pincode'),
            state: formData.get('state')
        };

        // Initiate PayU payment
        await initiatePayment(billingInfo);
    });
}

// Initiate PayU payment
async function initiatePayment(billingInfo) {
    try {
        // Show loading state
        const submitBtn = document.querySelector('#checkoutForm button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Processing...';

        // Generate transaction ID
        const txnId = generateTransactionId();

        // Prepare payment data
        const paymentData = {
            key: payuConfig?.merchantKey || 'YOUR_MERCHANT_KEY',
            txnid: txnId,
            amount: selectedStall.price,
            productinfo: `${selectedStall.name} - GLS Vision 2047`,
            firstname: billingInfo.fullName,
            email: billingInfo.email,
            phone: billingInfo.phone,
            surl: `${window.location.origin}/payment-success.html`,
            furl: `${window.location.origin}/payment-failure.html`,
            udf1: selectedStall.id,
            udf2: selectedStall.name,
            udf3: billingInfo.companyName,
            udf4: billingInfo.gst || '',
            udf5: JSON.stringify({
                address: billingInfo.address,
                city: billingInfo.city,
                state: billingInfo.state,
                pincode: billingInfo.pincode
            })
        };

        // In a real implementation, you would:
        // 1. Send this data to your backend
        // 2. Backend generates hash using PayU secret key
        // 3. Backend returns hash
        // 4. Frontend submits to PayU

        // For now, we'll save the booking locally and show a demo message
        await saveBooking({
            transactionId: txnId,
            stall: selectedStall,
            billing: billingInfo,
            amount: selectedStall.price,
            status: 'pending',
            timestamp: new Date().toISOString()
        });

        // Demo: Show alert and redirect
        // In production, this would submit to PayU
        alert(`Booking initiated!\n\nTransaction ID: ${txnId}\n\nIn production, you will be redirected to PayU payment gateway.\n\nFor demo purposes, redirecting to success page...`);
        
        // Simulate successful payment for demo
        setTimeout(() => {
            sessionStorage.setItem('lastTransaction', JSON.stringify({
                txnId: txnId,
                amount: selectedStall.price,
                productInfo: paymentData.productinfo
            }));
            window.location.href = 'payment-success.html';
        }, 1500);

    } catch (error) {
        console.error('Payment error:', error);
        alert('Payment initiation failed. Please try again.');
        
        // Reset button
        const submitBtn = document.querySelector('#checkoutForm button[type="submit"]');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Proceed to Payment';
    }
}

// Generate unique transaction ID
function generateTransactionId() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    return `GLS2026-STALL-${timestamp}-${random}`;
}

// Save booking to local storage (in production, this would go to backend)
async function saveBooking(bookingData) {
    try {
        // Get existing bookings
        const bookings = JSON.parse(localStorage.getItem('stallBookings') || '[]');
        
        // Add new booking
        bookings.push(bookingData);
        
        // Save back to localStorage
        localStorage.setItem('stallBookings', JSON.stringify(bookings));
        
        console.log('Booking saved:', bookingData);
    } catch (error) {
        console.error('Error saving booking:', error);
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('checkoutForm')) {
        initCheckout();
    }
});
