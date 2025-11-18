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

$departingFlightId = $_POST['departingFlightId'] ?? '';
$returnFlightId = $_POST['returnFlightId'] ?? '';
$adults = intval($_POST['adults'] ?? 0);
$children = intval($_POST['children'] ?? 0);
$infants = intval($_POST['infants'] ?? 0);

$conn = getDBConnection();

// Get departing flight details
$stmt = $conn->prepare("SELECT * FROM flights WHERE flight_id = ?");
$stmt->bind_param("s", $departingFlightId);
$stmt->execute();
$result = $stmt->get_result();
$departingFlight = $result->fetch_assoc();
$stmt->close();

if (!$departingFlight) {
    echo json_encode(['success' => false, 'message' => 'Flight not found']);
    $conn->close();
    exit;
}

$cartData = [
    'tripType' => empty($returnFlightId) ? 'oneway' : 'roundtrip',
    'departingFlight' => $departingFlight,
    'adults' => $adults,
    'children' => $children,
    'infants' => $infants,
    'adultPrice' => floatval($departingFlight['price']),
    'childPrice' => floatval($departingFlight['price']) * 0.7,
    'infantPrice' => floatval($departingFlight['price']) * 0.1
];

// Calculate prices
$totalPrice = ($adults * $cartData['adultPrice']) +
              ($children * $cartData['childPrice']) +
              ($infants * $cartData['infantPrice']);

// Get return flight if round trip
if (!empty($returnFlightId)) {
    $stmt = $conn->prepare("SELECT * FROM flights WHERE flight_id = ?");
    $stmt->bind_param("s", $returnFlightId);
    $stmt->execute();
    $result = $stmt->get_result();
    $returnFlight = $result->fetch_assoc();
    $stmt->close();

    if ($returnFlight) {
        $cartData['returnFlight'] = $returnFlight;
        $returnAdultPrice = floatval($returnFlight['price']);
        $returnChildPrice = $returnAdultPrice * 0.7;
        $returnInfantPrice = $returnAdultPrice * 0.1;

        $totalPrice += ($adults * $returnAdultPrice) +
                      ($children * $returnChildPrice) +
                      ($infants * $returnInfantPrice);
    }
}

$cartData['totalPrice'] = $totalPrice;

// Store in session
$_SESSION['cart_flights'] = $cartData;

$conn->close();

echo json_encode(['success' => true, 'message' => 'Flight added to cart']);
?>
