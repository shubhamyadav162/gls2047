# PanIIT GLS 2026 Exhibition Booking - Essential Project Data

This document summarizes the current state of the project, including credentials, logic, and pending tasks to facilitate a smooth handover or new session start.

## 🛠 Project Structure
- **Frontend**: 
  - Main Homepage: `c:\Users\s\Desktop\panit\newwebsite\mainhomepage\`
  - Booking Page: `c:\Users\s\Desktop\panit\newwebsite\bookingpage\`
- **Backend (PHP)**: Roots of `c:\Users\s\Desktop\panit\` (local) and `/var/www/html/` (VPS).
- **Deployment Path**:
  - Root `index.html` & `assets/`: From `mainhomepage/dist/`.
  - `/exhibition/`: From `bookingpage/dist/`.
  - All PHP scripts: Located in root.

## 🔑 Credentials & Connectivity

### 💾 Database (Hostinger / MySQL)
- **Host**: `localhost`
- **Database**: `u364184455_paniit`
- **Frontend API User**: `root` / `Globaluser@2026`
- **Backend Handler User**: `u364184455_pan_iit` / `Pan_iit@1614`

### 💳 Payment Gateway (PayU Production)
- **Merchant Key**: `HSWnht`
- **Salt**: `cMXguKayBU9yfIfwB3MQfkm8pjDKZZlP`
- **VPS IP**: `46.28.44.62`
- **Success/Failure URLs**: `http://46.28.44.62/exhibition_payu_handler.php`

### 📧 Email (SMTP - Hostinger)
- **Host**: `smtp.hostinger.com` (Port 465, SSL/TLS)
- **Email**: `invitation@globalleadershipsummit2026.com`
- **Password**: `Avanger@16143777`

---

## 🏗 Business Logic & Pricing

### 1. Categories & Rates
| Category | Rate | Min Area | Payment Mode |
| :--- | :--- | :--- | :--- |
| **Corporate** | ₹20,000 / sq.m | 9 sq.m | 10% Booking Token |
| **PSU** | ₹18,000 / sq.m | 100 sq.m | 10% Booking Token |
| **Government**| ₹18,000 / sq.m | 100 sq.m | 10% Booking Token |
| **Academia** | ₹10,000 / sq.m | 12 sq.m | 10% Booking Token |
| **Country Rep**| $200 / sq.m | 50 sq.m | 10% Booking Token |
| **Startup** | Flat: ₹25k / ₹1L | 4/9 sq.m | 100% Full Payment |

### 2. Selection Sizes (Updated)
- **Default Sizes**: 3x3 (9), 3x4 (12), 3x6 (18), 6x6 (36).
- **Large Pavilion Sizes**: 100 SQM, 200 SQM, 300 SQM, 400 SQM, 500 SQM.
- **Custom Button**: Removed as requested. Direct SQM buttons added.

---

## 🏗 Rebuild & Sync
If you make changes in the `newwebsite` folders:
1. Rebuild them (`npm run build`).
2. Copy `mainhomepage/dist` contents to root.
3. Copy `bookingpage/dist` contents to `/exhibition/`.
4. Push to GitHub to update the VPS.

---

## ⏳ Pending & Issues
1. **Caching Problems**: The user reported that changes aren't visible. This is likely due to browser/server caching.
   - **Fix**: Use Incognito mode or `Ctrl + F5` to verify.
   - **Verification**: Ensure `exhibition.html` references the latest JS file (e.g., `index-Do1uW5Wj.js`).
2. **Backend Validation**: Ensure `exhibition_api.php` and `exhibition_payu_handler.php` logic for calculating the "Total Investment" from the 10% token is consistent with the new larger sizes.
3. **VAT/GST**: Clarify if 18% GST should be applies to the *total amount* or just the *token* in the confirmation email displays. Currently, it's 18% on the token (approx 1.18x of token = booking amount).
