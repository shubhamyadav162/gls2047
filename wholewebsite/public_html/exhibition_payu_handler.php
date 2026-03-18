<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require __DIR__ . '/phpmailer/src/Exception.php';
require __DIR__ . '/phpmailer/src/PHPMailer.php';
require __DIR__ . '/phpmailer/src/SMTP.php';

function calculateBookingAmounts($clientType, $selectedSize) {
    $currency = ($clientType === "country") ? "$" : "₹";

    if ($clientType === "startup") {
        $total = 25000;
        $bookingToken = 9000;
        return [
            "total" => $total,
            "bookingToken" => $bookingToken,
            "gst" => 0,
            "payable" => $bookingToken,
            "currency" => $currency,
            "isFull" => false,
            "gstIncluded" => true
        ];
    }

    $rates = [
        "corporate" => 20000,
        "psu" => 18000,
        "government" => 18000,
        "academia" => 10000,
        "country" => 200
    ];

    if (!isset($rates[$clientType])) {
        return null;
    }

    $total = $selectedSize * $rates[$clientType];
    $bookingToken = round($total * 0.10, 2);
    $gst = round($bookingToken * 0.18, 2);
    $payable = round($bookingToken + $gst, 2);

    return [
        "total" => $total,
        "bookingToken" => $bookingToken,
        "gst" => $gst,
        "payable" => $payable,
        "currency" => $currency,
        "isFull" => false,
        "gstIncluded" => false
    ];
}

function getPassAllocation($clientType, $selectedSize) {
    $map = [
        "corporate" => [
            9 => ["vip" => 2, "delegate" => 4, "exhibitor" => 3],
            12 => ["vip" => 2, "delegate" => 4, "exhibitor" => 3],
            18 => ["vip" => 3, "delegate" => 6, "exhibitor" => 4],
            36 => ["vip" => 4, "delegate" => 8, "exhibitor" => 6],
            100 => ["vip" => 6, "delegate" => 12, "exhibitor" => 12],
            200 => ["vip" => 10, "delegate" => 20, "exhibitor" => 20],
            300 => ["vip" => 14, "delegate" => 28, "exhibitor" => 28],
            400 => ["vip" => 18, "delegate" => 36, "exhibitor" => 36],
            500 => ["vip" => 22, "delegate" => 44, "exhibitor" => 44]
        ],
        "psu" => [
            100 => ["vip" => 8, "delegate" => 16, "exhibitor" => 16],
            200 => ["vip" => 12, "delegate" => 24, "exhibitor" => 24],
            300 => ["vip" => 16, "delegate" => 32, "exhibitor" => 32],
            400 => ["vip" => 20, "delegate" => 40, "exhibitor" => 40],
            500 => ["vip" => 24, "delegate" => 48, "exhibitor" => 48]
        ],
        "government" => [
            100 => ["vip" => 8, "delegate" => 16, "exhibitor" => 16],
            200 => ["vip" => 12, "delegate" => 24, "exhibitor" => 24],
            300 => ["vip" => 16, "delegate" => 32, "exhibitor" => 32],
            400 => ["vip" => 20, "delegate" => 40, "exhibitor" => 40],
            500 => ["vip" => 24, "delegate" => 48, "exhibitor" => 48]
        ],
        "academia" => [
            12 => ["vip" => 1, "delegate" => 2, "exhibitor" => 2],
            36 => ["vip" => 2, "delegate" => 5, "exhibitor" => 4],
            100 => ["vip" => 4, "delegate" => 8, "exhibitor" => 8],
            200 => ["vip" => 8, "delegate" => 16, "exhibitor" => 16],
            300 => ["vip" => 12, "delegate" => 24, "exhibitor" => 24],
            400 => ["vip" => 16, "delegate" => 32, "exhibitor" => 32],
            500 => ["vip" => 20, "delegate" => 40, "exhibitor" => 40]
        ],
        "startup" => [
            9 => ["vip" => 2, "delegate" => 4, "exhibitor" => 4]
        ],
        "country" => [
            50 => ["vip" => 4, "delegate" => 8, "exhibitor" => 8],
            100 => ["vip" => 6, "delegate" => 12, "exhibitor" => 12],
            200 => ["vip" => 10, "delegate" => 20, "exhibitor" => 20],
            300 => ["vip" => 14, "delegate" => 28, "exhibitor" => 28],
            400 => ["vip" => 18, "delegate" => 36, "exhibitor" => 36],
            500 => ["vip" => 22, "delegate" => 44, "exhibitor" => 44]
        ]
    ];

    if (!isset($map[$clientType]) || !isset($map[$clientType][$selectedSize])) {
        return null;
    }
    return $map[$clientType][$selectedSize];
}

