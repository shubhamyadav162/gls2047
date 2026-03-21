<?php
$servername = "localhost";
$username = "root";
$password = "Globaluser@2026";
$dbname = "u364184455_paniit";

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    http_response_code(500);
    die("Database connection failed");
}

$conn->set_charset("utf8mb4");
?>
