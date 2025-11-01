<?php
require_once __DIR__ . '/config.php';
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class JWTToken {
    
    // Generate a JWT token
    public static function generateToken(array $user, int $expirySeconds = 3600): string {
        $payload = [
            "iss" => "localhost",        // issuer
            "aud" => "localhost",        // audience
            "iat" => time(),             // issued at
            "exp" => time() + $expirySeconds, // expiration
            "user" => [
                "id" => $user['id'],
                "email" => $user['email'],
                "firstName" => $user['firstName'] ?? $user['first_name'] ?? '',
                "lastName" => $user['lastName'] ?? $user['last_name'] ?? '',
                "role" => $user['role'] ?? 'USER'
            ]
        ];

        return JWT::encode($payload, JWT_SECRET, 'HS256');
    }

    // Verify a JWT token
    public static function verifyToken(string $token): ?array {
        try {
            $decoded = JWT::decode($token, new Key(JWT_SECRET, 'HS256'));
            // Return user payload
            return (array) $decoded->user;
        } catch (Exception $e) {
            return nul