function formatPasses($allocation) {
    if (!$allocation) {
        return "";
    }
    $parts = [];
    if (!empty($allocation["vip"])) {
        $parts[] = $allocation["vip"] . " VIP";
    }
    if (!empty($allocation["delegate"])) {
        $parts[] = $allocation["delegate"] . " Delegate";
    }
    if (!empty($allocation["exhibitor"])) {
        $parts[] = $allocation["exhibitor"] . " Exhibitor";
    }
    return implode(" + ", $parts);
}

function formatClientTypeLabel($clientType) {
    $labels = [
        "corporate" => "Corporate",
        "startup" => "Startup",
        "psu" => "PSU",
        "government" => "Government",
        "academia" => "Academia",
        "country" => "Country Representation"
    ];
    return isset($labels[$clientType]) ? $labels[$clientType] : ucfirst($clientType);
}

function dbConnect() {
    $candidates = [
        ["host" => "localhost", "db" => "u364184455_paniit", "user" => "root", "pass" => "Globaluser@2026"],
        ["host" => "localhost", "db" => "u364184455_paniit", "user" => "u364184455_pan_iit", "pass" => "Pan_iit@1614"]
    ];

    foreach ($candidates as $cfg) {
        try {
            $pdo = new PDO(
                "mysql:host={$cfg['host']};dbname={$cfg['db']};charset=utf8mb4",
                $cfg['user'],
                $cfg['pass']
            );
            $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            return $pdo;
        } catch (PDOException $e) {
        }
    }

    return null;
}

function logPaymentAudit($conn, $bookingId, $txnid, $eventType, $eventStatus, $message, $payload = null, $payuStatus = null) {
    if (!$conn) {
        return;
    }

    try {
        $ip = isset($_SERVER['REMOTE_ADDR']) ? $_SERVER['REMOTE_ADDR'] : '';
        $ua = isset($_SERVER['HTTP_USER_AGENT']) ? substr($_SERVER['HTTP_USER_AGENT'], 0, 255) : '';
        $payloadJson = $payload ? json_encode($payload, JSON_UNESCAPED_UNICODE) : null;

        $stmt = $conn->prepare("INSERT INTO exhibition_payment_audit
            (booking_id, txnid, event_type, event_status, payu_status, message, payload_json, ip_address, user_agent)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");

        $stmt->execute([
            $bookingId,
            $txnid,
            $eventType,
            $eventStatus,
            $payuStatus,
            $message,
            $payloadJson,
            $ip,
            $ua
        ]);
    } catch (Exception $e) {
    }
}

function verifyPayUTransaction($merchantKey, $salt, $txnid) {
    $command = "verify_payment";
    $hash = strtolower(hash("sha512", $merchantKey . "|" . $command . "|" . $txnid . "|" . $salt));
    $postFields = http_build_query([
        "key" => $merchantKey,
        "command" => $command,
        "var1" => $txnid,
        "hash" => $hash
    ]);

    $endpoints = [
        "https://info.payu.in/merchant/postservice?form=2",
        "https://info.payu.in/merchant/postservice.php?form=2"
    ];

    foreach ($endpoints as $url) {
        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $postFields);
        curl_setopt($ch, CURLOPT_TIMEOUT, 15);
        curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 8);
        $response = curl_exec($ch);
        $curlErr = curl_error($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($response === false || $response === "" || $httpCode < 200 || $httpCode >= 500) {
            continue;
        }

        $decoded = json_decode($response, true);
        if (!is_array($decoded)) {
            continue;
        }

        $details = null;
        if (isset($decoded["transaction_details"]) && is_array($decoded["transaction_details"])) {
            if (isset($decoded["transaction_details"][$txnid])) {
                $details = $decoded["transaction_details"][$txnid];
            } elseif (count($decoded["transaction_details"]) > 0) {
                $details = reset($decoded["transaction_details"]);
            }
        }

        $payuStatus = strtolower((string)($details["status"] ?? ""));
        $success = in_array($payuStatus, ["success", "captured", "paid"], true);

        return [
            "checked" => true,
            "success" => $success,
            "payu_status" => $payuStatus,
            "mihpayid" => isset($details["mihpayid"]) ? (string)$details["mihpayid"] : "",
            "response" => $decoded,
            "http_code" => $httpCode,
            "error" => ""
        ];
    }

    return [
        "checked" => false,
        "success" => false,
        "payu_status" => "",
        "mihpayid" => "",
        "response" => null,
        "http_code" => 0,
        "error" => "PayU verification service unavailable"
    ];
}

