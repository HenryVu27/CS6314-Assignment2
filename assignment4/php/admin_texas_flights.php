<?php
require_once 'config.php';

header('Content-Type: application/json');

// Check if admin
if (!isset($_SESSION['phone']) || $_SESSION['phone'] !== '222-222-2222') {
    echo json_encode(['success' => false, 'message' => 'Unauthorized - Admin only']);
    exit;
}

$conn = getDBConnection();

// Get all booked flights departing from Texas (Sep-Oct 2024)
$sql = "SELECT fb.*, f.*, u.first_name, u.last_name
        FROM flight_bookings fb
        JOIN flights f ON fb.flight_id = f.flight_id
        JOIN users u ON fb.phone_number = u.phone_number
        WHERE f.origin IN ('Dallas', 'Houston', 'Austin', 'San Antonio')
        AND f.departure_date BETWEEN '2024-09-01' AND '2024-10-31'
        ORDER BY f.departure_date, f.departure_time";

$result = $conn->query($sql);

if ($result) {
    $data = [];
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }

    echo json_encode([
        'success' => true,
        'results' => $data,
        'count' => count($data)
    ]);
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Query failed: ' . $conn->error
    ]);
}

$conn->close();
?>
