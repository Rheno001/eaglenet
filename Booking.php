<?php
// JSON Only Output
ini_set('display_errors', '0');
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=utf-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization");

// Handle fatal exceptions as JSON
set_exception_handler(function($e) {
  http_response_code(500);
  echo json_encode(["status" => "error", "message" => "Uncaught exception: " . $e->getMessage()]);
  exit;
});

register_shutdown_function(function() {
  $err = error_get_last();
  if ($err !== null) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Fatal error: " . $err['message']]);
    exit;
  }
});

// DB Connection
$servername = "localhost";
$username = "root";
$passwordDB = ""; 
$dbname = "eaglenet";

// Handle CORS preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(200);
  exit;
}

// Create mysqli connection using the variables defined above
$conn = new mysqli($servername, $username, $passwordDB, $dbname);

if ($conn->connect_error) {
  echo json_encode(["status" => "error", "message" => "Database connection failed"]);
  exit;
}

// Read JSON
$raw = file_get_contents("php://input");
$data = json_decode($raw, true);

if (json_last_error() !== JSON_ERROR_NONE) {
  echo json_encode(["status" => "error", "message" => "Invalid JSON: " . json_last_error_msg()]);
  exit;
}

if (!is_array($data) || empty($data)) {
  echo json_encode(["status" => "error", "message" => "No data received"]);
  exit;
}

// Extract fields
$customerName = $data['customerName'] ?? '';
$email = $data['email'] ?? '';
$phone = $data['phone'] ?? '';
$pickupAddress = $data['pickupAddress'] ?? '';
$pickupCity = $data['pickupCity'] ?? '';
$destination = $data['destination'] ?? '';
$destinationCity = $data['destinationCity'] ?? '';
$packageWeight = $data['packageWeight'] ?? '';
$packageType = $data['packageType'] ?? '';
$packageDetails = $data['packageDetails'] ?? '';
$date = $data['date'] ?? '';
$preferredTime = $data['preferredTime'] ?? '';
$specialRequirements = $data['specialRequirements'] ?? '';
$trackingId = $data['trackingId'] ?? null;

// ✅ FIXED: Corrected bind_param type string (all strings)
$stmt = $conn->prepare("
  INSERT INTO bookings (
    customerName, email, phone, pickupAddress, pickupCity,
    destination, destinationCity, packageWeight, packageType,
    packageDetails, date, preferredTime, specialRequirements, trackingId
  )
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
");

if (!$stmt) {
  echo json_encode(["status" => "error", "message" => "Prepare failed: " . $conn->error]);
  exit;
}

$stmt->bind_param(
  "ssssssssssssss", // ✅ all 14 parameters as strings
  $customerName,
  $email,
  $phone,
  $pickupAddress,
  $pickupCity,
  $destination,
  $destinationCity,
  $packageWeight,
  $packageType,
  $packageDetails,
  $date,
  $preferredTime,
  $specialRequirements,
  $trackingId
);

if ($stmt->execute()) {
  echo json_encode([
    "status" => "success",
    "message" => "Booking saved successfully",
    "trackingId" => $trackingId
  ]);
} else {
  echo json_encode(["status" => "error", "message" => "Failed to save: " . $stmt->error]);
}

$stmt->close();
$conn->close();

?>
