# GLS Vision 2047 - Complete Implementation Guide

## 🎯 Quick Start for Production Deployment

This guide will help you deploy the complete GLS Vision 2047 event platform with all features.

---

## 📦 What's Been Built

### ✅ Frontend (Multi-Page Website)
- **Homepage** - Single-page design with all sections
- **Speakers Page** - Dynamic speaker profiles with filtering
- **Agenda Page** - Day-wise conference schedule
- **Tickets/Registration** - Complete booking flow with payment
- **Sponsorship Page** - Packages and inquiry forms
- **Startup Pavilion, Hackathon** - Application and showcase
- **Gallery** - Photo/video grid
- **Media Page** - Press releases and coverage
- **Contact Page** - Form with Google Maps
- **Admin Dashboard** - Complete order management system

### ✅ Backend (Node.js/Express API)
- User authentication with JWT
- Payment gateway integration (PayU & Easebuzz)
- Database models (MongoDB/Mongoose)
- Email confirmation system
- Form submission handlers
- Admin API endpoints
- Security middleware (Helmet, CORS, Rate Limiting)

### ✅ Features Implemented
- 💳 Live payment integration (PayU + Easebuzz)
- 📧 Automated email confirmations
- 🔐 Secure admin dashboard
- 📊 Real-time analytics and reporting
- 📱 Fully responsive design
- 🚀 Fast loading & SEO optimized
- 🎫 QR code ticket generation
- 📥 Data export (CSV/Excel)

---

## 🚀 Installation Steps

### Step 1: Set Up Project Structure

```bash
cd /Users/omdubey/Documents/GlobalSummit2026

# Install backend dependencies
cd server
npm install

# Create environment file
cp .env.example .env
```

### Step 2: Configure Environment Variables

Edit `server/.env`:

```env
# CRITICAL: Update these for production

# Server
PORT=5000
NODE_ENV=production
API_BASE_URL=https://api.gls2026.org
FRONTEND_URL=https://gls2026.org

# MongoDB (Get from MongoDB Atlas)
MONGODB_URI=mongodb+srv://gls2026:YOUR_PASSWORD@cluster.mongodb.net/gls2026?retryWrites=true&w=majority

# JWT Secret (Generate strong secret)
JWT_SECRET=use_openssl_rand_base64_32_to_generate_this

# Email (Gmail)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=events@gls2026.org
EMAIL_PASSWORD=your_gmail_app_password

# PayU Credentials (Get from dashboard.payu.in)
PAYU_MERCHANT_KEY=your_merchant_key_here
PAYU_MERCHANT_SALT=your_merchant_salt_here
PAYU_SUCCESS_URL=https://gls2026.org/payment-success
PAYU_FAILURE_URL=https://gls2026.org/payment-failure
PAYU_BASE_URL=https://secure.payu.in/_payment

# Easebuzz Credentials (Get from dashboard.easebuzz.in)
EASEBUZZ_MERCHANT_KEY=your_easebuzz_key_here
EASEBUZZ_SALT=your_easebuzz_salt_here
EASEBUZZ_SUCCESS_URL=https://gls2026.org/payment-success
EASEBUZZ_FAILURE_URL=https://gls2026.org/payment-failure
EASEBUZZ_BASE_URL=https://pay.easebuzz.in/pay

# Admin Credentials
ADMIN_EMAIL=admin@gls2026.org
ADMIN_PASSWORD=ChangeThisStrongPassword123!
```

### Step 3: Update Frontend API Configuration

Create `js/config.js`:

```javascript
const API_CONFIG = {
    // Development
    // baseURL: 'http://localhost:5000/api',
    
    // Production
    baseURL: 'https://api.gls2026.org/api',
    
    timeout: 30000
};

export default API_CONFIG;
```

Update in all JS files that make API calls:
- `js/tickets.js` - Line 5
- `js/speakers.js` - Line 3
- `admin/js/admin-dashboard.js` - Line 3

### Step 4: Set Up MongoDB Database

