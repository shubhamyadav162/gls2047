<?php 
  include_once 'db.php';
  include_once 'auth.php';
  include_once "header.php";
  if(!empty($_GET['st'])){
    $st=$_GET['st'];
    $id=$_GET['id'];
    $sql="UPDATE registerfinalnowform set status=$st where id=$id"; 
    $conn->query($sql);
    header("location:http://localhost/iconex/globalhse.org/myadmin/aramco.php");
?>
<meta http-equiv="refresh" content="1; url=aramco.php">
<?php } ?>
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
          <div class="card-header"><h4 class="card-title">Delegate Details</h4></div>
          <div class="card-body">
            <div class="table-responsive" style="max-height:450px !important;overflow:auto;">
              <table id="export_table" class="display table table-striped table-hover table-bordered">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Company</th>
                    <th>Designation</th>
                    <th>Option</th>
                    <th>Price</th>
                    <th>Invoice</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody style="">
                  <?php 
                    $sql="SELECT * from registerfinalnowform where code!=NULL order by status ASC, id DESC"; 
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
                      <td><?php echo $row['option'].' '.$row['inner_option']; ?></td>
                      <td><?php echo $row['price']; ?></td>
                      <td><?php echo $row['invoice_no']; ?></td>
                      <td class="center" style="width:40px !important;"><?php $st=$row['status']; if($st==1){echo '<span class="badge badge-success">Active</span>';}else if($st==2){echo '<span class="badge badge-warning">Blocked</span>';}else if($st==3){echo '<span class="badge badge-danger">Deleted</span>';}else{echo '<span class="badge badge-secondary">New</span>';}?></td>
                      <td style="width:80px !important;">
                        <a class="text-success" href="aramco.php?st=1&id=<?php echo $row['id'];?>">Active</a> | 
                        <a class="text-warning" href="aramco.php?st=2&id=<?php echo $row['id'];?>">Block</a> | 
                        <a class="text-danger" href="aramco.php?st=3&id=<?php echo $row['id'];?>">Delete</a>
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
