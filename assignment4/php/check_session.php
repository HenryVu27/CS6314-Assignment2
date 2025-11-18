<?php
require_once 'config.php';

header('Content-Type: application/json');

if (isset($_SESSION['phone'])) {
    echo json_encode([
        'loggedIn' => true,
        'phone' => $_SESSION['phone'],
        'firstName' => $_SESSION['firstName'],
        'lastName' => $_SESSION['lastName']
    ]);
} else {
    echo json_encode(['loggedIn' => false]);
}
?>