#### Option A: MongoDB Atlas (Recommended)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create cluster (Free tier: M0)
4. Database Access → Add user (username: gls2026)
5. Network Access → Add IP (0.0.0.0/0 for testing, restrict in production)
6. Connect → Get connection string
7. Update `MONGODB_URI` in `.env`

#### Option B: Local MongoDB

```bash
# macOS
brew install mongodb-community
brew services start mongodb-community

# Ubuntu
sudo apt install mongodb
sudo systemctl start mongodb

# Update .env
MONGODB_URI=mongodb://localhost:27017/gls2026
```

### Step 5: Start Backend Server

```bash
cd server

# Development
npm run dev

# Production
npm start

# With PM2 (recommended for production)
npm install -g pm2
pm2 start server.js --name gls2026-api
pm2 save
pm2 startup
```

Verify: http://localhost:5000/health

### Step 6: Test Frontend Locally

```bash
# From project root
npx live-server
# Or
python -m http.server 8000
# Or
php -S localhost:8000
```

Open: http://localhost:8000

---

## 💳 Payment Gateway Setup

### PayU Setup

1. **Sign Up**: https://payu.in/merchant-account
2. **Complete KYC**: Business documents, bank details
3. **Get Credentials**:
   - Login to dashboard.payu.in
   - Get Merchant Key
   - Get Merchant Salt (v1)
4. **Configure Webhooks**:
   - Success URL: `https://api.gls2026.org/api/payment/payu/success`
   - Failure URL: `https://api.gls2026.org/api/payment/payu/failure`
5. **Testing**:
   - Use test URL: `https://test.payu.in/_payment`
   - Test Card: 5123456789012346
   - CVV: 123

### Easebuzz Setup

1. **Sign Up**: https://easebuzz.in/
2. **Complete Onboarding**: Submit documents
3. **Get Credentials**:
   - Login to dashboard
   - API Keys section
   - Copy Merchant Key and Salt
4. **Configure Webhooks**:
   - Success: `https://api.gls2026.org/api/payment/easebuzz/success`
   - Failure: `https://api.gls2026.org/api/payment/easebuzz/failure`
5. **Testing**:
   - Use test URL: `https://testpay.easebuzz.in/pay`

### Payment Flow Testing

```bash
# Test payment initiation
curl -X POST http://localhost:5000/api/payment/initiate \
  -H "Content-Type: application/json" \
  -d '{
    "ticketType": "gold",
    "quantity": 1,
    "amount": 30000,
    "firstName": "Test",
    "lastName": "User",
    "email": "test@example.com",
    "phone": "9999999999",
    "organization": "Test Org",
    "designation": "Manager",
    "address": "Test Address",
    "city": "Delhi",
    "state": "Delhi",
    "pincode": "110001",
    "country": "India",
    "gateway": "payu"
  }'
```

---

## 📧 Email Configuration

### Gmail Setup

1. **Enable 2FA**: Google Account → Security → 2-Step Verification
2. **Create App Password**:
   - Security → App passwords
   - Select app: Mail
   - Select device: Other (GLS Vision 2047)
   - Copy generated password
3. **Update .env**:
   ```env
   EMAIL_USER=events@gls2026.org
   EMAIL_PASSWORD=generated_app_password
   ```

### Email Templates

Create custom templates in `server/templates/`:

