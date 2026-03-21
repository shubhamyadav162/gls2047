<?php 
  include_once("db.php");
  include_once 'auth.php';
  include_once "header.php";
  if(!empty($_GET['st'])){
    $st=$_GET['st'];
    $id=$_GET['id'];
    $sql="UPDATE sponsershipform set status=$st where id=$id"; 
    $conn->query($sql);
?>
<meta http-equiv="refresh" content="1; url=sponsorship.php">
<?php } 
  function get_countryName($id)
  {
    $sql="SELECT name from countries where id=$id"; 
    $result = $conn->query($sql);
    if ($result->num_rows > 0) {
      // $row = $result->fetch_assoc();
      while($row = $result->fetch_assoc()) {
      // if(!empty($row)){
        echo $row['name'];
      }
    }
  }
  function get_stateName($id)
  {
    $sql="SELECT name from states where id=$id"; 
    $result = $conn->query($sql);
    if ($result->num_rows > 0) {
      $row = $result->fetch_assoc();
      if(!empty($row)){
        echo $row[0]['name'];
      }
    }
  }
  function get_cityName($id)
  {
    $sql="SELECT name from cities where id=$id"; 
    $result=$conn->query($sql);
    if ($result->num_rows > 0) {
      while($row = $result->fetch_assoc()) {
        echo $row['name'];        
      }
    }  
  }
?>
<style type="text/css">
  .center{text-align:center;}
  .left{text-align:left;}
  .right{text-align:right;}
  table{border:1px solid #ddd !important;}
  .display > thead > tr > th{border:1px solid #ddd !important;padding:10px 2px 10px 2px !important;overflow-x:hidden;white-space:nowrap;}
  .display > tbody > tr > td{border:1px solid #ddd !important;padding:2px !important;overflow-x:hidden;white-space:nowrap;}
</style>
<div class="container">
  <div class="page-inner">
    <!-- <div class="page-header">
      <h3 class="fw-bold mb-3">White Hydrogen</h3>
      <ul class="breadcrumbs mb-3">
        <li class="nav-home"><a href="#"><i class="icon-home"></i></a></li>
        <li class="separator"><i class="icon-arrow-right"></i></li>
        <li class="nav-item"><a href="#">Tables</a></li>
        <li class="separator"><i class="icon-arrow-right"></i></li>
        <li class="nav-item"><a href="#">Datatables</a></li>
      </ul>
    </div> -->
    <div class="row">
      <div class="col-md-12">
        <div class="card">
          <div class="card-header"><h4 class="card-title">Sponsorship Details</h4></div>
          <div class="card-body">
            <div class="table-responsive">
              <table id="export_table" class="display table table-striped table-hover">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Company</th>
                    <th>Designation</th>
                    <!-- <th>Country</th> -->
                    <!-- <th>State</th> -->
                    <!-- <th>City</th> -->
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  <?php 
                    $sql="SELECT * from sponsershipform order by status ASC, id DESC"; 
                    $result=$conn->query($sql);
                    if ($result->num_rows > 0) {
                      while($row = $result->fetch_assoc()) {
                  ?>
                    <tr>
                      <td class="center"  style="width:20px !important;"><?php echo $row['id']; ?></td>
                      <td><?php echo $row['first_name'].' '.$row['last_name']; ?></td>
                      <td><?php echo $row['email']; ?></td>
                      <td><?php echo $row['mobile']; ?></td>
                      <td><?php echo $row['organisation']; ?></td>
                      <td><?php echo $row['job_title']; ?></td>
                      <!-- <td><?php //print_r(get_countryName($row['country'])); ?></td> -->
                      <!-- <td><?php //echo get_stateName($row['state']); ?></td> -->
                      <!-- <td><?php //echo get_cityName($row['city']); ?></td> -->
                      <td class="center" style="width:40px !important;"><?php $st=$row['status']; if($st==1){echo '<span class="badge badge-success">Active</span>';}else if($st==2){echo '<span class="badge badge-warning">Blocked</span>';}else if($st==3){echo '<span class="badge badge-danger">Deleted</span>';}else{echo '<span class="badge badge-secondary">New</span>';}?></td>
                      <td style="width:80px !important;">
                        <a class="text-success" href="sponsorship.php?st=1&id=<?php echo $row['id'];?>">Active</a> | 
                        <a class="text-warning" href="sponsorship.php?st=2&id=<?php echo $row['id'];?>">Block</a> | 
                        <a class="text-danger" href="sponsorship.php?st=3&id=<?php echo $row['id'];?>">Delete</a>
                      </td>
                    </tr>
                  <?php } }?>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
<?php include_once "footer.php"; ?>