function sendBookingEmail($booking, $txnid, $calc) {
    $clientType = strtolower($booking['client_type']);
    $selectedSize = intval($booking['selected_size']);
    $currency = $calc['currency'];
    $paidAmt = number_format(floatval($booking['payable_amount']), 2);
    $totalAmt = number_format($calc['total'], 2);
    $tokenAmt = number_format($calc['bookingToken'], 2);
    $gstAmt = number_format($calc['gst'], 2);
    $balanceAmt = number_format(($calc['isFull'] ? 0 : ($calc['total'] - $calc['bookingToken'])), 2);

    $passLabel = formatPasses(getPassAllocation($clientType, $selectedSize));
    $passesRow = $passLabel !== ""
        ? "<tr><td style='padding: 8px 0;'><strong>Included Passes:</strong></td><td style='text-align: right;'>" . htmlspecialchars($passLabel) . "</td></tr>"
        : "";

    if ($clientType === 'startup') {
        $paymentBreakupRows = "
            <tr><td style='padding: 8px 0;'><strong>Total Package (GST Included):</strong></td><td style='text-align: right;'>" . $currency . $totalAmt . "</td></tr>
            <tr><td style='padding: 8px 0;'><strong>Booking Amount Paid:</strong></td><td style='text-align: right;'>" . $currency . $tokenAmt . "</td></tr>
            <tr><td style='padding: 8px 0; color:#dc2626;'><strong>Balance:</strong></td><td style='text-align: right; color:#9ca3af;'><strong>" . $currency . $balanceAmt . "</strong></td></tr>
        ";
        $paymentNote = "Startup package is GST-inclusive. Your booking amount has been received; remaining balance is payable before final stall allocation.";
    } elseif ($calc['isFull']) {
        $paymentBreakupRows = "
            <tr><td style='padding: 8px 0;'><strong>Package Amount (100%):</strong></td><td style='text-align: right;'>" . $currency . $totalAmt . "</td></tr>
            <tr><td style='padding: 8px 0;'><strong>GST:</strong></td><td style='text-align: right;'>" . $currency . "0.00</td></tr>
        ";
        $paymentNote = "Full package payment has been received.";
    } else {
        $paymentBreakupRows = "
            <tr><td style='padding: 8px 0;'><strong>Total Stall Investment:</strong></td><td style='text-align: right;'>" . $currency . $totalAmt . "</td></tr>
            <tr><td style='padding: 8px 0;'><strong>Token Base (10%):</strong></td><td style='text-align: right;'>" . $currency . $tokenAmt . "</td></tr>
            <tr><td style='padding: 8px 0;'><strong>GST on Token (18%):</strong></td><td style='text-align: right;'>" . $currency . $gstAmt . "</td></tr>
            <tr><td style='padding: 8px 0; color:#dc2626;'><strong>Balance (90%):</strong></td><td style='text-align: right; color:#9ca3af;'><strong>" . $currency . $balanceAmt . "</strong></td></tr>
        ";
        $paymentNote = "Token + GST has been received. Remaining balance is payable before final stall allocation.";
    }

    $mail = new PHPMailer(true);
    $mail->isSMTP();
    $mail->Host = 'smtp.hostinger.com';
    $mail->SMTPAuth = true;
    $mail->Username = 'invitation@glsvision2047.com';
    $mail->Password = 'Avanger@16143777';
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
    $mail->Port = 465;

    $mail->setFrom('invitation@glsvision2047.com', 'GLS Vision 2047');
    $mail->addAddress($booking['email'], $booking['name']);
    $mail->addBCC('invitation@glsvision2047.com');

    $mail->isHTML(true);
    $mail->Subject = 'Booking Confirmation: GLS Vision 2047 Exhibition Space';
    $mail->Body = "
        <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e1e1e1; border-radius: 16px; overflow: hidden; background-color: #ffffff;'>
            <div style='background-color: #002D62; padding: 40px 20px; text-align: center; border-bottom: 4px solid #D4AF37;'>
                <h2 style='color: #D4AF37; margin: 0; font-size: 24px; text-transform: uppercase; letter-spacing: 2px;'>Booking Confirmed</h2>
                <p style='color: #ffffff; margin: 10px 0 0 0; font-size: 14px; opacity: 0.8;'>Global Leadership Summit Vision 2047 Exhibition</p>
            </div>

            <div style='padding: 30px;'>
                <p style='font-size: 16px; color: #333;'>Dear <strong>" . htmlspecialchars($booking['name']) . "</strong>,</p>
                <p style='font-size: 14px; color: #555; line-height: 1.6;'>
                    Thank you for booking your exhibition space for the <strong>Global Leadership Summit Vision 2047</strong>.
                    We have successfully received your payment.
                </p>

                <div style='background-color: #f8faff; border: 1px solid #e0e8f5; border-radius: 12px; padding: 25px; margin: 25px 0;'>
                    <h3 style='margin: 0 0 15px 0; font-size: 16px; color: #002D62; border-bottom: 1px solid #e0e8f5; padding-bottom: 10px;'>Transaction Summary</h3>
                    <table style='width: 100%; font-size: 14px; color: #444;'>
                        <tr><td style='padding: 8px 0;'><strong>Transaction ID:</strong></td><td style='text-align: right; font-family: monospace;'>" . htmlspecialchars($txnid) . "</td></tr>
                        <tr><td style='padding: 8px 0;'><strong>Company:</strong></td><td style='text-align: right;'>" . htmlspecialchars($booking['company']) . "</td></tr>
                        <tr><td style='padding: 8px 0;'><strong>Category:</strong></td><td style='text-align: right;'>" . formatClientTypeLabel($clientType) . "</td></tr>
                        <tr><td style='padding: 8px 0;'><strong>Space Size:</strong></td><td style='text-align: right;'>" . $selectedSize . " SQM</td></tr>
                        " . $paymentBreakupRows . "
                        " . $passesRow . "
                        <tr style='font-size: 18px; color: #002D62;'><td style='padding: 15px 0 0 0; border-top: 1px solid #e0e8f5;'><strong>Amount Paid:</strong></td><td style='padding: 15px 0 0 0; text-align: right; border-top: 1px solid #e0e8f5;'><strong>" . $currency . $paidAmt . "</strong></td></tr>
                    </table>
                </div>

                <p style='font-size: 14px; color: #555; line-height: 1.6;'>" . $paymentNote . "</p>

                <div style='margin-top: 30px; text-align: center;'>
                    <a href='https://glsvision2047.com/exhibition/' style='background-color: #002D62; color: #ffffff; padding: 12px 30px; text-decoration: none; border-radius: 30px; font-weight: bold; font-size: 14px; display: inline-block;'>Visit Portal</a>
                </div>
            </div>

            <div style='background-color: #f4f4f4; padding: 20px; text-align: center; border-top: 1px solid #e1e1e1;'>
                <p style='margin: 0; font-size: 12px; color: #888;'>
                    <strong>Venue:</strong> Bharat Mandapam / Yashobhoomi, New Delhi, India<br>
                    <strong>Contact:</strong> invitation@glsvision2047.com
                </p>
                <p style='margin: 10px 0 0 0; font-size: 11px; color: #bbb;'>© 2026 GLS Vision 2047 Alumni India. This is an automated receipt.</p>
            </div>
        </div>
    ";

    $mail->send();
}

