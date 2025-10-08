// Flights page validation and functionality

// Show/hide return date based on trip type
const tripTypeRadios = document.querySelectorAll('input[name="tripType"]');
const returnDateGroup = document.getElementById('returnDateGroup');

tripTypeRadios.forEach(radio => {
    radio.addEventListener('change', function() {
        if (this.value === 'roundtrip') {
            returnDateGroup.style.display = 'block';
        } else {
            returnDateGroup.style.display = 'none';
        }
    });
});

// Toggle passenger form
const passengerIcon = document.getElementById('passengerIcon');
const passengerForm = document.getElementById('passengerForm');

passengerIcon.addEventListener('click', function() {
    passengerForm.classList.toggle('show');
});

// Form submission and validation
document.getElementById('flightsForm').addEventListener('submit', function(e) {
    e.preventDefault();

    // Clear previous errors
    clearErrors();

    // Get form values
    const tripType = document.querySelector('input[name="tripType"]:checked').value;
    const origin = document.getElementById('origin').value.trim();
    const destination = document.getElementById('destination').value.trim();
    const departureDate = document.getElementById('departureDate').value;
    const returnDate = document.getElementById('returnDate').value;
    const adults = parseInt(document.getElementById('flightAdults').value) || 0;
    const children = parseInt(document.getElementById('flightChildren').value) || 0;
    const infants = parseInt(document.getElementById('flightInfants').value) || 0;

    let isValid = true;

    // Texas and California cities regex pattern
    // Common cities in Texas: Houston, Dallas, Austin, San Antonio, Fort Worth, El Paso
    // Common cities in California: Los Angeles, San Francisco, San Diego, Sacramento, San Jose, Fresno
    const texasCities = /(Houston|Dallas|Austin|San Antonio|Fort Worth|El Paso)/i;
    const californiaCities = /(Los Angeles|San Francisco|San Diego|Sacramento|San Jose|Fresno|LA|SF)/i;
    const validCityPattern = new RegExp(
        `(${texasCities.source}|${californiaCities.source})`,
        'i'
    );

    // Validate origin using regex
    if (!origin) {
        showError('originError');
        isValid = false;
    } else if (!validCityPattern.test(origin)) {
        showError('originError');
        isValid = false;
    }

    // Validate destination using regex
    if (!destination) {
        showError('destinationError');
        isValid = false;
    } else if (!validCityPattern.test(destination)) {
        showError('destinationError');
        isValid = false;
    }

    // Validate departure date using regex (format: YYYY-MM-DD between Sep 1, 2024 and Dec 1, 2024)
    const datePattern = /^2024-(09|10|11|12)-([0-2][0-9]|3[01])$/;

    if (!departureDate) {
        showError('departureDateError');
        isValid = false;
    } else if (!datePattern.test(departureDate)) {
        showError('departureDateError');
        isValid = false;
    } else {
        // Additional validation to ensure date is within range
        const depDate = new Date(departureDate);
        const minDate = new Date('2024-09-01');
        const maxDate = new Date('2024-12-01');

        if (depDate < minDate || depDate > maxDate) {
            showError('departureDateError');
            isValid = false;
        }
    }

    // Validate return date for round trip
    if (tripType === 'roundtrip') {
        if (!returnDate) {
            showError('returnDateError');
            isValid = false;
        } else if (!datePattern.test(returnDate)) {
            showError('returnDateError');
            isValid = false;
        } else {
            const retDate = new Date(returnDate);
            const depDate = new Date(departureDate);
            const minDate = new Date('2024-09-01');
            const maxDate = new Date('2024-12-01');

            if (retDate < minDate || retDate > maxDate || retDate <= depDate) {
                showError('returnDateError');
                isValid = false;
            }
        }
    }

    // Validate number of passengers (max 4 each)
    if (adults > 4) {
        showError('flightAdultsError');
        isValid = false;
    }

    if (children > 4) {
        showError('flightChildrenError');
        isValid = false;
    }

    if (infants > 4) {
        showError('flightInfantsError');
        isValid = false;
    }

    // At least one passenger required
    if (adults === 0 && children === 0 && infants === 0) {
        alert('Please select at least one passenger');
        isValid = false;
    }

    // Display results if valid
    if (isValid) {
        const resultsDiv = document.getElementById('results');
        const detailsDiv = document.getElementById('flightDetails');

        let tripTypeText = tripType === 'oneway' ? 'One Way' : 'Round Trip';
        let dateInfo = `<p><strong>Departure Date:</strong> ${formatDate(departureDate)}</p>`;

        if (tripType === 'roundtrip') {
            dateInfo += `<p><strong>Return Date:</strong> ${formatDate(returnDate)}</p>`;
        }

        detailsDiv.innerHTML = `
            <p><strong>Trip Type:</strong> ${tripTypeText}</p>
            <p><strong>Origin:</strong> ${origin}</p>
            <p><strong>Destination:</strong> ${destination}</p>
            ${dateInfo}
            <p><strong>Adults:</strong> ${adults}</p>
            <p><strong>Children:</strong> ${children}</p>
            <p><strong>Infants:</strong> ${infants}</p>
            <p><strong>Total Passengers:</strong> ${adults + children + infants}</p>
            <p style="margin-top: 1rem; padding: 1rem; background-color: #e3f2fd; border-radius: 4px;">
                <strong>✓ Your flight search is ready!</strong> We'll find the best options for your ${tripTypeText.toLowerCase()} journey.
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
