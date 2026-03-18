<?php
include_once 'auth.php';
include_once 'exhibition_db.php';
include_once 'exhibition_common.php';

header('Content-Type: text/event-stream');
header('Cache-Control: no-cache, no-store, must-revalidate');
header('Pragma: no-cache');
header('X-Accel-Buffering: no');

@ini_set('output_buffering', 'off');
@ini_set('zlib.output_compression', 0);
@set_time_limit(0);

$lastId = isset($_GET['last_id']) ? intval($_GET['last_id']) : 0;
$lastHash = '';

for ($i = 0; $i < 120; $i++) {
    if (connection_aborted()) {
        break;
    }

    $filters = [
        "status" => "all",
        "client_type" => "all",
        "search" => "",
        "from_date" => "",
        "to_date" => ""
    ];

    $rows = exhibition_fetch_rows($exhConn, $filters);
    $rows = exhibition_augment_rows($rows);
    $stats = exhibition_calculate_stats($rows);

    $latest = [];
    foreach ($rows as $row) {
        $rowId = intval($row['id']);
        if ($rowId > $lastId) {
            $latest[] = [
                "id" => $rowId,
                "name" => $row['name'],
                "company" => $row['company'],
                "client_type" => $row['client_type'],
                "status" => $row['status'],
                "package_total" => $row['package_total'],
                "created_at_human" => $row['created_at_human']
            ];
            $lastId = max($lastId, $rowId);
        }
    }

    $payload = [
        "timestamp" => date(DATE_ATOM),
        "last_id" => $lastId,
        "stats" => $stats,
        "latest" => $latest
    ];

    $hash = md5(json_encode($payload));
    if ($hash !== $lastHash) {
        echo "event: dashboard\n";
        echo "data: " . json_encode($payload, JSON_UNESCAPED_UNICODE) . "\n\n";
        $lastHash = $hash;
    } else {
        echo ": ping\n\n";
    }

    @ob_flush();
    flush();
    sleep(5);
}

echo "event: close\n";
echo "data: {}\n\n";
@ob_flush();
flush();
?>