function sendAdminAlertEmail($booking, $txnid, $calc, $verifyStatusLabel) {
    $currency = $calc['currency'];
    $clientType = formatClientTypeLabel(strtolower($booking['client_type']));
    $selectedSize = intval($booking['selected_size']);
    $bookingPaid = number_format(floatval($booking['payable_amount']), 2);
    $packageTotal = number_format(floatval($calc['total']), 2);
    $balance = number_format(max(floatval($calc['total']) - floatval($booking['payable_amount']), 0), 2);

    $mail = new PHPMailer(true);
    $mail->isSMTP();
    $mail->Host = 'smtp.hostinger.com';
    $mail->SMTPAuth = true;
    $mail->Username = 'invitation@glsvision2047.com';
    $mail->Password = 'Avanger@16143777';
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
    $mail->Port = 465;

    $mail->setFrom('invitation@glsvision2047.com', 'GLS Vision 2047 Alerts');
    $ownerEmail = getenv('OWNER_ALERT_EMAIL') ?: 'shubham.1614@gmail.com';
    $mail->addAddress($ownerEmail, 'Owner');
    $mail->isHTML(true);
    $mail->Subject = 'New Paid Booking Alert - ' . $txnid;
    $mail->Body = "
        <div style='font-family: Arial, sans-serif; max-width: 680px; margin: 0 auto; border:1px solid #e5e7eb; border-radius:14px; overflow:hidden;'>
            <div style='background:#002D62; padding:18px; color:#fff;'>
                <h2 style='margin:0; color:#D4AF37;'>Payment Alert</h2>
                <p style='margin:8px 0 0 0;'>A new exhibition payment has been marked successful.</p>
            </div>
            <div style='padding:18px;'>
                <table style='width:100%; border-collapse:collapse; font-size:14px;'>
                    <tr><td style='padding:8px 0;'><strong>Transaction ID</strong></td><td style='text-align:right; font-family:monospace;'>" . htmlspecialchars($txnid) . "</td></tr>
                    <tr><td style='padding:8px 0;'><strong>Verification</strong></td><td style='text-align:right;'>" . htmlspecialchars($verifyStatusLabel) . "</td></tr>
                    <tr><td style='padding:8px 0;'><strong>Name</strong></td><td style='text-align:right;'>" . htmlspecialchars($booking['name']) . "</td></tr>
                    <tr><td style='padding:8px 0;'><strong>Company</strong></td><td style='text-align:right;'>" . htmlspecialchars($booking['company']) . "</td></tr>
                    <tr><td style='padding:8px 0;'><strong>Category</strong></td><td style='text-align:right;'>" . htmlspecialchars($clientType) . "</td></tr>
                    <tr><td style='padding:8px 0;'><strong>Area</strong></td><td style='text-align:right;'>" . $selectedSize . " SQM</td></tr>
                    <tr><td style='padding:8px 0;'><strong>Booking Amount Received</strong></td><td style='text-align:right;'>" . $currency . $bookingPaid . "</td></tr>
                    <tr><td style='padding:8px 0;'><strong>Package Total</strong></td><td style='text-align:right;'>" . $currency . $packageTotal . "</td></tr>
                    <tr><td style='padding:8px 0; color:#dc2626;'><strong>Balance</strong></td><td style='text-align:right; color:#9ca3af;'><strong>" . $currency . $balance . "</strong></td></tr>
                </table>
                <p style='margin-top:14px; font-size:12px; color:#6b7280;'>Auto alert generated by payment callback handler.</p>
            </div>
        </div>
    ";
    $mail->send();
}

