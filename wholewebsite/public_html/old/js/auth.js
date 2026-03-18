// ==========================================
// Authentication System with OTP Support
// ==========================================

class AuthSystem {
    constructor() {
        this.currentUser = null;
        this.otpStore = new Map(); // Temporary OTP storage (in production, use backend)
        this.init();
    }

    init() {
        // Check if user is already logged in
        const user = this.getStoredUser();
        if (user) {
            this.currentUser = user;
            this.updateUI();
        }

        // Setup auth modal listeners
        this.setupAuthModals();
    }

    // ==========================================
    // OTP Generation and Verification
    // ==========================================
    
    async generateOTP(phone) {
        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        
        // Store OTP with expiration (5 minutes)
        this.otpStore.set(phone, {
            otp: otp,
            expires: Date.now() + 5 * 60 * 1000
        });

        // In production, send OTP via SMS API (Twilio, AWS SNS, etc.)
        console.log(`OTP for ${phone}: ${otp}`);
        
        // Simulate SMS API call
        try {
            await this.sendOTPviaSMS(phone, otp);
            return { success: true, message: 'OTP sent successfully' };
        } catch (error) {
            console.error('Error sending OTP:', error);
            return { success: false, message: 'Failed to send OTP' };
        }
    }

    async sendOTPviaSMS(phone, otp) {
        // DEMO: In production, integrate with Twilio or similar
        // Example Twilio integration:
        /*
        const response = await fetch('https://api.twilio.com/2010-04-01/Accounts/YOUR_ACCOUNT_SID/Messages.json', {
            method: 'POST',
            headers: {
                'Authorization': 'Basic ' + btoa('YOUR_ACCOUNT_SID:YOUR_AUTH_TOKEN'),
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                To: phone,
                From: 'YOUR_TWILIO_NUMBER',
                Body: `Your GLS Vision 2047 verification code is: ${otp}. Valid for 5 minutes.`
            })
        });
        return response.json();
        */

        // DEMO MODE: Show OTP in alert
        return new Promise((resolve) => {
            setTimeout(() => {
                alert(`DEMO MODE: Your OTP is ${otp}\n\n(In production, this will be sent via SMS)`);
                resolve({ success: true });
            }, 500);
        });
    }

    verifyOTP(phone, enteredOTP) {
        const storedData = this.otpStore.get(phone);
        
        if (!storedData) {
            return { success: false, message: 'OTP not found or expired' };
        }

        if (Date.now() > storedData.expires) {
            this.otpStore.delete(phone);
            return { success: false, message: 'OTP expired. Please request a new one.' };
        }

        if (storedData.otp === enteredOTP) {
            this.otpStore.delete(phone);
            return { success: true, message: 'OTP verified successfully' };
        }

        return { success: false, message: 'Invalid OTP. Please try again.' };
    }

    // ==========================================
    // User Registration
    // ==========================================
    
    async signup(userData) {
        const { name, email, phone, password, otp } = userData;

        // Verify OTP first
        const otpVerification = this.verifyOTP(phone, otp);
        if (!otpVerification.success) {
            return otpVerification;
        }

        // Check if user already exists
        const users = this.getAllUsers();
        if (users.find(u => u.email === email)) {
            return { success: false, message: 'User with this email already exists' };
        }

        // Create new user
        const newUser = {
            id: this.generateUserId(),
            name,
            email,
            phone,
            password: this.hashPassword(password), // In production, use bcrypt
            createdAt: new Date().toISOString(),
            verified: true
        };

        // Save user
        users.push(newUser);
        this.saveUsers(users);

        // Auto login
        this.loginUser(newUser);

        return { success: true, message: 'Registration successful!', user: newUser };
    }

    // ==========================================
    // User Login
    // ==========================================
    
    async login(credentials) {
        const { email, password, otp } = credentials;

        // Find user
        const users = this.getAllUsers();
        const user = users.find(u => u.email === email);

        if (!user) {
            return { success: false, message: 'User not found' };
        }

        // Verify password
        if (this.hashPassword(password) !== user.password) {
            return { success: false, message: 'Invalid password' };
        }

        // Verify OTP
        const otpVerification = this.verifyOTP(user.phone, otp);
        if (!otpVerification.success) {
            return otpVerification;
        }

        // Login user
        this.loginUser(user);

        return { success: true, message: 'Login successful!', user };
    }

    loginUser(user) {
        // Remove sensitive data
        const safeUser = { ...user };
        delete safeUser.password;

        this.currentUser = safeUser;
        localStorage.setItem('gls2026_user', JSON.stringify(safeUser));
        this.updateUI();
    }

    // ==========================================
    // User Logout
    // ==========================================
    
    logout() {
        this.currentUser = null;
        localStorage.removeItem('gls2026_user');
        this.updateUI();
        window.location.reload();
    }

    // ==========================================
    // Helper Functions
    // ==========================================
    
