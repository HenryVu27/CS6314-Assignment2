<?php
require_once 'config.php';

header('Content-Type: application/json');

if (!isset($_SESSION['phone'])) {
    echo json_encode(['success' => false, 'message' => 'Please login first']);
    exit;
}

if (!isset($_SESSION['cart_flights'])) {
    echo json_encode(['success' => false, 'message' => 'No flights in cart']);
    exit;
}

$input = file_get_contents('php://input');
$data = json_decode($input, true);
$passengers = $data['passengers'] ?? [];

if (empty($passengers)) {
    echo json_encode(['success' => false, 'message' => 'Passenger information required']);
    exit;
}

$conn = getDBConnection();
$cart = $_SESSION['cart_flights'];
$phone = $_SESSION['phone'];

// Start transaction
$conn->begin_transaction();

try {
    // Insert passengers and create booking
    foreach ($passengers as $passenger) {
        // Insert or update passenger
        $stmt = $conn->prepare("INSERT INTO passengers (ssn, first_name, last_name, date_of_birth, category) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE first_name=?, last_name=?, date_of_birth=?, category=?");
        $stmt->bind_param("sssssssss",
            $passenger['ssn'],
            $passenger['fname'],
            $passenger['lname'],
            $passenger['dob'],
            $passenger['category'],
            $passenger['fname'],
            $passenger['lname'],
            $passenger['dob'],
            $passenger['category']
        );
        $stmt->execute();
        $stmt->close();
    }

    // Create flight booking for departing flight
    $stmt = $conn->prepare("INSERT INTO flight_bookings (flight_id, total_price, phone_number) VALUES (?, ?, ?)");
    $flightId = $cart['departingFlight']['flight_id'];
    $totalPrice = $cart['totalPrice'];
    $stmt->bind_param("sds", $flightId, $totalPrice, $phone);
    $stmt->execute();
    $bookingId = $conn->insert_id;
    $stmt->close();

    // Create tickets for each passenger
    foreach ($passengers as $passenger) {
        $price = $cart['adultPrice'];
        if ($passenger['category'] === 'Child') $price = $cart['childPrice'];
        if ($passenger['category'] === 'Infant') $price = $cart['infantPrice'];

        $stmt = $conn->prepare("INSERT INTO tickets (flight_booking_id, ssn, price) VALUES (?, ?, ?)");
        $stmt->bind_param("isd", $bookingId, $passenger['ssn'], $price);
        $stmt->execute();
        $stmt->close();
    }

    // Update available seats
    $totalPassengers = count($passengers);
    $stmt = $conn->prepare("UPDATE flights SET available_seats = available_seats - ? WHERE flight_id = ?");
    $stmt->bind_param("is", $totalPassengers, $flightId);
    $stmt->execute();
    $stmt->close();

    // If round trip, handle return flight
    if (isset($cart['returnFlight'])) {
        $returnFlightId = $cart['returnFlight']['flight_id'];
        $stmt = $conn->prepare("INSERT INTO flight_bookings (flight_id, total_price, phone_number) VALUES (?, ?, ?)");
        $stmt->bind_param("sds", $returnFlightId, $totalPrice, $phone);
        $stmt->execute();
        $returnBookingId = $conn->insert_id;
        $stmt->close();

        foreach ($passengers as $passenger) {
            $price = floatval($cart['returnFlight']['price']);
            if ($passenger['category'] === 'Child') $price *= 0.7;
            if ($passenger['category'] === 'Infant') $price *= 0.1;

            $stmt = $conn->prepare("INSERT INTO tickets (flight_booking_id, ssn, price) VALUES (?, ?, ?)");
            $stmt->bind_param("isd", $returnBookingId, $passenger['ssn'], $price);
            $stmt->execute();
            $stmt->close();
        }

        $stmt = $conn->prepare("UPDATE flights SET available_seats = available_seats - ? WHERE flight_id = ?");
        $stmt->bind_param("is", $totalPassengers, $returnFlightId);
        $stmt->execute();
        $stmt->close();
    }

    $conn->commit();
    unset($_SESSION['cart_flights']);

    echo json_encode(['success' => true, 'message' => 'Flight booking successful!']);

} catch (Exception $e) {
    $conn->rollback();
    echo json_encode(['success' => false, 'message' => 'Booking failed: ' . $e->getMessage()]);
}

$conn->close();
?>
