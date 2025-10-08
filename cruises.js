// Cruises page - Using jQuery methods

$(document).ready(function() {
    // Form submission and validation using jQuery
    $('#cruisesForm').on('submit', function(e) {
        e.preventDefault();

        // Clear previous errors using jQuery
        clearErrors();

        // Get form values using jQuery
        const destination = $('#destination').val();
        const departingStart = $('#departingStart').val();
        const departingEnd = $('#departingEnd').val();
        const minDuration = parseInt($('#minDuration').val()) || 0;
        const maxDuration = parseInt($('#maxDuration').val()) || 0;
        const adults = parseInt($('#cruiseAdults').val()) || 0;
        const children = parseInt($('#cruiseChildren').val()) || 0;
        const infants = parseInt($('#cruiseInfants').val()) || 0;

        let isValid = true;

        // Validate destination
        const validDestinations = ['Alaska', 'Bahamas', 'Europe', 'Mexico'];
        if (!destination || !validDestinations.includes(destination)) {
            showError('destinationError');
            isValid = false;
        }

        // Validate departing start date
        if (!departingStart) {
            showError('departingStartError');
            isValid = false;
        } else {
            const startDate = new Date(departingStart);
            const minDate = new Date('2024-09-01');
            const maxDate = new Date('2024-12-01');

            if (startDate < minDate || startDate > maxDate) {
                showError('departingStartError');
                isValid = false;
            }
        }

        // Validate departing end date
        if (!departingEnd) {
            showError('departingEndError');
            isValid = false;
        } else {
            const endDate = new Date(departingEnd);
            const startDate = new Date(departingStart);
            const minDate = new Date('2024-09-01');
            const maxDate = new Date('2024-12-01');

            if (endDate < minDate || endDate > maxDate || endDate < startDate) {
                showError('departingEndError');
                isValid = false;
            }
        }

        // Validate minimum duration
        if (minDuration < 3) {
            showError('minDurationError');
            isValid = false;
        }

        // Validate maximum duration
        if (maxDuration > 10 || maxDuration < minDuration) {
            showError('maxDurationError');
            isValid = false;
        }

        // Validate number of guests (max 2 per room, excluding infants)
        const totalGuestsExcludingInfants = adults + children;
        if (totalGuestsExcludingInfants === 0) {
            alert('Please enter at least one adult or child guest');
            isValid = false;
        }

        // Calculate number of rooms needed
        let roomsNeeded = 0;
        if (totalGuestsExcludingInfants > 0) {
            roomsNeeded = Math.ceil(totalGuestsExcludingInfants / 2);
        }

        // Display results if valid using jQuery
        if (isValid) {
            const resultsHtml = `
                <p><strong>Destination:</strong> ${destination}</p>
                <p><strong>Departing Between:</strong> ${formatDate(departingStart)} to ${formatDate(departingEnd)}</p>
                <p><strong>Cruise Duration:</strong> ${minDuration} to ${maxDuration} days</p>
                <p><strong>Adults:</strong> ${adults}</p>
                <p><strong>Children:</strong> ${children}</p>
                <p><strong>Infants:</strong> ${infants}</p>
                <p><strong>Number of Cabins Required:</strong> ${roomsNeeded}</p>
                <p style="margin-top: 1rem; padding: 1rem; background-color: #e1f5fe; border-radius: 4px;">
                    <strong>⚓ Your cruise search is ready!</strong> We'll find the best ${destination} cruises
                    departing between your selected dates with ${roomsNeeded} cabin(s).
                </p>
            `;

            // Use jQuery to update the DOM
            $('#cruiseDetails').html(resultsHtml);
            $('#results').addClass('show');
        }
    });

    // Helper function to show error using jQuery
    function showError(errorId) {
        $('#' + errorId).addClass('show');
        $('#' + errorId).parent().addClass('has-error');
    }

    // Helper function to clear errors using jQuery
    function clearErrors() {
        $('.error').removeClass('show');
        $('.form-group').removeClass('has-error');
        $('#results').removeClass('show');
    }

    // Helper function to format dates
    function formatDate(dateString) {
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    }
});
