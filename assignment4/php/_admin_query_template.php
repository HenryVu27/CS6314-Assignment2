<?php
/*
 * TEMPLATE FOR ADMIN QUERY PHP FILES
 *
 * This is a template for creating admin query files.
 * Copy this file and modify the SQL query for each specific admin requirement.
 *
 * Required files to create (copy and modify this template):
 *
 * 1. get_flight_booking.php - Get flight booking by ID
 * 2. get_hotel_booking.php - Get hotel booking by ID
 * 3. get_september_bookings.php - Get all bookings for September 2024
 * 4. search_by_ssn.php - Search bookings by passenger SSN
 * 5. admin_texas_flights.php - Flights departing from Texas (Sep-Oct 2024)
 * 6. admin_texas_hotels.php - Hotels in Texas (Sep-Oct 2024)
 * 7. admin_expensive_hotels.php - Most expensive booked hotels
 * 8. admin_infant_flights.php - Flights with infant passengers
 * 9. admin_infant_children_flights.php - Flights with infants and 5+ children
 * 10. admin_expensive_flights.php - Most expensive booked flights
 * 11. admin_texas_no_infants.php - Texas flights with no infant passengers
 * 12. admin_california_flights.php - Count of flights to California (Sep-Oct 2024)
 */

require_once 'config.php';

header('Content-Type: application/json');

// Uncomment for admin-only queries
/*
if (!isset($_SESSION['phone']) || $_SESSION['phone'] !== '222-222-2222') {
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit;
}
*/

$conn = getDBConnection();

// MODIFY THIS SQL QUERY FOR YOUR SPECIFIC REQUIREMENT
$sql = "SELECT * FROM your_table WHERE your_condition";

$result = $conn->query($sql);

if ($result) {
    $data = [];
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }

    echo json_encode([
        'success' => true,
        'results' => $data
    ]);
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Query failed: ' . $conn->error
    ]);
}

$conn->close();
?>
