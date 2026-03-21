<?php
header('Content-Type: application/json');
ini_set('display_errors', 1);
error_reporting(E_ALL);
session_start();

// DB
$servername = "193.203.184.8";
$username = "u364184455_Signup";
$password = "Globaluser@2026";
$dbname   = "u364184455_User";
$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
  echo json_encode(['success' => false, 'message' => 'Database connection failed']);
  exit;
}

$data = json_decode(file_get_contents('php://input'), true);
$name = trim($data['name'] ?? '');
$email = trim($data['email'] ?? '');
$phone = trim($data['phone'] ?? '');
$passRaw = $data['password'] ?? '';
$otp = trim($data['otp'] ?? '');

// validate otp from session
if (
  empty($_SESSION['email_otp']) ||
  empty($_SESSION['email_pending']) ||
  empty($_SESSION['email_otp_expires']) ||
  time() > $_SESSION['email_otp_expires'] ||
  $email !== $_SESSION['email_pending'] ||
  $otp !== strval($_SESSION['email_otp'])
) {
  echo json_encode(['success' => false, 'message' => 'Invalid or expired verification code']);
  exit;
}

// basic validation
if (!$name || !$email || !$phone || !$passRaw) {
  echo json_encode(['success' => false, 'message' => 'Please fill all required fields']);
  exit;
}

// hash password
$hashed = password_hash($passRaw, PASSWORD_DEFAULT);

// ensure table exists (optional safety)
$conn->query("CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  phone VARCHAR(15) NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

// check duplicates
$check = $conn->prepare("SELECT id FROM users WHERE email=? OR phone=? LIMIT 1");
$check->bind_param("ss", $email, $phone);
$check->execute();
$check->store_result();
if ($check->num_rows > 0) {
  echo json_encode(['success' => false, 'message' => 'Email or phone already registered']);
  exit;
}
$check->close();

// insert
$stmt = $conn->prepare("INSERT INTO users (name, email, phone, password) VALUES (?, ?, ?, ?)");
$stmt->bind_param("ssss", $name, $email, $phone, $hashed);
if ($stmt->execute()) {
  // clear OTP so it can’t be reused
  unset($_SESSION['email_otp'], $_SESSION['email_pending'], $_SESSION['email_otp_expires']);

  echo json_encode(['success' => true, 'message' => 'Signup successful!']);
} else {
  echo json_encode(['success' => false, 'message' => 'Error: ' . $stmt->error]);
}
$stmt->close();
$conn->close();
