<?php
header('Content-Type: application/json');

// Test database connection
require_once 'db_connect.php';

$tests = [
    'database_connection' => false,
    'shipments_table' => false,
    'required_columns' => false
];

// Test 1: Database connection
try {
    if ($conn && $conn->ping()) {
        $tests['database_connection'] = true;
    }
} catch (Exception $e) {
    $tests['database_connection'] = false;
}

// Test 2: Check if shipments table exists
if ($tests['database_connection']) {
    $result = $conn->query("SHOW TABLES LIKE 'shipments'");
    $tests['shipments_table'] = ($result->num_rows > 0);
}

// Test 3: Check required columns
if ($tests['shipments_table']) {
    $result = $conn->query("DESCRIBE shipments");
    $columns = [];
    while ($row = $result->fetch_assoc()) {
        $columns[] = $row['Field'];
    }
    
    $required_columns = ['id', 'status', 'trackingId', 'destination', 'user_id'];
    $missing_columns = array_diff($required_columns, $columns);
    
    $tests['required_columns'] = empty($missing_columns);
    $tests['missing_columns'] = $missing_columns;
}

echo json_encode([
    'success' => true,
    'tests' => $tests,
    'message' => 'Test completed'
]);

$conn->close();
?>