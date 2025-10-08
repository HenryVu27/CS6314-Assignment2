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
    document.getElementById('datetime').textContent = dateTimeString;
}

// Update date and time every second
updateDateTime();
setInterval(updateDateTime, 1000);

// Font size control
const fontSizeSelect = document.getElementById('fontSize');
const mainContent = document.getElementById('mainContent');

if (fontSizeSelect && mainContent) {
    fontSizeSelect.addEventListener('change', function() {
        mainContent.style.fontSize = this.value;
    });
}

// Background color control
const bgColorInput = document.getElementById('bgColor');

if (bgColorInput) {
    bgColorInput.addEventListener('input', function() {
        document.body.style.backgroundColor = this.value;
    });
}
