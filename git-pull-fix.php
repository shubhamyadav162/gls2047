<?php
echo "<pre>";
echo "Starting git pull...\n";
$output = shell_exec("git pull origin main 2>&1");
echo $output;
echo "\nDone.";
echo "</pre>";
?>
