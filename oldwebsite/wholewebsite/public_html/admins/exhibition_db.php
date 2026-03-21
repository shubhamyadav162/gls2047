<?php
$exhServer = "localhost";
$exhUser = "root";
$exhPass = "Globaluser@2026";
$exhDb = "u364184455_paniit";

$exhConn = new mysqli($exhServer, $exhUser, $exhPass, $exhDb);
if ($exhConn->connect_error) {
    http_response_code(500);
    die("Exhibition DB connection failed: " . $exhConn->connect_error);
}

$exhConn->set_charset("utf8mb4");
?>
