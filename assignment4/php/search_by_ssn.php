<?php
require_once 'config.php';

header('Content-Type: application/json');

if (!isset($_SESSION['phone'])) {
    echo json_encode(['success' => false, 'message' => 'Please login first']);
    exit;
}

$ssn = $_GET['ssn'] ?? '';

if (empty($ssn)) {
    echo json_encode(['success' => false, 'message' => 'SSN required']);
    exit;
}

$conn = getDBConnection();
$results = [];

// Get flight bookings for this passenger
$sql = "SELECT DISTINCT fb.*, f.*, p.first_name, p.last_name, p.date_of_birth, p.category
        FROM passengers p
        JOIN tickets t ON p.ssn = t.ssn
        JOIN flight_bookings fb ON t.flight_booking_id = fb.flight_booking_id
        JOIN flights f ON fb.flight_id = f.flight_id
        WHERE p.ssn = ?";

$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $ssn);
$stmt->execute();
$result = $stmt->get_result();

$flightBookings = [];
while ($row = $result->fetch_assoc()) {
    $flightBookings[] = $row;
}
$stmt->close();

// Get hotel bookings for this guest
$sql = "SELECT hb.*, h.*, g.first_name, g.last_name, g.date_of_birth, g.category
        FROM guesses g
        JOIN hotel_bookings hb ON g.hotel_booking_id = hb.hotel_booking_id
        JOIN hotels h ON hb.hotel_id = h.hotel_id
        WHERE g.ssn = ?";

$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $ssn);
$stmt->execute();
$result = $stmt->get_result();

$hotelBookings = [];
while ($row = $result->fetch_assoc()) {
    $hotelBookings[] = $row;
}
$stmt->close();
$conn->close();

echo json_encode([
    'success' => true,
    'results' => [
        'flights' => $flightBookings,
        'hotels' => $hotelBookings
    ]
]);
?>
