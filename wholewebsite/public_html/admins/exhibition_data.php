<?php
include_once 'auth.php';
include_once 'exhibition_db.php';
include_once 'exhibition_common.php';

header('Content-Type: application/json; charset=utf-8');

$filters = exhibition_parse_filters();
$rows = exhibition_fetch_rows($exhConn, $filters);
$rows = exhibition_augment_rows($rows);
$stats = exhibition_calculate_stats($rows);

echo json_encode([
    "success" => true,
    "filters" => $filters,
    "stats" => $stats,
    "rows" => $rows,
    "generated_at" => date(DATE_ATOM)
], JSON_UNESCAPED_UNICODE);
?>
