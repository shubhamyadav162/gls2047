<?php
session_start();

// Configuration
$ADMIN_PASSWORD = 'GLSAdmin@2026'; // You can change this
$db_host = 'localhost';
$db_user = 'u364184455_pan_iit';
$db_pass = 'Pan_iit@1614';
$db_name = 'u364184455_paniit';

// Authentication Logic
if (isset($_POST['password'])) {
    if ($_POST['password'] === $ADMIN_PASSWORD) {
        $_SESSION['authenticated'] = true;
    } else {
        $error = "Invalid Password!";
    }
}

if (isset($_GET['logout'])) {
    session_destroy();
    header("Location: admin_gls.php");
    exit;
}

$authenticated = isset($_SESSION['authenticated']) && $_SESSION['authenticated'] === true;

// Database Connection
$conn = null;
if ($authenticated) {
    $conn = new mysqli($db_host, $db_user, $db_pass, $db_name);
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }
}

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>GLS 2026 | Admin Dashboard</title>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
    <style>
        :root {
            --primary: #0b3c5e;
            --gold: #D4AF37;
            --success: #2ecc71;
            --pending: #f1c40f;
            --bg: #f5f7fa;
            --card-bg: #fff;
        }

        body {
            font-family: 'Outfit', sans-serif;
            background-color: var(--bg);
            color: #333;
            margin: 0;
            padding: 0;
        }

        /* Login Page View */
        .login-container {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background: linear-gradient(135deg, #0b3c5e 0%, #061d2e 100%);
        }

        .login-card {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(15px);
            padding: 40px;
            border-radius: 20px;
            border: 1px solid rgba(255, 255, 255, 0.2);
            width: 100%;
            max-width: 400px;
            text-align: center;
            color: white;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        }

        .login-card img {
            height: 60px;
            margin-bottom: 20px;
        }

        .login-card h2 {
            margin-bottom: 30px;
            font-weight: 600;
        }

        .form-group {
            margin-bottom: 20px;
            text-align: left;
        }

        .form-group input {
            width: 100%;
            padding: 12px 15px;
            border-radius: 10px;
            border: 1px solid rgba(255, 255, 255, 0.3);
            background: rgba(255, 255, 255, 0.05);
            color: white;
            box-sizing: border-box;
            outline: none;
        }

        .login-btn {
            width: 100%;
            padding: 12px;
            border: none;
            background: var(--gold);
            color: #000;
            font-weight: 700;
            border-radius: 10px;
            cursor: pointer;
            transition: transform 0.2s;
        }

        .login-btn:hover {
            transform: scale(1.02);
            background: #e5bc3e;
        }

        /* Dashboard View */
        .header {
            background: var(--primary);
            color: white;
            padding: 15px 40px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        .header h1 {
            font-size: 1.5rem;
            margin: 0;
            display: flex;
            align-items: center;
            gap: 15px;
        }

        .live-badge {
            background: #ff4d4d;
            color: white;
            font-size: 0.65rem;
            padding: 2px 8px;
            border-radius: 4px;
            font-weight: 800;
            letter-spacing: 1px;
            display: flex;
            align-items: center;
            gap: 5px;
            animation: pulse 2s infinite;
        }

        @keyframes pulse {
            0% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.05); opacity: 0.7; }
            100% { transform: scale(1); opacity: 1; }
        }

        .auto-refresh-text {
            font-size: 0.75rem;
            color: rgba(255,255,255,0.6);
            margin-left: 15px;
            border-left: 1px solid rgba(255,255,255,0.2);
            padding-left: 15px;
        }

        .header .logout {
            color: #ccc;
            text-decoration: none;
            font-size: 0.9rem;
            display: flex;
            align-items: center;
            gap: 5px;
        }

        .header .logout:hover {
            color: white;
        }

        .main-content {
            padding: 40px;
            max-width: 1400px;
            margin: 0 auto;
        }

        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 25px;
            margin-bottom: 40px;
        }

        .stat-card {
            background: var(--card-bg);
            padding: 25px;
            border-radius: 15px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.05);
            display: flex;
            align-items: center;
            gap: 20px;
        }

        .stat-icon {
            width: 50px;
            height: 50px;
            border-radius: 12px;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 1.5rem;
        }

        .stat-info h3 {
            margin: 0;
            font-size: 0.9rem;
            color: #777;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        .stat-info p {
            margin: 5px 0 0;
            font-size: 1.8rem;
            font-weight: 700;
            color: var(--primary);
        }

        .table-container {
            background: var(--card-bg);
            border-radius: 15px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.05);
            overflow: hidden;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            text-align: left;
        }

        thead {
            background: #f8f9fa;
            border-bottom: 2px solid #eee;
        }

        th {
            padding: 15px 20px;
            font-size: 0.85rem;
            text-transform: uppercase;
            color: #666;
            font-weight: 600;
        }

        td {
            padding: 15px 20px;
            font-size: 0.95rem;
            border-bottom: 1px solid #f0f0f0;
        }

        tr:hover {
            background: #fafafa;
        }

        .status-badge {
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 0.8rem;
            font-weight: 600;
            text-transform: uppercase;
        }

        .status-success {
            background: rgba(46, 204, 113, 0.1);
            color: #27ae60;
        }

        .status-pending {
            background: rgba(241, 196, 15, 0.1);
            color: #f39c12;
        }

        .btn-view {
            padding: 5px 10px;
            background: #eee;
            border-radius: 5px;
            font-size: 0.8rem;
            color: #555;
            cursor: pointer;
        }

        /* Modal simple for details */
        .modal {
            display: none;
            position: fixed;
            z-index: 2000;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            justify-content: center;
            align-items: center;
        }

        .modal-content {
            background: white;
            padding: 30px;
            border-radius: 15px;
            width: 90%;
            max-width: 600px;
            max-height: 80vh;
            overflow-y: auto;
        }

        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid #eee;
            padding-bottom: 15px;
            margin-bottom: 20px;
        }

        .close-modal {
            font-size: 1.5rem;
            cursor: pointer;
            color: #999;
        }
    </style>
