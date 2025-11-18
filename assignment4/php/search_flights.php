<?php
require_once 'config.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
    exit;
}

$tripType = $_POST['tripType'] ?? 'oneway';
$origin = $_POST['origin'] ?? '';
$destination = $_POST['destination'] ?? '';
$departureDate = $_POST['departureDate'] ?? '';
$returnDate = $_POST['returnDate'] ?? '';
$totalPassengers = intval($_POST['totalPassengers'] ?? 1);

$conn = getDBConnection();

// Search for departing flights
$stmt = $conn->prepare("SELECT * FROM flights WHERE origin = ? AND destination = ? AND departure_date = ? AND available_seats >= ? ORDER BY departure_time");
$stmt->bind_param("sssi", $origin, $destination, $departureDate, $totalPassengers);
$stmt->execute();
$result = $stmt->get_result();

$flights = [];
while ($row = $result->fetch_assoc()) {
    $flights[] = $row;
}

// If no flights found on exact date, search within 3 days before and after
if (count($flights) === 0) {
    $stmt->close();
    $stmt = $conn->prepare("SELECT * FROM flights WHERE origin = ? AND destination = ? AND departure_date BETWEEN DATE_SUB(?, INTERVAL 3 DAY) AND DATE_ADD(?, INTERVAL 3 DAY) AND available_seats >= ? ORDER BY departure_date, departure_time");
    $stmt->bind_param("ssssi", $origin, $destination, $departureDate, $departureDate, $totalPassengers);
    $stmt->execute();
    $result = $stmt->get_result();

    while ($row = $result->fetch_assoc()) {
        $flights[] = $row;
    }
}

$response = [
    'success' => true,
    'flights' => $flights
];

// Search for return flights if round trip
if ($tripType === 'roundtrip' && !empty($returnDate)) {
    $stmt->close();
    $stmt = $conn->prepare("SELECT * FROM flights WHERE origin = ? AND destination = ? AND departure_date = ? AND available_seats >= ? ORDER BY departure_time");
    $stmt->bind_param("sssi", $destination, $origin, $returnDate, $totalPassengers);
    $stmt->execute();
    $result = $stmt->get_result();

    $returnFlights = [];
    while ($row = $result->fetch_assoc()) {
        $returnFlights[] = $row;
    }

    // If no return flights on exact date, search within 3 days
    if (count($returnFlights) === 0) {
        $stmt->close();
        $stmt = $conn->prepare("SELECT * FROM flights WHERE origin = ? AND destination = ? AND departure_date BETWEEN DATE_SUB(?, INTERVAL 3 DAY) AND DATE_ADD(?, INTERVAL 3 DAY) AND available_seats >= ? ORDER BY departure_date, departure_time");
        $stmt->bind_param("ssssi", $destination, $origin, $returnDate, $returnDate, $totalPassengers);
        $stmt->execute();
        $result = $stmt->get_result();

        while ($row = $result->fetch_assoc()) {
            $returnFlights[] = $row;
        }
    }

    $response['returnFlights'] = $returnFlights;
}

$stmt->close();
$conn->close();

echo json_encode($response);
?>
