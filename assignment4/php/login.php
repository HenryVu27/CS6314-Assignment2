<?php
require_once 'config.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
    exit;
}

$phone = $_POST['phone'] ?? '';
$password = $_POST['password'] ?? '';

if (empty($phone) || empty($password)) {
    echo json_encode(['success' => false, 'message' => 'Phone number and password are required']);
    exit;
}

$conn = getDBConnection();

$stmt = $conn->prepare("SELECT phone_number, password, first_name, last_name FROM users WHERE phone_number = ?");
$stmt->bind_param("s", $phone);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(['success' => false, 'message' => 'Invalid phone number or password']);
    $stmt->close();
    $conn->close();
    exit;
}

$user = $result->fetch_assoc();

if (password_verify($password, $user['password'])) {
    $_SESSION['phone'] = $user['phone_number'];
    $_SESSION['firstName'] = $user['first_name'];
    $_SESSION['lastName'] = $user['last_name'];

    echo json_encode([
        'success' => true,
        'message' => 'Login successful!',
        'user' => [
            'phone' => $user['phone_number'],
            'firstName' => $user['first_name'],
            'lastName' => $user['last_name']
        ]
    ]);
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid phone number or password']);
}

$stmt->close();
$conn->close();
?>
