<?php
$host = "localhost";
$dbname = "u364184455_paniit";
$username = "u364184455_pan_iit";
$password = "Pan_iit@1614";

try {
    $conn = new PDO("mysql:host=$host;charset=utf8", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Create database if not exists
    $conn->exec("CREATE DATABASE IF NOT EXISTS `$dbname`");
    $conn->exec("USE `$dbname`");
    
    // Create table
    $sql = "CREATE TABLE IF NOT EXISTS exhibition_bookings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        client_type VARCHAR(50),
        selected_size INT,
        name VARCHAR(100),
        company VARCHAR(100),
        designation VARCHAR(100),
        industry VARCHAR(100),
        email VARCHAR(100),
        phone VARCHAR(20),
        city_country VARCHAR(100),
        website VARCHAR(255),
        description TEXT,
        payable_amount DECIMAL(10,2),
        currency VARCHAR(10),
        status VARCHAR(20) DEFAULT 'pending',
        cashfree_order_id VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )";
    $conn->exec($sql);
    echo "Database and table created successfully!";
} catch(PDOException $e) {
    echo "Error: " . $e->getMessage();
}
?>