```html
<!-- payment-confirmation.html -->
<!DOCTYPE html>
<html>
<head>
    <style>
        /* Email styles */
    </style>
</head>
<body>
    <div class="email-container">
        <img src="https://gls2026.org/images/GLS Vision 2047Logo.png" alt="GLS Vision 2047">
        <h1>Booking Confirmed!</h1>
        <p>Dear {{firstName}} {{lastName}},</p>
        <p>Thank you for registering for Global Leadership Summit Vision 2047!</p>
        
        <div class="ticket-details">
            <h2>Ticket Details</h2>
            <p><strong>Ticket Type:</strong> {{ticketType}}</p>
            <p><strong>Quantity:</strong> {{quantity}}</p>
            <p><strong>Total Amount:</strong> ₹{{totalAmount}}</p>
            <p><strong>Transaction ID:</strong> {{transactionId}}</p>
            <p><strong>Ticket Code:</strong> {{ticketCode}}</p>
        </div>
        
        <div class="qr-code">
            <img src="{{qrCodeURL}}" alt="QR Code">
        </div>
        
        <p>Please present this QR code at the venue for entry.</p>
        
        <div class="event-details">
            <h3>Event Details</h3>
            <p><strong>Date:</strong> March, 2026</p>
            <p><strong>Venue:</strong> Bharat Mandapam, Delhi</p>
        </div>
        
        <p>See you at the summit!</p>
        <p>Team GLS Vision 2047</p>
    </div>
</body>
</html>
```

---

## 👨‍💼 Admin Dashboard Setup

### Create Admin User

```bash
# Method 1: Using Node.js script
cd server
node scripts/create-admin.js

# Method 2: MongoDB Shell
mongosh
use gls2026
db.admins.insertOne({
  email: "admin@gls2026.org",
  password: "$2a$10$hashed_password",  // Use bcrypt
  name: "Admin User",
  role: "super_admin",
  createdAt: new Date()
})
```

Create `server/scripts/create-admin.js`:

```javascript
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function createAdmin() {
    await mongoose.connect(process.env.MONGODB_URI);
    
    const Admin = require('../models/Admin');
    
    const password = await bcrypt.hash('YourStrongPassword123!', 10);
    
    const admin = new Admin({
        email: 'admin@gls2026.org',
        password: password,
        name: 'Super Admin',
        role: 'super_admin'
    });
    
    await admin.save();
    console.log('✅ Admin created successfully');
    process.exit(0);
}

createAdmin();
```

Run:
```bash
node scripts/create-admin.js
```

### Access Admin Dashboard

1. Navigate to: https://gls2026.org/admin/login.html
2. Login with credentials
3. Dashboard features:
   - View all ticket orders
   - Export data to CSV
   - Send confirmation emails
   - View payment analytics
   - Manage speakers/agenda
   - Respond to inquiries

---

## 🌐 Production Deployment

### Option 1: AWS (Recommended)

#### Backend (EC2 + RDS)

```bash
# 1. Launch EC2 instance (t2.micro for testing)
# Ubuntu 22.04 LTS

# 2. SSH and setup
ssh -i your-key.pem ubuntu@your-ip

# 3. Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 4. Clone repo
git clone your-repo-url
cd GlobalSummit2026/server

# 5. Install dependencies
npm install --production

# 6. Set environment variables
nano .env
# Paste production values

# 7. Install PM2
sudo npm install -g pm2

# 8. Start server
pm2 start server.js --name gls2026-api
pm2 startup systemd
pm2 save

# 9. Install Nginx
sudo apt update
sudo apt install nginx

# 10. Configure Nginx
sudo nano /etc/nginx/sites-available/gls2026-api
```

Nginx config:
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
```

Enable site and SSL:
```bash
sudo ln -s /etc/nginx/sites-available/gls2026-api /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Install SSL
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d api.gls2026.org
```

#### Frontend (S3 + CloudFront)

```bash
# 1. Create S3 bucket
aws s3 mb s3://gls2026.org

# 2. Enable static website hosting
aws s3 website s3://gls2026.org --index-document index.html

# 3. Upload files
aws s3 sync . s3://gls2026.org --exclude "server/*" --exclude "node_modules/*"

# 4. Set bucket policy (public read)
# 5. Create CloudFront distribution
# 6. Configure custom domain with Route 53
# 7. Add SSL certificate (ACM)
```

### Option 2: Heroku

```bash
# Backend
heroku create gls2026-api
heroku addons:create mongolab:sandbox
heroku config:set PAYU_MERCHANT_KEY=xxx
# ... set all env vars
git push heroku main