function sendAdminTelegramAlert($message, &$err = "") {
    $botToken = getenv('TELEGRAM_BOT_TOKEN') ?: '';
    $chatId = getenv('TELEGRAM_CHAT_ID') ?: '';
    $threadId = getenv('TELEGRAM_THREAD_ID') ?: '';

    if ($botToken === '' || $chatId === '') {
        $err = 'TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID is not configured';
        return false;
    }

    $url = 'https://api.telegram.org/bot' . $botToken . '/sendMessage';
    $payload = [
        'chat_id' => $chatId,
        'text' => $message,
        'parse_mode' => 'HTML',
        'disable_web_page_preview' => true
    ];

    if ($threadId !== '') {
        $payload['message_thread_id'] = $threadId;
    }

    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($payload));
    curl_setopt($ch, CURLOPT_TIMEOUT, 15);
    curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 8);

    $response = curl_exec($ch);
    $curlErr = curl_error($ch);
    $httpCode = intval(curl_getinfo($ch, CURLINFO_HTTP_CODE));
    curl_close($ch);

    if ($response === false || $curlErr !== '' || $httpCode < 200 || $httpCode >= 300) {
        $err = 'Telegram alert failed (HTTP ' . $httpCode . '): ' . ($curlErr !== '' ? $curlErr : substr((string)$response, 0, 160));
        return false;
    }

    $decoded = json_decode((string)$response, true);
    if (!is_array($decoded) || empty($decoded['ok'])) {
        $err = 'Telegram response not ok: ' . substr((string)$response, 0, 160);
        return false;
    }

    return true;
}

