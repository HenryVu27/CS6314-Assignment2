<?php
require_once 'config.php';

header('Content-Type: application/json');

// Check if admin
if (!isset($_SESSION['phone']) || $_SESSION['phone'] !== '222-222-2222') {
    echo json_encode(['success' => false, 'message' => 'Unauthorized - Admin only']);
    exit;
}

$conn = getDBConnection();

// Get all booked hotels in Texas (Sep-Oct 2024)
$sql = "SELECT hb.*, h.*, u.first_name, u.last_name
        FROM hotel_bookings hb
        JOIN hotels h ON hb.hotel_id = h.hotel_id
        JOIN users u ON hb.phone_number = u.phone_number
        WHERE h.city IN ('Dallas', 'Houston', 'Austin', 'San Antonio')
        AND hb.check_in_date BETWEEN '2024-09-01' AND '2024-10-31'
        ORDER BY hb.check_in_date";

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
