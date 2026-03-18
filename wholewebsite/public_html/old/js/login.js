/**
 * Login Page Logic
 * Handles user login and authentication
 */

document.addEventListener('DOMContentLoaded', function() {
    // Check if already logged in
    if (isLoggedIn()) {
        window.location.href = getReturnUrl();
        return;
    }
    
    // Check for redirect parameter
    checkRedirectParam();
    
    // Initialize login form
    initializeLoginForm();
    
    // Initialize social login
    setupSocialLogin();
    
    // Initialize mini countdown
    initializeMiniCountdown();
    
    // Pre-fill email if coming from signup
    prefillEmail();
});

/**
 * Check for redirect parameter
 */
function checkRedirectParam() {
    const urlParams = new URLSearchParams(window.location.search);
    const redirect = urlParams.get('redirect');
    
    if (redirect) {
        let returnUrl = redirect;
        
        // Convert redirect param to full URL
        if (redirect === 'tickets') {
            returnUrl = 'tickets.html';
        } else if (redirect === 'dashboard') {
            returnUrl = 'dashboard.html';
        }
        
        // Save return URL
        sessionStorage.setItem(AUTH_CONFIG.RETURN_URL_KEY, returnUrl);
    }
}

/**
 * Initialize login form
 */
function initializeLoginForm() {
    const form = document.getElementById('loginForm');
    if (!form) return;
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Clear previous messages
        hideError();
        hideSuccess();
        
        // Validate form
        if (!validateLoginForm()) {
            return;
        }
        
        // Get form data
        const loginData = {
            email: document.getElementById('loginEmail').value.trim().toLowerCase(),
            password: document.getElementById('loginPassword').value,
            rememberMe: document.getElementById('rememberMe').checked
        };
        
        // Submit login
        await handleLogin(loginData);
    });
    
    // Enter key on password field
    const passwordInput = document.getElementById('loginPassword');
    if (passwordInput) {
        passwordInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                form.dispatchEvent(new Event('submit'));
            }
        });
    }
}

/**
 * Validate login form
 */
function validateLoginForm() {
    let isValid = true;
    
    // Email
    const email = document.getElementById('loginEmail').value.trim();
    if (!validateEmail(email)) {
        showFieldError('emailError', 'Please enter a valid email address');
        isValid = false;
    }
    
    // Password
    const password = document.getElementById('loginPassword').value;
    if (password.length === 0) {
        showFieldError('passwordError', 'Please enter your password');
        isValid = false;
    }
    
    return isValid;
}

/**
 * Handle login submission
 */
async function handleLogin(loginData) {
    const btn = document.getElementById('loginBtn');
    const originalText = btn.textContent;
    
    try {
        // Show loading
        btn.disabled = true;
        btn.textContent = 'Logging in...';
        showLoading('Logging you in...');
        
        // Call API
        const response = await fetch(`${AUTH_CONFIG.API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginData)
        });
        
        const data = await response.json();
        
        if (!data.success) {
            throw data;
        }
        
        // Success - save auth data
        saveAuthData(data.data.token, data.data.user);
        
        // Show success message
        showSuccessAlert('Login successful! Redirecting...');
        
        // Redirect after short delay
        setTimeout(() => {
            window.location.href = getReturnUrl();
        }, 1000);
        
    } catch (error) {
        console.error('Login error:', error);
        hideLoading();
        btn.disabled = false;
        btn.textContent = originalText;
        
        // Show error
        let errorMessage = 'Login failed. Please check your credentials.';
        
        if (error.error && error.error.message) {
            errorMessage = error.error.message;
        } else if (error.message) {
            errorMessage = error.message;
        }
        
        showErrorAlert(errorMessage);
        
        // Focus password field for retry
        document.getElementById('loginPassword').value = '';
        document.getElementById('loginPassword').focus();
    }
}

/**
 * Show error alert
 */
function showErrorAlert(message) {
    const alert = document.getElementById('loginError');
    const messageElement = document.getElementById('loginErrorMessage');
    
    if (alert && messageElement) {
        messageElement.textContent = message;
        alert.style.display = 'flex';
        
        // Setup close button
        const closeBtn = alert.querySelector('.alert-close');
        if (closeBtn) {
            closeBtn.onclick = () => hideError();
        }
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            hideError();
        }, 5000);
    } else {
        alert(message);
    }
}

/**
 * Show success alert
 */
function showSuccessAlert(message) {
    const alert = document.getElementById('loginSuccess');
    const messageElement = alert?.querySelector('.alert-message');
    
    if (alert && messageElement) {
        messageElement.textContent = message;
        alert.style.display = 'flex';
    }
}

/**
 * Hide error alert
 */
function hideError() {
    const alert = document.getElementById('loginError');
    if (alert) {
        alert.style.display = 'none';
    }
}

/**
 * Hide success alert
 */
function hideSuccess() {
    const alert = document.getElementById('loginSuccess');
    if (alert) {
        alert.style.display = 'none';
    }
}

/**
 * Show field error
 */
function showFieldError(elementId, message) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = message;
    }
}

/**
 * Setup social login
 */
function setupSocialLogin() {
    const googleBtn = document.getElementById('googleLogin');
    const linkedinBtn = document.getElementById('linkedinLogin');
    
    if (googleBtn) {
        googleBtn.addEventListener('click', function(e) {
            e.preventDefault();
            alert('Google login coming soon!');
            // TODO: Implement Google OAuth
            // window.location.href = `${AUTH_CONFIG.API_BASE_URL}/auth/google`;
        });
    }
    
    if (linkedinBtn) {
        linkedinBtn.addEventListener('click', function(e) {
            e.preventDefault();
            alert('LinkedIn login coming soon!');
            // TODO: Implement LinkedIn OAuth
            // window.location.href = `${AUTH_CONFIG.API_BASE_URL}/auth/linkedin`;
        });
    }
}

/**
 * Initialize mini countdown
 */
function initializeMiniCountdown() {
    const eventDate = new Date('March 15, 2026 09:00:00').getTime();
    
    function updateMiniCountdown() {
        const now = new Date().getTime();
        const distance = eventDate - now;
        
        if (distance < 0) {
            document.getElementById('miniCountdown')?.remove();
            return;
        }
        
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        
        const daysElement = document.getElementById('miniDays');
        const hoursElement = document.getElementById('miniHours');
        
        if (daysElement) daysElement.textContent = String(days).padStart(3, '0');
        if (hoursElement) hoursElement.textContent = String(hours).padStart(2, '0');
    }
    
    updateMiniCountdown();
    setInterval(updateMiniCountdown, 60000); // Update every minute
}

/**
 * Pre-fill email if provided in URL
 */
function prefillEmail() {
    const urlParams = new URLSearchParams(window.location.search);
    const email = urlParams.get('email');
    
    if (email) {
        const emailInput = document.getElementById('loginEmail');
        if (emailInput) {
            emailInput.value = decodeURIComponent(email);
            document.getElementById('loginPassword')?.focus();
        }
    }
}

/**
 * Handle demo login (for testing)
 */
function loginWithDemo() {
    document.getElementById('loginEmail').value = 'demo@gls2026.org';
    document.getElementById('loginPassword').value = 'Demo@123456';
    document.getElementById('loginForm').dispatchEvent(new Event('submit'));
}

// Make demo login available in console for testing
window.loginWithDemo = loginWithDemo;

console.log('✅ Login page initialized');
console.log('💡 Tip: Use loginWithDemo() in console for quick testing');
