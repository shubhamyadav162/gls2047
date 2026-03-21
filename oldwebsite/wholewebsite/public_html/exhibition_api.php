<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

function failResponse($message, $code = 400) {
    http_response_code($code);
    echo json_encode(["success" => false, "message" => $message]);
    exit;
}

function getAllowedSizes($clientType) {
    $map = [
        "corporate" => [9, 12, 18, 36, 100, 200, 300, 400, 500],
        "startup" => [9],
        "psu" => [100, 200, 300, 400, 500],
        "government" => [100, 200, 300, 400, 500],
        "academia" => [12, 36, 100, 200, 300, 400, 500],
        "country" => [50, 100, 200, 300, 400, 500]
    ];
    return isset($map[$clientType]) ? $map[$clientType] : [];
}

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

$raw = file_get_contents("php://input");
$data = json_decode($raw);

if (!$data) {
    failResponse("No data provided");
}

$clientType = isset($data->clientType) ? strtolower(trim($data->clientType)) : "";
$selectedSize = isset($data->selectedSize) ? intval($data->selectedSize) : 0;

$allowedClientTypes = ["corporate", "startup", "psu", "government", "academia", "country"];
if (!in_array($clientType, $allowedClientTypes, true)) {
    failResponse("Invalid client type");
}

$allowedSizes = getAllowedSizes($clientType);
if (!in_array($selectedSize, $allowedSizes, true)) {
    failResponse("Invalid area selected for this category");
}

$name = isset($data->name) ? trim($data->name) : "";
$email = isset($data->email) ? trim($data->email) : "";
$phone = isset($data->whatsapp) ? trim($data->whatsapp) : "";
$company = isset($data->company) ? trim($data->company) : "";
$designation = isset($data->designation) ? trim($data->designation) : "";

if ($name === "" || $email === "" || $phone === "" || $company === "" || $designation === "") {
    failResponse("Please fill all required fields");
}

$calc = calculateBookingAmounts($clientType, $selectedSize);
if (!$calc) {
    failResponse("Unable to calculate booking amount");
}

$host = "localhost";
$dbname = "u364184455_paniit";
$username = "u364184455_pan_iit";
$password = "Pan_iit@1614";

$MERCHANT_KEY = "HSWnht";
$SALT = "cMXguKayBU9yfIfwB3MQfkm8pjDKZZlP";
$PAYU_BASE_URL = "https://secure.payu.in";

try {
    // Attempt with production user
    try {
        $conn = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    } catch (PDOException $e) {
        // Fallback to local root if production user fails (useful for local dev)
        $conn = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", "root", "Globaluser@2026");
    }
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $txnid = "GLS_EXH_" . time() . rand(1000, 9999);

    $stmt = $conn->prepare("INSERT INTO exhibition_bookings
        (client_type, selected_size, name, company, designation, industry, email, phone, city_country, website, description, payable_amount, currency, txnid)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");

    $stmt->execute([
        $clientType,
        $selectedSize,
        $name,
        $company,
        $designation,
        isset($data->industry) ? $data->industry : "",
        $email,
        $phone,
        isset($data->city_country) ? $data->city_country : "",
        isset($data->website) ? $data->website : "",
        isset($data->description) ? $data->description : "",
        $calc["payable"],
        $calc["currency"],
        $txnid
    ]);

    $amount = number_format($calc["payable"], 2, ".", "");
    $productinfo = "Exhibition Space - " . ucfirst($clientType) . " - " . $selectedSize . " SQM";
    $firstname = $name;

    $hashSequence = "$MERCHANT_KEY|$txnid|$amount|$productinfo|$firstname|$email|||||||||||$SALT";
    $hash = strtolower(hash("sha512", $hashSequence));

    echo json_encode([
        "success" => true,
        "payu_data" => [
            "key" => $MERCHANT_KEY,
            "hash" => $hash,
            "txnid" => $txnid,
            "amount" => $amount,
            "firstname" => $firstname,
            "email" => $email,
            "phone" => $phone,
            "productinfo" => $productinfo,
            "surl" => "https://glsvision2047.com/exhibition_payu_handler.php",
            "furl" => "https://glsvision2047.com/exhibition_payu_handler.php",
            "action" => $PAYU_BASE_URL . "/_payment"
        ],
        "calc" => $calc
    ]);
} catch (PDOException $e) {
    failResponse("Database error", 500);
}
?>
