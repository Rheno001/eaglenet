<?php
require 'c:/xampp/htdocs/backend/dp.php';
$res = $conn->query('DESCRIBE users');
while($r = $res->fetch_row()) echo $r[0] . " ";
?>
