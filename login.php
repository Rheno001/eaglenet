<?php
// login.php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

require_once __DIR__ . '/vendor/autoload.php';
require_once __DIR__ . '/dp.php'; // Database connection

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

$JWT_SECRET = "your_super_secret_key_here"; // ⚠️ Must match reg.php secret

// Handle preflight OPTIONS requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Get JSON body
$data = json_decode(file_get_contents("php://input"), true);

if (!$data || empty($data['email']) || empty($data['password'])) {
    echo json_encode(["success" => false, "message" => "Email and password are required"]);
    exit;
}

$email = trim($data['email']);
$password = trim($data['password']);

// ✅ Check if user exists
$stmt = $conn->prepare("SELECT * FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(["success" => false, "message" => "Invalid email or password"]);
    exit;
}

$user = $result->fetch_assoc();

// ✅ Verify password
if (!password_verify($password, $user['password'])) {
    echo json_encode(["success" => false, "message" => "Invalid email or password"]);
    exit;
}

// ✅ Generate JWT token
$payload = [
    "iss" => "localhost",
    "aud" => "localhost",
    "iat" => time(),
    "exp" => time() + (60 * 60 * 24), // 1 day
    "user" => [
        "id" => $user['id'],
        "email" => $user['email'],
        "firstName" => $user['first_name'],
        "lastName" => $user['last_name'],
        "role" => $user['role']
    ]
];

$token = JWT::encode($payload, $JWT_SECRET, 'HS256');

echo json_encode([
    "success" => true,
    "message" => "Login successful",
    "token" => $token,
    "user" => [
        "id" => $user['id'],
        "email" => $user['email'],
        "firstName" => $user['first_name'],
        "lastName" => $user['last_name'],
        "role" => $user['role']
    ]
]);
?>
