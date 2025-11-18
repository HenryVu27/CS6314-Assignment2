<?php
require_once 'config.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
    exit;
}

$city = $_POST['city'] ?? '';

$conn = getDBConnection();

$stmt = $conn->prepare("SELECT * FROM hotels WHERE city = ? ORDER BY price_per_night");
$stmt->bind_param("s", $city);
$stmt->execute();
$result = $stmt->get_result();

$hotels = [];
while ($row = $result->fetch_assoc()) {
    $hotels[] = $row;
}

$stmt->close();
$conn->close();

echo json_encode([
    'success' => true,
    'hotels' => $hotels
]);
?>
