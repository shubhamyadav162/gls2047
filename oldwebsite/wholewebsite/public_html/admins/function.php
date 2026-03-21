<?php
  include_once 'db.php';
  class User extends Database{
    private $table_name       = "users";
    private $contact_us       = "contact_now";
    private $brochure         = "download_brochure";
    private $exhibitor_table  = "exhibitor_table";
    private $delegate_table   = "delegate_table";
    private $sponsorship_table= "sponsorship_table";
    public  $id;
    public  $name;
    public  $email;
    public  $password;

    public function register(){
      $query = " INSERT INTO ".$this->table_name. "(name,email,password) VALUES (:name, :email, :password)";
      $stmt = $this->conn->prepare($query);
      $this->password = password_hash($this->password, PASSWORD_DEFAULT);
      $stmt->bindParam(':name',$this->name);
      $stmt->bindParam(':email',$this->email);
      $stmt->bindParam(':password',$this->password);
      if($stmt->execute()){
        return true;
      }else{
        return false;
      }
    }

    public function login(){
      $query  = " SELECT * FROM ".$this->table_name. " WHERE email = :email";
      $stmt   = $this->conn->prepare($query);
      $stmt->bindParam(':email',$this->email);
      $stmt->execute();
      $row    = $stmt->fetch(PDO::FETCH_ASSOC);
      if($row && password_verify($this->password, $row['password'])){
        $this->id   = $row['id'];
        $this->name = $row['name'];
        return true;
      }else{
        return false;
      }
    }

    public function contactList(){
      $sql  = "SELECT * FROM ".$this->contact_us;
      $data = $this->conn->prepare($sql);
      $data->execute();
      if($data->rowCount() > 0){
        while($result = $data->fetch(PDO::FETCH_ASSOC)){
          $responseArray[] = $result;
        }
        return $responseArray;
      }else{
        echo "No data found"; 
      }        
    }

    public function delegateList(){
      $sql  = "SELECT * FROM ".$this->delegate_table;
      $data = $this->conn->prepare($sql);
      $data->execute();
      if($data->rowCount() > 0){
        while($result = $data->fetch(PDO::FETCH_ASSOC)){
          $responseArray[] = $result;
        }
        return $responseArray;
      }else{
        echo "No data found"; 
      }
    }

    public function sponsorshipList(){
      $sql  = "SELECT * FROM ".$this->sponsorship_table;
      $data = $this->conn->prepare($sql);
      $data->execute();
      if($data->rowCount() > 0){
        while($result = $data->fetch(PDO::FETCH_ASSOC)){
          $responseArray[] = $result;
        }
        return $responseArray;
      }else{
        echo "No data found"; 
      }
    }

    public function exhibitorList(){
      $sql  = "SELECT * FROM ".$this->sponsorship_table;
      $data = $this->conn->prepare($sql);
      $data->execute();
      if($data->rowCount() > 0){
        while($result = $data->fetch(PDO::FETCH_ASSOC)){
          $responseArray[] = $result;
        }
        return $responseArray;
      }else{
        echo "No data found"; 
      }
    }

    public function brochureList(){
      $sql  = "SELECT * FROM ".$this->brochure;
      $data = $this->conn->prepare($sql);
      $data->execute();
      if($data->rowCount() > 0){
        while($result = $data->fetch(PDO::FETCH_ASSOC)){
            $responseArray[] = $result;
        }
        return $responseArray;
      }else{
        echo "No data found"; 
      }
    }

  }

  $obj              = new User();
  $fetch_data       = $obj->contactList();
  $brochure_data    = $obj->brochureList();
  $delagate_data    = $obj->delegateList();
  $sponsorship_data = $obj->sponsorshipList();
  $exhibitor_data   = $obj->exhibitorList();

?>
