<?php
  // ============================================================
  // PAN IIT GLOBAL LEADERSHIP SUMMIT 2026
  // Live PayU Checkout + Auto Email Confirmation + QR Code Invoice
  // ============================================================

  // ---- ORGANIZATION INFO ----
  define('ORG_NAME', 'Global Leadership Summit Vision 2047');
  define('ORG_EMAIL', 'secretariat@glsvision2047.com');
  define('ORG_PHONE', '+91 7719981714');
  define('ORG_ADDRESS', 'India Office: Bharat Mandapam, Pragati Maidan, New Delhi, India 110001');

  // ---- PAYU LIVE CREDENTIALS ----
  $PAYU_KEY  = "HSWnht";  
  $PAYU_SALT = "cMXguKayBU9yfIfwB3MQfkm8pjDKZZlP"; 

  // ---- EARLY BIRD DEADLINE ----
  $EARLY_BIRD_END = strtotime("2025-12-24 23:59:59");

  // ---- PRODUCT PRICING ----
  $products = [
    "PremiumIIT Pass"     => 25000,
    "PremiumNonIIT Pass"  => 35000,
    "StandardIIT Pass"    => 10000,
    "StandardNonIIT Pass" => 15000
  ];

  // ============================================================
  // EMAIL FUNCTION
  // ============================================================
  function sendEmail($to, $subject, $messageHTML) {
    $headers  = "MIME-Version: 1.0\r\n";
    $headers .= "Content-type:text/html;charset=UTF-8\r\n";
    $headers .= "From: " . ORG_NAME . " <" . ORG_EMAIL . ">\r\n";
    $headers .= "Reply-To: " . ORG_EMAIL . "\r\n";
    @mail($to, $subject, $messageHTML, $headers);
  }

  // ============================================================
  // EMAIL TEMPLATE WITH QR CODE
  // ============================================================
  function paymentEmailTemplate($name, $service, $amount, $txnId, $email, $company, $designation, $iit_alumni, $comments, $date, $discountApplied) {
      $confirmation = "GLS" . strtoupper(substr(md5($txnId), 0, 8));
      $qrCodeURL = "https://api.qrserver.com/v1/create-qr-code/?data=" . urlencode("Confirmation: $confirmation | Name: $name | Event: GLS Vision 2047") . "&size=180x180";
      $discountText = $discountApplied ? "<p style='color:green;'><b>🎉 Early Bird Offer Applied – 50% Off</b></p>" : "";    
      return "<html>
                <body style='font-family:Segoe UI, Arial; background:#f4f7fb; margin:0; padding:30px;'>
                  <div style='max-width:700px; margin:auto; background:#fff; border-radius:10px; overflow:hidden; box-shadow:0 3px 15px rgba(0,0,0,0.1);'>
                    <div style='background:#003399; color:#fff; padding:25px; text-align:center;'>
                      <h2 style='margin:0;'>Global Leadership Summit Vision 2047</h2>
                      <p style='margin:0;font-size:14px;'>Official Registration Confirmation</p>
                    </div>
                    <div style='padding:30px;'>
                      <p>Dear <b>$name</b>,</p>
                      <p>We’re excited to confirm your <b>$service</b> for the <b>Global Leadership Summit Vision 2047</b>,
                      taking place from <b>January 24–25, 2026</b> at <b>IIT Bombay, Mumbai</b>.</p>
                      $discountText
                      <table width='100%' cellspacing='0' cellpadding='8' style='border-collapse:collapse;margin:15px 0;'>
                        <tr style='background:#f1f5ff;'><td><b>Confirmation Number:</b></td><td>$confirmation</td></tr>
                        <tr><td><b>Pass Type:</b></td><td>$service</td></tr>
                        <tr><td><b>Amount Paid:</b></td><td><b style='color:green;'>₹$amount</b></td></tr>
                        <tr><td><b>Transaction ID:</b></td><td>$txnId</td></tr>
                        <tr><td><b>Date:</b></td><td>$date</td></tr>
                      </table>
                      <div style='text-align:center; margin:20px 0;'>
                        <p style='font-weight:600;'>Your Entry QR Code:</p>
                        <img src='$qrCodeURL' alt='QR Code' style='border:4px solid #003399; border-radius:10px;'>
                        <p style='font-size:12px; color:#777;'>Show this QR code at the venue for quick check-in.</p>
                      </div>
                      <h4>Participant Details</h4>
                      <p>
                        <b>Name:</b> $name<br>
                        <b>Email:</b> $email<br>
                        <b>Company:</b> $company<br>
                        <b>Designation:</b> $designation<br>
                        <b>IIT Alumni:</b> $iit_alumni<br>
                        <b>Comments:</b> $comments
                      </p>
                      <hr style='margin:25px 0;'>
                      <p><b>Important Information:</b></p>
                      <ul style='line-height:1.6;'>
                        <li>Entry Gate: <b>No. 20</b></li>
                        <li>Documents Required: Govt. Photo ID + This Confirmation Email</li>
                        <li>Badge Pickup: Registration Desk – P1 Level, Gate No. 20</li>
                        <li>Luggage Counter: Available on first-come basis</li>
                      </ul>
                      <p style='font-size:13px; color:#555;'>For any queries, please contact: <b>secretariat@glsvision2047.com</b></p>
                      <hr style='margin:25px 0;'>
                      <p>We look forward to welcoming you to an unforgettable leadership experience.</p>
                      <p>Warm regards,<br><b>Team Global Leadership Summit Vision 2047</b></p>
                    </div>
                    <div style='background:#f8f9fa; padding:15px; text-align:center; font-size:13px; color:#666;'>
                      <p style='margin:0;'>©️ " . date('Y') . " Global Leadership Summit Vision 2047 | " . ORG_ADDRESS . "</p>
                      <p style='margin-top:5px;'>Disclaimer: This is an automated email. Replies to this email are not monitored.</p>
                    </div>
                  </div>
                </body>
              </html>";
  }

  // ============================================================
  // PAYU PAYMENT INITIALIZATION
  // ============================================================
  if (isset($_POST['pay_payu'])) {
      global $products, $EARLY_BIRD_END;

      $firstname   = trim($_POST['firstname']);
      $email       = trim($_POST['email']);
      $phone       = trim($_POST['phone']);
      $company     = trim($_POST['company']);
      $designation = trim($_POST['designation']);
      $iit_alumni  = trim($_POST['iit_alumni']);
      $comments    = trim($_POST['comments']);
      $productinfo = trim($_POST['productinfo']);

      // Validate email format
      if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
          echo "<h3 style='color:red;text-align:center;'>Invalid email format. Please enter a valid email like user@domain.com</h3>";
          exit;
      }
      // Fetch base price
      $amount = isset($products[$productinfo]) ? $products[$productinfo] : 0;
      if ($amount <= 0) {
          echo "<h3 style='color:red;text-align:center;'>Invalid package selected.</h3>";
          exit;
      }
      // Apply Early Bird Discount
      $discountApplied = false;
      if (time() < $EARLY_BIRD_END) {
          $amount = $amount * 1;
          $discountApplied = true;
      }
      $txnid = "PU" . time() . rand(100,999);
      $params = [
        'status'  => 'success',
        'gateway' => 'payu',
        'txn'     => $txnid,
        'name'    => urlencode($firstname),
        'email'   => urlencode($email),
        'service' => urlencode($productinfo),
        'amount'  => $amount,
        'company' => urlencode($company),
        'designation' => urlencode($designation),
        'iit_alumni'  => urlencode($iit_alumni),
        'comments'    => urlencode($comments),
        'discount'    => $discountApplied
      ];

      $surl = "https://glsvision2047.com/payment-success.html?" . http_build_query($params);
      $furl = "https://glsvision2047.com/payment-failure.html?status=failed&gateway=payu";

      // PayU Hash
      $hash_string = $PAYU_KEY.'|'.$txnid.'|'.$amount.'|'.$productinfo.'|'.$firstname.'|'.$email.'|||||||||||'.$PAYU_SALT;
      $hash = strtolower(hash('sha512', $hash_string));

      echo "<form id='payuForm' method='POST' action='https://secure.payu.in/_payment'>
              <input type='hidden' name='key' value='$PAYU_KEY'>
              <input type='hidden' name='txnid' value='$txnid'>
              <input type='hidden' name='amount' value='$amount'>
              <input type='hidden' name='productinfo' value='$productinfo'>
              <input type='hidden' name='firstname' value='$firstname'>
              <input type='hidden' name='email' value='$email'>
              <input type='hidden' name='phone' value='$phone'>
              <input type='hidden' name='surl' value='$surl'>
              <input type='hidden' name='furl' value='$furl'>
              <input type='hidden' name='hash' value='$hash'>
            </form>
            <script>document.getElementById('payuForm').submit();</script>";
      exit;
  }

  // ============================================================
  // PAYMENT STATUS HANDLER
  // ============================================================
  if (isset($_GET['status'])) {
    $status = $_GET['status'];
    if ($status === 'success') {
      $txn = $_GET['txn'];
      $name = $_GET['name'];
      $email = $_GET['email'];
      $service = $_GET['service'];
      $amount = $_GET['amount'];
      $company = $_GET['company'];
      $designation = $_GET['designation'];
      $iit_alumni = $_GET['iit_alumni'];
      $comments = $_GET['comments'];
      $discountApplied = $_GET['discount'] ?? false;

      $date = date("d M Y, h:i A");
      $emailBody = paymentEmailTemplate($name, $service, $amount, $txn, $email, $company, $designation, $iit_alumni, $comments, $date, $discountApplied);
      sendEmail($email, "✅ Registration Confirmation - Global Leadership Summit Vision 2047", $emailBody);
      header("Location: success.html");
      exit;
    } else {
      header("Location: failed.html");
      exit;
    }
  }
