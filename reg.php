<?php
// reg.php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

require_once __DIR__ . '/vendor/autoload.php';
require_once __DIR__ . '/dp.php'; // contains $conn = new mysqli(...);

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

$JWT_SECRET = "your_super_secret_key_here"; // 🔒 Change this to a strong secret key

// Handle preflight OPTIONS requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Get JSON body
$data = json_decode(file_get_contents("php://input"), true);
if (!$data || empty($data['firstName']) || empty($data['lastName']) || empty($data['email']) || empty($data['password'])) {
    echo json_encode(["success" => false, "message" => "All fields are required"]);
    exit;
}

$firstName = trim($data['firstName']);
$lastName  = trim($data['lastName']);
$email     = trim($data['email']);
$password  = password_hash(trim($data['password']), PASSWORD_DEFAULT);

// ✅ Check if email already exists
$check = $conn->prepare("SELECT id FROM users WHERE email = ?");
$check->bind_param("s", $email);
$check->execute();
$result = $check->get_result();
if ($result->num_rows > 0) {
    echo json_encode(["success" => false, "message" => "Email already registered"]);
    exit;
}

// ✅ Insert new user
$stmt = $conn->prepare("INSERT INTO users (first_name, last_name, email, password, role) VALUES (?, ?, ?, ?, ?)");
$role = "user"; // default role
$stmt->bind_param("sssss", $firstName, $lastName, $email, $password, $role);

if ($stmt->execute()) {
    $userId = $conn->insert_id;

    // ✅ Create token payload
    $payload = [
        "iss" => "localhost",
        "aud" => "localhost",
        "iat" => time(),
        "exp" => time() + (60 * 60 * 24), // 1 day expiry
        "user" => [
            "id" => $userId,
            "email" => $email,
            "firstName" => $firstName,
            "lastName" => $lastName,
            "role" => $role
        ]
    ];

    // ✅ Encode JWT
    $token = JWT::encode($payload, $JWT_SECRET, 'HS256');

    echo json_encode([
        "success" => true,
        "message" => "Registration successful",
        "token" => $token,
        "user" => [
            "id" => $userId,
            "email" => $email,
            "firstName" => $firstName,
            "lastName" => $lastName,
            "role" => $role
        ]
    ]);
} else {
    echo json_encode(["success" => false, "message" => "Registration failed"]);
}
?>
