// Stays page validation and functionality
document.getElementById('staysForm').addEventListener('submit', function(e) {
    e.preventDefault();

    // Clear previous errors
    clearErrors();

    // Get form values
    const city = document.getElementById('city').value;
    const checkin = document.getElementById('checkin').value;
    const checkout = document.getElementById('checkout').value;
    const adults = parseInt(document.getElementById('adults').value) || 0;
    const children = parseInt(document.getElementById('children').value) || 0;
    const infants = parseInt(document.getElementById('infants').value) || 0;

    let isValid = true;

    // Validate city (must be selected)
    if (!city) {
        showError('cityError');
        isValid = false;
    }

    // Validate check-in date (Sep 1, 2024 to Dec 1, 2024)
    if (!checkin) {
        showError('checkinError');
        isValid = false;
    } else {
        const checkinDate = new Date(checkin);
        const minDate = new Date('2024-09-01');
        const maxDate = new Date('2024-12-01');

        if (checkinDate < minDate || checkinDate > maxDate) {
            showError('checkinError');
            isValid = false;
        }
    }

    // Validate check-out date (Sep 1, 2024 to Dec 1, 2024 and after check-in)
    if (!checkout) {
        showError('checkoutError');
        isValid = false;
    } else {
        const checkoutDate = new Date(checkout);
        const checkinDate = new Date(checkin);
        const minDate = new Date('2024-09-01');
        const maxDate = new Date('2024-12-01');

        if (checkoutDate < minDate || checkoutDate > maxDate || checkoutDate <= checkinDate) {
            showError('checkoutError');
            isValid = false;
        }
    }

    // Validate number of guests (max 2 per room, excluding infants)
    const totalGuestsExcludingInfants = adults + children;
    if (totalGuestsExcludingInfants === 0) {
        alert('Please enter at least one adult or child guest');
        isValid = false;
    }

    // Calculate number of rooms needed
    // Each room can accommodate max 2 guests (adults + children), infants don't count
    let roomsNeeded = 0;
    if (totalGuestsExcludingInfants > 0) {
        roomsNeeded = Math.ceil(totalGuestsExcludingInfants / 2);
    }

    // Display results if valid
    if (isValid) {
        const resultsDiv = document.getElementById('results');
        const detailsDiv = document.getElementById('bookingDetails');

        detailsDiv.innerHTML = `
            <p><strong>City:</strong> ${city}</p>
            <p><strong>Check-in:</strong> ${formatDate(checkin)}</p>
            <p><strong>Check-out:</strong> ${formatDate(checkout)}</p>
            <p><strong>Adults:</strong> ${adults}</p>
            <p><strong>Children:</strong> ${children}</p>
            <p><strong>Infants:</strong> ${infants}</p>
            <p><strong>Number of Rooms Required:</strong> ${roomsNeeded}</p>
            <p style="margin-top: 1rem; padding: 1rem; background-color: #e8f5e9; border-radius: 4px;">
                <strong>Note:</strong> Based on ${totalGuestsExcludingInfants} guest(s) (excluding infants),
                you will need ${roomsNeeded} room(s) at maximum 2 guests per room.
            </p>
        `;

        resultsDiv.classList.add('show');
    }
});

function showError(errorId) {
    const errorElement = document.getElementById(errorId);
    errorElement.classList.add('show');
    errorElement.parentElement.classList.add('has-error');
}

function clearErrors() {
    const errors = document.querySelectorAll('.error');
    errors.forEach(error => error.classList.remove('show'));

    const formGroups = document.querySelectorAll('.form-group');
    formGroups.forEach(group => group.classList.remove('has-error'));

    const resultsDiv = document.getElementById('results');
    resultsDiv.classList.remove('show');
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}
