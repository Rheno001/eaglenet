<?php
require 'c:/xampp/htdocs/backend/dp.php';
$sql = "ALTER TABLE users ADD COLUMN phone VARCHAR(20) AFTER email";
if ($conn->query($sql)) {
    echo "Phone column added successfully";
} else {
    echo "Error: " . $conn->error;
}
?>
