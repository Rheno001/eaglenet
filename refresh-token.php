<?php
// refresh-token.php
header("Access-Control-Allow-Origin: http://localhost:5173"); // React frontend port
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");

require_once __DIR__ . '/vendor/autoload.php';
require_once __DIR__ . '/dp.php';

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

$JWT_SECRET = $_ENV['JWT_SECRET'];
$REFRESH_SECRET = $_ENV['REFRESH_SECRET'];

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// ✅ Check for refresh token cookie
if (empty($_COOKIE['refresh_token'])) {
    echo json_encode(["success" => false, "message" => "No refresh token found"]);
    exit;
}

$refreshToken = $_COOKIE['refresh_token'];

try {
    // ✅ Verify refresh token
    $decoded = JWT::decode($refreshToken, new Key($REFRESH_SECRET, 'HS256'));
    $userId = $decoded->user_id;

    // ✅ Verify user still exists
    $stmt = $conn->prepare("SELECT id, first_name, last_name, email, role FROM users WHERE id = ?");
    $stmt->bind_param("i", $userId);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        echo json_encode(["success" => false, "message" => "User no longer exists"]);
        exit;
    }

    $user = $result->fetch_assoc();

    // ✅ Generate new access token
    $accessPayload = [
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

    $newAccessToken = JWT::encode($accessPayload, $JWT_SECRET, 'HS256');

    echo json_encode([
        "success" => true,
        "message" => "Token refreshed successfully",
        "token" => $newAccessToken,
        "user" => $user
    ]);

} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => "Invalid or expired refresh token", "error" => $e->getMessage()]);
}
?>
