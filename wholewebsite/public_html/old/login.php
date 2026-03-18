<?php
session_start();
header('Content-Type: application/json');

// === DB CONFIG (Hostinger) ===
$servername = "193.203.184.8";
$username   = "u364184455_Signup";
$password   = "Globaluser@2026";
$dbname     = "u364184455_User";


$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    echo json_encode(['success' => false, 'message' => 'Database connection failed']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);
$email = trim($data['email'] ?? '');
$passwordInput = $data['password'] ?? '';

if (!$email || !$passwordInput) {
    echo json_encode(['success' => false, 'message' => 'Email and password required']);
    exit;
}

// === Fetch user ===
$stmt = $conn->prepare("SELECT id, name, email, password FROM users WHERE email=? LIMIT 1");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(['success' => false, 'message' => 'User not found']);
    exit;
}

$user = $result->fetch_assoc();

if (!password_verify($passwordInput, $user['password'])) {
    echo json_encode(['success' => false, 'message' => 'Invalid password']);
    exit;
}

// === Login successful: store session ===
$_SESSION['user_id']    = $user['id'];
$_SESSION['user_name']  = $user['name'];
$_SESSION['user_email'] = $user['email'];

echo json_encode([
  'success' => true,
  'message' => 'Login successful',
  'user' => [
    'id' => $user['id'],
    'name' => $user['name'],
    'email' => $user['email']
  ]
]);