?>
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>Checkout - Global Leadership Summit Vision 2047</title>
    <style>
      body {
        font-family: 'Poppins', sans-serif;
        background: #eef3fc;
        color: #333;
        padding: 40px 20px;
      }
      .checkout-box {
        background: #fff;
        max-width: 600px;
        margin: auto;
        padding: 40px 45px;
        border-radius: 14px;
        box-shadow: 0 5px 25px rgba(0,0,0,0.1);
        border: 1px solid #e8ecf5;
      }
      h2 {
        text-align: center;
        color: #003399;
        margin-bottom: 25px;
        font-weight: 700;
      }
      label {
        display: block;
        margin-top: 15px;
        font-weight: 600;
        color: #555;
      }
      input[type=text],
      input[type=email],
      textarea,
      select {
        width: 100%;
        padding: 10px;
        border: 1px solid #ccc;
        border-radius: 8px;
        font-size: 15px;
        transition: 0.3s;
      }
      input:focus,
      textarea:focus,
      select:focus {
        border-color: #003399;
        box-shadow: 0 0 5px rgba(0,51,153,0.2);
        outline: none;
      }
      .btn {
        margin-top: 25px;
        width: 100%;
        padding: 12px;
        border: none;
        border-radius: 8px;
        color: #fff;
        font-size: 16px;
        cursor: pointer;
        transition: 0.3s;
      }
      .payu-btn {
        background: linear-gradient(90deg, #003399, #0044cc);
      }
      .payu-btn:hover {
        background: #002266;
        box-shadow: 0 6px 20px rgba(0,51,153,0.25);
      }
      .price-box {
        background: #f8faff;
        padding: 18px 20px;
        border-radius: 10px;
        margin-top: 20px;
        font-weight: 600;
        color: #003399;
        text-align: center;
        box-shadow: 0 3px 10px rgba(0,0,0,0.05);
      }
      .price-box .original-price {
        text-decoration: line-through;
        color: #888;
        font-size: 14px;
        display: block;
      }
      .price-box .discounted-price {
        color: #003399;
        font-size: 22px;
        font-weight: 700;
        display: block;
      }
      .price-box .early-bird-label {
        color: #08914f;
        font-size: 14px;
        font-weight: 600;
        display: block;
        margin-top: 5px;
      }
      .pass-name {
        text-align: center;
        font-size: 18px;
        font-weight: 600;
        color: #003399;
        margin-top: 10px;
      }
      .back-btn {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        background: #f1f5f9;
        color: #0b63d6;
        border: none;
        padding: 10px 16px;
        border-radius: 10px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.25s ease;
        font-size: 14px;
      }
      .back-btn:hover {
        background: #e0ecff;
        transform: translateY(-2px);
      }
      .back-btn svg {
        width: 18px;
        height: 18px;
        stroke: currentColor;
      }
      @media (max-width: 720px) {
        .back-btn {
          width: 100%;
          justify-content: center;
        }
      }
    </style>
    <script>
      // Function to display correct price and pass
      document.addEventListener("DOMContentLoaded", () => {
        const urlParams = new URLSearchParams(window.location.search);
        const pass = urlParams.get("product") || "Unknown Pass";

        const prices = {
          "PremiumIIT Pass"   : 25000,
          "PremiumNonIIT Pass": 35000,
          "StandardIIT Pass"  : 2500,
          "StandardNonIIT Pass": 7500
        };

        const earlyBirdEnd = new Date("2025-12-24 23:59:59");
        const now = new Date();
        const base = prices[pass] || 0;
        const discounted = now < earlyBirdEnd;
        const final = discounted ? base * 1 : base;

        // Update display
        document.getElementById("selectedPass").innerText = pass;
        const priceBox = document.getElementById("priceBox");

        if (discounted) {
          priceBox.innerHTML = `
            <span class="discounted-price">₹${final.toLocaleString()}</span>
          `;
          
            // <span class="original-price">₹${base.toLocaleString()}</span>
          // <span class="early-bird-label">🎉 Early Bird 50% OFF</span>
        } else {
          priceBox.innerHTML = `<span class="discounted-price">₹${base.toLocaleString()}</span>`;
        }

        // Set hidden product input value for PHP
        document.getElementById("productinfo").value = pass;
      });
      // 🔙 Go back to Home Page
      function goHome() {
        window.location.href = "index.html"; // change this to your actual homepage path
      }
    </script>
  </head>
  <body>
    <!-- 🔙 Back to Home Button -->
    <button class="back-btn" onclick="goHome()">
      <svg fill="none" stroke-width="2" viewBox="0 0 24 24">
        <path d="M15 19l-7-7 7-7" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" />
      </svg> Back to Home
    </button>
    <div class="checkout-box">
      <h2>Secured Checkout | Global Leadership Summit Vision 2047</h2>
      <div class="pass-name">
        Selected Package: <span id="selectedPass">Loading...</span>
      </div>
      <form method="POST">
        <input type="hidden" name="productinfo" id="productinfo" value="">

        <label>Full Name</label>
        <input type="text" name="firstname" required placeholder="Enter your full name">

        <label>Mobile Number</label>
        <input type="text" name="phone" required pattern="\d{10}" maxlength="10" title="Enter 10-digit mobile number" placeholder="e.g. 9999999999">

        <label>Official Email</label>
        <input type="email" name="email" required placeholder="Enter your work or personal email">

        <label>Company / Organization Name</label>
        <input type="text" name="company" placeholder="Enter your company or institution name">

        <label>Your Designation</label>
        <input type="text" name="designation" placeholder="Enter your designation or role">

        <label>Are You IIT Alumni?</label>
        <select name="iit_alumni" required>
          <option value="">-- Select Option --</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>

        <label>Comments / Notes</label>
        <textarea name="comments" rows="3" placeholder="Any special requests or notes..."></textarea>

        <div class="price-box" id="priceBox">Loading price...</div>

        <button type="submit" name="pay_payu" class="btn payu-btn">Pay Now</button>
      </form>
    </div>
  </body>
</html>
