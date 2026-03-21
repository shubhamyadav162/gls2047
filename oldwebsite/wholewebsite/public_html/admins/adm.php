<?php include_once 'auth.php';?>
<!DOCTYPE html>
<html lang="en">
  <head>
    <title>GLS Vision 2047 GLS Admin</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
  </head>
  <body>
    <div class="container mt-3">
      <div class="row d-flex justify-content-center pt-5">
        <div class="col-lg-6 col-md-6 col-12 shadow p-4">
          <h2 class="text-center"><?php echo $_SESSION['name']; ?> Dashboard</h2>
          <a href="logout.php" class="btn btn-danger float-end">Logout</a>
        </div>
      </div>
    </div>
  </body>
</html>
