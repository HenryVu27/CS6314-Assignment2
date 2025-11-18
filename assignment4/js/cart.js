// Load cart on page load
loadCart();

function loadCart() {
    fetch('php/get_cart.php')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                displayCart(data.cart);
            } else {
                document.getElementById('cartContent').innerHTML = `
                    <div class="alert alert-warning">
                        ${data.message || 'Please login to view your cart.'}
                    </div>
                `;
            }
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('cartContent').innerHTML = `
                <div class="alert alert-error">
                    Error loading cart. Please try again.
                </div>
            `;
        });
}

function displayCart(cart) {
    const cartContent = document.getElementById('cartContent');

    if (!cart.flights && !cart.hotel) {
        cartContent.innerHTML = `
            <div class="alert alert-warning">
                Your cart is empty. <a href="flights.html">Search flights</a> or <a href="stays.html">search hotels</a>.
            </div>
        `;
        return;
    }

    let html = '';

    // Display flights if any
    if (cart.flights) {
        html += '<h3>Flights in Cart</h3>';
        html += displayFlightCart(cart.flights);
    }

    // Display hotel if any
    if (cart.hotel) {
        html += '<h3>Hotel in Cart</h3>';
        html += displayHotelCart(cart.hotel);
    }

    cartContent.innerHTML = html;
}

function displayFlightCart(flights) {
    let html = '<div class="cart-item">';
    html += `<h4>${flights.tripType === 'roundtrip' ? 'Round Trip Flights' : 'One-way Flight'}</h4>`;

    // Departing flight
    html += '<h5>Departing Flight:</h5>';
    html += `<p><strong>Flight ID:</strong> ${flights.departingFlight.flight_id}</p>`;
    html += `<p><strong>Route:</strong> ${flights.departingFlight.origin} → ${flights.departingFlight.destination}</p>`;
    html += `<p><strong>Departure:</strong> ${flights.departingFlight.departure_date} at ${flights.departingFlight.departure_time}</p>`;
    html += `<p><strong>Arrival:</strong> ${flights.departingFlight.arrival_date} at ${flights.departingFlight.arrival_time}</p>`;

    // Return flight if round trip
    if (flights.returnFlight) {
        html += '<h5 style="margin-top: 1rem;">Return Flight:</h5>';
        html += `<p><strong>Flight ID:</strong> ${flights.returnFlight.flight_id}</p>`;
        html += `<p><strong>Route:</strong> ${flights.returnFlight.origin} → ${flights.returnFlight.destination}</p>`;
        html += `<p><strong>Departure:</strong> ${flights.returnFlight.departure_date} at ${flights.returnFlight.departure_time}</p>`;
        html += `<p><strong>Arrival:</strong> ${flights.returnFlight.arrival_date} at ${flights.returnFlight.arrival_time}</p>`;
    }

    // Passengers
    html += `<p style="margin-top: 1rem;"><strong>Passengers:</strong> ${flights.adults} Adults, ${flights.children} Children, ${flights.infants} Infants</p>`;

    // Price breakdown
    html += `<div class="cart-summary">`;
    html += `<div class="price-line"><span>Adult Tickets (${flights.adults}):</span><span>$${(flights.adults * flights.adultPrice).toFixed(2)}</span></div>`;
    html += `<div class="price-line"><span>Children Tickets (${flights.children}):</span><span>$${(flights.children * flights.childPrice).toFixed(2)}</span></div>`;
    html += `<div class="price-line"><span>Infant Tickets (${flights.infants}):</span><span>$${(flights.infants * flights.infantPrice).toFixed(2)}</span></div>`;
    html += `<div class="price-line total"><span>Total Price:</span><span>$${flights.totalPrice.toFixed(2)}</span></div>`;
    html += `</div>`;

    // Passenger details form
    html += '<div id="passengerDetailsForm">';
    html += '<h4 style="margin-top: 2rem;">Enter Passenger Details</h4>';
    html += '<div id="passengerInputs"></div>';
    html += '<button class="btn-green" style="margin-top: 1rem;" onclick="bookFlights()">Book Flights</button>';
    html += '</div>';

    html += '</div>';

    // Generate passenger input fields
    setTimeout(() => generatePassengerInputs(flights), 100);

    return html;
}

function generatePassengerInputs(flights) {
    const container = document.getElementById('passengerInputs');
    if (!container) return;

    let html = '';
    let passengerIndex = 0;

    // Adults
    for (let i = 0; i < flights.adults; i++) {
        html += generatePassengerForm(passengerIndex++, 'Adult', i + 1);
    }

    // Children
    for (let i = 0; i < flights.children; i++) {
        html += generatePassengerForm(passengerIndex++, 'Child', i + 1);
    }

    // Infants
    for (let i = 0; i < flights.infants; i++) {
        html += generatePassengerForm(passengerIndex++, 'Infant', i + 1);
    }

    container.innerHTML = html;
}

function generatePassengerForm(index, category, number) {
    return `
        <div class="passenger-details" style="background: #f9fafb; padding: 1rem; margin-bottom: 1rem; border-radius: 6px;">
            <h5>${category} ${number}</h5>
            <input type="text" id="p${index}_fname" placeholder="First Name" style="width: 48%; margin-right: 4%; margin-bottom: 0.5rem;" required>
            <input type="text" id="p${index}_lname" placeholder="Last Name" style="width: 48%; margin-bottom: 0.5rem;" required>
            <input type="text" id="p${index}_dob" placeholder="DOB (MM/DD/YYYY)" style="width: 48%; margin-right: 4%; margin-bottom: 0.5rem;" required>
            <input type="text" id="p${index}_ssn" placeholder="SSN (ddd-dd-dddd)" maxlength="11" style="width: 48%; margin-bottom: 0.5rem;" required>
            <input type="hidden" id="p${index}_category" value="${category}">
        </div>
    `;
}

