<?php
session_start();

$ADMIN_PASSWORD = 'GLSAdmin@2026';
$db_host = 'localhost';
$db_name = 'u364184455_paniit';

function getConn($host, $name) {
    try { 
        $c = new mysqli($host, 'u364184455_pan_iit', 'Pan_iit@1614', $name);
        if ($c->connect_error) throw new Exception($c->connect_error);
        return $c;
    } catch(Exception $e) { 
        return new mysqli($host, 'root', 'Globaluser@2026', $name); 
    }
}

if (isset($_POST['password'])) {
    if ($_POST['password'] === $ADMIN_PASSWORD) { $_SESSION['authenticated'] = true; }
    else { $error = 'Invalid Password!'; }
}
if (isset($_GET['logout'])) { session_destroy(); header('Location: admin_gls.php'); exit; }
$authenticated = isset($_SESSION['authenticated']) && $_SESSION['authenticated'] === true;

$conn = null;
if ($authenticated) {
    $conn = getConn($db_host, $db_name);
    if ($conn->connect_error) die('DB Error: ' . $conn->connect_error);
}

function buildWhere($filter_date, $filter_status, $filter_cat, $date_from, $date_to) {
    $conditions = [];
    $today = date('Y-m-d');
    if ($filter_date === 'today')  $conditions[] = "DATE(created_at) = '$today'";
    elseif ($filter_date === 'week')  $conditions[] = "created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)";
    elseif ($filter_date === 'month') $conditions[] = "created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)";
    if ($date_from) $conditions[] = "DATE(created_at) >= '" . $date_from . "'";
    if ($date_to)   $conditions[] = "DATE(created_at) <= '" . $date_to . "'";
    if ($filter_status === 'paid')    $conditions[] = "status IN ('success','paid')";
    elseif ($filter_status === 'pending') $conditions[] = "status = 'pending'";
    elseif ($filter_status === 'failed')  $conditions[] = "status = 'failed'";
    if ($filter_cat) $conditions[] = "client_type = '" . $filter_cat . "'";
    return count($conditions) ? ' WHERE ' . implode(' AND ', $conditions) : '';
}

if ($authenticated && isset($_GET['export_csv'])) {
    $f   = isset($_GET['filter_date'])   ? $_GET['filter_date']   : '';
    $fs  = isset($_GET['filter_status']) ? $_GET['filter_status'] : '';
    $fc  = isset($_GET['filter_cat'])    ? $_GET['filter_cat']    : '';
    $df  = isset($_GET['date_from'])     ? $_GET['date_from']     : '';
    $dt  = isset($_GET['date_to'])       ? $_GET['date_to']       : '';
    $w   = buildWhere($f, $fs, $fc, $df, $dt);
    $res = $conn->query("SELECT * FROM exhibition_bookings$w ORDER BY created_at DESC");
    header('Content-Type: text/csv; charset=utf-8');
    header('Content-Disposition: attachment; filename=GLS_Bookings_' . date('Y-m-d_His') . '.csv');
    $out = fopen('php://output', 'w');
    fprintf($out, chr(0xEF).chr(0xBB).chr(0xBF));
    fputcsv($out, ['#','Date Submitted','Payment Date','Name','Company','Designation','Industry','Email','Phone','Location','Website','Category','Size(sqm)','Amount','Currency','Status','Transaction ID','PayU Payment ID','Description']);
    $i = 1;
    while ($r = $res->fetch_assoc()) {
        fputcsv($out, [ $i++, $r['created_at'], $r['payment_verified_at'] ?? '',
            $r['name'], $r['company'], $r['designation'], $r['industry'],
            $r['email'], $r['phone'], $r['city_country'], $r['website'],
            strtoupper($r['client_type']), $r['selected_size'],
            $r['payable_amount'], $r['currency'], $r['status'],
            $r['txnid'], $r['last_payu_mihpayid'] ?? '', $r['description'] ]);
    }
    fclose($out); exit;
}

