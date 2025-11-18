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

// Get hotel booking details
$sql = "SELECT hb.*, h.*
        FROM hotel_bookings hb
        JOIN hotels h ON hb.hotel_id = h.hotel_id
        WHERE hb.hotel_booking_id = ?";

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

// Get guests for this booking
$sql = "SELECT * FROM guesses WHERE hotel_booking_id = ?";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $bookingId);
$stmt->execute();
$result = $stmt->get_result();

$guests = [];
while ($row = $result->fetch_assoc()) {
    $guests[] = $row;
}

$booking['guests'] = $guests;

$stmt->close();
$conn->close();

echo json_encode([
    'success' => true,
    'booking' => $booking
]);
?>
