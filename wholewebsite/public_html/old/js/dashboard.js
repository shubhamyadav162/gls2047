/**
 * Dashboard Page Logic
 * Handles user dashboard, profile, and ticket management
 */

let currentUser = null;
let userTickets = [];

document.addEventListener('DOMContentLoaded', async function() {
    // Require authentication
    if (!requireAuth()) {
        return;
    }
    
    // Load user data
    await loadUserData();
    
    // Initialize tabs
    initializeTabs();
    
    // Initialize profile form
    initializeProfileForm();
    
    // Initialize settings
    initializeSettings();
    
    // Calculate days to event
    calculateDaysToEvent();
});

/**
 * Load user data from API
 */
async function loadUserData() {
    try {
        showLoading('Loading your data...');
        
        const response = await authFetch('/auth/me');
        const data = await response.json();
        
        if (!data.success) {
            throw new Error('Failed to load user data');
        }
        
        currentUser = data.data.user;
        userTickets = currentUser.tickets || [];
        
        // Update UI
        updateUserInfo();
        updateStats();
        loadTickets();
        populateProfileForm();
        loadSettings();
        loadRecentActivity();
        
    } catch (error) {
        console.error('Load user data error:', error);
        showError('Failed to load user data. Please refresh the page.');
    } finally {
        hideLoading();
    }
}

/**
 * Update user information in header
 */
function updateUserInfo() {
    const userName = document.getElementById('userName');
    if (userName && currentUser) {
        userName.textContent = currentUser.fullName.split(' ')[0];
    }
}

/**
 * Update dashboard stats
 */
function updateStats() {
    // Total tickets
    const totalTickets = userTickets.length;
    document.getElementById('totalTickets').textContent = totalTickets;
    
    // Total spent
    const totalSpent = userTickets.reduce((sum, ticket) => {
        if (ticket.paymentStatus === 'completed') {
            return sum + ticket.totalAmount;
        }
        return sum;
    }, 0);
    document.getElementById('totalSpent').textContent = `₹${totalSpent.toLocaleString('en-IN')}`;
    
    // Upcoming events (hardcoded for now)
    document.getElementById('upcomingEvents').textContent = totalTickets > 0 ? '1' : '0';
}

/**
 * Calculate days to event
 */
function calculateDaysToEvent() {
    const eventDate = new Date('March 15, 2026 09:00:00');
    const now = new Date();
    const diff = eventDate - now;
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    
    document.getElementById('daysToEvent').textContent = days > 0 ? days : '0';
}

/**
 * Load and display tickets
 */