</head>
<body>

<?php if (!$authenticated): ?>
    <div class="login-container">
        <div class="login-card">
            <img src="images/GLS_Logo.jpg" alt="GLS 2026">
            <h2>Admin Login</h2>
            <?php if (isset($error)): ?>
                <p style="color: #ff4d4d; margin-bottom: 20px;"><?php echo $error; ?></p>
            <?php endif; ?>
            <form method="POST">
                <div class="form-group">
                    <label>Dashboard Password</label>
                    <input type="password" name="password" placeholder="Enter password" required autofocus>
                </div>
                <button type="submit" class="login-btn">Secure Login</button>
            </form>
        </div>
    </div>
<?php else: 
    // Fetch Data
    $total_res = $conn->query("SELECT COUNT(*) as count FROM exhibition_bookings");
    $total_count = $total_res->fetch_assoc()['count'];

    $paid_res = $conn->query("SELECT COUNT(*) as count FROM exhibition_bookings WHERE status IN ('success', 'paid')");
    $paid_count = $paid_res->fetch_assoc()['count'];

    $bounced_res = $conn->query("SELECT COUNT(*) as count FROM exhibition_bookings WHERE status = 'pending'");
    $bounced_count = $bounced_res->fetch_assoc()['count'];

    $sum_res = $conn->query("SELECT SUM(payable_amount) as total FROM exhibition_bookings WHERE status IN ('success', 'paid')");
    $total_revenue = $sum_res->fetch_assoc()['total'] ?: 0;

    $bookings_res = $conn->query("SELECT * FROM exhibition_bookings ORDER BY created_at DESC");
