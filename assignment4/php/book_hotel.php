<?php
require_once 'config.php';

header('Content-Type: application/json');

if (!isset($_SESSION['phone'])) {
    echo json_encode(['success' => false, 'message' => 'Please login first']);
    exit;
}

if (!isset($_SESSION['cart_hotel'])) {
    echo json_encode(['success' => false, 'message' => 'No hotel in cart']);
    exit;
}

$input = file_get_contents('php://input');
$data = json_decode($input, true);
$guests = $data['guests'] ?? [];

if (empty($guests)) {
    echo json_encode(['success' => false, 'message' => 'Guest information required']);
    exit;
}

$conn = getDBConnection();
$cart = $_SESSION['cart_hotel'];
$phone = $_SESSION['phone'];

// Start transaction
$conn->begin_transaction();

try {
    // Create hotel booking
    $stmt = $conn->prepare("INSERT INTO hotel_bookings (hotel_id, check_in_date, check_out_date, number_of_rooms, price_per_night, total_price, phone_number) VALUES (?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("sssiids",
        $cart['hotelId'],
        $cart['checkIn'],
        $cart['checkOut'],
        $cart['rooms'],
        $cart['pricePerNight'],
        $cart['totalPrice'],
        $phone
    );
    $stmt->execute();
    $bookingId = $conn->insert_id;
    $stmt->close();

    // Insert guests
    foreach ($guests as $guest) {
        $stmt = $conn->prepare("INSERT INTO guesses (ssn, hotel_booking_id, first_name, last_name, date_of_birth, category) VALUES (?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE hotel_booking_id=?, first_name=?, last_name=?, date_of_birth=?, category=?");
        $stmt->bind_param("sisssssisss",
            $guest['ssn'],
            $bookingId,
            $guest['fname'],
            $guest['lname'],
            $guest['dob'],
            $guest['category'],
            $bookingId,
            $guest['fname'],
            $guest['lname'],
            $guest['dob'],
            $guest['category']
        );
        $stmt->execute();
        $stmt->close();
    }

    $conn->commit();
    unset($_SESSION['cart_hotel']);

    echo json_encode(['success' => true, 'message' => 'Hotel booking successful!']);

} catch (Exception $e) {
    $conn->rollback();
    echo json_encode(['success' => false, 'message' => 'Booking failed: ' . $e->getMessage()]);
}

$conn->close();
?>
