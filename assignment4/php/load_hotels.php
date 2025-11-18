<?php
require_once 'config.php';

header('Content-Type: application/json');

// Check if admin
if (!isset($_SESSION['phone']) || $_SESSION['phone'] !== '222-222-2222') {
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit;
}

// Read XML file
$xmlFile = '../data/hotels.xml';
if (!file_exists($xmlFile)) {
    echo json_encode(['success' => false, 'message' => 'Hotels XML file not found']);
    exit;
}

$xml = simplexml_load_file($xmlFile);
if ($xml === false) {
    echo json_encode(['success' => false, 'message' => 'Invalid XML format']);
    exit;
}

$conn = getDBConnection();

$inserted = 0;
$updated = 0;

foreach ($xml->hotel as $hotel) {
    $hotelId = (string)$hotel->hotel_id;
    $hotelName = (string)$hotel->hotel_name;
    $city = (string)$hotel->city;
    $pricePerNight = (float)$hotel->price_per_night;

    // Check if hotel already exists
    $stmt = $conn->prepare("SELECT hotel_id FROM hotels WHERE hotel_id = ?");
    $stmt->bind_param("s", $hotelId);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        // Update existing hotel
        $stmt->close();
        $stmt = $conn->prepare("UPDATE hotels SET hotel_name=?, city=?, price_per_night=? WHERE hotel_id=?");
        $stmt->bind_param("ssds", $hotelName, $city, $pricePerNight, $hotelId);
        $stmt->execute();
        $updated++;
    } else {
        // Insert new hotel
        $stmt->close();
        $stmt = $conn->prepare("INSERT INTO hotels (hotel_id, hotel_name, city, price_per_night) VALUES (?, ?, ?, ?)");
        $stmt->bind_param("sssd", $hotelId, $hotelName, $city, $pricePerNight);
        $stmt->execute();
        $inserted++;
    }
    $stmt->close();
}

$conn->close();

echo json_encode([
    'success' => true,
    'message' => "Hotels loaded successfully! Inserted: $inserted, Updated: $updated"
]);
?>
