# GLS Vision 2047 - Full Deployment Guide

## 🚀 Complete Event Platform with Payment Integration

This guide covers deploying the full-featured Global Leadership Summit Vision 2047 website with:
- Multi-page responsive website
- Payment gateway integration (PayU & Easebuzz)
- Backend API with email confirmation
- Admin dashboard for order management
- Database setup and configuration

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Project Structure](#project-structure)
3. [Frontend Setup](#frontend-setup)
4. [Backend Setup](#backend-setup)
5. [Database Configuration](#database-configuration)
6. [Payment Gateway Setup](#payment-gateway-setup)
7. [Email Configuration](#email-configuration)
8. [Admin Dashboard](#admin-dashboard)
9. [Deployment](#deployment)
10. [Security Checklist](#security-checklist)

---

## 📦 Prerequisites

### Required Software
- **Node.js** 16.x or higher
- **MongoDB** 5.x or higher (or MongoDB Atlas account)
- **npm** or **yarn** package manager
- **Git** for version control

### Required Accounts
1. **PayU Merchant Account** - https://payu.in/merchant-account
2. **Easebuzz Merchant Account** - https://easebuzz.in/
3. **Email Service** - Gmail, SendGrid, or AWS SES
4. **MongoDB Atlas** (recommended) - https://www.mongodb.com/cloud/atlas
5. **Hosting** - AWS, DigitalOcean, Heroku, or similar

---

## 🏗️ Project Structure

```
GlobalSummit2026/
├── index.html                    # Homepage (single-page version)
├── speakers.html                 # Speakers page
├── agenda.html                   # Event agenda
├── startup-pavilion.html         # Startup registration
├── sponsorship.html              # Sponsorship packages
├── tickets.html                  # Ticket booking with payment
├── gallery.html                  # Photo/video gallery
├── media.html                    # Press & media coverage
├── contact.html                  # Contact form
├── payment-success.html          # Payment success page
├── payment-failure.html          # Payment failure page
├── admin/
│   ├── login.html               # Admin login
│   ├── dashboard.html           # Admin dashboard
│   └── orders.html              # Order management
├── styles.css                    # Main stylesheet
├── script.js                     # Main JavaScript
├── css/
│   └── pages.css                # Additional page styles
├── js/
│   ├── speakers.js              # Speakers page logic
│   ├── tickets.js               # Ticket booking logic
│   ├── payment.js               # Payment integration
│   └── admin.js                 # Admin dashboard logic
├── data/
│   ├── speakers.json            # Speaker data
│   ├── agenda.json              # Agenda data
│   └── config.json              # Site configuration
├── assets/
│   ├── images/                  # Image files
│   ├── partners/                # Partner logos
│   └── gallery/                 # Gallery images
├── server/
│   ├── server.js                # Express server
│   ├── package.json             # Backend dependencies
│   ├── .env                     # Environment variables (create from .env.example)
│   ├── models/
│   │   ├── Ticket.js           # Ticket model
│   │   ├── Transaction.js      # Transaction model
│   │   ├── Sponsorship.js      # Sponsorship model
│   │   ├── Startup.js          # Startup model
│   │   ├── Contact.js          # Contact inquiry model
│   │   └── Admin.js            # Admin user model
│   ├── routes/
│   │   ├── auth.js             # Authentication routes
│   │   ├── tickets.js          # Ticket routes
│   │   ├── payment.js          # Payment gateway routes
│   │   ├── sponsorship.js      # Sponsorship routes
│   │   ├── startup.js          # Startup routes
│   │   ├── contact.js          # Contact routes
│   │   ├── admin.js            # Admin routes
│   │   ├── speakers.js         # Speakers API
│   │   └── agenda.js           # Agenda API
│   ├── middleware/
│   │   ├── auth.js             # JWT authentication
│   │   └── validation.js       # Input validation
│   └── utils/
│       ├── email.js            # Email utilities
│       ├── pdf.js              # PDF generation
│       └── hash.js             # Hashing utilities
└── README.md
```

---

## 🎨 Frontend Setup

### Step 1: Install Frontend Dependencies (Optional)

If using build tools (recommended for production):

```bash
npm init -y
npm install --save-dev live-server
```

### Step 2: Configure API Endpoints

Create `js/config.js`:

```javascript
const API_CONFIG = {
    baseURL: 'http://localhost:5000/api',  // Change to production URL
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json'
    }
};

// For production:
// baseURL: 'https://api.gls2026.org/api'
```

### Step 3: Update Payment Gateway URLs

In `tickets.html`, update:
- PayU form action URL
- Easebuzz form action URL
- Success/failure redirect URLs

### Step 4: Test Frontend Locally

```bash
# Using live-server
npx live-server

# Or using Python
python -m http.server 8000

# Or using PHP
php -S localhost:8000
```

Open http://localhost:8000 in your browser.

---

## ⚙️ Backend Setup

### Step 1: Install Backend Dependencies

```bash
cd server
npm install
```

### Step 2: Configure Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Edit `.env` with your actual credentials:

```env
# Server
PORT=5000
NODE_ENV=production
API_BASE_URL=https://api.gls2026.org
FRONTEND_URL=https://gls2026.org

# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/gls2026

# JWT
JWT_SECRET=your_super_secret_key_min_32_characters_long

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# PayU
PAYU_MERCHANT_KEY=your_payu_key
PAYU_MERCHANT_SALT=your_payu_salt

# Easebuzz
EASEBUZZ_MERCHANT_KEY=your_easebuzz_key
EASEBUZZ_SALT=your_easebuzz_salt
```

### Step 3: Create Database Models

The models are already created in `server/models/`. Ensure they're properly connected.

### Step 4: Start Backend Server

```bash
# Development mode
npm run dev

# Production mode
npm start
```

Server will run on http://localhost:5000

### Step 5: Test API Endpoints

```bash
# Health check
curl http://localhost:5000/health

# Should return: {"status":"OK","timestamp":"..."}
```

---

## 💾 Database Configuration

### Option 1: MongoDB Atlas (Recommended)

1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a new cluster (Free tier available)
3. Configure network access (allow your IP)
4. Create database user
5. Get connection string
6. Update `MONGODB_URI` in `.env`

### Option 2: Local MongoDB

```bash
# Install MongoDB
# macOS
brew install mongodb-community

# Ubuntu
sudo apt-get install mongodb

# Start MongoDB
mongod --dbpath /path/to/data
```

Update `.env`:
```env
MONGODB_URI=mongodb://localhost:27017/gls2026
```

### Database Indexes

Create indexes for better performance:

```javascript
// In MongoDB shell or Compass
db.tickets.createIndex({ transactionId: 1 }, { unique: true });
db.tickets.createIndex({ email: 1 });
db.tickets.createIndex({ paymentStatus: 1 });
db.transactions.createIndex({ transactionId: 1 });
db.tickets.createIndex({ createdAt: -1 });
```

---

## 💳 Payment Gateway Setup

### PayU Integration

1. **Get Merchant Credentials:**
   - Sign up at https://payu.in/merchant-account
   - Get Merchant Key and Salt from dashboard
   - Set up success/failure URLs

2. **Test Mode:**
   ```env
   PAYU_BASE_URL=https://test.payu.in/_payment
   ```

3. **Production Mode:**
   ```env
   PAYU_BASE_URL=https://secure.payu.in/_payment
   ```

4. **Test Cards:**
   - Card Number: 5123456789012346
   - CVV: 123
   - Expiry: Any future date

### Easebuzz Integration

1. **Get Merchant Credentials:**
   - Sign up at https://easebuzz.in/
   - Get Merchant Key and Salt
   - Configure webhook URLs

2. **Test Mode:**
   ```env
   EASEBUZZ_BASE_URL=https://testpay.easebuzz.in/pay
   ```

3. **Production Mode:**
   ```env
   EASEBUZZ_BASE_URL=https://pay.easebuzz.in/pay
   ```

### Payment Flow

1. User fills registration form
2. Frontend calls `/api/payment/initiate`
3. Backend generates hash and returns payment data
4. Frontend submits form to payment gateway
5. User completes payment on gateway
6. Gateway calls success/failure webhook
7. Backend updates database and sends email
8. User redirected to success/failure page

---

## 📧 Email Configuration

### Gmail Setup

1. Enable 2-Factor Authentication
2. Generate App Password:
   - Google Account → Security → App passwords
   - Select "Mail" and generate

3. Update `.env`:
   ```env
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=generated-app-password
   ```

### SendGrid Setup (Alternative)

```env
SENDGRID_API_KEY=your_sendgrid_api_key
```

Update `server/utils/email.js` to use SendGrid:

```javascript
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
```

### Email Templates

Create custom templates in `server/templates/`:
- `payment-confirmation.html` - Ticket purchase confirmation
- `registration-confirmation.html` - Event registration
- `sponsorship-inquiry.html` - Sponsorship inquiry received

---

## 👨‍💼 Admin Dashboard

### Access Admin Dashboard

1. Navigate to `/admin/login.html`
2. Default credentials (change these!):
   - Email: admin@gls2026.org
   - Password: ChangeThisStrongPassword123!

### Admin Features

- **Dashboard Overview:**
  - Total tickets sold
  - Revenue statistics
  - Recent transactions
  - Payment status breakdown

- **Order Management:**
  - View all ticket orders
  - Filter by status, date, ticket type
  - Export to CSV/Excel
  - Send confirmation emails

- **Sponsorship Inquiries:**
  - View sponsorship requests
  - Mark as contacted/closed
  - Export leads

- **Startup Applications:**
  - Review Startup Pavilion, Hackathon applications
  - Approve/reject applications
  - Contact applicants

- **Contact Inquiries:**
  - View all contact form submissions
  - Respond to inquiries
  - Mark as resolved

### Create Admin User

```bash
# Using MongoDB shell
use gls2026
db.admins.insertOne({
  email: "admin@gls2026.org",
  password: "$2a$10$hashed_password",  // Use bcrypt to hash
  name: "Admin User",
  role: "admin",
  createdAt: new Date()
})
```

Or use the API:

```bash
curl -X POST http://localhost:5000/api/auth/register-admin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@gls2026.org",
    "password": "YourStrongPassword123!",
    "name": "Admin User"
  }'
```

---

## 🌐 Deployment

### Option 1: AWS EC2

```bash
# 1. Launch EC2 instance (Ubuntu)
# 2. SSH into instance
ssh -i your-key.pem ubuntu@your-ip

# 3. Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 4. Install MongoDB (or use Atlas)
# 5. Clone repository
git clone https://github.com/yourusername/gls2026.git
cd gls2026/server

# 6. Install dependencies
npm install --production

# 7. Install PM2
npm install -g pm2

# 8. Start server with PM2
pm2 start server.js --name gls2026-api
pm2 startup
pm2 save

# 9. Setup Nginx reverse proxy
sudo apt install nginx
# Configure Nginx (see nginx.conf example below)

# 10. Setup SSL with Let's Encrypt
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d api.gls2026.org
```

### Option 2: Heroku

```bash
# 1. Install Heroku CLI
# 2. Login
heroku login

# 3. Create app
heroku create gls2026-api

# 4. Set environment variables
heroku config:set MONGODB_URI=your_mongodb_uri
heroku config:set JWT_SECRET=your_secret
# ... set all other env vars

# 5. Deploy
git push heroku main

# 6. Open app
heroku open
```

### Option 3: DigitalOcean App Platform

1. Connect GitHub repository
2. Configure environment variables
3. Deploy automatically on push

### Frontend Deployment

#### Netlify (Recommended)

1. Connect GitHub repository
2. Build settings: None (static site)
3. Publish directory: `/`
4. Deploy!

#### Vercel

```bash
npm install -g vercel
vercel
```

#### AWS S3 + CloudFront

```bash
# Upload files to S3
aws s3 sync . s3://your-bucket-name --exclude "server/*"

# Configure CloudFront distribution
# Enable HTTPS with ACM certificate
```

### Nginx Configuration

```nginx
server {
    listen 80;
    server_name api.gls2026.org;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

server {
    listen 80;
    server_name gls2026.org www.gls2026.org;
    root /var/www/gls2026;
    index index.html;

    location / {
        try_files $uri $uri/ =404;
    }
}
```

---

## 🔒 Security Checklist

### Before Going Live:

- [ ] Change all default passwords
- [ ] Use strong JWT secret (min 32 characters)
- [ ] Enable HTTPS/SSL certificates
- [ ] Configure CORS properly
- [ ] Set up rate limiting
- [ ] Validate all user inputs
- [ ] Sanitize database queries
- [ ] Enable MongoDB authentication
- [ ] Use environment variables for secrets
- [ ] Set up backup strategy
- [ ] Configure firewall rules
- [ ] Enable monitoring and logging
- [ ] Test payment gateway in sandbox mode first
- [ ] Implement CSRF protection
- [ ] Add security headers (Helmet.js)
- [ ] Regular dependency updates
- [ ] Set up error tracking (Sentry, LogRocket)

### Additional Security Measures:

```javascript
// Add to server.js

// Security headers
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"],
        },
    },
}));

// XSS protection
app.use((req, res, next) => {
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
});
```

---

## 🧪 Testing

### Backend API Testing

```bash
# Install testing dependencies
npm install --save-dev jest supertest

# Run tests
npm test
```

### Frontend Testing

- Test all forms with validation
- Test payment flow end-to-end
- Test on multiple devices and browsers
- Test with slow network connections
- Verify email delivery

### Payment Gateway Testing

1. Use test credentials in sandbox mode
2. Test successful payment flow
3. Test failed payment scenarios
4. Test callback webhooks
5. Verify database updates
6. Check email confirmations

---

## 📊 Monitoring & Analytics

### Google Analytics

Add to all HTML pages:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-XXXXXXXXXX');
</script>
```

### Server Monitoring

```bash
# Install PM2 for process monitoring
npm install -g pm2

# Start with monitoring
pm2 start server.js --name gls2026-api
pm2 monit
```

---

## 🆘 Troubleshooting

### Common Issues:

**Payment hash mismatch:**
- Verify merchant key and salt are correct
- Check hash generation algorithm
- Ensure no extra spaces in credentials

**Email not sending:**
- Check SMTP credentials
- Verify app password (not regular password)
- Check firewall/port 587 access

**Database connection failed:**
- Verify MongoDB URI
- Check network access in Atlas
- Ensure database user has correct permissions

**CORS errors:**
- Add frontend URL to CORS whitelist
- Check protocol (http vs https)

---

## 📞 Support

For technical support:
- Email: dev@gls2026.org
- Documentation: https://docs.gls2026.org

---

## 📝 License

© 2026 Global Leadership Summit. All rights reserved.
