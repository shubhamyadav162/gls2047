<?php
header('Content-Type: application/json');
ini_set('display_errors', 1);
error_reporting(E_ALL);
session_start();

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require __DIR__ . '/phpmailer/src/Exception.php';
require __DIR__ . '/phpmailer/src/PHPMailer.php';
require __DIR__ . '/phpmailer/src/SMTP.php';

$input = json_decode(file_get_contents('php://input'), true);
$email = $input['email'] ?? '';

if (!$email) {
  echo json_encode(['success' => false, 'message' => 'Email is required']);
  exit;
}

// Generate 6-digit OTP and store it for 10 minutes
$otp = random_int(100000, 999999);
$_SESSION['email_otp'] = $otp;
$_SESSION['email_otp_expires'] = time() + 600; // 10 minutes
$_SESSION['email_pending'] = $email;

$mail = new PHPMailer(true);

try {
  // SMTP Configuration (Hostinger)
  $mail->isSMTP();
  $mail->Host = 'smtp.hostinger.com';
  $mail->SMTPAuth = true;
  $mail->Username = 'noreply@glsvision2047.com';
  $mail->Password = 'Abcde@@1234'; // change this
  $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS; // or ENCRYPTION_SMTPS if using port 465
  $mail->Port = 587;

  // Email details
  $mail->setFrom('noreply@glsvision2047.com', 'Global Leadership Summit Vision 2047');
  $mail->addAddress($email);
  $mail->isHTML(true);
  $mail->Subject = 'Your GLS Vision 2047 Email Verification Code';
  $mail->Body = "
    <div style='font-family:Arial,sans-serif'>
      <h2>GLS Vision 2047 Verification</h2>
      <p>Your verification code is:</p>
      <div style='font-size:28px;font-weight:700;letter-spacing:3px;'>$otp</div>
      <p>This code expires in 10 minutes.</p>
      <hr>
      <p>If you didn’t request this, please ignore this email.</p>
    </div>
  ";

  $mail->send();
  echo json_encode(['success' => true, 'message' => 'Verification code sent to your email.']);
} catch (Exception $e) {
  echo json_encode(['success' => false, 'message' => 'Mailer error: ' . $mail->ErrorInfo]);
}
?>
