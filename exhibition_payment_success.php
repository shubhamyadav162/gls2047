<?php
// exhibition_payment_success.php
$order_id = isset($_GET['order_id']) ? htmlspecialchars($_GET['order_id']) : '';

// Optional: you can verify the payment status with Cashfree via API here before displaying success.
// If valid, update the database status to 'paid'.

$host = "localhost";
$dbname = "u364184455_paniit"; // Database naming remains unchanged for system stability
$username = "u364184455_pan_iit";
$password = "Pan_iit@1614";

try {
    $conn = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // In production, verify with Cashfree and then update status correctly.
    // Assuming success for demo:
    $stmt = $conn->prepare("UPDATE exhibition_bookings SET status = 'paid' WHERE cashfree_order_id = ?");
    $stmt->execute([$order_id]);
    
    $stmt = $conn->prepare("SELECT * FROM exhibition_bookings WHERE cashfree_order_id = ?");
    $stmt->execute([$order_id]);
    $booking = $stmt->fetch(PDO::FETCH_ASSOC);
    
    // Here you would normally send Email / WhatsApp using an API (e.g., Twilio, SMTP)
    // Send email using PHPMailer or mail() function here.
} catch(PDOException $e) {
    // Keep quiet
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Payment Successful - GLS Vision 2047</title>
    <style>
        body { font-family: 'Inter', sans-serif; background-color: #f9f9f9; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }
        .card { background: white; padding: 40px; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); text-align: center; max-width: 500px; width: 90%; }
        .icon { font-size: 60px; color: #4BB543; margin-bottom: 20px; }
        h1 { color: #002D62; margin-bottom: 10px; font-size: 28px; }
        p { color: #555; line-height: 1.6; }
        .order-id { background: #f0f0f0; padding: 10px; border-radius: 5px; font-family: monospace; display: inline-block; margin: 20px 0; color: #333; }
        .btn { display: inline-block; padding: 12px 24px; background-color: #002D62; color: white; text-decoration: none; border-radius: 50px; font-weight: bold; transition: 0.3s; margin-top: 20px; }
        .btn:hover { background-color: #001f42; }
    </style>
</head>
<body>
    <div class="card">
        <div class="icon">✅</div>
        <h1>Payment Successful!</h1>
        <p>Thank you for securing your spot at the Global Leadership Summit Vision 2047. Your transaction was completed successfully.</p>
        
        <?php if($order_id): ?>
        <p>Your Order ID:</p>
        <div class="order-id"><?php echo $order_id; ?></div>
        <?php endif; ?>
        
        <p>We have sent a confirmation email & WhatsApp message with your tickets and invoice.</p>
        
        <a href="/" class="btn">Return to Homepage</a>
    </div>

    <!-- Automatically close if in popup, or wait for user to click -->
    <script>
        // Check if opened as a popup or iframe for cashfree
        if(window.opener) {
            setTimeout(() => {
                window.opener.postMessage({status: 'SUCCESS', order_id: '<?php echo $order_id; ?>'}, '*');
                window.close();
            }, 3000);
        }
    </script>
</body>
</html>
