// Store passenger counts
let passengerData = {
    adults: 1,
    children: 0,
    infants: 0
};

// Toggle trip type fields
document.querySelectorAll('input[name="tripType"]').forEach(radio => {
    radio.addEventListener('change', function() {
        const returnDateGroup = document.getElementById('returnDateGroup');
        if (this.value === 'roundtrip') {
            returnDateGroup.style.display = 'block';
            document.getElementById('returnDate').required = true;
        } else {
            returnDateGroup.style.display = 'none';
            document.getElementById('returnDate').required = false;
        }
    });
});

// Passenger icon toggle
document.getElementById('passengerIcon').addEventListener('click', function() {
    const passengerForm = document.getElementById('passengerForm');
    passengerForm.classList.toggle('show');
});

// Update passengers
document.getElementById('updatePassengers').addEventListener('click', function() {
    const adults = parseInt(document.getElementById('adults').value) || 0;
    const children = parseInt(document.getElementById('children').value) || 0;
    const infants = parseInt(document.getElementById('infants').value) || 0;

    clearAllErrors();
    let isValid = true;

    if (adults > 4) {
        showError('adults-error', 'Maximum 4 adults allowed');
        isValid = false;
    }
    if (children > 4) {
        showError('children-error', 'Maximum 4 children allowed');
        isValid = false;
    }
    if (infants > 4) {
        showError('infants-error', 'Maximum 4 infants allowed');
        isValid = false;
    }

    if (!isValid) return;

    passengerData = { adults, children, infants };

    // Update display
    let displayText = [];
    if (adults > 0) displayText.push(`${adults} Adult${adults > 1 ? 's' : ''}`);
    if (children > 0) displayText.push(`${children} Child${children > 1 ? 'ren' : ''}`);
    if (infants > 0) displayText.push(`${infants} Infant${infants > 1 ? 's' : ''}`);

    document.getElementById('passengerCount').textContent = displayText.join(', ') || '0 Passengers';
    document.getElementById('passengerForm').classList.remove('show');
});

// Form submission
document.getElementById('flightSearchForm').addEventListener('submit', function(e) {
    e.preventDefault();
    clearAllErrors();

    const tripType = document.querySelector('input[name="tripType"]:checked').value;
    const origin = document.getElementById('origin').value;
    const destination = document.getElementById('destination').value;
    const departureDate = document.getElementById('departureDate').value;
    const returnDate = document.getElementById('returnDate').value;

    let isValid = true;

    // Validate inputs
    if (!origin) {
        showError('origin-error', 'Please select an origin city');
        isValid = false;
    }

    if (!destination) {
        showError('destination-error', 'Please select a destination city');
        isValid = false;
    }

    if (origin === destination) {
        showError('destination-error', 'Destination must be different from origin');
        isValid = false;
    }

    if (!departureDate) {
        showError('departureDate-error', 'Please select a departure date');
        isValid = false;
    } else {
        const depDate = new Date(departureDate);
        const minDate = new Date('2024-09-01');
        const maxDate = new Date('2024-12-01');

        if (depDate < minDate || depDate > maxDate) {
            showError('departureDate-error', 'Date must be between Sep 1, 2024 and Dec 1, 2024');
            isValid = false;
        }
    }

    if (tripType === 'roundtrip' && !returnDate) {
        showError('returnDate-error', 'Please select a return date');
        isValid = false;
    }

    if (!isValid) return;

    // Search for flights
    const totalPassengers = passengerData.adults + passengerData.children + passengerData.infants;

    const formData = new FormData();
    formData.append('tripType', tripType);
    formData.append('origin', origin);
    formData.append('destination', destination);
    formData.append('departureDate', departureDate);
    formData.append('returnDate', returnDate);
    formData.append('totalPassengers', totalPassengers);
    formData.append('adults', passengerData.adults);
    formData.append('children', passengerData.children);
    formData.append('infants', passengerData.infants);

    fetch('php/search_flights.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        const alertContainer = document.getElementById('alert-container');

        if (data.success) {
            displaySearchSummary(tripType, origin, destination, departureDate, returnDate);
            displayFlights(data.flights, tripType);
            document.getElementById('searchResults').style.display = 'block';

            // Store return flights if round trip
            if (tripType === 'roundtrip' && data.returnFlights) {
                window.returnFlights = data.returnFlights;
            }
        } else {
            alertContainer.innerHTML = `
                <div class="alert alert-warning">
                    ${data.message}
                </div>
            `;
        }

        window.scrollTo(0, document.getElementById('searchResults').offsetTop - 100);
    })
    .catch(error => {
        console.error('Error:', error);
        const alertContainer = document.getElementById('alert-container');
        alertContainer.innerHTML = `
            <div class="alert alert-error">
                An error occurred while searching for flights. Please try again.
            </div>
        `;
    });
});

