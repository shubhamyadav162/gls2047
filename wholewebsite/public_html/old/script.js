// ==========================================
// Global Leadership Summit Vision 2047 - JavaScript
// Interactive Features
// ==========================================

document.addEventListener('DOMContentLoaded', function() {
    
    // ==========================================
    // Mobile Menu Toggle
    // ==========================================
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            
            // Animate hamburger icon
            const spans = this.querySelectorAll('span');
            spans.forEach((span, index) => {
                if (navMenu.classList.contains('active')) {
                    if (index === 0) span.style.transform = 'rotate(45deg) translate(5px, 5px)';
                    if (index === 1) span.style.opacity = '0';
                    if (index === 2) span.style.transform = 'rotate(-45deg) translate(7px, -7px)';
                } else {
                    span.style.transform = 'none';
                    span.style.opacity = '1';
                }
            });
        });
    }
    
    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                navMenu.classList.remove('active');
                const spans = mobileMenuToggle.querySelectorAll('span');
                spans.forEach(span => {
                    span.style.transform = 'none';
                    span.style.opacity = '1';
                });
            }
        });
    });
    
    // ==========================================
    // Sticky Header on Scroll
    // ==========================================
    const header = document.getElementById('header');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            header.style.padding = '10px 0';
            header.style.background = 'rgba(17, 17, 17, 0.98)';
        } else {
            header.style.padding = '15px 0';
            header.style.background = 'rgba(17, 17, 17, 0.95)';
        }
        
        lastScrollTop = scrollTop;
    });
    
    // ==========================================
    // Active Navigation Link on Scroll (Scroll Spy)
    // ==========================================
    const sections = document.querySelectorAll('section[id]');
    
    function highlightNavigation() {
        const scrollPosition = window.scrollY + 150;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    window.addEventListener('scroll', highlightNavigation);
    
    // ==========================================
    // Countdown Timer to Event Date
    // ==========================================
    const countdownDate = new Date('March 15, 2026 09:00:00').getTime();
    
    const countdownTimer = setInterval(function() {
        const now = new Date().getTime();
        const distance = countdownDate - now;
        
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        // Update countdown display
        const daysElement = document.getElementById('days');
        const hoursElement = document.getElementById('hours');
        const minutesElement = document.getElementById('minutes');
        const secondsElement = document.getElementById('seconds');
        
        if (daysElement) daysElement.textContent = String(days).padStart(3, '0');
        if (hoursElement) hoursElement.textContent = String(hours).padStart(2, '0');
        if (minutesElement) minutesElement.textContent = String(minutes).padStart(2, '0');
        if (secondsElement) secondsElement.textContent = String(seconds).padStart(2, '0');
        
        // If countdown is finished
        if (distance < 0) {
            clearInterval(countdownTimer);
            if (daysElement) daysElement.textContent = '000';
            if (hoursElement) hoursElement.textContent = '00';
            if (minutesElement) minutesElement.textContent = '00';
            if (secondsElement) secondsElement.textContent = '00';
        }
    }, 1000);
    
    // ==========================================
    // Animated Counters for Stats
    // ==========================================
    const statNumbers = document.querySelectorAll('.stat-number');
    let hasAnimated = false;
    
    function animateCounters() {
        const statsSection = document.querySelector('.stats-grid');
        if (!statsSection) return;
        
        const sectionTop = statsSection.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (sectionTop < windowHeight * 0.75 && !hasAnimated) {
            hasAnimated = true;
            
            statNumbers.forEach(statNumber => {
                const target = parseInt(statNumber.getAttribute('data-target'));
                const duration = 2000; // 2 seconds
                const increment = target / (duration / 16); // 60fps
                let current = 0;
                
                const updateCounter = () => {
                    current += increment;
                    if (current < target) {
                        statNumber.textContent = Math.floor(current);
                        requestAnimationFrame(updateCounter);
                    } else {
                        statNumber.textContent = target;
                    }
                };
                
                updateCounter();
            });
        }
    }
    
    window.addEventListener('scroll', animateCounters);
    animateCounters(); // Check on load as well
    
    // ==========================================
    // Agenda Tabs Functionality
    // ==========================================
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked button and corresponding content
            this.classList.add('active');
            const targetContent = document.getElementById(targetTab);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });
    
    // ==========================================
    // Scroll to Top Button
    // ==========================================
    const scrollToTopBtn = document.getElementById('scrollToTop');
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.classList.add('visible');
        } else {
            scrollToTopBtn.classList.remove('visible');
        }
    });
    
    scrollToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // ==========================================
    // Smooth Scroll for Anchor Links
    // ==========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Don't prevent default for empty hash or just '#'
            if (href === '#' || href === '') return;
            
            const targetElement = document.querySelector(href);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // ==========================================
    // Contact Form Submission Handler
    // ==========================================
    // const contactForm = document.getElementById('contactForm');
    
    // if (contactForm) {
    //     contactForm.addEventListener('submit', function(e) {
    //         e.preventDefault();
            
    //         // Get form data
    //         const formData = {
    //             name: document.getElementById('name').value,
    //             email: document.getElementById('email').value,
    //             organization: document.getElementById('organization').value,
    //             interest: document.getElementById('interest').value,
    //             message: document.getElementById('message').value
    //         };
            
            // Here you would normally send the data to a server
            // For now, we'll just show an alert
            // alert('Thank you for your message! We will get back to you shortly.\n\nNote: This is a demo. Please integrate with your backend API for production.');
            
            // // Reset form
            // contactForm.reset();
            
            // In production, you would do something like:
            /*
            fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            })
            .then(response => response.json())
            .then(data => {
                alert('Message sent successfully!');
                contactForm.reset();
            })
            .catch(error => {
                alert('Error sending message. Please try again.');
                console.error('Error:', error);
            });
            */
    //     });
    // }
    
    // ==========================================
    // Intersection Observer for Fade-in Animations
    // ==========================================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements with fade-in class
    const fadeElements = document.querySelectorAll('.benefit-item, .track-card, .investor-feature, .tier-card, .stall-card, .ticket-card');
    
    fadeElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
    
    // ==========================================
    // Prevent Default for Download Links (Optional)
    // ==========================================
    // Note: In production, replace with actual PDF download links
    const downloadLinks = document.querySelectorAll('a[download]');
    downloadLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href.includes('assets/') && !href.endsWith('.pdf')) {
                e.preventDefault();
                alert('Sponsorship deck will be available soon. Please contact us for more information.');
            }
        });
    });
    
    // ==========================================
    // Dynamic Year in Footer
    // ==========================================
    const currentYear = new Date().getFullYear();
    const footerYear = document.querySelector('.footer-bottom p');
    if (footerYear && currentYear > 2026) {
        footerYear.textContent = `© ${currentYear} Global Leadership Summit. All rights reserved.`;
    }
    
    // ==========================================
    // Parallax Effect for Hero Section (Optional)
    // ==========================================
    const heroSection = document.querySelector('.hero-section');
    
    if (heroSection) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const parallaxSpeed = 0.5;
            
            if (scrolled < window.innerHeight) {
                const heroBg = document.querySelector('.hero-bg');
                if (heroBg) {
                    heroBg.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
                }
            }
        });
    }
    
    // ==========================================
    // Add loading state to buttons on click
    // ==========================================
    const ctaButtons = document.querySelectorAll('.btn');
    
    ctaButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Only add loading state for buttons that trigger actions
            if (this.getAttribute('href') === '#contact' || 
                this.getAttribute('href') === '#tickets' ||
                this.getAttribute('href') === '#sponsorship') {
                // Just smooth scroll, handled by earlier code
                return;
            }
            
            // For external links or form submissions
            if (!this.getAttribute('href').startsWith('#')) {
                const originalText = this.textContent;
                this.style.opacity = '0.7';
                this.style.pointerEvents = 'none';
                
                setTimeout(() => {
                    this.style.opacity = '1';
                    this.style.pointerEvents = 'auto';
                }, 1000);
            }
        });
    });
    
    // ==========================================
    // Donation Form Handler
    // ==========================================
    const donationForm = document.getElementById('donationForm');
    const amountButtons = document.querySelectorAll('.amount-btn');
    const donationAmountInput = document.getElementById('donationAmount');

    if (amountButtons && donationAmountInput) {
        amountButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                // Remove active class from all buttons
                amountButtons.forEach(b => b.classList.remove('active'));
                
                // Add active class to clicked button
                this.classList.add('active');
                
                // Set amount value
                const amount = this.getAttribute('data-amount');
                donationAmountInput.value = amount;
            });
        });
    }

    if (donationForm) {
        donationForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Check if user is logged in
            if (!authSystem || !authSystem.currentUser) {
                alert('Please login to make a donation');
                window.location.href = 'login.html';
                return;
            }

            const amount = parseFloat(donationAmountInput.value);
            const purpose = document.getElementById('donationPurpose').value;

            if (!amount || amount < 100) {
                alert('Please enter a donation amount (minimum ₹100)');
                return;
            }

            // Initiate donation payment
            const donationData = {
                amount,
                purpose
            };

            try {
                const result = await payuIntegration.initiateDonation(donationData);
                
                if (!result.success) {
                    alert(result.message || 'Donation initiation failed');
                }
            } catch (error) {
                console.error('Donation error:', error);
                alert('An error occurred. Please try again.');
            }
        });
    }

    // ==========================================
    // Console Welcome Message
    // ==========================================
    console.log('%c🎉 Welcome to Global Leadership Summit Vision 2047! 🎉', 
        'color: #D4AF37; font-size: 20px; font-weight: bold; text-shadow: 2px 2px 4px rgba(0,0,0,0.5);');
    console.log('%cOrganized by GLS Vision 2047 Leaders & NextGen Ventures', 
        'color: #0D47A1; font-size: 14px;');
    console.log('%cMarch, 2026 | Bharat Mandapam, Delhi', 
        'color: #333; font-size: 12px;');
    
});

// ==========================================
// Additional Helper Functions
// ==========================================

// Format number with commas
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// Validate email format
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Get URL parameters
function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    const results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Export functions for potential use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        formatNumber,
        validateEmail,
        getUrlParameter,
        debounce
    };
}
