// Display current date and time
function updateDateTime() {
    const now = new Date();
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    };
    const dateTimeString = now.toLocaleDateString('en-US', options);
    const datetimeElement = document.getElementById('datetime');
    if (datetimeElement) {
        datetimeElement.textContent = dateTimeString;
    }
}

// Update date and time every second
updateDateTime();
setInterval(updateDateTime, 1000);

// Font size control
const fontSizeSelect = document.getElementById('fontSize');
const mainContent = document.getElementById('mainContent');

if (fontSizeSelect && mainContent) {
    // Load saved font size
    const savedFontSize = localStorage.getItem('fontSize');
    if (savedFontSize) {
        mainContent.style.fontSize = savedFontSize;
        fontSizeSelect.value = savedFontSize;
    }

    fontSizeSelect.addEventListener('change', function() {
        mainContent.style.fontSize = this.value;
        localStorage.setItem('fontSize', this.value);
    });
}

// Background color control
const bgColorInput = document.getElementById('bgColor');

if (bgColorInput) {
    // Load saved background color
    const savedBgColor = localStorage.getItem('bgColor');
    if (savedBgColor) {
        document.body.style.backgroundColor = savedBgColor;
        bgColorInput.value = savedBgColor;
    }

    bgColorInput.addEventListener('input', function() {
        document.body.style.backgroundColor = this.value;
        localStorage.setItem('bgColor', this.value);
    });
}

// Check if user is logged in and display user info
function checkLoginStatus() {
    fetch('php/check_session.php')
        .then(response => response.json())
        .then(data => {
            const userInfoElement = document.getElementById('user-info');
            if (userInfoElement) {
                if (data.loggedIn) {
                    userInfoElement.innerHTML = `Welcome, ${data.firstName} ${data.lastName} | <a href="php/logout.php" style="color: white; text-decoration: underline;">Logout</a>`;
                } else {
                    userInfoElement.innerHTML = `<a href="login.html" style="color: white; text-decoration: underline;">Login</a> | <a href="register.html" style="color: white; text-decoration: underline;">Register</a>`;
                }
            }
        })
        .catch(error => console.error('Error checking login status:', error));
}

// Call on page load
checkLoginStatus();

// Helper function to format phone number
function formatPhoneNumber(input) {
    // Remove all non-digits
    let value = input.value.replace(/\D/g, '');

    // Format as ddd-ddd-dddd
    if (value.length >= 6) {
        value = value.substring(0, 3) + '-' + value.substring(3, 6) + '-' + value.substring(6, 10);
    } else if (value.length >= 3) {
        value = value.substring(0, 3) + '-' + value.substring(3);
    }

    input.value = value;
}

// Helper function to validate phone number format
function isValidPhoneNumber(phone) {
    const phonePattern = /^\d{3}-\d{3}-\d{4}$/;
    return phonePattern.test(phone);
}

// Helper function to validate email
function isValidEmail(email) {
    return email.includes('@') && email.includes('.com');
}

// Helper function to validate date format (MM/DD/YYYY)
function isValidDateFormat(dateStr) {
    const datePattern = /^\d{2}\/\d{2}\/\d{4}$/;
    return datePattern.test(dateStr);
}

// Helper function to show error message
function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }
}

// Helper function to hide error message
function hideError(elementId) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.classList.remove('show');
    }
}

// Helper function to clear all errors
function clearAllErrors() {
    const errors = document.querySelectorAll('.error');
    errors.forEach(error => error.classList.remove('show'));

    const formGroups = document.querySelectorAll('.form-group');
    formGroups.forEach(group => group.classList.remove('has-error'));
}
