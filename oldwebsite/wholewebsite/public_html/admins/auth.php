<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

if (empty($_SESSION['name'])) {
    $_SESSION = [];
    session_destroy();
    header("Location: login.php");
    exit();
}

session_write_close();
?>
