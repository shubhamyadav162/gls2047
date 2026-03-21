# 🎯 Global Leadership Summit Vision 2047

## Complete Event Management Platform

Official website and backend system for Global Leadership Summit Vision 2047 (GLS Vision 2047), organized by GLS Vision 2047 Leaders and NextGen Ventures.

[![Node.js](https://img.shields.io/badge/Node.js-18.x-green)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-5.x-green)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-Proprietary-red)]()

---

## 🎯 Event Details

- **Event Name:** Global Leadership Summit Vision 2047 (GLS Vision 2047)
- **Organizers:** GLS Vision 2047 Leaders, NextGen Ventures
- **Venue:** Bharat Mandapam, Delhi
- **Date:** March, 2026
- **Expected Attendees:** 5,000+ delegates
- **Theme:** Leadership • Innovation • Vision 2047

---

## ✨ Features

### 🌐 Multi-Page Website
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Modern UI with brand colors
- ✅ Dynamic content (JSON-based)
- ✅ SEO optimized
- ✅ Fast loading (<3s)

### 💳 Payment Integration
- ✅ **PayU** integration (live & test modes)
- ✅ **Easebuzz** integration (live & test modes)
- ✅ Secure hash verification (SHA512)
- ✅ Webhook callbacks
- ✅ Payment status tracking
- ✅ Automated refund support

### 📧 Email System
- ✅ Automated confirmation emails
- ✅ QR code ticket generation
- ✅ Invoice generation (PDF)
- ✅ Event reminders
- ✅ Admin notifications

### 👨‍💼 Admin Dashboard
- ✅ Real-time analytics
- ✅ Order management
- ✅ Payment tracking
- ✅ Inquiry management
- ✅ Data export (CSV/Excel)
- ✅ Email automation

### 🔐 Security
- ✅ JWT authentication
- ✅ Password hashing (bcrypt)
- ✅ CORS protection
- ✅ Rate limiting
- ✅ Input validation
- ✅ SQL injection prevention
- ✅ XSS protection

---

## 🚀 Quick Start

Get started in 5 minutes! See [QUICK-START.md](QUICK-START.md)

```bash
# 1. Install backend dependencies
cd server
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env with your credentials

# 3. Start backend
npm start

# 4. Start frontend (in new terminal)
cd ..
npx live-server
```

**That's it!** Open http://localhost:8080

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [QUICK-START.md](QUICK-START.md) | Get running in 5 minutes |
| [IMPLEMENTATION-GUIDE.md](IMPLEMENTATION-GUIDE.md) | Step-by-step setup guide |
| [DEPLOYMENT-GUIDE.md](DEPLOYMENT-GUIDE.md) | Production deployment |
| [PROJECT-SUMMARY.md](PROJECT-SUMMARY.md) | Complete project overview |
| [ASSETS-NEEDED.md](ASSETS-NEEDED.md) | Asset requirements |

---

## 🎨 Brand Colors

- **Royal Blue:** `#0D47A1`
- **Gold:** `#D4AF37`
- **White:** `#FFFFFF`
- **Dark Slate:** `#111111`

## 📁 Project Structure

```
GlobalSummit2026/
├── index.html          # Main HTML file with all sections
├── styles.css          # Complete styling with responsive design
├── script.js           # Interactive features and animations
├── README.md           # This file
└── assets/             # Assets directory (create this folder)
    ├── gls-logo.png                    # GLS Vision 2047 logo
    ├── favicon.png                     # Browser favicon
    ├── bharat-mandapam-bg.jpg         # Hero background image
    ├── paniit-leaders.jpg             # GLS Vision 2047 section image
    ├── nextgen-ventures.jpg           # NextGen section image
    ├── og-image.jpg                   # Open Graph image for social sharing
    ├── twitter-card.jpg               # Twitter card image
    ├── GLS2026-Sponsorship-Deck.pdf   # Sponsorship deck download
    └── partners/                       # Partner logos folder
        ├── paniit-logo.png
        ├── nextgen-logo.png
        ├── jagran-logo.png
        ├── bright-logo.png
        ├── zomoto-logo.png
        ├── ev-expo-logo.png
        ├── meta-logo.png
        ├── google-logo.png
        └── aws-logo.png
```

## 🚀 Features Implemented

### Navigation
- Fixed header with scroll-spy highlighting
- Mobile-responsive hamburger menu
- Smooth scrolling to sections

### Hero Section
- Full-screen hero with gradient overlay
- Event countdown timer (days, hours, minutes, seconds)
- Dual CTA buttons (Register & Sponsor)
- Scroll indicator animation

### Interactive Elements
- Animated stat counters (5000+, 500+, 200+, 100+)
- Tabbed agenda interface (Day 1 & Day 2)
- Fade-in animations on scroll
- Parallax effect on hero background
- Hover effects on all cards and buttons

### Sections
1. **Home** - Hero with countdown and CTAs
2. **About Event** - Overview, benefits, key stats
3. **GLS Vision 2047 Leaders** - Organization background and role
4. **NextGen Ventures** - Organizing team details
5. **Conference & Exhibition** - Dual tracks, sectors, agenda
6. **Global Investors Meet** - Investment opportunities
7. **Sponsorship & Exhibition** - Packages and stall options
8. **Partners** - Logo grid with categories
9. **Tickets & Registration** - Ticket tiers with early bird pricing
10. **Contact Us** - Contact info, map, and form

### Additional Features
- Floating WhatsApp chat button
- Scroll-to-top button
- Contact form with validation
- Fully responsive design (mobile, tablet, desktop)
- Meta tags for SEO and social sharing

## 📝 Setup Instructions

1. **Create Assets Folder:**
   ```bash
   mkdir -p assets/partners
   ```

2. **Add Required Images:**
   Replace the following placeholder image paths with actual branded assets:
   - `images/GLS Vision 2047Logo.png` - Your event logo
   - `images/GLS Vision 2047Logo.png` - Browser tab icon
   - `assets/bharat-mandapam-bg.jpg` - Hero background (recommend 1920x1080px)
   - `assets/paniit-leaders.jpg` - GLS Vision 2047 section image
   - `assets/nextgen-ventures.jpg` - NextGen section image
   - `assets/og-image.jpg` - Social media preview (1200x630px)
   - `assets/twitter-card.jpg` - Twitter preview (1200x600px)

3. **Add Partner Logos:**
   Place partner logo images in `assets/partners/` folder:
   - GLS Vision 2047, NextGen Ventures, Jagran, Bright, Zomoto, EV Expo, Meta, Google, AWS

4. **Add Sponsorship Deck:**
   - Place PDF file at `assets/GLS2026-Sponsorship-Deck.pdf`

5. **Open Website:**
   - Simply open `index.html` in a modern web browser
   - For development, use a local server (recommended):
     ```bash
     # Using Python
     python -m http.server 8000
     
     # Using Node.js
     npx http-server
     
     # Using PHP
     php -S localhost:8000
     ```

## 🎨 Customization Guide

### Update Event Date
Edit the countdown date in `script.js` (line 86):
```javascript
const countdownDate = new Date('March 15, 2026 09:00:00').getTime();
```

### Modify Colors
Update CSS variables in `styles.css` (lines 15-20):
```css
:root {
    --royal-blue: #0D47A1;
    --gold: #D4AF37;
    --white: #FFFFFF;
    --dark-slate: #111111;
}
```

### Update Contact Information
Edit contact details in the Contact section of `index.html` (section #contact)

### Add/Remove Sections
The website uses section-based navigation. To add or remove sections:
1. Update navigation menu in `<nav>` element
2. Add/remove `<section>` with corresponding ID
3. Update scroll-spy functionality if needed

## 📱 Responsive Breakpoints

- **Desktop:** 1024px and above
- **Tablet:** 768px - 1023px
- **Mobile:** 480px - 767px
- **Small Mobile:** Below 480px

## 🔧 Browser Compatibility

Tested and working on:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 📊 Performance Optimizations

- Lazy loading for images (implement with `loading="lazy"`)
- Debounced scroll events
- Intersection Observer for animations
- Optimized CSS with minimal dependencies
- No external framework dependencies

## 🌐 Deployment

### Option 1: Static Hosting
Upload all files to:
- GitHub Pages
- Netlify
- Vercel
- AWS S3 + CloudFront
- Firebase Hosting

### Option 2: Traditional Web Hosting
Upload files via FTP to your web hosting provider's public_html or www directory.

### Option 3: WordPress Integration
Integrate using custom page template or page builder.

## 📧 Contact Form Integration

The contact form currently shows an alert on submission. For production:

1. **Email Service Integration:**
   - Use EmailJS, SendGrid, or similar
   - Or create backend API endpoint

2. **Example with EmailJS:**
   ```javascript
   emailjs.send('service_id', 'template_id', formData)
       .then(response => {
           alert('Message sent successfully!');
       });
   ```

3. **Backend Integration:**
   Uncomment the fetch API code in `script.js` (lines 227-242) and point to your backend endpoint.

## 🔐 Security Considerations

- Implement CAPTCHA for contact form in production
- Validate and sanitize all form inputs on backend
- Use HTTPS for production deployment
- Implement rate limiting for form submissions
- Store sensitive data securely (never in frontend code)

## ✅ Pre-Launch Checklist

- [ ] Replace all placeholder images with actual branded assets
- [ ] Update contact email and phone number
- [ ] Add real partner logos
- [ ] Upload sponsorship PDF deck
- [ ] Test contact form integration
- [ ] Verify all links work correctly
- [ ] Test on multiple devices and browsers
- [ ] Add Google Analytics tracking code
- [ ] Update meta tags for SEO
- [ ] Set up custom domain and SSL certificate
- [ ] Create 301 redirects if needed
- [ ] Test page load speed
- [ ] Validate HTML/CSS
- [ ] Check accessibility (WCAG compliance)

## 🎯 Future Enhancements

Consider adding:
- Registration payment gateway integration
- CMS for dynamic content management
- Live chat support
- Agenda mobile app integration
- Speaker profile pages
- Past event gallery
- Blog section for updates
- Newsletter subscription
- Multi-language support
- Virtual event platform integration

## 📄 License

© 2026 Global Leadership Summit. All rights reserved.

## 🤝 Support

For technical support or questions:
- **Email:** care@glsvision2047.com
- **Phone:** +91 9026181492
- **WhatsApp:** Click the floating button on the website

---

**Built with ❤️ for GLS Vision 2047 | GLS Vision 2047 Leaders & NextGen Ventures**
