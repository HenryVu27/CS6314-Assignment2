<?php
require_once 'config.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
    exit;
}

if (!isset($_SESSION['phone'])) {
    echo json_encode(['success' => false, 'message' => 'Please login to submit a comment']);
    exit;
}

$comment = $_POST['comment'] ?? '';

if (strlen($comment) < 10) {
    echo json_encode(['success' => false, 'message' => 'Comment must be at least 10 characters']);
    exit;
}

// Get user info
$phone = $_SESSION['phone'];
$conn = getDBConnection();

$stmt = $conn->prepare("SELECT first_name, last_name, date_of_birth, email, gender FROM users WHERE phone_number = ?");
$stmt->bind_param("s", $phone);
$stmt->execute();
$result = $stmt->get_result();
$user = $result->fetch_assoc();
$stmt->close();
$conn->close();

// Create XML file or append to existing
$xmlFile = '../data/contacts.xml';

if (!file_exists($xmlFile)) {
    $xml = new SimpleXMLElement('<contacts></contacts>');
} else {
    $xml = simplexml_load_file($xmlFile);
}

// Generate unique contact ID
$contactId = 'CNT' . time() . rand(1000, 9999);

// Add contact
$contact = $xml->addChild('contact');
$contact->addChild('contact_id', $contactId);
$contact->addChild('phone_number', $phone);
$contact->addChild('first_name', $user['first_name']);
$contact->addChild('last_name', $user['last_name']);
$contact->addChild('date_of_birth', $user['date_of_birth']);
$contact->addChild('email', $user['email']);
$contact->addChild('gender', $user['gender']);
$contact->addChild('comment', htmlspecialchars($comment));
$contact->addChild('timestamp', date('Y-m-d H:i:s'));

// Save XML
$xml->asXML($xmlFile);

echo json_encode(['success' => true, 'message' => 'Comment submitted successfully!']);
?>
