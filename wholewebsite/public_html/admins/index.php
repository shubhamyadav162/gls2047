<?php
include_once 'db.php';
include_once 'auth.php';
include_once 'header.php';

function fetch_scalar($conn, $sql) {
    $res = $conn->query($sql);
    if (!$res) {
        return 0;
    }
    $row = $res->fetch_row();
    return $row ? (float)$row[0] : 0;
}

$total = fetch_scalar($conn, "SELECT COUNT(*) FROM exhibition_bookings");
$paid = fetch_scalar($conn, "SELECT COUNT(*) FROM exhibition_bookings WHERE status='paid'");
$pending = fetch_scalar($conn, "SELECT COUNT(*) FROM exhibition_bookings WHERE status='pending'");
$failed = fetch_scalar($conn, "SELECT COUNT(*) FROM exhibition_bookings WHERE status='failed'");
$today = fetch_scalar($conn, "SELECT COUNT(*) FROM exhibition_bookings WHERE DATE(created_at)=CURDATE()");

$tokenCollected = fetch_scalar($conn, "SELECT COALESCE(SUM(payable_amount),0) FROM exhibition_bookings WHERE status='paid'");
$tokenIntent = fetch_scalar($conn, "SELECT COALESCE(SUM(payable_amount),0) FROM exhibition_bookings");

$recent = $conn->query("SELECT id, name, company, client_type, status, selected_size, payable_amount, created_at FROM exhibition_bookings ORDER BY id DESC LIMIT 10");
?>

<div class="container">
  <div class="page-inner">
    <div class="d-flex align-items-left align-items-md-center flex-column flex-md-row pt-2 pb-4">
      <div>
        <h3 class="fw-bold mb-2">Admin Overview</h3>
        <p class="text-muted mb-0">Exhibition booking operations snapshot</p>
      </div>
      <div class="ms-md-auto py-2 py-md-0">
        <a href="exhibition_dashboard.php" class="btn btn-primary btn-round">Open Live Dashboard</a>
      </div>
    </div>

    <div class="row">
      <div class="col-sm-6 col-md-3"><div class="card card-stats card-round"><div class="card-body"><p class="card-category">Total Forms</p><h4 class="card-title"><?php echo number_format($total); ?></h4></div></div></div>
      <div class="col-sm-6 col-md-3"><div class="card card-stats card-round"><div class="card-body"><p class="card-category">Paid</p><h4 class="card-title text-success"><?php echo number_format($paid); ?></h4></div></div></div>
      <div class="col-sm-6 col-md-3"><div class="card card-stats card-round"><div class="card-body"><p class="card-category">Pending</p><h4 class="card-title text-warning"><?php echo number_format($pending); ?></h4></div></div></div>
      <div class="col-sm-6 col-md-3"><div class="card card-stats card-round"><div class="card-body"><p class="card-category">Failed</p><h4 class="card-title text-danger"><?php echo number_format($failed); ?></h4></div></div></div>
      <div class="col-sm-6 col-md-4"><div class="card card-stats card-round"><div class="card-body"><p class="card-category">Captured Today</p><h4 class="card-title text-info"><?php echo number_format($today); ?></h4></div></div></div>
      <div class="col-sm-6 col-md-4"><div class="card card-stats card-round"><div class="card-body"><p class="card-category">Token Collected (Paid)</p><h4 class="card-title">₹<?php echo number_format($tokenCollected, 2); ?></h4></div></div></div>
      <div class="col-sm-6 col-md-4"><div class="card card-stats card-round"><div class="card-body"><p class="card-category">Token Intent (All)</p><h4 class="card-title">₹<?php echo number_format($tokenIntent, 2); ?></h4></div></div></div>
    </div>

    <div class="card">
      <div class="card-header d-flex justify-content-between align-items-center">
        <h4 class="card-title mb-0">Recent Submissions</h4>
        <a href="exhibition_export.php" class="btn btn-success btn-sm">Download CSV</a>
      </div>
      <div class="card-body">
        <div class="table-responsive">
          <table class="table table-striped table-hover" id="export_table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Time</th>
                <th>Name</th>
                <th>Company</th>
                <th>Category</th>
                <th>SQM</th>
                <th>Status</th>
                <th>Booking</th>
              </tr>
            </thead>
            <tbody>
              <?php if ($recent && $recent->num_rows > 0): ?>
                <?php while ($r = $recent->fetch_assoc()): ?>
                  <tr>
                    <td><?php echo (int)$r['id']; ?></td>
                    <td><?php echo htmlspecialchars(date('d M Y, h:i A', strtotime($r['created_at']))); ?></td>
                    <td><?php echo htmlspecialchars($r['name']); ?></td>
                    <td><?php echo htmlspecialchars($r['company']); ?></td>
                    <td><?php echo htmlspecialchars(ucfirst($r['client_type'])); ?></td>
                    <td><?php echo (int)$r['selected_size']; ?> sqm</td>
                    <td>
                      <?php if ($r['status'] === 'paid'): ?>
                        <span class="badge badge-success">PAID</span>
                      <?php elseif ($r['status'] === 'failed'): ?>
                        <span class="badge badge-danger">FAILED</span>
                      <?php else: ?>
                        <span class="badge badge-warning">PENDING</span>
                      <?php endif; ?>
                    </td>
                    <td>₹<?php echo number_format((float)$r['payable_amount'], 2); ?></td>
                  </tr>
                <?php endwhile; ?>
              <?php else: ?>
                <tr><td colspan="8" class="text-center text-muted">No submissions yet.</td></tr>
              <?php endif; ?>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</div>

<?php include_once 'footer.php'; ?>