function displayHotelCart(hotel) {
    let html = '<div class="cart-item">';
    html += `<h4>${hotel.hotelName}</h4>`;
    html += `<p><strong>Hotel ID:</strong> ${hotel.hotelId}</p>`;
    html += `<p><strong>City:</strong> ${hotel.city}</p>`;
    html += `<p><strong>Check-in:</strong> ${hotel.checkIn}</p>`;
    html += `<p><strong>Check-out:</strong> ${hotel.checkOut}</p>`;
    html += `<p><strong>Rooms:</strong> ${hotel.rooms}</p>`;
    html += `<p><strong>Guests:</strong> ${hotel.adults} Adults, ${hotel.children} Children, ${hotel.infants} Infants</p>`;

    // Price breakdown
    html += `<div class="cart-summary">`;
    html += `<div class="price-line"><span>Price per Night:</span><span>$${hotel.pricePerNight.toFixed(2)}</span></div>`;
    html += `<div class="price-line"><span>Number of Nights:</span><span>${hotel.nights}</span></div>`;
    html += `<div class="price-line"><span>Number of Rooms:</span><span>${hotel.rooms}</span></div>`;
    html += `<div class="price-line total"><span>Total Price:</span><span>$${hotel.totalPrice.toFixed(2)}</span></div>`;
    html += `</div>`;

    // Guest details form
    html += '<div id="guestDetailsForm">';
    html += '<h4 style="margin-top: 2rem;">Enter Guest Details</h4>';
    html += '<div id="guestInputs"></div>';
    html += '<button class="btn-green" style="margin-top: 1rem;" onclick="bookHotel()">Book Hotel</button>';
    html += '</div>';

    html += '</div>';

    // Generate guest input fields
    setTimeout(() => generateGuestInputs(hotel), 100);

    return html;
}

function generateGuestInputs(hotel) {
    const container = document.getElementById('guestInputs');
    if (!container) return;

    let html = '';
    let guestIndex = 0;

    // Adults
    for (let i = 0; i < hotel.adults; i++) {
        html += generateGuestForm(guestIndex++, 'Adult', i + 1);
    }

    // Children
    for (let i = 0; i < hotel.children; i++) {
        html += generateGuestForm(guestIndex++, 'Child', i + 1);
    }

    // Infants
    for (let i = 0; i < hotel.infants; i++) {
        html += generateGuestForm(guestIndex++, 'Infant', i + 1);
    }

    container.innerHTML = html;
}

function generateGuestForm(index, category, number) {
    return `
        <div class="guest-details" style="background: #f9fafb; padding: 1rem; margin-bottom: 1rem; border-radius: 6px;">
            <h5>${category} ${number}</h5>
            <input type="text" id="g${index}_fname" placeholder="First Name" style="width: 48%; margin-right: 4%; margin-bottom: 0.5rem;" required>
            <input type="text" id="g${index}_lname" placeholder="Last Name" style="width: 48%; margin-bottom: 0.5rem;" required>
            <input type="text" id="g${index}_dob" placeholder="DOB (MM/DD/YYYY)" style="width: 48%; margin-right: 4%; margin-bottom: 0.5rem;" required>
            <input type="text" id="g${index}_ssn" placeholder="SSN (ddd-dd-dddd)" maxlength="11" style="width: 48%; margin-bottom: 0.5rem;" required>
            <input type="hidden" id="g${index}_category" value="${category}">
        </div>
    `;
}

function bookFlights() {
    // Collect passenger data
    const passengers = [];
    let index = 0;
    let hasError = false;

    while (document.getElementById(`p${index}_fname`)) {
        const fname = document.getElementById(`p${index}_fname`).value.trim();
        const lname = document.getElementById(`p${index}_lname`).value.trim();
        const dob = document.getElementById(`p${index}_dob`).value.trim();
        const ssn = document.getElementById(`p${index}_ssn`).value.trim();
        const category = document.getElementById(`p${index}_category`).value;

        if (!fname || !lname || !dob || !ssn) {
            alert('Please fill in all passenger details');
            hasError = true;
            break;
        }

        passengers.push({ fname, lname, dob, ssn, category });
        index++;
    }

    if (hasError) return;

    // Submit booking
    fetch('php/book_flights.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ passengers })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Flight(s) booked successfully!');
            window.location.href = 'my-account.html';
        } else {
            alert(data.message || 'Error booking flights');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while booking flights');
    });
}

function bookHotel() {
    // Collect guest data
    const guests = [];
    let index = 0;
    let hasError = false;

    while (document.getElementById(`g${index}_fname`)) {
        const fname = document.getElementById(`g${index}_fname`).value.trim();
        const lname = document.getElementById(`g${index}_lname`).value.trim();
        const dob = document.getElementById(`g${index}_dob`).value.trim();
        const ssn = document.getElementById(`g${index}_ssn`).value.trim();
        const category = document.getElementById(`g${index}_category`).value;

        if (!fname || !lname || !dob || !ssn) {
            alert('Please fill in all guest details');
            hasError = true;
            break;
        }

        guests.push({ fname, lname, dob, ssn, category });
        index++;
    }

    if (hasError) return;

    // Submit booking
    fetch('php/book_hotel.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ guests })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Hotel booked successfully!');
            window.location.href = 'my-account.html';
        } else {
            alert(data.message || 'Error booking hotel');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while booking hotel');
    });
}
