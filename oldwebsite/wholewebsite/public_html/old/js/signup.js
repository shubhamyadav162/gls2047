/**
 * Signup Page Logic
 * Handles user registration and OTP verification
 */

let currentStep = 1;
let signupData = {};
let otpTimer = null;
let resendCooldown = 60;

/**
 * Initialize signup page
 */
document.addEventListener('DOMContentLoaded', function() {
    // Check if already logged in
    if (isLoggedIn()) {
        window.location.href = 'dashboard.html';
        return;
    }
    
    initializeSignupForm();
    initializeOTPForm();
    initializePasswordValidation();
    setupSocialLogin();
});

/**
 * Initialize signup form
 */
function initializeSignupForm() {
    const form = document.getElementById('signupForm');
    if (!form) return;
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Clear previous errors
        clearErrors();
        
        // Validate form
        if (!validateSignupForm()) {
            return;
        }
        
        // Get form data
        signupData = {
            fullName: document.getElementById('fullName').value.trim(),
            email: document.getElementById('email').value.trim().toLowerCase(),
            phone: document.getElementById('phone').value.trim(),
            password: document.getElementById('password').value,
            confirmPassword: document.getElementById('confirmPassword').value,
            subscribeNewsletter: document.getElementById('subscribeNewsletter').checked
        };
        
        // Check terms acceptance
        if (!document.getElementById('agreeTerms').checked) {
            showError('Please accept the Terms & Conditions', 'agreeTermsError');
            return;
        }
        
        // Submit signup
        await handleSignup();
    });
}

/**
 * Validate signup form
 */
function validateSignupForm() {
    let isValid = true;
    
    // Full name
    const fullName = document.getElementById('fullName').value.trim();
    if (fullName.length < 2) {
        showError('Please enter your full name', 'fullNameError');
        isValid = false;
    }
    
    // Email
    const email = document.getElementById('email').value.trim();
    if (!validateEmail(email)) {
        showError('Please enter a valid email address', 'emailError');
        isValid = false;
    }
    
    // Phone
    const phone = document.getElementById('phone').value.trim();
    if (!validatePhone(phone)) {
        showError('Please enter a valid 10-digit phone number', 'phoneError');
        isValid = false;
    }
    
    // Password
    const password = document.getElementById('password').value;
    const validation = validatePassword(password);
    if (!validation.isValid) {
        let message = 'Password must contain: ';
        const missing = [];
        if (!validation.minLength) missing.push('8+ characters');
        if (!validation.hasUpperCase) missing.push('uppercase letter');
        if (!validation.hasLowerCase) missing.push('lowercase letter');
        if (!validation.hasNumber) missing.push('number');
        if (!validation.hasSpecialChar) missing.push('special character');
        message += missing.join(', ');
        showError(message, 'passwordError');
        isValid = false;
    }
    
    // Confirm password
    const confirmPassword = document.getElementById('confirmPassword').value;
    if (password !== confirmPassword) {
        showError('Passwords do not match', 'confirmPasswordError');
        isValid = false;
    }
    
    return isValid;
}

/**
 * Handle signup submission
 */
