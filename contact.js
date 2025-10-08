// Contact page validation using regular expressions

document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();

    // Clear previous errors
    clearErrors();

    // Get form values
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const gender = document.querySelector('input[name="gender"]:checked');
    const email = document.getElementById('email').value.trim();
    const comment = document.getElementById('comment').value.trim();

    let isValid = true;

    // Regular expression for alphabetic names with first letter capitalized
    // Pattern: First letter must be uppercase, rest must be lowercase letters
    const namePattern = /^[A-Z][a-z]+$/;

    // Validate first name using regex
    if (!firstName) {
        showError('firstNameError');
        isValid = false;
    } else if (!namePattern.test(firstName)) {
        showError('firstNameError');
        isValid = false;
    }

    // Validate last name using regex
    if (!lastName) {
        showError('lastNameError');
        isValid = false;
    } else if (!namePattern.test(lastName)) {
        showError('lastNameError');
        isValid = false;
    }

    // Validate that first name and last name are not the same
    if (firstName && lastName && firstName.toLowerCase() === lastName.toLowerCase()) {
        alert('First name and last name cannot be the same');
        showError('firstNameError');
        showError('lastNameError');
        isValid = false;
    }

    // Validate phone number using regex
    // Pattern: (ddd) ddd-dddd
    const phonePattern = /^\(\d{3}\)\s\d{3}-\d{4}$/;

    if (!phone) {
        showError('phoneError');
        isValid = false;
    } else if (!phonePattern.test(phone)) {
        showError('phoneError');
        isValid = false;
    }

    // Validate gender (must be selected)
    if (!gender) {
        showError('genderError');
        isValid = false;
    }

    // Validate email using regex
    // Pattern: must contain @ and .
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
        showError('emailError');
        isValid = false;
    } else if (!emailPattern.test(email)) {
        showError('emailError');
        isValid = false;
    }

    // Validate comment using regex (at least 10 characters)
    const commentPattern = /^.{10,}$/;

    if (!comment) {
        showError('commentError');
        isValid = false;
    } else if (!commentPattern.test(comment)) {
        showError('commentError');
        isValid = false;
    }

    // Display results if valid
    if (isValid) {
        const resultsDiv = document.getElementById('results');
        const detailsDiv = document.getElementById('contactDetails');

        detailsDiv.innerHTML = `
            <p><strong>Name:</strong> ${firstName} ${lastName}</p>
            <p><strong>Phone:</strong> ${phone}</p>
            <p><strong>Gender:</strong> ${gender.value.charAt(0).toUpperCase() + gender.value.slice(1)}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Comment:</strong> ${comment}</p>
        `;

        resultsDiv.classList.add('show');

        // Optionally reset the form
        // document.getElementById('contactForm').reset();
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
