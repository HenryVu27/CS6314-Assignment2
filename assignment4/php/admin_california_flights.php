<?php
require_once 'config.php';

header('Content-Type: application/json');

// Check if admin
if (!isset($_SESSION['phone']) || $_SESSION['phone'] !== '222-222-2222') {
    echo json_encode(['success' => false, 'message' => 'Unauthorized - Admin only']);
    exit;
}

$conn = getDBConnection();

// Count booked flights arriving in California (Sep-Oct 2024)
$sql = "SELECT COUNT(*) as flight_count
        FROM flight_bookings fb
        JOIN flights f ON fb.flight_id = f.flight_id
        WHERE f.destination IN ('Los Angeles', 'San Francisco', 'San Diego', 'Sacramento')
        AND f.arrival_date BETWEEN '2024-09-01' AND '2024-10-31'";

$result = $conn->query($sql);

if ($result) {
    $row = $result->fetch_assoc();

    // Also get the detailed list
    $sql2 = "SELECT fb.*, f.*, u.first_name, u.last_name
            FROM flight_bookings fb
            JOIN flights f ON fb.flight_id = f.flight_id
            JOIN users u ON fb.phone_number = u.phone_number
            WHERE f.destination IN ('Los Angeles', 'San Francisco', 'San Diego', 'Sacramento')
            AND f.arrival_date BETWEEN '2024-09-01' AND '2024-10-31'
            ORDER BY f.arrival_date";

    $result2 = $conn->query($sql2);
    $flights = [];
    while ($flight = $result2->fetch_assoc()) {
        $flights[] = $flight;
    }

    echo json_encode([
        'success' => true,
        'count' => $row['flight_count'],
        'results' => $flights
    ]);
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Query failed: ' . $conn->error
    ]);
}

$conn->close();
?>
