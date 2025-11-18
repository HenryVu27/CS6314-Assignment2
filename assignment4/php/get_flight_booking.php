<?php
require_once 'config.php';

header('Content-Type: application/json');

if (!isset($_SESSION['phone'])) {
    echo json_encode(['success' => false, 'message' => 'Please login first']);
    exit;
}

$bookingId = $_GET['booking_id'] ?? '';

if (empty($bookingId)) {
    echo json_encode(['success' => false, 'message' => 'Booking ID required']);
    exit;
}

$conn = getDBConnection();

// Get flight booking details
$sql = "SELECT fb.*, f.*
        FROM flight_bookings fb
        JOIN flights f ON fb.flight_id = f.flight_id
        WHERE fb.flight_booking_id = ?";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $bookingId);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(['success' => false, 'message' => 'Booking not found']);
    $stmt->close();
    $conn->close();
    exit;
}

$booking = $result->fetch_assoc();
$stmt->close();

// Get tickets and passengers for this booking
$sql = "SELECT t.*, p.*
        FROM tickets t
        JOIN passengers p ON t.ssn = p.ssn
        WHERE t.flight_booking_id = ?";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $bookingId);
$stmt->execute();
$result = $stmt->get_result();

$tickets = [];
while ($row = $result->fetch_assoc()) {
    $tickets[] = $row;
}

$booking['tickets'] = $tickets;

$stmt->close();
$conn->close();

echo json_encode([
    'success' => true,
    'booking' => $booking
]);
?>
