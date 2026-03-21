// Stalls functionality for GLS Vision 2047

// Load and display stalls
async function loadStalls() {
    try {
        const response = await fetch('data/stalls.json');
        const data = await response.json();
        
        const stallsGrid = document.getElementById('stallsGrid');
        if (!stallsGrid) return;

        // Sort stalls by priority
        const sortedStalls = data.stalls.sort((a, b) => a.priority - b.priority);

        stallsGrid.innerHTML = sortedStalls.map(stall => createStallCard(stall)).join('');

        // Attach event listeners
        attachStallEventListeners();
    } catch (error) {
        console.error('Error loading stalls:', error);
        const stallsGrid = document.getElementById('stallsGrid');
        if (stallsGrid) {
            stallsGrid.innerHTML = '<p class="error-message">Unable to load stalls. Please try again later.</p>';
        }
    }
}

// Create stall card HTML
function createStallCard(stall) {
    const badgeClass = stall.category.toLowerCase();
    
    return `
        <div class="stall-card ${stall.id === 'gold' ? 'highlight' : ''}" data-stall-id="${stall.id}">
            <div class="stall-icon">${stall.icon}</div>
            <span class="stall-badge ${badgeClass}">${stall.category}</span>
            <h4>${stall.name}</h4>
            <div class="stall-size">${stall.size} (${stall.sqm})</div>
            <div class="stall-duration">${stall.duration}</div>
            <div class="stall-availability">Available for Sponsorship</div>
            <ul class="stall-features">
                ${stall.features.slice(0, 5).map(feature => `<li>${feature}</li>`).join('')}
                ${stall.features.length > 5 ? `<li><em>+${stall.features.length - 5} more features</em></li>` : ''}
            </ul>
            <div class="stall-actions">
                <button class="btn btn-read-more" onclick="showStallDetails('${stall.id}')">Read More</button>
                <button class="btn btn-book-now" onclick="bookStall('${stall.id}')">Book Now</button>
            </div>
        </div>
    `;
}

// Format price with commas
function formatPrice(price) {
    return price.toLocaleString('en-IN');
}

// Attach event listeners to stall cards
function attachStallEventListeners() {
    const stallCards = document.querySelectorAll('.stall-card');
    stallCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
        });
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

// Show stall details in modal
async function showStallDetails(stallId) {
    try {
        const response = await fetch('data/stalls.json');
        const data = await response.json();
        const stall = data.stalls.find(s => s.id === stallId);
        
        if (!stall) return;

        // Create modal
        const modal = createStallModal(stall);
        document.body.insertAdjacentHTML('beforeend', modal);

        // Show modal
        setTimeout(() => {
            const modalElement = document.getElementById('stallModal');
            if (modalElement) {
                modalElement.classList.add('active');
            }
        }, 10);

        // Close modal on click outside or close button
        document.getElementById('stallModal').addEventListener('click', function(e) {
            if (e.target === this || e.target.classList.contains('stall-modal-close')) {
                closeStallModal();
            }
        });
    } catch (error) {
        console.error('Error showing stall details:', error);
    }
}

// Create stall modal HTML
function createStallModal(stall) {
    return `
        <div id="stallModal" class="stall-modal">
            <div class="stall-modal-content">
                <div class="stall-modal-header">
                    <button class="stall-modal-close">&times;</button>
                    <div class="stall-icon">${stall.icon}</div>
                    <span class="stall-badge ${stall.category.toLowerCase()}">${stall.category}</span>
                    <h2>${stall.name}</h2>
                </div>
                <div class="stall-modal-body">
                    <div class="stall-details">
                        <div class="detail-item">
                            <strong>Stall Size:</strong> ${stall.size} (${stall.sqm})
                        </div>
                        <div class="detail-item">
                            <strong>Duration:</strong> ${stall.duration}
                        </div>
                        <div class="detail-item">
                            <strong>Availability:</strong> <span class="availability-highlight">Available for Sponsorship</span>
                        </div>
                    </div>
                    <div class="features-section">
                        <h3>Included Features:</h3>
                        <ul class="stall-features">
                            ${stall.features.map(feature => `<li>${feature}</li>`).join('')}
                        </ul>
                    </div>
                    <div class="modal-actions">
                        <button class="btn btn-primary btn-block" onclick="bookStall('${stall.id}')">Book This Stall</button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Close stall modal
function closeStallModal() {
    const modal = document.getElementById('stallModal');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => {
            modal.remove();
        }, 300);
    }
}

// Book stall - redirect to checkout
async function bookStall(stallId) {
    try {
        // Save stall info to sessionStorage for checkout page
        const response = await fetch('data/stalls.json');
        const data = await response.json();
        const stall = data.stalls.find(s => s.id === stallId);
        
        if (!stall) {
            alert('Stall not found. Please try again.');
            return;
        }

        sessionStorage.setItem('selectedStall', JSON.stringify(stall));
        
        // Redirect to checkout
        window.location.href = 'checkout.html';
    } catch (error) {
        console.error('Error booking stall:', error);
        alert('Unable to proceed with booking. Please try again.');
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('stallsGrid')) {
        loadStalls();
    }
});
