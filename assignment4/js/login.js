// Phone number formatting on input
document.getElementById('phone').addEventListener('input', function(e) {
    formatPhoneNumber(this);
});

// Form submission
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    clearAllErrors();

    const phone = document.getElementById('phone').value.trim();
    const password = document.getElementById('password').value;

    let isValid = true;

    if (!phone) {
        showError('phone-error', 'Phone number is required');
        isValid = false;
    } else if (!isValidPhoneNumber(phone)) {
        showError('phone-error', 'Phone number must be in format ddd-ddd-dddd');
        isValid = false;
    }

    if (!password) {
        showError('password-error', 'Password is required');
        isValid = false;
    }

    if (!isValid) {
        return;
    }

    // Submit to PHP backend
    const formData = new FormData();
    formData.append('phone', phone);
    formData.append('password', password);

    fetch('php/login.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        const alertContainer = document.getElementById('alert-container');

        if (data.success) {
            alertContainer.innerHTML = `
                <div class="alert alert-success">
                    ${data.message} Redirecting...
                </div>
            `;
            // Redirect to home page after 1 second
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        } else {
            alertContainer.innerHTML = `
                <div class="alert alert-error">
                    ${data.message}
                </div>
            `;
        }

        window.scrollTo(0, 0);
    })
    .catch(error => {
        console.error('Error:', error);
        const alertContainer = document.getElementById('alert-container');
        alertContainer.innerHTML = `
            <div class="alert alert-error">
                An error occurred during login. Please try again.
            </div>
        `;
        window.scrollTo(0, 0);
    });
});