$MERCHANT_KEY = "HSWnht";
$SALT = "cMXguKayBU9yfIfwB3MQfkm8pjDKZZlP";

$status = isset($_POST["status"]) ? strtolower(trim($_POST["status"])) : "failed";
$firstname = isset($_POST["firstname"]) ? $_POST["firstname"] : "";
$amount = isset($_POST["amount"]) ? $_POST["amount"] : "0";
$txnid = isset($_POST["txnid"]) ? trim($_POST["txnid"]) : "";
$postedHash = isset($_POST["hash"]) ? strtolower(trim($_POST["hash"])) : "";
$key = isset($_POST["key"]) ? $_POST["key"] : "";
$productinfo = isset($_POST["productinfo"]) ? $_POST["productinfo"] : "";
$email = isset($_POST["email"]) ? $_POST["email"] : "";
$mihpayid = isset($_POST["mihpayid"]) ? trim($_POST["mihpayid"]) : "";

$retHashSeq = $SALT . '|' . $status . '||||||||||' . $email . '|' . $firstname . '|' . $productinfo . '|' . $amount . '|' . $txnid . '|' . $key;
$localHash = strtolower(hash('sha512', $retHashSeq));
$isValidHash = hash_equals($localHash, $postedHash);

$conn = dbConnect();
$booking = null;
$bookingId = null;
$displaySuccess = false;
$mailError = "";

