<?php
file_put_contents('debug.txt', print_r($_SERVER, true));
// verify-token.php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

require_once __DIR__ . '/vendor/autoload.php';
require_once __DIR__ . '/dp.php'; // Database connection

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

$JWT_SECRET = "your_super_secret_key_here"; // Must match reg.php & login.php

// Handle preflight OPTIONS requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// ✅ Get token from Authorization header
$authHeader = null;
if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
    $authHeader = $_SERVER['HTTP_AUTHORIZATION'];
} elseif (isset($_SERVER['REDIRECT_HTTP_AUTHORIZATION'])) { // For Apache environments
    $authHeader = $_SERVER['REDIRECT_HTTP_AUTHORIZATION'];
} elseif (function_exists('getallheaders')) {
    $headers = getallheaders();
    if (isset($headers['Authorization'])) {
        $authHeader = $headers['Authorization'];
    }
}

if (!$authHeader) {
    echo json_encode(["success" => false, "message" => "Missing Authorization header"]);
    exit;
}
list($type, $token) = explode(" ", $authHeader, 2);

if (strcasecmp($type, 'Bearer') != 0 || empty($token)) {
    echo json_encode(["success" => false, "message" => "Invalid Authorization header format"]);
    exit;
}

// ✅ Decode JWT
try {
    $decoded = JWT::decode($token, new Key($JWT_SECRET, 'HS256'));
    $userData = (array)$decoded->user;

    // Optional: Verify user still exists in DB
    $stmt = $conn->prepare("SELECT id, first_name, last_name, email, role FROM users WHERE id = ?");
    $stmt->bind_param("i", $userData['id']);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        echo json_encode(["success" => false, "message" => "User no longer exists"]);
        exit;
    }

    $user = $result->fetch_assoc();

    echo json_encode([
        "success" => true,
        "message" => "Token is valid",
        "user" => [
            "id" => $user['id'],
            "firstName" => $user['first_name'],
            "lastName" => $user['last_name'],
            "email" => $user['email'],
            "role" => $user['role']
        ]
    ]);
} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => "Invalid or expired token", "error" => $e->getMessage()]);
}
?>