function loadTickets() {
    const ticketsList = document.getElementById('ticketsList');
    
    if (!ticketsList) return;
    
    if (userTickets.length === 0) {
        ticketsList.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">🎫</div>
                <h4>No tickets yet</h4>
                <p>Book your tickets now to secure your spot at GLS Vision 2047!</p>
                <a href="tickets.html" class="btn btn-primary">Book Tickets</a>
            </div>
        `;
        return;
    }
    
    ticketsList.innerHTML = userTickets.map(ticket => `
        <div class="ticket-item">
            <div class="ticket-header">
                <div class="ticket-type">${ticket.ticketType.toUpperCase()} PASS</div>
                <div class="ticket-status status-${ticket.paymentStatus}">
                    ${ticket.paymentStatus === 'completed' ? 'Confirmed' : ticket.paymentStatus}
                </div>
            </div>
            <div class="ticket-details">
                <div>
                    <strong>Ticket Code:</strong><br>
                    ${ticket.ticketCode || 'Processing...'}
                </div>
                <div>
                    <strong>Quantity:</strong><br>
                    ${ticket.quantity} ticket(s)
                </div>
                <div>
                    <strong>Amount:</strong><br>
                    ₹${ticket.totalAmount.toLocaleString('en-IN')}
                </div>
                <div>
                    <strong>Booking Date:</strong><br>
                    ${new Date(ticket.registrationDate).toLocaleDateString()}
                </div>
            </div>
            ${ticket.paymentStatus === 'completed' ? `
                <div class="ticket-actions">
                    <button class="btn btn-outline btn-sm" onclick="downloadTicket('${ticket._id}')">
                        Download E-Ticket
                    </button>
                    <button class="btn btn-outline btn-sm" onclick="downloadInvoice('${ticket._id}')">
                        Download Invoice
                    </button>
                    <button class="btn btn-outline btn-sm" onclick="viewQRCode('${ticket._id}')">
                        View QR Code
                    </button>
                </div>
            ` : ''}
        </div>
    `).join('');
}

/**
 * Load recent activity
 */
function loadRecentActivity() {
    const activityContainer = document.getElementById('recentActivity');
    
    if (!activityContainer) return;
    
    if (userTickets.length === 0) {
        activityContainer.innerHTML = '<p style="color: #999;">No recent activity</p>';
        return;
    }
    
    // Get last 5 activities
    const recentTickets = userTickets.slice(0, 5);
    
    activityContainer.innerHTML = `
        <ul style="list-style: none; padding: 0;">
            ${recentTickets.map(ticket => `
                <li style="padding: 10px 0; border-bottom: 1px solid #e0e0e0;">
                    <strong>${ticket.ticketType.toUpperCase()} Pass</strong> - 
                    ${new Date(ticket.registrationDate).toLocaleDateString()} - 
                    <span style="color: ${ticket.paymentStatus === 'completed' ? '#4CAF50' : '#f57c00'}">
                        ${ticket.paymentStatus}
                    </span>
                </li>
            `).join('')}
        </ul>
    `;
}

/**
 * Initialize tabs
 */
function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetTab = this.dataset.tab;
            
            // Remove active class from all
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked
            this.classList.add('active');
            document.getElementById(targetTab)?.classList.add('active');
        });
    });
}

/**
 * Populate profile form
 */
function populateProfileForm() {
    if (!currentUser) return;
    
    document.getElementById('profileName').value = currentUser.fullName || '';
    document.getElementById('profileEmail').value = currentUser.email || '';
    document.getElementById('profilePhone').value = currentUser.phone || '';
    document.getElementById('profileOrganization').value = currentUser.organization || '';
    document.getElementById('profileDesignation').value = currentUser.designation || '';
    document.getElementById('profileIndustry').value = currentUser.industry || '';
}

/**
 * Initialize profile form
 */
function initializeProfileForm() {
    const form = document.getElementById('profileForm');
    
    if (!form) return;
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        await updateProfile();
    });
}

/**
 * Update user profile
 */
async function updateProfile() {
    try {
        showLoading('Updating profile...');
        
        const profileData = {
            fullName: document.getElementById('profileName').value.trim(),
            phone: document.getElementById('profilePhone').value.trim(),
            organization: document.getElementById('profileOrganization').value.trim(),
            designation: document.getElementById('profileDesignation').value.trim(),
            industry: document.getElementById('profileIndustry').value
        };
        
        const response = await authFetch('/auth/update-profile', {
            method: 'PUT',
            body: JSON.stringify(profileData)
        });
        
        const data = await response.json();
        
        if (!data.success) {
            throw data;
        }
        
        // Update current user
        currentUser = data.data.user;
        
        // Update stored user
        const storedUser = getUser();
        const updatedUser = { ...storedUser, ...currentUser };
        saveAuthData(getToken(), updatedUser);
        
        // Update UI
        updateUserInfo();
        
        alert('Profile updated successfully!');
        
    } catch (error) {
        console.error('Update profile error:', error);
        alert('Failed to update profile. Please try again.');
    } finally {
        hideLoading();
    }
}

/**
 * Load settings
 */
function loadSettings() {
    if (!currentUser) return;
    
    document.getElementById('emailNotifications').checked = currentUser.notificationsEnabled !== false;
    document.getElementById('newsletter').checked = currentUser.subscribeNewsletter || false;
}

/**
 * Initialize settings
 */
function initializeSettings() {
    const emailNotif = document.getElementById('emailNotifications');
    const newsletter = document.getElementById('newsletter');
    
    if (emailNotif) {
        emailNotif.addEventListener('change', async function() {
            await updateSettings({ notificationsEnabled: this.checked });
        });
    }
    
    if (newsletter) {
        newsletter.addEventListener('change', async function() {
            await updateSettings({ subscribeNewsletter: this.checked });
        });
    }
}

/**
 * Update settings
 */
async function updateSettings(settings) {
    try {
        const response = await authFetch('/auth/update-profile', {
            method: 'PUT',
            body: JSON.stringify(settings)
        });
        
        const data = await response.json();
        
        if (data.success) {
            currentUser = data.data.user;
        }
        
    } catch (error) {
        console.error('Update settings error:', error);
    }
}

/**
 * Download ticket (placeholder)
 */
function downloadTicket(ticketId) {
    alert('E-ticket download will be available soon!\nTicket ID: ' + ticketId);
    // TODO: Implement actual download
    // window.open(`${AUTH_CONFIG.API_BASE_URL}/tickets/${ticketId}/download`, '_blank');
}

/**
 * Download invoice (placeholder)
 */
function downloadInvoice(ticketId) {
    alert('Invoice download will be available soon!\nTicket ID: ' + ticketId);
    // TODO: Implement actual download
    // window.open(`${AUTH_CONFIG.API_BASE_URL}/tickets/${ticketId}/invoice`, '_blank');
}

/**
 * View QR code (placeholder)
 */
function viewQRCode(ticketId) {
    alert('QR code viewer will be available soon!\nTicket ID: ' + ticketId);
    // TODO: Implement QR code modal
}

console.log('✅ Dashboard initialized');
