<?php
function exhibition_allowed_client_types() {
    return ["corporate", "startup", "psu", "government", "academia", "country"];
}

function exhibition_allowed_statuses() {
    return ["pending", "paid", "failed"];
}

function exhibition_parse_filters() {
    $status = isset($_GET["status"]) ? strtolower(trim($_GET["status"])) : "all";
    $clientType = isset($_GET["client_type"]) ? strtolower(trim($_GET["client_type"])) : "all";
    $search = isset($_GET["search"]) ? trim($_GET["search"]) : "";
    $fromDate = isset($_GET["from_date"]) ? trim($_GET["from_date"]) : "";
    $toDate = isset($_GET["to_date"]) ? trim($_GET["to_date"]) : "";

    if (!in_array($status, array_merge(["all"], exhibition_allowed_statuses()), true)) {
        $status = "all";
    }

    if (!in_array($clientType, array_merge(["all"], exhibition_allowed_client_types()), true)) {
        $clientType = "all";
    }

    if ($fromDate !== "" && !preg_match('/^\d{4}-\d{2}-\d{2}$/', $fromDate)) {
        $fromDate = "";
    }

    if ($toDate !== "" && !preg_match('/^\d{4}-\d{2}-\d{2}$/', $toDate)) {
        $toDate = "";
    }

    return [
        "status" => $status,
        "client_type" => $clientType,
        "search" => $search,
        "from_date" => $fromDate,
        "to_date" => $toDate
    ];
}

function exhibition_build_query_parts($filters) {
    $where = " WHERE 1=1";
    $types = "";
    $params = [];

    if ($filters["status"] !== "all") {
        $where .= " AND status = ?";
        $types .= "s";
        $params[] = $filters["status"];
    }

    if ($filters["client_type"] !== "all") {
        $where .= " AND client_type = ?";
        $types .= "s";
        $params[] = $filters["client_type"];
    }

    if ($filters["from_date"] !== "") {
        $where .= " AND DATE(created_at) >= ?";
        $types .= "s";
        $params[] = $filters["from_date"];
    }

    if ($filters["to_date"] !== "") {
        $where .= " AND DATE(created_at) <= ?";
        $types .= "s";
        $params[] = $filters["to_date"];
    }

    if ($filters["search"] !== "") {
        $where .= " AND (name LIKE ? OR company LIKE ? OR email LIKE ? OR phone LIKE ? OR txnid LIKE ?)";
        $types .= "sssss";
        $like = "%" . $filters["search"] . "%";
        $params[] = $like;
        $params[] = $like;
        $params[] = $like;
        $params[] = $like;
        $params[] = $like;
    }

    return [$where, $types, $params];
}

function exhibition_fetch_rows($conn, $filters) {
    list($where, $types, $params) = exhibition_build_query_parts($filters);

    $sql = "SELECT id, client_type, selected_size, name, company, designation, industry, email, phone, city_country, website, description, payable_amount, currency, status, txnid, created_at,
                   COALESCE(payment_verified,0) AS payment_verified,
                   payment_verified_at,
                   verification_note,
                   COALESCE(callback_count,0) AS callback_count,
                   last_callback_at,
                   COALESCE(mail_sent,0) AS mail_sent,
                   mail_sent_at,
                   mail_last_error,
                   last_payu_status,
                   last_payu_mihpayid
            FROM exhibition_bookings" . $where . " ORDER BY id DESC";

    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        return [];
    }

    if ($types !== "") {
        $stmt->bind_param($types, ...$params);
    }

    $stmt->execute();
    $result = $stmt->get_result();

    $rows = [];
    while ($row = $result->fetch_assoc()) {
        $rows[] = $row;
    }

    $stmt->close();
    return $rows;
}

function exhibition_calculate_package_total($clientType, $selectedSize) {
    $sqm = intval($selectedSize);
    switch ($clientType) {
        case "startup":
            return 25000;
        case "corporate":
            return $sqm * 20000;
        case "psu":
        case "government":
            return $sqm * 18000;
        case "academia":
            return $sqm * 10000;
        case "country":
            return $sqm * 200;
        default:
            return 0;
    }
}