    generateUserId() {
        return 'USER_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    hashPassword(password) {
        // DEMO: Simple hash (In production, use bcrypt on backend)
        let hash = 0;
        for (let i = 0; i < password.length; i++) {
            const char = password.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return hash.toString();
    }

    getAllUsers() {
        try {
            const data = localStorage.getItem('gls2026_users');
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Error loading users:', error);
            return [];
        }
    }

    saveUsers(users) {
        try {
            localStorage.setItem('gls2026_users', JSON.stringify(users));
        } catch (error) {
            console.error('Error saving users:', error);
        }
    }

    getStoredUser() {
        try {
            const data = localStorage.getItem('gls2026_user');
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Error loading user:', error);
            return null;
        }
    }

    // ==========================================
    // UI Updates
    // ==========================================
    
    updateUI() {
        const authButtons = document.getElementById('authButtons');
        const userProfile = document.getElementById('userProfile');

        if (this.currentUser) {
            // User is logged in
            if (authButtons) authButtons.style.display = 'none';
            if (userProfile) {
                userProfile.style.display = 'flex';
                userProfile.querySelector('.user-name').textContent = this.currentUser.name;
            }
        } else {
            // User is not logged in
            if (authButtons) authButtons.style.display = 'flex';
            if (userProfile) userProfile.style.display = 'none';
        }
    }

    // ==========================================
    // Modal Setup
    // ==========================================
    
    setupAuthModals() {
        // Signup Modal
        const signupForm = document.getElementById('signupForm');
        if (signupForm) {
            const sendOtpBtn = document.getElementById('sendSignupOtp');
            const otpSection = document.getElementById('signupOtpSection');
            
            if (sendOtpBtn) {
                sendOtpBtn.addEventListener('click', async (e) => {
                    e.preventDefault();
                    const phone = document.getElementById('signupPhone').value;
                    
                    if (!phone || phone.length < 10) {
                        alert('Please enter a valid phone number');
                        return;
                    }

                    sendOtpBtn.disabled = true;
                    sendOtpBtn.textContent = 'Sending...';
                    
                    const result = await this.generateOTP(phone);
                    
                    if (result.success) {
                        otpSection.style.display = 'block';
                        sendOtpBtn.textContent = 'Resend OTP';
                    } else {
                        alert(result.message);
                        sendOtpBtn.textContent = 'Send OTP';
                    }
                    
                    sendOtpBtn.disabled = false;
                });
            }

            signupForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const formData = {
                    name: document.getElementById('signupName').value,
                    email: document.getElementById('signupEmail').value,
                    phone: document.getElementById('signupPhone').value,
                    password: document.getElementById('signupPassword').value,
                    otp: document.getElementById('signupOtp').value
                };

                const result = await this.signup(formData);
                
                if (result.success) {
                    alert(`Welcome to GLS Vision 2047, ${result.user.name}!`);
                    this.closeModal('signupModal');
                    signupForm.reset();
                } else {
                    alert(result.message);
                }
            });
        }

        // Login Modal
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            const sendOtpBtn = document.getElementById('sendLoginOtp');
            const otpSection = document.getElementById('loginOtpSection');
            
            if (sendOtpBtn) {
                sendOtpBtn.addEventListener('click', async (e) => {
                    e.preventDefault();
                    const email = document.getElementById('loginEmail').value;
                    
                    if (!email) {
                        alert('Please enter your email first');
                        return;
                    }

                    // Find user's phone
                    const users = this.getAllUsers();
                    const user = users.find(u => u.email === email);
                    
                    if (!user) {
                        alert('User not found');
                        return;
                    }

                    sendOtpBtn.disabled = true;
                    sendOtpBtn.textContent = 'Sending...';
                    
                    const result = await this.generateOTP(user.phone);
                    
                    if (result.success) {
                        otpSection.style.display = 'block';
                        sendOtpBtn.textContent = 'Resend OTP';
                    } else {
                        alert(result.message);
                        sendOtpBtn.textContent = 'Send OTP';
                    }
                    
                    sendOtpBtn.disabled = false;
                });
            }

            loginForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const email = document.getElementById('loginEmail').value;
                const users = this.getAllUsers();
                const user = users.find(u => u.email === email);
                
                if (!user) {
                    alert('User not found');
                    return;
                }

                const credentials = {
                    email,
                    password: document.getElementById('loginPassword').value,
                    otp: document.getElementById('loginOtp').value
                };

                const result = await this.login(credentials);
                
                if (result.success) {
                    alert(`Welcome back, ${result.user.name}!`);
                    this.closeModal('loginModal');
                    loginForm.reset();
                } else {
                    alert(result.message);
                }
            });
        }

        // Logout button
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                if (confirm('Are you sure you want to logout?')) {
                    this.logout();
                }
            });
        }
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
        }
    }
}

// Initialize authentication system
const authSystem = new AuthSystem();

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AuthSystem;
}
