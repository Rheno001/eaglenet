<?php
// Enable error reporting (for development only)
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Allow CORS (adjust the origin if needed)
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Accept");
header('Content-Type: application/json');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Helper function to send JSON responses
function sendResponse($success, $message) {
    echo json_encode(['success' => $success, 'message' => $message]);
    exit;
}

// Read raw JSON input
$rawInput = file_get_contents('php://input');
$data = json_decode($rawInput, true);

if (!$data) {
    sendResponse(false, 'Invalid JSON input');
}

// Extract and sanitize form data
$email = trim($data['email'] ?? '');
$password = trim($data['password'] ?? '');

// Validate fields
if (!$email || !$password) {
    sendResponse(false, 'Email and password are required');
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    sendResponse(false, 'Invalid email address');
}

// Database connection
$servername = "localhost";
$username = "root";
$passwordDB = ""; // Your DB password if any
$dbname = "eaglenet";

$conn = new mysqli($servername, $username, $passwordDB, $dbname);

if ($conn->connect_error) {
    sendResponse(false, 'Database connection failed: ' . $conn->connect_error);
}

// Check if user exists
$stmt = $conn->prepare("SELECT id, full_name, password FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows === 0) {
    $stmt->close();
    $conn->close();
    sendResponse(false, 'Email not registered');
}

$stmt->bind_result($id, $fullName, $hashedPassword);
$stmt->fetch();

// Verify password
if (!password_verify($password, $hashedPassword)) {
    $stmt->close();
    $conn->close();
    sendResponse(false, 'Incorrect password');
}

$stmt->close();
$conn->close();

// Login successful
sendResponse(true, 'Login successful');
?>