function exhibition_get_pass_text($clientType, $selectedSize) {
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
        "startup" => [
            9 => ["vip" => 2, "delegate" => 4, "exhibitor" => 4]
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
        "country" => [
            50 => ["vip" => 4, "delegate" => 8, "exhibitor" => 8],
            100 => ["vip" => 6, "delegate" => 12, "exhibitor" => 12],
            200 => ["vip" => 10, "delegate" => 20, "exhibitor" => 20],
            300 => ["vip" => 14, "delegate" => 28, "exhibitor" => 28],
            400 => ["vip" => 18, "delegate" => 36, "exhibitor" => 36],
            500 => ["vip" => 22, "delegate" => 44, "exhibitor" => 44]
        ]
    ];

    $sqm = intval($selectedSize);
    if (!isset($map[$clientType][$sqm])) {
        return "";
    }

    $allocation = $map[$clientType][$sqm];
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

function exhibition_currency_for_row($row) {
    if (isset($row["currency"]) && trim($row["currency"]) !== "") {
        return $row["currency"];
    }
    return ($row["client_type"] === "country") ? "$" : "₹";
}

function exhibition_augment_rows($rows) {
    $augmented = [];
    foreach ($rows as $row) {
        $clientType = strtolower($row["client_type"]);
        $selectedSize = intval($row["selected_size"]);
        $packageTotal = exhibition_calculate_package_total($clientType, $selectedSize);
        $payable = floatval($row["payable_amount"]);
        $currency = exhibition_currency_for_row($row);

        $row["package_total"] = $packageTotal;
        $row["balance_due"] = max($packageTotal - $payable, 0);
        $row["pass_allocation"] = exhibition_get_pass_text($clientType, $selectedSize);
        $row["currency"] = $currency;
        $row["payable_amount"] = $payable;
        $row["created_at_human"] = date("d M Y, h:i A", strtotime($row["created_at"]));
        $row["payment_verified"] = intval($row["payment_verified"]);
        $row["mail_sent"] = intval($row["mail_sent"]);
        $row["callback_count"] = intval($row["callback_count"]);
        $augmented[] = $row;
    }
    return $augmented;
}

function exhibition_calculate_stats($rows) {
    $today = date("Y-m-d");
    $weekStartTs = strtotime("-6 days");
    $monthKey = date("Y-m");

    $stats = [
        "total" => 0,
        "paid" => 0,
        "pending" => 0,
        "failed" => 0,
        "today" => 0,
        "this_week" => 0,
        "this_month" => 0,
        "token_collected" => 0.0,
        "token_intent" => 0.0,
        "projected_value" => 0.0,
        "paid_pipeline_value" => 0.0,
        "unpaid_pipeline_value" => 0.0,
        "outstanding_on_paid" => 0.0,
        "verified_paid" => 0,
        "mail_sent_count" => 0,
        "callbacks_total" => 0,
        "by_client_type" => []
    ];

    foreach ($rows as $row) {
        $stats["total"]++;
        $status = strtolower(trim($row["status"]));
        if (!isset($stats[$status])) {
            $status = "pending";
        }
        $stats[$status]++;

        $createdDate = date("Y-m-d", strtotime($row["created_at"]));
        $createdTs = strtotime($row["created_at"]);
        if ($createdDate === $today) {
            $stats["today"]++;
        }
        if ($createdTs >= $weekStartTs) {
            $stats["this_week"]++;
        }
        if (strpos($createdDate, $monthKey) === 0) {
            $stats["this_month"]++;
        }

        $payable = floatval($row["payable_amount"]);
        $totalValue = floatval($row["package_total"]);
        $balance = floatval($row["balance_due"]);
        $mailSent = intval($row["mail_sent"]);
        $isVerified = intval($row["payment_verified"]);
        $callbackCount = intval($row["callback_count"]);

        $stats["token_intent"] += $payable;
        $stats["projected_value"] += $totalValue;
        $stats["callbacks_total"] += $callbackCount;

        if ($mailSent === 1) {
            $stats["mail_sent_count"]++;
        }

        if ($status === "paid") {
            $stats["token_collected"] += $payable;
            $stats["paid_pipeline_value"] += $totalValue;
            $stats["outstanding_on_paid"] += $balance;
            if ($isVerified === 1) {
                $stats["verified_paid"]++;
            }
        } else {
            $stats["unpaid_pipeline_value"] += $totalValue;
        }

        $type = strtolower($row["client_type"]);
        if (!isset($stats["by_client_type"][$type])) {
            $stats["by_client_type"][$type] = [
                "count" => 0,
                "projected_value" => 0.0,
                "paid_count" => 0
            ];
        }
        $stats["by_client_type"][$type]["count"]++;
        $stats["by_client_type"][$type]["projected_value"] += $totalValue;
        if ($status === "paid") {
            $stats["by_client_type"][$type]["paid_count"]++;
        }
    }

    return $stats;
}

function exhibition_format_status_badge($status) {
    $status = strtolower(trim((string)$status));
    if ($status === "paid") {
        return "success";
    }
    if ($status === "failed") {
        return "danger";
    }
    return "warning";
}
?>
