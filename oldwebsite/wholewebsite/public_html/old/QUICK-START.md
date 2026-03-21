# 🚀 Quick Start Guide - GLS Vision 2047

Get your event platform running in 15 minutes!

---

## ⚡ Fastest Way to Get Started

### Step 1: Install Dependencies (2 minutes)

```bash
cd /Users/omdubey/Documents/GlobalSummit2026/server
npm install
```

### Step 2: Set Up Environment (3 minutes)

```bash
# Copy example env file
cp .env.example .env

# Edit .env file with your credentials
nano .env
```

**Minimum required configs:**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/gls2026
JWT_SECRET=your_secret_key_at_least_32_characters_long
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your_gmail_app_password
PAYU_MERCHANT_KEY=test_key
PAYU_MERCHANT_SALT=test_salt
```

### Step 3: Start Backend (1 minute)

```bash
npm start
```

Verify: http://localhost:5000/health

### Step 4: Start Frontend (1 minute)

```bash
# In new terminal, from project root
npx live-server
```

Open: http://localhost:8080

---

## 🎯 Using Test Mode (No Real Payments)

If you don't have payment gateway credentials yet:

**Update .env:**
```env
# Use test URLs
PAYU_BASE_URL=https://test.payu.in/_payment
EASEBUZZ_BASE_URL=https://testpay.easebuzz.in/pay

# Test credentials (these won't charge real money)
PAYU_MERCHANT_KEY=gtKFFx
PAYU_MERCHANT_SALT=eCwWELxi

EASEBUZZ_MERCHANT_KEY=test_key
EASEBUZZ_SALT=test_salt
```

**Test Cards:**
- Card: 5123456789012346
- CVV: 123
- Expiry: Any future date

---

## 📧 Quick Email Setup (Gmail)

1. **Enable 2FA**: https://myaccount.google.com/security
2. **Create App Password**: https://myaccount.google.com/apppasswords
3. **Update .env:**
   ```env
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=generated-app-password
   ```

---

## 💾 Quick MongoDB Setup

### Option A: Local MongoDB
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

### Option B: MongoDB Atlas (Free Cloud)
1. Sign up: https://www.mongodb.com/cloud/atlas
2. Create free cluster (M0)
3. Get connection string
4. Update .env:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/gls2026
   ```

---

## 👨‍💼 Create Admin User

```bash
cd server
node -e "
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI).then(async () => {
    const Admin = require('./models/Admin');
    const password = await bcrypt.hash('admin123', 10);
    await Admin.create({
        email: 'admin@gls2026.org',
        password: password,
        name: 'Admin User',
        role: 'admin'
    });
    console.log('✅ Admin created!');
    process.exit(0);
});
"
```

Login at: http://localhost:8080/admin/login.html
- Email: admin@gls2026.org
- Password: admin123

---

## 🧪 Quick Test

### Test Ticket Booking Flow:

1. Open http://localhost:8080/tickets.html
2. Select "Gold Pass"
3. Fill form with test data
4. Select "PayU" payment gateway
5. Submit form
6. You'll be redirected to PayU test page
7. Use test card: 5123456789012346
8. Complete payment
9. Check email for confirmation

### Test Admin Dashboard:

1. Open http://localhost:8080/admin/login.html
2. Login with admin credentials
3. View dashboard statistics
4. Check recent transactions
5. Export data

---

## 📂 File Structure Overview

```
Your project/
├── index.html              ← Main homepage
├── tickets.html            ← Ticket booking page
├── speakers.html           ← Speakers listing
├── admin/dashboard.html    ← Admin dashboard
├── server/server.js        ← Backend API
└── data/speakers.json      ← Dynamic content
```

---

## 🔧 Common Issues & Quick Fixes

### "Cannot connect to MongoDB"
```bash
# Check if MongoDB is running
brew services list  # macOS
sudo systemctl status mongodb  # Linux

# Or use MongoDB Atlas (cloud)
```

### "Port 5000 already in use"
```bash
# Change port in .env
PORT=5001

# Or kill process
lsof -ti:5000 | xargs kill -9  # macOS/Linux
```

### "Email not sending"
```bash
# Verify credentials
# Use Gmail app password, not regular password
# Check if 2FA is enabled
```

### "Payment not working"
```bash
# Use test mode first
# Check merchant keys in .env
# Verify callback URLs
```

---

## 📝 Next Steps

Once everything is running:

1. **Customize Content:**
   - Edit `data/speakers.json` for your speakers
   - Update `data/agenda.json` for your schedule
   - Replace images in `assets/` folder

2. **Configure Payment:**
   - Get real PayU credentials
   - Get real Easebuzz credentials
   - Update production URLs

3. **Deploy:**
   - Follow [DEPLOYMENT-GUIDE.md](DEPLOYMENT-GUIDE.md)
   - Set up production database
   - Configure SSL certificates

4. **Go Live:**
   - Test thoroughly
   - Enable monitoring
   - Launch! 🎉

---

## 🆘 Need Help?

**Read the docs:**
- [IMPLEMENTATION-GUIDE.md](IMPLEMENTATION-GUIDE.md) - Detailed setup
- [DEPLOYMENT-GUIDE.md](DEPLOYMENT-GUIDE.md) - Production deployment
- [PROJECT-SUMMARY.md](PROJECT-SUMMARY.md) - Complete overview

**Contact:**
- Email: dev@gls2026.org
- Phone: +91 9026181492

---

## ✅ Checklist

- [ ] Backend server running
- [ ] Frontend accessible
- [ ] MongoDB connected
- [ ] Email configured
- [ ] Admin user created
- [ ] Test payment successful
- [ ] Dashboard accessible

**All done? Congratulations! 🎉**

Your event platform is ready for customization and deployment!

---

**Quick Commands Reference:**

```bash
# Start backend
cd server && npm start

# Start frontend
npx live-server

# Create admin
node scripts/create-admin.js

# Check logs
tail -f server/logs/app.log

# Test API
curl http://localhost:5000/health
```

Good luck! 🚀
