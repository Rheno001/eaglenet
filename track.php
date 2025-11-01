<!-- <?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");

$servername = "localhost";
$username = "root";
$passwordDB = ""; 
$dbname = "eaglenet";


$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    echo json_encode([
        "status" => "error",
        "message" => "Database connection failed"
    ]);
    exit;
}

if (isset($_GET['tracking_id'])) {
    $trackingId = $_GET['tracking_id'];

    $sql = "SELECT * FROM bookings WHERE tracking_id = '$trackingId'";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $data = $result->fetch_assoc();
        echo json_encode([
            "status" => "success",
            "data" => $data
        ]);
    } else {
        echo json_encode([
            "status" => "error",
            "message" => "Shipment not found"
        ]);
    }
} else {
    echo json_encode([
        "status" => "error",
        "message" => "Tracking ID missing"
    ]);
}

$conn->close();
?> -->
