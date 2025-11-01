<?php
require __DIR__ . '/vendor/autoload.php';
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Dotenv\Dotenv;

// Load .env file
$dotenv = Dotenv::createImmutable(__DIR__ . '/../'); // Adjust path to where .env is located
$dotenv->load();

function verifyToken($token) {
    // Remove 'Bearer ' from token
    $token = str_replace('Bearer ', '', $token);
    
    try {
        // Verify JWT token
        $key = $_ENV['JWT_SECRET'];
        $decoded = JWT::decode($token, new Key($key, 'HS256'));
        return $decoded;
    } catch (Exception $e) {
        error_log("Token verification failed: " . $e->getMessage());
        return false;
    }
}

function requireAuth() {
    // Get headers
    $headers = getallheaders();
    $authHeader = isset($headers['Authorization']) ? $headers['Authorization'] : '';
    
    if (!$authHeader) {
        http_response_code(401);
        echo json_encode(['error' => 'No authorization header']);
        exit;
    }
    
    $decoded = verifyToken($authHeader);
    if (!$decoded) {
        http_response_code(401);
        echo json_encode(['error' => 'Invalid token']);
        exit;
    }
    
    return $decoded;
}
?>
