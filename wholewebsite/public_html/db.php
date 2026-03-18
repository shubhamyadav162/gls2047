<?php
$host = "localhost";        
$dbname = "u364184455_paniit";    
$username = "root";   
$password = "Globaluser@2026";  // your MySQL password

try {
    $conn = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    die("Database connection failed: " . $e->getMessage());
}
?>