?>
    <div class="header">
        <h1>
            <img src="images/GLS_fevicon.png" style="height: 30px;">
            Exhibition Registry Dashboard
            <span class="live-badge"><i class="fas fa-circle" style="font-size: 6px;"></i> LIVE</span>
            <span class="auto-refresh-text">Auto-refreshing in <span id="timer">30</span>s</span>
        </h1>
        <a href="?logout=1" class="logout"><i class="fas fa-sign-out-alt"></i> Logout</a>
    </div>

    <div class="main-content">
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-icon" style="background: rgba(11, 60, 94, 0.1); color: var(--primary);">
                    <i class="fas fa-users"></i>
                </div>
                <div class="stat-info">
                    <h3>Total Inquiries</h3>
                    <p><?php echo $total_count; ?></p>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon" style="background: rgba(46, 204, 113, 0.1); color: var(--success);">
                    <i class="fas fa-check-circle"></i>
                </div>
                <div class="stat-info">
                    <h3>Successful Payments</h3>
                    <p><?php echo $paid_count; ?></p>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon" style="background: rgba(241, 196, 15, 0.1); color: var(--pending);">
                    <i class="fas fa-clock"></i>
                </div>
                <div class="stat-info">
                    <h3>Pending/Bounced</h3>
                    <p><?php echo $bounced_count; ?></p>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon" style="background: rgba(212, 175, 55, 0.1); color: var(--gold);">
                    <i class="fas fa-wallet"></i>
                </div>
                <div class="stat-info">
                    <h3>Revenue (Paid)</h3>
                    <p>₹<?php echo number_format($total_revenue, 2); ?></p>
                </div>
            </div>
        </div>

        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Name</th>
                        <th>Company</th>
                        <th>Category</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    <?php while($row = $bookings_res->fetch_assoc()): ?>
                    <tr>
                        <td style="color: #888; font-size: 0.85rem;"><?php echo date('d M, H:i', strtotime($row['created_at'])); ?></td>
                        <td><strong><?php echo htmlspecialchars($row['name']); ?></strong></td>
                        <td><?php echo htmlspecialchars($row['company']); ?></td>
                        <td><span style="font-size: 0.75rem; background: #eee; padding: 3px 8px; border-radius: 10px;"><?php echo strtoupper($row['client_type']); ?></span></td>
                        <td><?php echo $row['currency'] . number_format($row['payable_amount'], 2); ?></td>
                        <td>
                            <span class="status-badge <?php echo ($row['status'] === 'success' || $row['status'] === 'paid') ? 'status-success' : 'status-pending'; ?>">
                                <?php echo htmlspecialchars($row['status']); ?>
                            </span>
                        </td>
                        <td>
                            <button class="btn-view" onclick="showDetails(<?php echo htmlspecialchars(json_encode($row)); ?>)">Details</button>
                        </td>
                    </tr>
                    <?php endwhile; ?>
                </tbody>
            </table>
        </div>
    </div>

    <!-- Details Modal -->
    <div id="detailsModal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h2 id="m-name">Exhibitor Details</h2>
                <span class="close-modal" onclick="closeModal()">&times;</span>
            </div>
            <div id="m-body" style="line-height: 1.8;">
                <!-- Detailed info injected here by JS -->
            </div>
        </div>
    </div>

    <script>
        // Auto-refresh logic
        let timeLeft = 30;
        const timerElement = document.getElementById('timer');
        
        setInterval(() => {
            timeLeft--;
            if (timeLeft <= 0) {
                window.location.reload();
            }
            if(timerElement) timerElement.innerText = timeLeft;
        }, 1000);

        function showDetails(data) {
            const body = document.getElementById('m-body');
            document.getElementById('m-name').innerText = data.name + ' (' + data.company + ')';
            
            let html = `
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                    <div><strong>Designation:</strong> ${data.designation}</div>
                    <div><strong>Industry:</strong> ${data.industry}</div>
                    <div><strong>Email:</strong> ${data.email}</div>
                    <div><strong>Phone:</strong> ${data.phone}</div>
                    <div><strong>Location:</strong> ${data.city_country}</div>
                    <div><strong>Website:</strong> <a href="${data.website}" target="_blank">${data.website}</a></div>
                    <div><strong>Type:</strong> ${data.client_type}</div>
                    <div><strong>Sizesqm:</strong> ${data.selected_size} sqm</div>
                    <div><strong>Transaction ID:</strong> ${data.txnid || 'N/A'}</div>
                    <div><strong>Date:</strong> ${data.created_at}</div>
                </div>
                <div style="margin-top: 20px; border-top: 1px solid #eee; padding-top: 15px;">
                    <strong>Description:</strong><br>
                    <p style="white-space: pre-wrap; font-size: 0.9rem; color: #555;">${data.description}</p>
                </div>
            `;
            body.innerHTML = html;
            document.getElementById('detailsModal').style.display = 'flex';
        }

        function closeModal() {
            document.getElementById('detailsModal').style.display = 'none';
        }

        window.onclick = function(event) {
            if (event.target == document.getElementById('detailsModal')) {
                closeModal();
            }
        }
    </script>
<?php endif; ?>

</body>
</html>
