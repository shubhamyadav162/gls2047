<?php
include_once 'auth.php';
include_once 'exhibition_db.php';
include_once 'exhibition_common.php';

$filters = exhibition_parse_filters();
$rows = exhibition_fetch_rows($exhConn, $filters);
$rows = exhibition_augment_rows($rows);

$filename = 'exhibition-bookings-' . date('Ymd-His') . '.csv';

header('Content-Type: text/csv; charset=utf-8');
header('Content-Disposition: attachment; filename="' . $filename . '"');

$out = fopen('php://output', 'w');

fputcsv($out, [
    'ID',
    'Created At',
    'Status',
    'Client Type',
    'Selected SQM',
    'Name',
    'Company',
    'Designation',
    'Industry',
    'Email',
    'Phone',
    'City/Country',
    'Website',
    'Description',
    'Booking Amount',
    'Currency',
    'Payment Verified',
    'Mail Sent',
    'Callback Count',
    'Last PayU Status',
    'Verification Note',
    'Package Total',
    'Balance Due',
    'Complimentary Passes',
    'Txn ID'
]);

foreach ($rows as $row) {
    fputcsv($out, [
        $row['id'],
        $row['created_at'],
        strtoupper($row['status']),
        ucfirst($row['client_type']),
        $row['selected_size'],
        $row['name'],
        $row['company'],
        $row['designation'],
        $row['industry'],
        $row['email'],
        $row['phone'],
        $row['city_country'],
        $row['website'],
        preg_replace('/\s+/', ' ', (string)$row['description']),
        number_format((float)$row['payable_amount'], 2, '.', ''),
        $row['currency'],
        intval($row['payment_verified']) === 1 ? 'YES' : 'NO',
        intval($row['mail_sent']) === 1 ? 'SENT' : 'PENDING',
        intval($row['callback_count']),
        $row['last_payu_status'],
        $row['verification_note'],
        number_format((float)$row['package_total'], 2, '.', ''),
        number_format((float)$row['balance_due'], 2, '.', ''),
        $row['pass_allocation'],
        $row['txnid']
    ]);
}

fclose($out);
exit;
?>