if ($authenticated) {
    $filter_date   = isset($_GET['filter_date'])   ? $_GET['filter_date']   : '';
    $filter_status = isset($_GET['filter_status']) ? $_GET['filter_status'] : '';
    $filter_cat    = isset($_GET['filter_cat'])    ? $_GET['filter_cat']    : '';
    $date_from     = isset($_GET['date_from'])     ? $_GET['date_from']     : '';
    $date_to       = isset($_GET['date_to'])       ? $_GET['date_to']       : '';
    $where         = buildWhere($filter_date, $filter_status, $filter_cat, $date_from, $date_to);

    $total_count = $conn->query("SELECT COUNT(*) as c FROM exhibition_bookings")->fetch_assoc()['c'];
    $paid_count  = $conn->query("SELECT COUNT(*) as c FROM exhibition_bookings WHERE status IN ('success','paid')")->fetch_assoc()['c'];
    $pend_count  = $conn->query("SELECT COUNT(*) as c FROM exhibition_bookings WHERE status NOT IN ('success','paid')")->fetch_assoc()['c'];
    $total_rev   = $conn->query("SELECT SUM(payable_amount) as t FROM exhibition_bookings WHERE status IN ('success','paid')")->fetch_assoc()['t'] ?: 0;
    $today_row   = $conn->query("SELECT COUNT(*) as c, SUM(CASE WHEN status IN ('success','paid') THEN payable_amount ELSE 0 END) as r FROM exhibition_bookings WHERE DATE(created_at)=CURDATE()")->fetch_assoc();
    $week_row    = $conn->query("SELECT COUNT(*) as c, SUM(CASE WHEN status IN ('success','paid') THEN payable_amount ELSE 0 END) as r FROM exhibition_bookings WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)")->fetch_assoc();
    $filtered_count = $conn->query("SELECT COUNT(*) as c FROM exhibition_bookings$where")->fetch_assoc()['c'];
    $bookings_res = $conn->query("SELECT * FROM exhibition_bookings$where ORDER BY created_at DESC");
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>GLS 2026 | Admin Dashboard</title>
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Outfit',sans-serif;background:#f0f4f8;color:#1a2332;min-height:100vh}
:root{--navy:#002D62;--gold:#D4AF37;--green:#00b386;--red:#e74c3c;--orange:#f39c12}
.header{background:linear-gradient(135deg,#002D62 0%,#003d82 100%);color:#fff;padding:18px 32px;display:flex;align-items:center;justify-content:space-between;box-shadow:0 4px 24px rgba(0,45,98,.3);position:sticky;top:0;z-index:10}
.header h1{font-size:1rem;font-weight:700;display:flex;align-items:center;gap:10px;flex-wrap:wrap}
.live-badge{background:var(--green);color:#fff;font-size:.65rem;padding:3px 10px;border-radius:30px;font-weight:700;letter-spacing:.05em;animation:pulse 2s infinite}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.6}}
.logout{color:rgba(255,255,255,.7);text-decoration:none;font-size:.85rem;padding:8px 16px;border:1px solid rgba(255,255,255,.2);border-radius:8px;transition:.2s;white-space:nowrap}
.logout:hover{background:rgba(255,255,255,.1);color:#fff}
.main{padding:24px 28px;max-width:1600px;margin:0 auto}
.stats-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:14px;margin-bottom:20px}
.stat-card{background:#fff;border-radius:14px;padding:18px 20px;display:flex;align-items:center;gap:14px;box-shadow:0 2px 12px rgba(0,0,0,.06)}
.stat-icon{width:46px;height:46px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:1.15rem;flex-shrink:0}
.stat-info h3{font-size:.65rem;text-transform:uppercase;letter-spacing:.07em;color:#888;font-weight:600}
.stat-info p{font-size:1.5rem;font-weight:800;color:var(--navy);line-height:1.1;margin-top:2px}
.quick-bar{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:20px}
.qcard{background:#fff;border-radius:14px;padding:16px 20px;box-shadow:0 2px 12px rgba(0,0,0,.06)}
.qcard h4{font-size:.68rem;text-transform:uppercase;letter-spacing:.07em;color:#888;font-weight:600;margin-bottom:10px}
.qcard .row{display:flex;justify-content:space-between;align-items:baseline}
.qcard .big{font-size:1.4rem;font-weight:800;color:var(--navy)}
.qcard .rev{font-size:.88rem;font-weight:700;color:var(--green)}
.filter-box{background:#fff;border-radius:14px;padding:18px 22px;margin-bottom:18px;box-shadow:0 2px 12px rgba(0,0,0,.06)}
.filter-box form{display:flex;flex-wrap:wrap;gap:12px;align-items:flex-end}
.fg{display:flex;flex-direction:column;gap:5px}
.fg label{font-size:.65rem;text-transform:uppercase;letter-spacing:.06em;color:#777;font-weight:600}
.fg select,.fg input[type=date]{padding:9px 12px;border:1.5px solid #e0e5ed;border-radius:9px;font-family:inherit;font-size:.83rem;color:var(--navy);background:#f8fafc;min-width:130px;outline:none}
.fg select:focus,.fg input:focus{border-color:var(--navy);background:#fff}
.pills{display:flex;gap:6px;flex-wrap:wrap}
.pill{padding:6px 14px;border-radius:30px;font-size:.72rem;font-weight:700;cursor:pointer;border:2px solid #e0e5ed;background:#f8fafc;color:#666;transition:.2s;user-select:none}
.pill:hover,.pill.on{background:var(--navy);color:#fff;border-color:var(--navy)}
.btn-apply{background:var(--navy);color:#fff;border:none;padding:9px 20px;border-radius:9px;font-family:inherit;font-weight:700;font-size:.83rem;cursor:pointer}
.btn-apply:hover{background:#003d82}
.btn-reset{background:#f0f4f8;color:#555;border:1.5px solid #e0e5ed;padding:9px 16px;border-radius:9px;font-family:inherit;font-weight:600;font-size:.83rem;cursor:pointer;text-decoration:none;display:inline-flex;align-items:center;gap:6px}
.btn-csv{background:linear-gradient(135deg,#00b386,#009e77);color:#fff;border:none;padding:9px 20px;border-radius:9px;font-family:inherit;font-weight:700;font-size:.83rem;cursor:pointer;text-decoration:none;display:inline-flex;align-items:center;gap:8px;margin-left:auto}
.btn-csv:hover{transform:translateY(-1px);box-shadow:0 4px 14px rgba(0,179,134,.3)}
.table-card{background:#fff;border-radius:14px;box-shadow:0 2px 12px rgba(0,0,0,.06);overflow:hidden}
.table-top{display:flex;align-items:center;justify-content:space-between;padding:16px 22px;border-bottom:1px solid #f0f4f8}
.table-top h3{font-size:.88rem;font-weight:700;color:var(--navy)}
.rc{font-size:.72rem;color:#888;background:#f0f4f8;padding:4px 12px;border-radius:20px;font-weight:600}
table{width:100%;border-collapse:collapse}
thead tr{background:#f8fafc}
th{padding:10px 14px;text-align:left;font-size:.65rem;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:#777;white-space:nowrap;border-bottom:1px solid #f0f4f8}
td{padding:11px 14px;font-size:.83rem;border-bottom:1px solid #f8fafc;vertical-align:middle}
tr:last-child td{border-bottom:none}
tr:hover td{background:#f8fbff}
.bdg{padding:3px 10px;border-radius:20px;font-size:.68rem;font-weight:700;text-transform:uppercase}
.bdg-paid{background:rgba(0,179,134,.12);color:#00b386}
.bdg-pen{background:rgba(243,156,18,.12);color:#f39c12}
.bdg-fail{background:rgba(231,76,60,.12);color:#e74c3c}
.bdg-cat{background:rgba(0,45,98,.08);color:var(--navy)}
.btn-d{background:transparent;border:1.5px solid #dde3ed;color:#666;padding:5px 14px;border-radius:7px;font-size:.72rem;font-weight:700;cursor:pointer;font-family:inherit;transition:.2s}
.btn-d:hover{border-color:var(--navy);color:var(--navy);background:#f0f4f8}
.modal{display:none;position:fixed;inset:0;background:rgba(0,0,0,.55);backdrop-filter:blur(6px);z-index:99;align-items:center;justify-content:center;padding:20px}
.mbox{background:#fff;border-radius:18px;max-width:680px;width:100%;max-height:88vh;overflow-y:auto;box-shadow:0 24px 60px rgba(0,0,0,.25)}
.mhead{background:linear-gradient(135deg,var(--navy),#003d82);color:#fff;padding:22px 26px;border-radius:18px 18px 0 0;display:flex;justify-content:space-between;align-items:flex-start}
.mhead h2{font-size:1.05rem;font-weight:700}
.mhead p{font-size:.78rem;opacity:.7;margin-top:3px}
.closebtn{background:rgba(255,255,255,.15);border:none;color:#fff;width:30px;height:30px;border-radius:50%;cursor:pointer;font-size:1rem;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.closebtn:hover{background:rgba(255,255,255,.25)}
.mbody{padding:22px 26px}
.igrid{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:16px}
.ii label{font-size:.62rem;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:#999;display:block;margin-bottom:2px}
.ii span,.ii a{font-size:.88rem;color:var(--navy);font-weight:600}
.dbox{background:#f8fafc;border-radius:10px;padding:14px;font-size:.83rem;color:#555;line-height:1.7;white-space:pre-wrap;margin-top:4px}
.login-wrap{min-height:100vh;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#002D62 0%,#003d82 100%)}
.lbox{background:#fff;border-radius:20px;padding:44px 40px;width:100%;max-width:400px;box-shadow:0 24px 60px rgba(0,0,0,.2);text-align:center}
.lbox img{height:60px;margin-bottom:20px;border-radius:50%}
.lbox h2{font-size:1.3rem;font-weight:800;color:var(--navy);margin-bottom:6px}
.lbox p{font-size:.85rem;color:#888;margin-bottom:28px}
.lbox input{width:100%;padding:14px 18px;border:2px solid #e0e5ed;border-radius:12px;font-family:inherit;font-size:.95rem;margin-bottom:16px;outline:none;transition:.2s;text-align:center;letter-spacing:.1em}
.lbox input:focus{border-color:var(--navy)}
.lbtn{width:100%;background:linear-gradient(135deg,var(--navy),#003d82);color:#fff;border:none;padding:14px;border-radius:12px;font-family:inherit;font-weight:700;font-size:1rem;cursor:pointer}
.lbtn:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(0,45,98,.35)}
.err{color:var(--red);font-size:.83rem;margin-bottom:10px;font-weight:600}
@media(max-width:768px){
  .main{padding:14px}
  .header{padding:14px 16px}
  .header h1{font-size:.85rem}
  .quick-bar,.igrid{grid-template-columns:1fr}
  table{font-size:.73rem}
  th,td{padding:8px 10px}
  .filter-box form{flex-direction:column}
  .fg select,.fg input[type=date]{min-width:100%}
  .btn-csv{margin-left:0;width:100%;justify-content:center}
}
</style>
</head>
<body>

<?php if (!$authenticated): ?>
<div class="login-wrap">
  <div class="lbox">
    <img src="images/GLS_Logo.jpg" alt="GLS" onerror="this.style.display='none'">
    <h2>GLS Exhibition Admin</h2>
    <p>Booking Registry &amp; Analytics Dashboard</p>
    <?php if(isset($error)): ?><p class="err"><?php echo $error; ?></p><?php endif; ?>
    <form method="POST">
      <input type="password" name="password" placeholder="Enter Dashboard Password" required autofocus>
      <button type="submit" class="lbtn"><i class="fas fa-lock"></i>&nbsp; Secure Login</button>
    </form>
  </div>
</div>

<?php else: ?>

<div class="header">
  <h1>
    <i class="fas fa-chart-line" style="color:#D4AF37"></i>
    GLS 2026 &mdash; Exhibition Dashboard
    <span class="live-badge"><i class="fas fa-circle" style="font-size:5px"></i> LIVE</span>
    <span style="font-size:.68rem;opacity:.55;font-weight:400">Auto-refresh: <span id="timer">30</span>s</span>
  </h1>
  <a href="?logout=1" class="logout"><i class="fas fa-sign-out-alt"></i> Logout</a>
</div>

<div class="main">

  <!-- KPI Cards -->
  <div class="stats-grid">
    <div class="stat-card">
      <div class="stat-icon" style="background:rgba(0,45,98,.1);color:var(--navy)"><i class="fas fa-users"></i></div>
      <div class="stat-info"><h3>Total Inquiries</h3><p><?php echo $total_count; ?></p></div>
    </div>
    <div class="stat-card">
      <div class="stat-icon" style="background:rgba(0,179,134,.1);color:var(--green)"><i class="fas fa-check-circle"></i></div>
      <div class="stat-info"><h3>Payments Received</h3><p><?php echo $paid_count; ?></p></div>
    </div>
    <div class="stat-card">
      <div class="stat-icon" style="background:rgba(243,156,18,.1);color:var(--orange)"><i class="fas fa-hourglass-half"></i></div>
      <div class="stat-info"><h3>Pending / Failed</h3><p><?php echo $pend_count; ?></p></div>
    </div>
    <div class="stat-card">
      <div class="stat-icon" style="background:rgba(212,175,55,.12);color:var(--gold)"><i class="fas fa-indian-rupee-sign"></i></div>
      <div class="stat-info"><h3>Revenue Collected</h3><p>&#8377;<?php echo number_format($total_rev, 0); ?></p></div>
    </div>
  </div>

  <!-- Quick Period Stats -->
  <div class="quick-bar">
    <div class="qcard">
      <h4><i class="fas fa-sun" style="color:var(--gold)"></i>&nbsp; Today's Activity</h4>
      <div class="row">
        <div><span class="big"><?php echo $today_row['c']; ?></span> <span style="font-size:.75rem;color:#aaa">bookings</span></div>
        <div class="rev">&#8377;<?php echo number_format($today_row['r'] ?? 0, 0); ?> collected</div>
      </div>
    </div>
    <div class="qcard">
      <h4><i class="fas fa-calendar-week" style="color:var(--navy)"></i>&nbsp; Last 7 Days</h4>
      <div class="row">
        <div><span class="big"><?php echo $week_row['c']; ?></span> <span style="font-size:.75rem;color:#aaa">bookings</span></div>
        <div class="rev">&#8377;<?php echo number_format($week_row['r'] ?? 0, 0); ?> collected</div>
      </div>
    </div>
  </div>

  <!-- Filters -->
  <div class="filter-box">
    <form method="GET" id="ff">
      <input type="hidden" name="filter_date" id="fd_inp" value="<?php echo htmlspecialchars($filter_date); ?>">
      <div class="fg">
        <label>Quick Period</label>
        <div class="pills">
          <span class="pill <?php echo $filter_date===''?'on':'' ?>" onclick="setQ('')">All Time</span>
          <span class="pill <?php echo $filter_date==='today'?'on':'' ?>" onclick="setQ('today')">Today</span>
          <span class="pill <?php echo $filter_date==='week'?'on':'' ?>" onclick="setQ('week')">This Week</span>
          <span class="pill <?php echo $filter_date==='month'?'on':'' ?>" onclick="setQ('month')">Last 30 Days</span>
        </div>
      </div>
      <div class="fg"><label>From Date</label><input type="date" name="date_from" value="<?php echo htmlspecialchars($date_from); ?>"></div>
      <div class="fg"><label>To Date</label><input type="date" name="date_to" value="<?php echo htmlspecialchars($date_to); ?>"></div>
      <div class="fg">
        <label>Status</label>
        <select name="filter_status">
          <option value="">All Status</option>
          <option value="paid" <?php echo $filter_status==='paid'?'selected':'' ?>>Paid</option>
          <option value="pending" <?php echo $filter_status==='pending'?'selected':'' ?>>Pending</option>
          <option value="failed" <?php echo $filter_status==='failed'?'selected':'' ?>>Failed</option>
        </select>
      </div>
      <div class="fg">
        <label>Category</label>
        <select name="filter_cat">
          <option value="">All Categories</option>
          <option value="startup" <?php echo $filter_cat==='startup'?'selected':'' ?>>Startup</option>
          <option value="corporate" <?php echo $filter_cat==='corporate'?'selected':'' ?>>Corporate</option>
          <option value="psu" <?php echo $filter_cat==='psu'?'selected':'' ?>>PSU</option>
          <option value="government" <?php echo $filter_cat==='government'?'selected':'' ?>>Government</option>
          <option value="academia" <?php echo $filter_cat==='academia'?'selected':'' ?>>Academia</option>
          <option value="country" <?php echo $filter_cat==='country'?'selected':'' ?>>Country</option>
        </select>
      </div>
      <button type="submit" class="btn-apply"><i class="fas fa-filter"></i>&nbsp;Apply</button>
      <a href="admin_gls.php" class="btn-reset"><i class="fas fa-undo"></i>&nbsp;Reset</a>
      <a href="?export_csv=1&filter_date=<?php echo urlencode($filter_date); ?>&filter_status=<?php echo urlencode($filter_status); ?>&filter_cat=<?php echo urlencode($filter_cat); ?>&date_from=<?php echo urlencode($date_from); ?>&date_to=<?php echo urlencode($date_to); ?>" class="btn-csv">
        <i class="fas fa-file-csv"></i>&nbsp;Download CSV
      </a>
    </form>
  </div>

  <!-- Table -->
  <div class="table-card">
    <div class="table-top">
      <h3><i class="fas fa-table" style="color:var(--navy)"></i>&nbsp; Booking Records</h3>
      <span class="rc"><?php echo $filtered_count; ?> records</span>
    </div>
    <div style="overflow-x:auto">
    <table>
      <thead><tr>
        <th>#</th><th>Submitted</th><th>Payment Date</th><th>Name / Email</th>
        <th>Company</th><th>Category</th><th>Size</th><th>Amount</th>
        <th>Status</th><th>Txn ID</th><th>Action</th>
      </tr></thead>
      <tbody>
      <?php $i=1; while($row = $bookings_res->fetch_assoc()):
        $isPaid  = in_array($row['status'], ['success','paid']);
        $sc      = $isPaid ? 'bdg-paid' : ($row['status']==='failed' ? 'bdg-fail' : 'bdg-pen');
      ?>
      <tr>
        <td style="color:#ccc;font-size:.72rem"><?php echo $i++; ?></td>
        <td style="font-size:.78rem;color:#777;white-space:nowrap"><?php echo date('d M Y', strtotime($row['created_at'])); ?><br><span style="opacity:.6"><?php echo date('H:i', strtotime($row['created_at'])); ?></span></td>
        <td style="font-size:.78rem;white-space:nowrap">
          <?php if(!empty($row['payment_verified_at'])): ?>
            <span style="color:var(--green);font-weight:700"><?php echo date('d M Y, H:i', strtotime($row['payment_verified_at'])); ?></span>
          <?php else: echo '<span style="color:#ddd">—</span>'; endif; ?>
        </td>
        <td>
          <strong style="display:block"><?php echo htmlspecialchars($row['name']); ?></strong>
          <span style="font-size:.72rem;color:#aaa"><?php echo htmlspecialchars($row['email']); ?></span>
        </td>
        <td style="font-size:.82rem"><?php echo htmlspecialchars($row['company']); ?></td>
        <td><span class="bdg bdg-cat"><?php echo strtoupper($row['client_type']); ?></span></td>
        <td style="text-align:center;font-weight:700"><?php echo $row['selected_size']; ?>m²</td>
        <td style="font-weight:800;color:var(--navy);white-space:nowrap"><?php echo htmlspecialchars($row['currency']); ?><?php echo number_format($row['payable_amount'], 0); ?></td>
        <td><span class="bdg <?php echo $sc; ?>"><?php echo htmlspecialchars($row['status']); ?></span></td>
        <td style="font-size:.68rem;color:#bbb;max-width:110px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="<?php echo htmlspecialchars($row['txnid'] ?? ''); ?>"><?php echo htmlspecialchars(substr($row['txnid'] ?? '—', 0, 18)); ?></td>
        <td><button class="btn-d" onclick='showD(<?php echo htmlspecialchars(json_encode($row), ENT_QUOTES); ?>)'>Details</button></td>
      </tr>
      <?php endwhile; ?>
      </tbody>
    </table>
    </div>
  </div>
</div>

<!-- Modal -->
<div id="modal" class="modal" onclick="if(event.target===this)closeM()">
  <div class="mbox">
    <div class="mhead">
      <div><h2 id="mn">Details</h2><p id="ms"></p></div>
      <button class="closebtn" onclick="closeM()">&#10005;</button>
    </div>
    <div class="mbody">
      <div class="igrid" id="mg"></div>
      <div id="md"></div>
    </div>
  </div>
</div>

<script>
let cd=30;const te=document.getElementById('timer');
setInterval(()=>{cd--;if(cd<=0)location.reload();if(te)te.textContent=cd;},1000);

function setQ(v){document.getElementById('fd_inp').value=v;document.getElementById('ff').submit();}

function showD(d){
  document.getElementById('mn').textContent=d.name+' — '+d.company;
  document.getElementById('ms').textContent=(d.designation||'')+(d.designation&&d.industry?' | ':' ')+(d.industry||'');
  const sc=d.status==='success'||d.status==='paid'?'#00b386':d.status==='failed'?'#e74c3c':'#f39c12';
  document.getElementById('mg').innerHTML=`
    <div class="ii"><label>Email</label><span><a href="mailto:${d.email}">${d.email}</a></span></div>
    <div class="ii"><label>Phone / WhatsApp</label><span><a href="tel:${d.phone}">${d.phone}</a></span></div>
    <div class="ii"><label>Category</label><span>${(d.client_type||'').toUpperCase()}</span></div>
    <div class="ii"><label>Area Booked</label><span>${d.selected_size} sqm</span></div>
    <div class="ii"><label>Booking Amount</label><span style="font-size:1.1rem;font-weight:800;color:#002D62">${d.currency}${parseFloat(d.payable_amount).toLocaleString('en-IN')}</span></div>
    <div class="ii"><label>Payment Status</label><span style="color:${sc};font-weight:800">${(d.status||'').toUpperCase()}</span></div>
    <div class="ii"><label>Payment Date</label><span>${d.payment_verified_at||'—'}</span></div>
    <div class="ii"><label>PayU Payment ID</label><span>${d.last_payu_mihpayid||'—'}</span></div>
    <div class="ii"><label>Transaction ID</label><span style="font-size:.75rem;word-break:break-all">${d.txnid||'—'}</span></div>
    <div class="ii"><label>Submitted On</label><span>${d.created_at}</span></div>
    <div class="ii"><label>Location</label><span>${d.city_country||'—'}</span></div>
    <div class="ii"><label>Website</label><span>${d.website?`<a href="${d.website}" target="_blank">${d.website}</a>`:'—'}</span></div>
  `;
  document.getElementById('md').innerHTML=d.description?`
    <div style="margin-top:14px;border-top:1px solid #f0f4f8;padding-top:14px">
      <label style="font-size:.62rem;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:#999;display:block;margin-bottom:8px">Showcase Description</label>
      <div class="dbox">${d.description}</div>
    </div>`:'';
  document.getElementById('modal').style.display='flex';
}
function closeM(){document.getElementById('modal').style.display='none';}
</script>
<?php endif; ?>
</body>
</html>
