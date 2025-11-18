<?php
require_once 'config.php';

header('Content-Type: application/json');

if (!isset($_SESSION['phone'])) {
    echo json_encode(['success' => false, 'message' => 'Please login first']);
    exit;
}

$phone = $_SESSION['phone'];
$conn = getDBConnection();

// Get flight bookings for September 2024
$sql = "SELECT fb.*, f.*
        FROM flight_bookings fb
        JOIN flights f ON fb.flight_id = f.flight_id
        WHERE fb.phone_number = ?
        AND f.departure_date BETWEEN '2024-09-01' AND '2024-09-30'
        ORDER BY f.departure_date";

$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $phone);
$stmt->execute();
$result = $stmt->get_result();

$flightBookings = [];
while ($row = $result->fetch_assoc()) {
    $flightBookings[] = $row;
}
$stmt->close();

// Get hotel bookings for September 2024
$sql = "SELECT hb.*, h.*
        FROM hotel_bookings hb
        JOIN hotels h ON hb.hotel_id = h.hotel_id
        WHERE hb.phone_number = ?
        AND hb.check_in_date BETWEEN '2024-09-01' AND '2024-09-30'
        ORDER BY hb.check_in_date";

$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $phone);
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
    'flights' => $flightBookings,
    'hotels' => $hotelBookings
]);
?>
