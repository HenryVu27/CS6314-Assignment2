// Store guest data
let guestData = {
    adults: 2,
    children: 0,
    infants: 0,
    rooms: 1
};

// Form submission
document.getElementById('hotelSearchForm').addEventListener('submit', function(e) {
    e.preventDefault();
    clearAllErrors();

    const city = document.getElementById('city').value;
    const checkIn = document.getElementById('checkIn').value;
    const checkOut = document.getElementById('checkOut').value;
    const adults = parseInt(document.getElementById('adultsGuests').value) || 0;
    const children = parseInt(document.getElementById('childrenGuests').value) || 0;
    const infants = parseInt(document.getElementById('infantsGuests').value) || 0;

    let isValid = true;

    // Validate inputs
    if (!city) {
        showError('city-error', 'Please select a city');
        isValid = false;
    }

    if (!checkIn) {
        showError('checkIn-error', 'Please select check-in date');
        isValid = false;
    } else {
        const checkInDate = new Date(checkIn);
        const minDate = new Date('2024-09-01');
        const maxDate = new Date('2024-12-01');

        if (checkInDate < minDate || checkInDate > maxDate) {
            showError('checkIn-error', 'Date must be between Sep 1, 2024 and Dec 1, 2024');
            isValid = false;
        }
    }

    if (!checkOut) {
        showError('checkOut-error', 'Please select check-out date');
        isValid = false;
    } else {
        const checkOutDate = new Date(checkOut);
        const checkInDate = new Date(checkIn);
        const minDate = new Date('2024-09-01');
        const maxDate = new Date('2024-12-01');

        if (checkOutDate < minDate || checkOutDate > maxDate) {
            showError('checkOut-error', 'Date must be between Sep 1, 2024 and Dec 1, 2024');
            isValid = false;
        }

        if (checkOutDate <= checkInDate) {
            showError('checkOut-error', 'Check-out must be after check-in date');
            isValid = false;
        }
    }

    // Calculate required rooms
    const regularGuests = adults + children;
    const rooms = Math.ceil(regularGuests / 2);

    guestData = { adults, children, infants, rooms };

    if (!isValid) return;

    // Search for hotels
    const formData = new FormData();
    formData.append('city', city);
    formData.append('checkIn', checkIn);
    formData.append('checkOut', checkOut);
    formData.append('adults', adults);
    formData.append('children', children);
    formData.append('infants', infants);
    formData.append('rooms', rooms);

    fetch('php/search_hotels.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        const alertContainer = document.getElementById('alert-container');

        if (data.success) {
            displaySearchSummary(city, checkIn, checkOut, adults, children, infants, rooms);
            displayHotels(data.hotels, checkIn, checkOut, rooms);
            document.getElementById('searchResults').style.display = 'block';
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
                An error occurred while searching for hotels. Please try again.
            </div>
        `;
    });
});

function displaySearchSummary(city, checkIn, checkOut, adults, children, infants, rooms) {
    const summary = document.createElement('div');
    summary.className = 'alert alert-success';
    summary.innerHTML = `
        <strong>Search Summary:</strong><br>
        City: ${city}<br>
        Check-in: ${checkIn}<br>
        Check-out: ${checkOut}<br>
        Guests: ${adults} Adult(s), ${children} Child(ren), ${infants} Infant(s)<br>
        Rooms Required: ${rooms}
    `;
    document.getElementById('alert-container').innerHTML = '';
    document.getElementById('alert-container').appendChild(summary);
}

function displayHotels(hotels, checkIn, checkOut, rooms) {
    const hotelsList = document.getElementById('hotelsList');
    hotelsList.innerHTML = '';

    if (hotels.length === 0) {
        hotelsList.innerHTML = '<p>No hotels found in this city.</p>';
        return;
    }

    hotels.forEach(hotel => {
        // Calculate nights
        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);
        const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
        const pricePerNight = parseFloat(hotel.price_per_night);
        const totalPrice = pricePerNight * rooms * nights;

        const hotelCard = document.createElement('div');
        hotelCard.className = 'hotel-card';
        hotelCard.innerHTML = `
            <h4>${hotel.hotel_name}</h4>
            <div class="hotel-info">
                <div class="info-item">
                    <strong>Hotel ID:</strong>
                    ${hotel.hotel_id}
                </div>
                <div class="info-item">
                    <strong>City:</strong>
                    ${hotel.city}
                </div>
                <div class="info-item">
                    <strong>Price per Night:</strong>
                    $${pricePerNight.toFixed(2)}
                </div>
                <div class="info-item">
                    <strong>Rooms:</strong>
                    ${rooms}
                </div>
                <div class="info-item">
                    <strong>Nights:</strong>
                    ${nights}
                </div>
                <div class="info-item">
                    <strong>Total Price:</strong>
                    $${totalPrice.toFixed(2)}
                </div>
            </div>
            <button class="btn-green" onclick="addHotelToCart('${hotel.hotel_id}', '${checkIn}', '${checkOut}', ${rooms})">
                Add to Cart
            </button>
        `;
        hotelsList.appendChild(hotelCard);
    });
}

function addHotelToCart(hotelId, checkIn, checkOut, rooms) {
    const formData = new FormData();
    formData.append('hotelId', hotelId);
    formData.append('checkIn', checkIn);
    formData.append('checkOut', checkOut);
    formData.append('rooms', rooms);
    formData.append('adults', guestData.adults);
    formData.append('children', guestData.children);
    formData.append('infants', guestData.infants);

    fetch('php/add_hotel_to_cart.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Hotel added to cart! Redirecting to cart page...');
            window.location.href = 'cart.html';
        } else {
            alert(data.message || 'Error adding hotel to cart. Please login first.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred. Please make sure you are logged in.');
    });
}