# Frontend (use Netlify or Vercel)
```

### Option 3: DigitalOcean

1. App Platform → Create App
2. Connect GitHub
3. Configure build settings
4. Add environment variables
5. Deploy

---

## 🔒 Security Checklist

Before going live:

- [ ] Change all default passwords
- [ ] Use strong JWT secret (32+ chars)
- [ ] Enable HTTPS everywhere
- [ ] Configure CORS properly
- [ ] Enable rate limiting
- [ ] Validate all inputs (both frontend & backend)
- [ ] Sanitize database queries
- [ ] Use parameterized queries
- [ ] Enable MongoDB authentication
- [ ] Restrict MongoDB network access
- [ ] Use environment variables (never commit .env)
- [ ] Set up regular backups
- [ ] Configure firewall (UFW/Security Groups)
- [ ] Enable audit logging
- [ ] Test payment in sandbox first
- [ ] Implement CSRF protection
- [ ] Add security headers
- [ ] Keep dependencies updated
- [ ] Set up error monitoring (Sentry)
- [ ] Configure log rotation
- [ ] Implement API key rotation

---

## 📊 Monitoring & Analytics

### Application Monitoring

```bash
# PM2 Monitoring
pm2 monit
pm2 logs gls2026-api

# Set up PM2 Plus (optional)
pm2 link your-secret-key your-public-key
```

### Google Analytics

Add to all HTML pages (before `</head>`):

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

### Payment Analytics

Track in admin dashboard:
- Total revenue
- Success rate by gateway
- Failed transactions
- Refund requests
- Average ticket value

---

## 🧪 Testing Checklist

### Frontend Testing

- [ ] Test on Chrome, Firefox, Safari, Edge
- [ ] Test on mobile devices (iOS, Android)
- [ ] Test form validation
- [ ] Test payment flow end-to-end
- [ ] Test with slow network
- [ ] Verify responsive design
- [ ] Check accessibility (WCAG)
- [ ] Test browser back button
- [ ] Verify all links work

### Backend Testing

- [ ] API endpoint responses
- [ ] Database connections
- [ ] Payment webhook callbacks
- [ ] Email delivery
- [ ] Error handling
- [ ] Rate limiting
- [ ] Authentication/Authorization
- [ ] File uploads
- [ ] Data export

### Payment Testing

- [ ] Successful payment (PayU)
- [ ] Successful payment (Easebuzz)
- [ ] Failed payment scenarios
- [ ] Payment timeout
- [ ] Webhook verification
- [ ] Duplicate transaction check
- [ ] Refund processing
- [ ] Invoice generation

---

## 🆘 Troubleshooting

### Common Issues

**"MongoDB connection failed"**
```bash
# Check MongoDB URI
# Verify network access in Atlas
# Test connection:
mongosh "your_mongodb_uri"
```

**"Payment hash mismatch"**
```bash
# Verify merchant key and salt
# Check for extra spaces
# Ensure correct hash algorithm (SHA512)
```

**"Email not sending"**
```bash
# Verify Gmail app password
# Check port 587 is open
# Test SMTP:
telnet smtp.gmail.com 587
```

**"CORS error"**
```javascript
// Update CORS whitelist in server.js
const corsOptions = {
    origin: ['https://gls2026.org', 'https://www.gls2026.org'],
    credentials: true
};
```

---

## 📞 Support Contacts

- **Technical Issues**: dev@gls2026.org
- **Payment Issues**: finance@gls2026.org
- **General Inquiries**: care@glsvision2047.com
- **Emergency**: +91 9026181492

---

## 📝 Next Steps

1. ✅ Complete environment setup
2. ✅ Configure payment gateways
3. ✅ Set up email system
4. ✅ Create admin user
5. ✅ Deploy to production
6. ✅ Test thoroughly
7. ✅ Enable monitoring
8. ✅ Launch! 🚀

---

**Good luck with your launch!** 🎉

For detailed deployment instructions, see [DEPLOYMENT-GUIDE.md](DEPLOYMENT-GUIDE.md)