async function handleSignup() {
    const btn = document.getElementById('signupBtn');
    const originalText = btn.textContent;
    
    try {
        // Show loading
        btn.disabled = true;
        btn.textContent = 'Creating Account...';
        showLoading('Creating your account...');
        
        // Call API
        const response = await fetch(`${AUTH_CONFIG.API_BASE_URL}/auth/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(signupData)
        });
        
        const data = await response.json();
        
        if (!data.success) {
            throw data;
        }
        
        // Success - move to OTP verification
        document.getElementById('displayEmail').textContent = signupData.email;
        moveToStep(2);
        startOTPTimer();
        
    } catch (error) {
        console.error('Signup error:', error);
        handleApiError(error);
    } finally {
        hideLoading();
        btn.disabled = false;
        btn.textContent = originalText;
    }
}

/**
 * Initialize OTP form
 */
function initializeOTPForm() {
    const form = document.getElementById('otpForm');
    if (!form) return;
    
    // Setup OTP inputs
    setupOTPInputs();
    
    // Handle form submission
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        await verifyOTP();
    });
    
    // Resend OTP button
    const resendBtn = document.getElementById('resendOtp');
    if (resendBtn) {
        resendBtn.addEventListener('click', async function() {
            await resendOTP();
        });
    }
    
    // Change email link
    const changeEmailLink = document.getElementById('changeEmail');
    if (changeEmailLink) {
        changeEmailLink.addEventListener('click', function(e) {
            e.preventDefault();
            moveToStep(1);
            stopOTPTimer();
        });
    }
}

/**
 * Setup OTP input fields
 */
function setupOTPInputs() {
    const inputs = document.querySelectorAll('.otp-input');
    
    inputs.forEach((input, index) => {
        // Auto-focus next input on entry
        input.addEventListener('input', function() {
            if (this.value.length === 1 && index < inputs.length - 1) {
                inputs[index + 1].focus();
            }
        });
        
        // Handle backspace
        input.addEventListener('keydown', function(e) {
            if (e.key === 'Backspace' && !this.value && index > 0) {
                inputs[index - 1].focus();
            }
        });
        
        // Only allow numbers
        input.addEventListener('input', function() {
            this.value = this.value.replace(/[^0-9]/g, '');
        });
        
        // Select all on focus
        input.addEventListener('focus', function() {
            this.select();
        });
    });
    
    // Auto-focus first input
    if (inputs.length > 0) {
        inputs[0].focus();
    }
}

/**
 * Get OTP from inputs
 */
function getOTPValue() {
    const inputs = document.querySelectorAll('.otp-input');
    let otp = '';
    inputs.forEach(input => {
        otp += input.value;
    });
    return otp;
}

/**
 * Clear OTP inputs
 */
function clearOTPInputs() {
    const inputs = document.querySelectorAll('.otp-input');
    inputs.forEach(input => {
        input.value = '';
    });
    inputs[0]?.focus();
}

/**
 * Verify OTP
 */
async function verifyOTP() {
    const otp = getOTPValue();
    
    // Validate OTP
    if (otp.length !== 6) {
        showError('Please enter complete 6-digit OTP', 'otpError');
        return;
    }
    
    const btn = document.querySelector('#otpForm button[type="submit"]');
    const originalText = btn.textContent;
    
    try {
        btn.disabled = true;
        btn.textContent = 'Verifying...';
        showLoading('Verifying OTP...');
        
        const response = await fetch(`${AUTH_CONFIG.API_BASE_URL}/auth/verify-otp`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: signupData.email,
                otp: otp
            })
        });
        
        const data = await response.json();
        
        if (!data.success) {
            throw data;
        }
        
        // Success - save auth data
        saveAuthData(data.data.token, data.data.user);
        
        // Stop timer
        stopOTPTimer();
        
        // Show success message
        document.getElementById('successEmail').textContent = signupData.email;
        moveToStep(3);
        
        // Redirect after 3 seconds
        setTimeout(() => {
            window.location.href = getReturnUrl();
        }, 3000);
        
    } catch (error) {
        console.error('OTP verification error:', error);
        clearOTPInputs();
        handleApiError(error, 'otpError');
    } finally {
        hideLoading();
        btn.disabled = false;
        btn.textContent = originalText;
    }
}

/**
 * Resend OTP
 */
async function resendOTP() {
    try {
        showLoading('Sending new OTP...');
        
        const response = await fetch(`${AUTH_CONFIG.API_BASE_URL}/auth/resend-otp`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: signupData.email
            })
        });
        
        const data = await response.json();
        
        if (!data.success) {
            throw data;
        }
        
        // Clear inputs and restart timer
        clearOTPInputs();
        startOTPTimer();
        
        alert('New OTP sent to your email!');
        
    } catch (error) {
        console.error('Resend OTP error:', error);
        handleApiError(error, 'otpError');
    } finally {
        hideLoading();
    }
}

/**
 * Start OTP timer
 */
function startOTPTimer() {
    resendCooldown = 60;
    const btn = document.getElementById('resendOtp');
    const timerElement = document.getElementById('timer');
    
    btn.disabled = true;
    
    otpTimer = setInterval(() => {
        resendCooldown--;
        timerElement.textContent = resendCooldown;
        
        if (resendCooldown <= 0) {
            stopOTPTimer();
            btn.disabled = false;
            btn.textContent = 'Resend OTP';
        }
    }, 1000);
}

/**
 * Stop OTP timer
 */
function stopOTPTimer() {
    if (otpTimer) {
        clearInterval(otpTimer);
        otpTimer = null;
    }
}

/**
 * Move to step
 */
function moveToStep(step) {
    // Update step indicators
    const steps = document.querySelectorAll('.step');
    steps.forEach((s, index) => {
        s.classList.remove('active', 'completed');
        if (index + 1 < step) {
            s.classList.add('completed');
        } else if (index + 1 === step) {
            s.classList.add('active');
        }
    });
    
    // Update step content
    const contents = document.querySelectorAll('.step-content');
    contents.forEach((content, index) => {
        content.classList.remove('active');
        if (index + 1 === step) {
            content.classList.add('active');
        }
    });
    
    currentStep = step;
    
    // Auto-focus first input in new step
    setTimeout(() => {
        const activeContent = document.querySelector('.step-content.active');
        const firstInput = activeContent?.querySelector('input:not([type="checkbox"])');
        firstInput?.focus();
    }, 100);
}

/**
 * Initialize password validation
 */
function initializePasswordValidation() {
    const passwordInput = document.getElementById('password');
    if (!passwordInput) return;
    
    passwordInput.addEventListener('input', function() {
        updatePasswordStrength(this.value);
    });
}

/**
 * Setup social login buttons
 */
function setupSocialLogin() {
    const googleBtn = document.querySelector('.btn-google');
    const linkedinBtn = document.querySelector('.btn-linkedin');
    
    if (googleBtn) {
        googleBtn.addEventListener('click', function() {
            alert('Google login coming soon!');
            // Implement Google OAuth here
        });
    }
    
    if (linkedinBtn) {
        linkedinBtn.addEventListener('click', function() {
            alert('LinkedIn login coming soon!');
            // Implement LinkedIn OAuth here
        });
    }
}

/**
 * Clear all error messages
 */
function clearErrors() {
    const errorElements = document.querySelectorAll('.error-message');
    errorElements.forEach(element => {
        element.textContent = '';
    });
}

console.log('✅ Signup page initialized');
