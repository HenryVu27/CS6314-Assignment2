// Check if user is admin and show admin panel
fetch('php/check_session.php')
    .then(response => response.json())
    .then(data => {
        if (data.loggedIn) {
            if (data.phone === '222-222-2222') {
                // Show admin panel
                document.getElementById('adminPanel').style.display = 'block';
                document.getElementById('adminQueries').style.display = 'block';
            }
        } else {
            document.getElementById('alert-container').innerHTML = `
                <div class="alert alert-warning">
                    Please <a href="login.html">login</a> to access your account.
                </div>
            `;
        }
    });

// Admin functions
function loadFlightsData() {
    if (confirm('This will load all flights from the JSON file into the database. Continue?')) {
        fetch('php/load_flights.php', { method: 'POST' })
            .then(response => response.json())
            .then(data => {
                alert(data.message);
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error loading flights data');
            });
    }
}

function loadHotelsData() {
    if (confirm('This will load all hotels from the XML file into the database. Continue?')) {
        fetch('php/load_hotels.php', { method: 'POST' })
            .then(response => response.json())
            .then(data => {
                alert(data.message);
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error loading hotels data');
            });
    }
}

// User queries
function searchFlightBooking() {
    const bookingId = document.getElementById('flightBookingId').value.trim();
    if (!bookingId) {
        alert('Please enter a flight booking ID');
        return;
    }

    fetch(`php/get_flight_booking.php?booking_id=${bookingId}`)
        .then(response => response.json())
        .then(data => {
            const container = document.getElementById('bookingResults');
            if (data.success) {
                container.innerHTML = formatBookingData(data.booking, 'flight');
            } else {
                container.innerHTML = `<p>${data.message}</p>`;
            }
        });
}

function searchHotelBooking() {
    const bookingId = document.getElementById('hotelBookingId').value.trim();
    if (!bookingId) {
        alert('Please enter a hotel booking ID');
        return;
    }

    fetch(`php/get_hotel_booking.php?booking_id=${bookingId}`)
        .then(response => response.json())
        .then(data => {
            const container = document.getElementById('bookingResults');
            if (data.success) {
                container.innerHTML = formatBookingData(data.booking, 'hotel');
            } else {
                container.innerHTML = `<p>${data.message}</p>`;
            }
        });
}

function getMyBookingsSeptember() {
    fetch('php/get_september_bookings.php')
        .then(response => response.json())
        .then(data => {
            const container = document.getElementById('septemberResults');
            if (data.success) {
                let html = '<h5>September 2024 Bookings</h5>';
                if (data.flights && data.flights.length > 0) {
                    html += '<h6>Flights:</h6>';
                    data.flights.forEach(flight => {
                        html += formatBookingData(flight, 'flight');
                    });
                }
                if (data.hotels && data.hotels.length > 0) {
                    html += '<h6>Hotels:</h6>';
                    data.hotels.forEach(hotel => {
                        html += formatBookingData(hotel, 'hotel');
                    });
                }
                container.innerHTML = html;
            } else {
                container.innerHTML = `<p>${data.message}</p>`;
            }
        });
}

function searchBySSN() {
    const ssn = document.getElementById('passengerSSN').value.trim();
    if (!ssn) {
        alert('Please enter an SSN');
        return;
    }

    fetch(`php/search_by_ssn.php?ssn=${ssn}`)
        .then(response => response.json())
        .then(data => {
            const container = document.getElementById('ssnResults');
            if (data.success) {
                container.innerHTML = '<h5>Bookings Found:</h5>' + JSON.stringify(data.results, null, 2);
            } else {
                container.innerHTML = `<p>${data.message}</p>`;
            }
        });
}

// Admin queries
function getFlightsFromTexas() {
    fetch('php/admin_texas_flights.php')
        .then(response => response.json())
        .then(data => displayResults('texasFlightsResults', data));
}

function getHotelsInTexas() {
    fetch('php/admin_texas_hotels.php')
        .then(response => response.json())
        .then(data => displayResults('texasHotelsResults', data));
}

function getMostExpensiveHotels() {
    fetch('php/admin_expensive_hotels.php')
        .then(response => response.json())
        .then(data => displayResults('expensiveHotelsResults', data));
}

function getFlightsWithInfants() {
    fetch('php/admin_infant_flights.php')
        .then(response => response.json())
        .then(data => displayResults('infantFlightsResults', data));
}

function getFlightsWithInfantsAndChildren() {
    fetch('php/admin_infant_children_flights.php')
        .then(response => response.json())
        .then(data => displayResults('infantChildrenResults', data));
}

function getMostExpensiveFlights() {
    fetch('php/admin_expensive_flights.php')
        .then(response => response.json())
        .then(data => displayResults('expensiveFlightsResults', data));
}

function getTexasFlightsNoInfants() {
    fetch('php/admin_texas_no_infants.php')
        .then(response => response.json())
        .then(data => displayResults('texasNoInfantsResults', data));
}

function getFlightsToCalifornia() {
    fetch('php/admin_california_flights.php')
        .then(response => response.json())
        .then(data => displayResults('californiaFlightsResults', data));
}

function displayResults(containerId, data) {
    const container = document.getElementById(containerId);
    if (data.success) {
        container.innerHTML = '<pre>' + JSON.stringify(data.results, null, 2) + '</pre>';
    } else {
        container.innerHTML = `<p>${data.message}</p>`;
    }
}

function formatBookingData(booking, type) {
    return '<div style="background: #f9fafb; padding: 1rem; margin-bottom: 1rem; border-radius: 6px;">' +
           '<pre>' + JSON.stringify(booking, null, 2) + '</pre>' +
           '</div>';
}
