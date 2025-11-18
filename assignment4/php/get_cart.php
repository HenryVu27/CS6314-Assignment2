<?php
require_once 'config.php';

header('Content-Type: application/json');

if (!isset($_SESSION['phone'])) {
    echo json_encode(['success' => false, 'message' => 'Please login to view cart']);
    exit;
}

$cart = [];

if (isset($_SESSION['cart_flights'])) {
    $cart['flights'] = $_SESSION['cart_flights'];
}

if (isset($_SESSION['cart_hotel'])) {
    $cart['hotel'] = $_SESSION['cart_hotel'];
}

echo json_encode([
    'success' => true,
    'cart' => $cart
]);
?>
