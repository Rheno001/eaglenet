<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

$host = "localhost"; // Change if needed
$user = "root";
$password = ""; // Add your DB password
$dbname = "eaglenet"; // Change this

$conn = new mysqli($host, $user, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode(["status" => "error", "message" => "Connection failed"]));
}

$sql = "SELECT * FROM bookings"; // ✅ Table name
$result = $conn->query($sql);

$bookings = [];

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $bookings[] = $row;
    }
}

// Return the bookings array directly so frontend can consume it as an array.
// This keeps the response simple: [{...}, {...}, ...]
echo json_encode($bookings);

$conn->close();
?>
