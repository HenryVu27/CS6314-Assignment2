<?php
require_once 'config.php';

header('Content-Type: application/json');

// Check if admin
if (!isset($_SESSION['phone']) || $_SESSION['phone'] !== '222-222-2222') {
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit;
}

// Read JSON file
$jsonFile = '../data/flights.json';
if (!file_exists($jsonFile)) {
    echo json_encode(['success' => false, 'message' => 'Flights JSON file not found']);
    exit;
}

$jsonData = file_get_contents($jsonFile);
$data = json_decode($jsonData, true);

if (!isset($data['flights'])) {
    echo json_encode(['success' => false, 'message' => 'Invalid JSON format']);
    exit;
}

$conn = getDBConnection();

$inserted = 0;
$updated = 0;

foreach ($data['flights'] as $flight) {
    // Check if flight already exists
    $stmt = $conn->prepare("SELECT flight_id FROM flights WHERE flight_id = ?");
    $stmt->bind_param("s", $flight['flight_id']);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        // Update existing flight
        $stmt->close();
        $stmt = $conn->prepare("UPDATE flights SET origin=?, destination=?, departure_date=?, arrival_date=?, departure_time=?, arrival_time=?, available_seats=?, price=? WHERE flight_id=?");
        $stmt->bind_param("ssssssiis",
            $flight['origin'],
            $flight['destination'],
            $flight['departure_date'],
            $flight['arrival_date'],
            $flight['departure_time'],
            $flight['arrival_time'],
            $flight['available_seats'],
            $flight['price'],
            $flight['flight_id']
        );
        $stmt->execute();
        $updated++;
    } else {
        // Insert new flight
        $stmt->close();
        $stmt = $conn->prepare("INSERT INTO flights (flight_id, origin, destination, departure_date, arrival_date, departure_time, arrival_time, available_seats, price) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("sssssssii",
            $flight['flight_id'],
            $flight['origin'],
            $flight['destination'],
            $flight['departure_date'],
            $flight['arrival_date'],
            $flight['departure_time'],
            $flight['arrival_time'],
            $flight['available_seats'],
            $flight['price']
        );
        $stmt->execute();
        $inserted++;
    }
    $stmt->close();
}

$conn->close();

echo json_encode([
    'success' => true,
    'message' => "Flights loaded successfully! Inserted: $inserted, Updated: $updated"
]);
?>
