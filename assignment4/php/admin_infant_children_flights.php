<?php
require_once 'config.php';

header('Content-Type: application/json');

// Check if admin
if (!isset($_SESSION['phone']) || $_SESSION['phone'] !== '222-222-2222') {
    echo json_encode(['success' => false, 'message' => 'Unauthorized - Admin only']);
    exit;
}

$conn = getDBConnection();

// Get flights with at least one infant AND at least 5 children
$sql = "SELECT DISTINCT fb.*, f.*, u.first_name, u.last_name,
        (SELECT COUNT(*) FROM tickets t2
         JOIN passengers p2 ON t2.ssn = p2.ssn
         WHERE t2.flight_booking_id = fb.flight_booking_id
         AND p2.category = 'Infant') as infant_count,
        (SELECT COUNT(*) FROM tickets t3
         JOIN passengers p3 ON t3.ssn = p3.ssn
         WHERE t3.flight_booking_id = fb.flight_booking_id
         AND p3.category = 'Child') as child_count
        FROM flight_bookings fb
        JOIN flights f ON fb.flight_id = f.flight_id
        JOIN users u ON fb.phone_number = u.phone_number
        HAVING infant_count >= 1 AND child_count >= 5
        ORDER BY f.departure_date";

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