if ($conn && $txnid !== "") {
    try {
        $conn->beginTransaction();

        $stmt = $conn->prepare("SELECT * FROM exhibition_bookings WHERE txnid = ? FOR UPDATE");
        $stmt->execute([$txnid]);
        $booking = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($booking) {
            $bookingId = intval($booking['id']);

            $stmt = $conn->prepare("UPDATE exhibition_bookings
                                   SET callback_count = COALESCE(callback_count, 0) + 1,
                                       last_callback_at = NOW(),
                                       last_payu_status = ?,
                                       last_payu_mihpayid = ?
                                   WHERE id = ?");
            $stmt->execute([$status, $mihpayid, $bookingId]);

            logPaymentAudit($conn, $bookingId, $txnid, "callback_received", "info", "Callback received from PayU", $_POST, $status);

            if (!$isValidHash) {
                $stmt = $conn->prepare("UPDATE exhibition_bookings SET status = 'failed' WHERE id = ?");
                $stmt->execute([$bookingId]);
                logPaymentAudit($conn, $bookingId, $txnid, "hash_validation", "failed", "Invalid hash signature", null, $status);
            } elseif ($status !== "success") {
                $stmt = $conn->prepare("UPDATE exhibition_bookings SET status = 'failed' WHERE id = ?");
                $stmt->execute([$bookingId]);
                logPaymentAudit($conn, $bookingId, $txnid, "payment_status", "failed", "Gateway reported non-success status", null, $status);
            } else {
                $verify = verifyPayUTransaction($MERCHANT_KEY, $SALT, $txnid);

                if ($verify["checked"] && !$verify["success"]) {
                    $stmt = $conn->prepare("UPDATE exhibition_bookings
                                           SET status = 'failed',
                                               payment_verified = 0,
                                               verification_note = ?,
                                               last_payu_status = ?,
                                               last_payu_mihpayid = ?
                                           WHERE id = ?");
                    $stmt->execute([
                        "PayU verify mismatch",
                        $verify["payu_status"],
                        $verify["mihpayid"],
                        $bookingId
                    ]);
                    logPaymentAudit($conn, $bookingId, $txnid, "payu_verify", "failed", "PayU verify returned non-success", $verify, $verify["payu_status"]);
                } else {
                    $verifiedFlag = ($verify["checked"] && $verify["success"]) ? 1 : 0;
                    $verificationNote = $verifiedFlag ? "Verified via PayU API" : "PayU verify unavailable; accepted with signed callback";
                    $verifiedAtSql = $verifiedFlag ? "NOW()" : "NULL";

                    $stmt = $conn->prepare("UPDATE exhibition_bookings
                                           SET status = 'paid',
                                               payment_verified = ?,
                                               payment_verified_at = " . $verifiedAtSql . ",
                                               verification_note = ?,
                                               last_payu_status = ?,
                                               last_payu_mihpayid = ?
                                           WHERE id = ?");
                    $stmt->execute([
                        $verifiedFlag,
                        $verificationNote,
                        $verify["checked"] ? $verify["payu_status"] : "verify_unavailable",
                        $verify["mihpayid"],
                        $bookingId
                    ]);

                    logPaymentAudit(
                        $conn,
                        $bookingId,
                        $txnid,
                        "payu_verify",
                        $verifiedFlag ? "success" : "warning",
                        $verificationNote,
                        $verify,
                        $verify["checked"] ? $verify["payu_status"] : "verify_unavailable"
                    );

                    $displaySuccess = true;
                }
            }
        } else {
            logPaymentAudit($conn, null, $txnid, "booking_lookup", "failed", "No booking found for txnid", $_POST, $status);
        }

        $conn->commit();
    } catch (Exception $e) {
        if ($conn->inTransaction()) {
            $conn->rollBack();
        }
        logPaymentAudit($conn, $bookingId, $txnid, "handler_exception", "failed", $e->getMessage(), null, $status);
    }
}

if ($displaySuccess && $conn && $booking) {
    try {
        $stmt = $conn->prepare("UPDATE exhibition_bookings SET mail_sent = 2 WHERE id = ? AND COALESCE(mail_sent,0) = 0");
        $stmt->execute([intval($booking['id'])]);
        $claimed = ($stmt->rowCount() === 1);

        if ($claimed) {
            $clientType = strtolower($booking['client_type']);
            $selectedSize = intval($booking['selected_size']);
            $calc = calculateBookingAmounts($clientType, $selectedSize);
            if (!$calc) {
                $calc = [
                    "total" => floatval($booking['payable_amount']),
                    "bookingToken" => floatval($booking['payable_amount']),
                    "gst" => 0,
                    "payable" => floatval($booking['payable_amount']),
                    "currency" => ($booking['currency'] === '$' ? '$' : '₹'),
                    "isFull" => true
                ];
            }

            sendBookingEmail($booking, $txnid, $calc);

            $stmt = $conn->prepare("UPDATE exhibition_bookings SET mail_sent = 1, mail_sent_at = NOW(), mail_last_error = NULL WHERE id = ?");
            $stmt->execute([intval($booking['id'])]);

            logPaymentAudit($conn, intval($booking['id']), $txnid, "mail_dispatch", "success", "Confirmation email sent", null, "paid");

            $verifyStatusLabel = (isset($booking['payment_verified']) && intval($booking['payment_verified']) === 1) ? 'PayU API verified' : 'Signed callback accepted';
            try {
                sendAdminAlertEmail($booking, $txnid, $calc, $verifyStatusLabel);
                logPaymentAudit($conn, intval($booking['id']), $txnid, "admin_email_alert", "success", "Owner alert email sent", null, "paid");
            } catch (Exception $adminMailEx) {
                logPaymentAudit($conn, intval($booking['id']), $txnid, "admin_email_alert", "failed", $adminMailEx->getMessage(), null, "paid");
            }

            $tgMessage = "<b>GLS Vision 2047 Payment Alert</b>\n"
                . "Txn: <code>" . htmlspecialchars($txnid) . "</code>\n"
                . "Name: " . htmlspecialchars($booking['name']) . "\n"
                . "Company: " . htmlspecialchars($booking['company']) . "\n"
                . "Category: " . strtoupper(htmlspecialchars($booking['client_type'])) . "\n"
                . "Area: " . intval($booking['selected_size']) . " sqm\n"
                . "Booking Received: " . $calc['currency'] . number_format(floatval($booking['payable_amount']), 2) . "\n"
                . "Total Package: " . $calc['currency'] . number_format(floatval($calc['total']), 2);
            $tgErr = "";
            if (sendAdminTelegramAlert($tgMessage, $tgErr)) {
                logPaymentAudit($conn, intval($booking['id']), $txnid, "admin_telegram_alert", "success", "Owner Telegram alert sent", null, "paid");
            } else {
                logPaymentAudit($conn, intval($booking['id']), $txnid, "admin_telegram_alert", "failed", $tgErr, null, "paid");
            }
        } else {
            logPaymentAudit($conn, intval($booking['id']), $txnid, "mail_dispatch", "info", "Email already sent earlier; skipped duplicate", null, "paid");
        }
    } catch (Exception $e) {
        $mailError = $e->getMessage();
        if ($booking) {
            $stmt = $conn->prepare("UPDATE exhibition_bookings SET mail_sent = 0, mail_last_error = ? WHERE id = ?");
            $stmt->execute([$mailError, intval($booking['id'])]);
            logPaymentAudit($conn, intval($booking['id']), $txnid, "mail_dispatch", "failed", $mailError, null, "paid");
        }
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Payment <?php echo ucfirst($status); ?> - GLS Vision 2047</title>
    <style>
        body { font-family: Arial, sans-serif; background-color: #f9f9f9; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }
        .card { background: white; padding: 40px; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); text-align: center; max-width: 540px; width: 90%; }
        .icon { font-size: 60px; margin-bottom: 20px; }
        .success { color: #4BB543; }
        .failure { color: #FF0000; }
        h1 { color: #002D62; margin-bottom: 10px; font-size: 28px; }
        p { color: #555; line-height: 1.6; }
        .order-id { background: #f0f0f0; padding: 10px; border-radius: 5px; font-family: monospace; display: inline-block; margin: 20px 0; color: #333; }
        .btn { display: inline-block; padding: 12px 24px; background-color: #002D62; color: white; text-decoration: none; border-radius: 50px; font-weight: bold; transition: 0.3s; margin-top: 20px; }
        .btn:hover { background-color: #001f42; }
        .note { font-size: 12px; color: #888; margin-top: 10px; }
    </style>
</head>
<body>
    <div class="card">
        <?php if ($displaySuccess): ?>
            <div class="icon success">✅</div>
            <h1>Payment Successful!</h1>
            <p>Thank you for your booking. Your transaction was verified and recorded successfully.</p>
        <?php else: ?>
            <div class="icon failure">❌</div>
            <h1>Payment Could Not Be Verified</h1>
            <p>We could not confirm this transaction as successful. Please contact support with your transaction ID.</p>
        <?php endif; ?>

        <p>Transaction ID:</p>
        <div class="order-id"><?php echo htmlspecialchars($txnid); ?></div>

        <?php if ($displaySuccess): ?>
            <p>A confirmation email has been sent to your registered email address.</p>
        <?php endif; ?>

        <?php if ($mailError !== ""): ?>
            <p class="note">Note: Payment is recorded. Email dispatch will be retried by support.</p>
        <?php endif; ?>

        <a href="/exhibition/" class="btn">Return to Exhibition Page</a>
    </div>
</body>
</html>
