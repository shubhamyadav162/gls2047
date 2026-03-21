<?php
if (!defined('ADMIN_LOGIN_ID')) {
    define('ADMIN_LOGIN_ID', getenv('ADMIN_LOGIN_ID') ?: 'admin');
}

if (!defined('ADMIN_LOGIN_PASSWORD')) {
    define('ADMIN_LOGIN_PASSWORD', getenv('ADMIN_LOGIN_PASSWORD') ?: 'GLS Vision 2047@2026');
}

if (!defined('ADMIN_DISPLAY_NAME')) {
    define('ADMIN_DISPLAY_NAME', getenv('ADMIN_DISPLAY_NAME') ?: 'GLS Vision 2047 Admin');
}
?>