function displaySearchSummary(tripType, origin, destination, departureDate, returnDate) {
    const summary = document.createElement('div');
    summary.className = 'alert alert-success';
    summary.innerHTML = `
        <strong>Search Summary:</strong><br>
        Trip Type: ${tripType === 'oneway' ? 'One-way' : 'Round Trip'}<br>
        Route: ${origin} → ${destination}<br>
        Departure: ${departureDate}${tripType === 'roundtrip' ? `<br>Return: ${returnDate}` : ''}<br>
        Passengers: ${passengerData.adults} Adult(s), ${passengerData.children} Child(ren), ${passengerData.infants} Infant(s)
    `;
    document.getElementById('alert-container').innerHTML = '';
    document.getElementById('alert-container').appendChild(summary);
}

function displayFlights(flights, tripType) {
    const flightsList = document.getElementById('flightsList');
    flightsList.innerHTML = '';

    if (flights.length === 0) {
        flightsList.innerHTML = '<p>No flights found matching your criteria.</p>';
        return;
    }

    const title = document.createElement('h4');
    title.textContent = tripType === 'roundtrip' ? 'Departing Flights' : 'Available Flights';
    flightsList.appendChild(title);

    flights.forEach(flight => {
        const flightCard = document.createElement('div');
        flightCard.className = 'flight-card';
        flightCard.innerHTML = `
            <h4>Flight ${flight.flight_id}</h4>
            <div class="flight-info">
                <div class="info-item">
                    <strong>Origin:</strong>
                    ${flight.origin}
                </div>
                <div class="info-item">
                    <strong>Destination:</strong>
                    ${flight.destination}
                </div>
                <div class="info-item">
                    <strong>Departure:</strong>
                    ${flight.departure_date} at ${flight.departure_time}
                </div>
                <div class="info-item">
                    <strong>Arrival:</strong>
                    ${flight.arrival_date} at ${flight.arrival_time}
                </div>
                <div class="info-item">
                    <strong>Available Seats:</strong>
                    ${flight.available_seats}
                </div>
                <div class="info-item">
                    <strong>Price:</strong>
                    $${parseFloat(flight.price).toFixed(2)}
                </div>
            </div>
            <button class="btn-green" onclick="selectFlight('${flight.flight_id}', '${tripType}')">
                ${tripType === 'roundtrip' ? 'Select Departing Flight' : 'Add to Cart'}
            </button>
        `;
        flightsList.appendChild(flightCard);
    });
}

function selectFlight(flightId, tripType) {
    if (tripType === 'roundtrip') {
        // Show return flights
        showReturnFlights(flightId);
    } else {
        // Add to cart
        addFlightToCart(flightId, null);
    }
}

function showReturnFlights(departingFlightId) {
    window.selectedDepartingFlight = departingFlightId;

    const flightsList = document.getElementById('flightsList');

    // Add return flights section
    const returnSection = document.createElement('div');
    returnSection.id = 'returnFlightsSection';
    returnSection.innerHTML = '<h4 style="margin-top: 2rem;">Return Flights</h4>';

    if (window.returnFlights && window.returnFlights.length > 0) {
        window.returnFlights.forEach(flight => {
            const flightCard = document.createElement('div');
            flightCard.className = 'flight-card';
            flightCard.innerHTML = `
                <h4>Flight ${flight.flight_id}</h4>
                <div class="flight-info">
                    <div class="info-item">
                        <strong>Origin:</strong>
                        ${flight.origin}
                    </div>
                    <div class="info-item">
                        <strong>Destination:</strong>
                        ${flight.destination}
                    </div>
                    <div class="info-item">
                        <strong>Departure:</strong>
                        ${flight.departure_date} at ${flight.departure_time}
                    </div>
                    <div class="info-item">
                        <strong>Arrival:</strong>
                        ${flight.arrival_date} at ${flight.arrival_time}
                    </div>
                    <div class="info-item">
                        <strong>Available Seats:</strong>
                        ${flight.available_seats}
                    </div>
                    <div class="info-item">
                        <strong>Price:</strong>
                        $${parseFloat(flight.price).toFixed(2)}
                    </div>
                </div>
                <button class="btn-green" onclick="selectReturnFlight('${flight.flight_id}')">
                    Select Return Flight
                </button>
            `;
            returnSection.appendChild(flightCard);
        });
    } else {
        returnSection.innerHTML += '<p>No return flights available.</p>';
    }

    flightsList.appendChild(returnSection);
    window.scrollTo(0, returnSection.offsetTop - 100);
}

function selectReturnFlight(returnFlightId) {
    addFlightToCart(window.selectedDepartingFlight, returnFlightId);
}

function addFlightToCart(departingFlightId, returnFlightId) {
    const formData = new FormData();
    formData.append('departingFlightId', departingFlightId);
    formData.append('returnFlightId', returnFlightId || '');
    formData.append('adults', passengerData.adults);
    formData.append('children', passengerData.children);
    formData.append('infants', passengerData.infants);

    fetch('php/add_flight_to_cart.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Flight(s) added to cart! Redirecting to cart page...');
            window.location.href = 'cart.html';
        } else {
            alert(data.message || 'Error adding flight to cart. Please login first.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred. Please make sure you are logged in.');
    });
}
