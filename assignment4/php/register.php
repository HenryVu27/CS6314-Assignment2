<?php
require_once 'config.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
    exit;
}

$phone = $_POST['phone'] ?? '';
$password = $_POST['password'] ?? '';
$firstName = $_POST['firstName'] ?? '';
$lastName = $_POST['lastName'] ?? '';
$dob = $_POST['dob'] ?? '';
$email = $_POST['email'] ?? '';
$gender = $_POST['gender'] ?? '';

// Validate required fields
if (empty($phone) || empty($password) || empty($firstName) || empty($lastName) || empty($dob) || empty($email)) {
    echo json_encode(['success' => false, 'message' => 'All required fields must be filled']);
    exit;
}

$conn = getDBConnection();

// Check if phone number already exists
$stmt = $conn->prepare("SELECT phone_number FROM users WHERE phone_number = ?");
$stmt->bind_param("s", $phone);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    echo json_encode(['success' => false, 'message' => 'Phone number already registered']);
    $stmt->close();
    $conn->close();
    exit;
}
$stmt->close();

// Hash password
$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

// Insert new user
$stmt = $conn->prepare("INSERT INTO users (phone_number, password, first_name, last_name, date_of_birth, email, gender) VALUES (?, ?, ?, ?, ?, ?, ?)");
$stmt->bind_param("sssssss", $phone, $hashedPassword, $firstName, $lastName, $dob, $email, $gender);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Registration successful!']);
} else {
    echo json_encode(['success' => false, 'message' => 'Registration failed: ' . $stmt->error]);
}

$stmt->close();
$conn->close();
?>
