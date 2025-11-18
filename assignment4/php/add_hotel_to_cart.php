<?php
require_once 'config.php';

header('Content-Type: application/json');

if (!isset($_SESSION['phone'])) {
    echo json_encode(['success' => false, 'message' => 'Please login first']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
    exit;
}

$hotelId = $_POST['hotelId'] ?? '';
$checkIn = $_POST['checkIn'] ?? '';
$checkOut = $_POST['checkOut'] ?? '';
$rooms = intval($_POST['rooms'] ?? 1);
$adults = intval($_POST['adults'] ?? 0);
$children = intval($_POST['children'] ?? 0);
$infants = intval($_POST['infants'] ?? 0);

$conn = getDBConnection();

// Get hotel details
$stmt = $conn->prepare("SELECT * FROM hotels WHERE hotel_id = ?");
$stmt->bind_param("s", $hotelId);
$stmt->execute();
$result = $stmt->get_result();
$hotel = $result->fetch_assoc();
$stmt->close();
$conn->close();

if (!$hotel) {
    echo json_encode(['success' => false, 'message' => 'Hotel not found']);
    exit;
}

// Calculate nights
$checkInDate = new DateTime($checkIn);
$checkOutDate = new DateTime($checkOut);
$nights = $checkInDate->diff($checkOutDate)->days;

// Calculate total price
$pricePerNight = floatval($hotel['price_per_night']);
$totalPrice = $pricePerNight * $rooms * $nights;

// Store in session
$_SESSION['cart_hotel'] = [
    'hotelId' => $hotelId,
    'hotelName' => $hotel['hotel_name'],
    'city' => $hotel['city'],
    'checkIn' => $checkIn,
    'checkOut' => $checkOut,
    'rooms' => $rooms,
    'adults' => $adults,
    'children' => $children,
    'infants' => $infants,
    'pricePerNight' => $pricePerNight,
    'nights' => $nights,
    'totalPrice' => $totalPrice
];

echo json_encode(['success' => true, 'message' => 'Hotel added to cart']);
?>
