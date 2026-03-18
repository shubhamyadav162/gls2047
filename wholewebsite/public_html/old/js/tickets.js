// ==========================================
// Tickets Page - Dynamic Ticket Booking System
// ==========================================

let selectedTicket = null;
let ticketsData = null;

// Load tickets data
async function loadTickets Data() {
    try {
        const response = await fetch('/data/tickets.json');
        ticketsData = await response.json();
        renderTicketCards();
    } catch (error) {
        console.error('Error loading tickets:', error);
    }
}

// Render ticket cards dynamically
function renderTicketCards() {
    if (!ticketsData) return;

    const ticketsGrid = document.querySelector('.tickets-grid');
    if (!ticketsGrid) return;

    // Clear existing cards (except for static ones if any)
    ticketsGrid.innerHTML = '';

    ticketsData.tickets.forEach((ticket, index) => {
        const card = createTicketCard(ticket, index);
        ticketsGrid.appendChild(card);
    });
}

// Create ticket card element
function createTicketCard(ticket, index) {
    const card = document.createElement('div');
    card.className = `ticket-card ticket-${ticket.id}`;
    
    let badgeClass = '';
    switch(ticket.id) {
        case 'platinum': badgeClass = 'ticket-platinum'; break;
        case 'gold': badgeClass = 'ticket-gold'; break;
        default: badgeClass = 'ticket-startup';
    }
    
    card.classList.add(badgeClass);

    const benefitsList = ticket.benefits.map(b => `<li>${b}</li>`).join('');

    card.innerHTML = `
        <div class="ticket-badge">${ticket.category.toUpperCase()}</div>
        ${index === 1 ? '<div class="popular-badge">MOST POPULAR</div>' : ''}
        <h3>${ticket.name}</h3>
        <div class="ticket-pricing">
            <div class="discounted-price">₹${ticket.price.toLocaleString()}</div>
        </div>
        <ul class="ticket-benefits">
            ${benefitsList}
        </ul>
        <button class="btn btn-primary btn-block select-ticket-btn" data-ticket-id="${ticket.id}">
            Select ${ticket.name}
        </button>
    `;

    // Add click handler
    const selectBtn = card.querySelector('.select-ticket-btn');
    selectBtn.addEventListener('click', () => selectTicket(ticket));

    return card;
}

// Select ticket and show registration form
function selectTicket(ticket) {
    selectedTicket = ticket;
    
    // Update order summary
    document.getElementById('selectedTicketName').textContent = ticket.name;
    document.getElementById('selectedTicketDesc').textContent = ticket.description;
    document.getElementById('selectedTicketType').value = ticket.id;
    document.getElementById('selectedTicketPrice').value = ticket.price;
    document.getElementById('unitPrice').textContent = `₹${ticket.price.toLocaleString()}`;
    
    // Reset quantity to 1
    document.getElementById('ticketQuantity').value = 1;
    updatePriceCalculation();
    
    // Show registration form
    document.getElementById('registrationForm').style.display = 'block';
    document.getElementById('registrationForm').scrollIntoView({ behavior: 'smooth' });
}

// Quantity controls
document.addEventListener('DOMContentLoaded', () => {
    // Load tickets
    loadTicketsData();

    const decreaseBtn = document.getElementById('decreaseQty');
    const increaseBtn = document.getElementById('increaseQty');
    const qtyInput = document.getElementById('ticketQuantity');

    if (decreaseBtn) {
        decreaseBtn.addEventListener('click', () => {
            let qty = parseInt(qtyInput.value);
            if (qty > 1) {
                qtyInput.value = qty - 1;
                updatePriceCalculation();
            }
        });
    }

    if (increaseBtn) {
        increaseBtn.addEventListener('click', () => {
            let qty = parseInt(qtyInput.value);
            if (qty < 10) {
                qtyInput.value = qty + 1;
                updatePriceCalculation();
            }
        });
    }

    if (qtyInput) {
        qtyInput.addEventListener('change', updatePriceCalculation);
    }

    // Cancel button
    const cancelBtn = document.getElementById('cancelBtn');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            document.getElementById('registrationForm').style.display = 'none';
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Form submission
    const ticketForm = document.getElementById('ticketRegistrationForm');
    if (ticketForm) {
        ticketForm.addEventListener('submit', handleTicketPurchase);
    }
});

// Update price calculation
function updatePriceCalculation() {
    if (!selectedTicket) return;

    const quantity = parseInt(document.getElementById('ticketQuantity').value) || 1;
    const basePrice = selectedTicket.price;
    const subtotal = basePrice * quantity;
    
    // Calculate GST (18%)
    const gst = subtotal * 0.18;
    const total = subtotal + gst;

    // Update display
    document.getElementById('quantityDisplay').textContent = quantity;
    document.getElementById('subtotalPrice').textContent = `₹${subtotal.toLocaleString()}`;
    document.getElementById('gstAmount').textContent = `₹${gst.toLocaleString()}`;
    document.getElementById('totalPrice').textContent = `₹${total.toLocaleString()}`;
}

// Handle ticket purchase
async function handleTicketPurchase(e) {
    e.preventDefault();

    // Check if user is logged in
    if (!authSystem || !authSystem.currentUser) {
        alert('Please login to purchase tickets');
        window.location.href = 'login.html';
        return;
    }

    // Get form data
    const formData = new FormData(e.target);
    const quantity = parseInt(document.getElementById('ticketQuantity').value);
    const total = parseFloat(document.getElementById('totalPrice').textContent.replace('₹', '').replace(',', ''));

    // Prepare ticket data for payment
    const ticketData = {
        ticketId: selectedTicket.id,
        ticketType: selectedTicket.name,
        quantity: quantity,
        basePrice: selectedTicket.price,
        totalAmount: total,
        customerInfo: {
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            organization: formData.get('organization'),
            designation: formData.get('designation'),
            industry: formData.get('industry'),
            address: formData.get('address'),
            city: formData.get('city'),
            state: formData.get('state'),
            pincode: formData.get('pincode'),
            country: formData.get('country'),
            gstNumber: formData.get('gstNumber')
        }
    };

    // Get selected payment gateway
    const gateway = document.querySelector('input[name="paymentGateway"]:checked').value;

    // Show loading
    const submitBtn = document.getElementById('proceedPaymentBtn');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Processing...';

    try {
        // Initiate payment via PayU
        if (gateway === 'payu') {
            const result = await payuIntegration.initiateTicketPayment(ticketData);
            
            if (!result.success) {
                alert(result.message || 'Payment initiation failed');
                submitBtn.disabled = false;
                submitBtn.textContent = 'Proceed to Payment';
            }
        } else {
            alert('Easebuzz integration coming soon!');
            submitBtn.disabled = false;
            submitBtn.textContent = 'Proceed to Payment';
        }
    } catch (error) {
        console.error('Payment error:', error);
        alert('An error occurred. Please try again.');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Proceed to Payment';
    }
}

// Mobile menu toggle (if needed on this page)
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navMenu = document.querySelector('.nav-menu');

if (mobileMenuToggle && navMenu) {
    mobileMenuToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
    });
}
