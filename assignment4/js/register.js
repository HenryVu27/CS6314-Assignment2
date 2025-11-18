// Phone number formatting on input
document.getElementById('phone').addEventListener('input', function(e) {
    formatPhoneNumber(this);
});

// Date of birth formatting
document.getElementById('dob').addEventListener('input', function(e) {
    let value = this.value.replace(/\D/g, '');
    if (value.length >= 4) {
        value = value.substring(0, 2) + '/' + value.substring(2, 4) + '/' + value.substring(4, 8);
    } else if (value.length >= 2) {
        value = value.substring(0, 2) + '/' + value.substring(2);
    }
    this.value = value;
});

// Form submission
document.getElementById('registerForm').addEventListener('submit', function(e) {
    e.preventDefault();
    clearAllErrors();

    // Get form values
    const phone = document.getElementById('phone').value.trim();
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const dob = document.getElementById('dob').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // Get selected gender
    const genderInputs = document.querySelectorAll('input[name="gender"]');
    let gender = '';
    for (let input of genderInputs) {
        if (input.checked) {
            gender = input.value;
            break;
        }
    }

    let isValid = true;

    // Validate required fields
    if (!phone) {
        showError('phone-error', 'Phone number is required');
        isValid = false;
    } else if (!isValidPhoneNumber(phone)) {
        showError('phone-error', 'Phone number must be in format ddd-ddd-dddd');
        isValid = false;
    }

    if (!firstName) {
        showError('firstName-error', 'First name is required');
        isValid = false;
    }

    if (!lastName) {
        showError('lastName-error', 'Last name is required');
        isValid = false;
    }

    if (!dob) {
        showError('dob-error', 'Date of birth is required');
        isValid = false;
    } else if (!isValidDateFormat(dob)) {
        showError('dob-error', 'Date of birth must be in format MM/DD/YYYY');
        isValid = false;
    }

    if (!email) {
        showError('email-error', 'Email is required');
        isValid = false;
    } else if (!isValidEmail(email)) {
        showError('email-error', 'Email must contain @ and .com');
        isValid = false;
    }

    if (!password) {
        showError('password-error', 'Password is required');
        isValid = false;
    } else if (password.length < 8) {
        showError('password-error', 'Password must be at least 8 characters');
        isValid = false;
    }

    if (!confirmPassword) {
        showError('confirmPassword-error', 'Please confirm your password');
        isValid = false;
    } else if (password !== confirmPassword) {
        showError('confirmPassword-error', 'Passwords do not match');
        isValid = false;
    }

    if (!isValid) {
        return;
    }

    // Submit to PHP backend
    const formData = new FormData();
    formData.append('phone', phone);
    formData.append('firstName', firstName);
    formData.append('lastName', lastName);
    formData.append('dob', dob);
    formData.append('email', email);
    formData.append('gender', gender);
    formData.append('password', password);

    fetch('php/register.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        const alertContainer = document.getElementById('alert-container');

        if (data.success) {
            alertContainer.innerHTML = `
                <div class="alert alert-success">
                    ${data.message} You can now <a href="login.html" style="color: #065f46; font-weight: 600; text-decoration: underline;">login here</a>.
                </div>
            `;
            document.getElementById('registerForm').reset();
        } else {
            alertContainer.innerHTML = `
                <div class="alert alert-error">
                    ${data.message}
                </div>
            `;
        }

        // Scroll to top to see the message
        window.scrollTo(0, 0);
    })
    .catch(error => {
        console.error('Error:', error);
        const alertContainer = document.getElementById('alert-container');
        alertContainer.innerHTML = `
            <div class="alert alert-error">
                An error occurred during registration. Please try again.
            </div>
        `;
        window.scrollTo(0, 0);
    });
});
