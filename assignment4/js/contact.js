// Form submission
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    clearAllErrors();

    const comment = document.getElementById('comment').value.trim();

    let isValid = true;

    if (!comment) {
        showError('comment-error', 'Comment is required');
        isValid = false;
    } else if (comment.length < 10) {
        showError('comment-error', 'Comment must be at least 10 characters');
        isValid = false;
    }

    if (!isValid) {
        return;
    }

    // Submit to PHP backend
    const formData = new FormData();
    formData.append('comment', comment);

    fetch('php/contact.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        const alertContainer = document.getElementById('alert-container');

        if (data.success) {
            alertContainer.innerHTML = `
                <div class="alert alert-success">
                    ${data.message}
                </div>
            `;
            document.getElementById('contactForm').reset();
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
                An error occurred. Please make sure you are logged in and try again.
            </div>
        `;
        window.scrollTo(0, 0);
    });
});
