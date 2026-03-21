<!DOCTYPE html>
<html lang="en">
  <head>
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <title>GLS Vision 2047 GLS Admin</title>
    <meta content="width=device-width, initial-scale=1.0, shrink-to-fit=no" name="viewport"/>
    <link rel="icon" href="../images/GLS_Favicon.png" type="image/png"/>
    <!-- Fonts and icons -->
    <script src="assets/js/plugin/webfont/webfont.min.js"></script>
    <script>
      WebFont.load({
        google: { families: ["Public Sans:300,400,500,600,700"] },
        custom: {
          families: [
            "Font Awesome 5 Solid",
            "Font Awesome 5 Regular",
            "Font Awesome 5 Brands",
            "simple-line-icons",
          ],
          urls: ["assets/css/fonts.min.css"],
        },
        active: function () {
          sessionStorage.fonts = true;
        },
      });
    </script>
    <!-- CSS Files -->
    <link rel="stylesheet" href="assets/css/bootstrap.min.css" />
    <link rel="stylesheet" href="assets/css/plugins.min.css" />
    <link rel="stylesheet" href="assets/css/kaiadmin.min.css" />
    <!-- Datatables -->
    <link rel="stylesheet" href="https://cdn.datatables.net/2.3.0/css/dataTables.dataTables.css" />
    <link rel="stylesheet" href="https://cdn.datatables.net/buttons/3.2.3/css/buttons.dataTables.css" />
    <!-- CSS Just for demo purpose, don't include it in your project -->
    <link rel="stylesheet" href="assets/css/demo.css" />
    <style>
      .red,.error{color:red !important;}
      th{text-align:center;}
    </style>
  </head>
  <body>
    <div class="wrapper">

      <div class="sidebar" data-background-color="dark">
        <div class="sidebar-logo">
          <div class="logo-header" data-background-color="dark">
            <a href="index.php" class="logo text-white" >
               <img src="../images/vision2047logomain.png" alt="GLS Logo" class="navbar-brand" height="40" style="background:#fff; padding:2px;border-radius:5px;"/>
               GLS Admin
            </a>
            <div class="nav-toggle">
              <button class="btn btn-toggle toggle-sidebar"><i class="gg-menu-right"></i></button>
              <button class="btn btn-toggle sidenav-toggler"><i class="gg-menu-left"></i></button>
            </div>
            <button class="topbar-toggler more"><i class="gg-more-vertical-alt"></i></button>
          </div>
        </div>
        <div class="sidebar-wrapper scrollbar scrollbar-inner">
          <div class="sidebar-content">
            <ul class="nav nav-secondary">
              <li class="nav-item active">
                <a href="index.php" class="collapsed" aria-expanded="false">
                  <i class="fas fa-home"></i><p>Dashboard</p><!-- <span class="caret"></span> -->
                </a>
              </li>
              <li class="nav-section">
                <span class="sidebar-mini-icon"><i class="fa fa-ellipsis-h"></i></span>
                <h4 class="text-section">Components</h4>
              </li>
              <li class="nav-item"><a href="index.php"><i class="fas fa-tachometer-alt"></i><p>Overview</p></a></li>
              <li class="nav-item"><a href="exhibition_dashboard.php"><i class="fas fa-chart-line"></i><p>Exhibition Live</p></a></li>
              <li class="nav-item"><a href="exhibition_export.php"><i class="fas fa-file-export"></i><p>Download Data</p></a></li>
              <!-- <li class="nav-item"><a href="delegate.php"><i class="fas fa-th-list"></i><p>Delegates</p></a></li> -->
              <!-- <li class="nav-item"><a href="aramco.php"><i class="fas fa-th-list"></i><p>Aramco Delegates</p></a></li> -->
              <!-- <li class="nav-item"><a href="exhibitor.php"><i class="fas fa-th-list"></i><p>Exhibitors</p></a></li> -->
              <!-- <li class="nav-item"><a href="sponsorship.php"><i class="fas fa-th-list"></i><p>Sponsorship</p></a></li> -->
              <li class="nav-item error"><a href="logout.php"><i class="fas fa-power-off error"></i><p>Logout</p></a></li>
            </ul>
          </div>
        </div>
      </div>

      <div class="main-panel">
        <div class="main-header">
          <div class="main-header-logo">
            <!-- Logo Header -->
            <div class="logo-header" data-background-color="dark">
              <a href="dashboard.php" class="logo"><img src="assets/img/logo/white_india.png" alt="navbar brand" class="navbar-brand" height="20" /></a>
              <div class="nav-toggle">
                <button class="btn btn-toggle toggle-sidebar"><i class="gg-menu-right"></i></button>
                <button class="btn btn-toggle sidenav-toggler"><i class="gg-menu-left"></i></button>
              </div>
              <button class="topbar-toggler more"><i class="gg-more-vertical-alt"></i></button>
            </div>
          </div>
          <nav class="navbar navbar-header navbar-header-transparent navbar-expand-lg border-bottom">
            <div class="container-fluid">
              <ul class="navbar-nav topbar-nav ms-md-auto align-items-center">
                <li class="nav-item topbar-user dropdown hidden-caret">
                  <a class="dropdown-toggle profile-pic" data-bs-toggle="dropdown" href="#"aria-expanded="false">
                    <div class="avatar-sm text-white">GLS Vision 2047 GLS Admin
                      <!-- <img src="assets/img/logo/uk_i.png" alt="..." class="avatar-img rounded-circle"/> -->
                    </div>
                    <span class="profile-username text-left">
                      <?php ?><span class="op-7">Hi</span> <?php if(isset($_SESSION['name'])){echo $_SESSION['name']; }else{echo 'Guest';}?>
                    </span>
                  </a>
                  <ul class="dropdown-menu dropdown-user animated fadeIn">
                    <div class="dropdown-user-scroll scrollbar-outer">
                      <li>
                        <div class="dropdown-divider"></div>
                        <a class="dropdown-item error" href="logout.php">Logout</a>
                      </li>
                    </div>
                  </ul>
                </li>
              </ul>
            </div>
          </nav>
        </div>
