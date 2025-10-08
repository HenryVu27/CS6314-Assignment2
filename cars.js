// Cars page - Using DOM methods to create the form

// Get container
const formContainer = document.getElementById('carFormContainer');

// Create form element
const form = document.createElement('form');
form.id = 'carsForm';

// Create city field
const cityGroup = document.createElement('div');
cityGroup.className = 'form-group';

const cityLabel = document.createElement('label');
cityLabel.setAttribute('for', 'carCity');
cityLabel.textContent = 'City:';

const citySelect = document.createElement('select');
citySelect.id = 'carCity';
citySelect.name = 'carCity';

const cityDefaultOption = document.createElement('option');
cityDefaultOption.value = '';
cityDefaultOption.textContent = 'Select a city';
citySelect.appendChild(cityDefaultOption);

// Texas cities
const texasGroup = document.createElement('optgroup');
texasGroup.label = 'Texas';

const texasCities = ['Houston', 'Dallas', 'Austin', 'San Antonio'];
texasCities.forEach(city => {
    const option = document.createElement('option');
    option.value = city;
    option.textContent = city;
    texasGroup.appendChild(option);
});
citySelect.appendChild(texasGroup);

// California cities
const californiaGroup = document.createElement('optgroup');
californiaGroup.label = 'California';

const californiaCities = ['Los Angeles', 'San Francisco', 'San Diego', 'Sacramento'];
californiaCities.forEach(city => {
    const option = document.createElement('option');
    option.value = city;
    option.textContent = city;
    californiaGroup.appendChild(option);
});
citySelect.appendChild(californiaGroup);

const cityError = document.createElement('span');
cityError.className = 'error';
cityError.id = 'carCityError';
cityError.textContent = 'Please select a city';

cityGroup.appendChild(cityLabel);
cityGroup.appendChild(citySelect);
cityGroup.appendChild(cityError);

// Create car type field
const carTypeGroup = document.createElement('div');
carTypeGroup.className = 'form-group';

const carTypeLabel = document.createElement('label');
carTypeLabel.setAttribute('for', 'carType');
carTypeLabel.textContent = 'Car Type:';

const carTypeSelect = document.createElement('select');
carTypeSelect.id = 'carType';
carTypeSelect.name = 'carType';

const carTypeDefaultOption = document.createElement('option');
carTypeDefaultOption.value = '';
carTypeDefaultOption.textContent = 'Select car type';
carTypeSelect.appendChild(carTypeDefaultOption);

const carTypes = ['economy', 'SUV', 'Compact', 'midsize'];
carTypes.forEach(type => {
    const option = document.createElement('option');
    option.value = type;
    option.textContent = type.charAt(0).toUpperCase() + type.slice(1);
    carTypeSelect.appendChild(option);
});

const carTypeError = document.createElement('span');
carTypeError.className = 'error';
carTypeError.id = 'carTypeError';
carTypeError.textContent = 'Please select a car type (economy, SUV, Compact, or midsize)';

carTypeGroup.appendChild(carTypeLabel);
carTypeGroup.appendChild(carTypeSelect);
carTypeGroup.appendChild(carTypeError);

// Create check-in date field
const checkinGroup = document.createElement('div');
checkinGroup.className = 'form-group';

const checkinLabel = document.createElement('label');
checkinLabel.setAttribute('for', 'carCheckin');
checkinLabel.textContent = 'Pick-up Date:';

const checkinInput = document.createElement('input');
checkinInput.type = 'date';
checkinInput.id = 'carCheckin';
checkinInput.name = 'carCheckin';
checkinInput.min = '2024-09-01';
checkinInput.max = '2024-12-01';

const checkinError = document.createElement('span');
checkinError.className = 'error';
checkinError.id = 'carCheckinError';
checkinError.textContent = 'Pick-up date must be between Sep 1, 2024 and Dec 1, 2024';

checkinGroup.appendChild(checkinLabel);
checkinGroup.appendChild(checkinInput);
checkinGroup.appendChild(checkinError);

// Create check-out date field
const checkoutGroup = document.createElement('div');
checkoutGroup.className = 'form-group';

const checkoutLabel = document.createElement('label');
checkoutLabel.setAttribute('for', 'carCheckout');
checkoutLabel.textContent = 'Drop-off Date:';

const checkoutInput = document.createElement('input');
checkoutInput.type = 'date';
checkoutInput.id = 'carCheckout';
checkoutInput.name = 'carCheckout';
checkoutInput.min = '2024-09-01';
checkoutInput.max = '2024-12-01';

const checkoutError = document.createElement('span');
checkoutError.className = 'error';
checkoutError.id = 'carCheckoutError';
checkoutError.textContent = 'Drop-off date must be between Sep 1, 2024 and Dec 1, 2024 and after pick-up';

checkoutGroup.appendChild(checkoutLabel);
checkoutGroup.appendChild(checkoutInput);
checkoutGroup.appendChild(checkoutError);

// Create submit button
const submitButton = document.createElement('button');
submitButton.type = 'submit';
submitButton.textContent = 'Search Cars';
submitButton.className = 'btn-pink';

// Append all fields to form
form.appendChild(cityGroup);
form.appendChild(carTypeGroup);
form.appendChild(checkinGroup);
form.appendChild(checkoutGroup);
form.appendChild(submitButton);

// Append form to container
formContainer.appendChild(form);

// Form validation and submission
form.addEventListener('submit', function(e) {
    e.preventDefault();

    // Clear previous errors
    clearErrors();

    // Get form values
    const city = document.getElementById('carCity').value;
    const carType = document.getElementById('carType').value;
    const checkin = document.getElementById('carCheckin').value;
    const checkout = document.getElementById('carCheckout').value;

    let isValid = true;

    // Validate city
    if (!city) {
        showError('carCityError');
        isValid = false;
    }

    // Validate car type
    const validCarTypes = ['economy', 'SUV', 'Compact', 'midsize'];
    if (!carType || !validCarTypes.includes(carType)) {
        showError('carTypeError');
        isValid = false;
    }

    // Validate check-in date
    if (!checkin) {
        showError('carCheckinError');
        isValid = false;
    } else {
        const checkinDate = new Date(checkin);
        const minDate = new Date('2024-09-01');
        const maxDate = new Date('2024-12-01');

        if (checkinDate < minDate || checkinDate > maxDate) {
            showError('carCheckinError');
            isValid = false;
        }
    }

    // Validate check-out date
    if (!checkout) {
        showError('carCheckoutError');
        isValid = false;
    } else {
        const checkoutDate = new Date(checkout);
        const checkinDate = new Date(checkin);
        const minDate = new Date('2024-09-01');
        const maxDate = new Date('2024-12-01');

        if (checkoutDate < minDate || checkoutDate > maxDate || checkoutDate <= checkinDate) {
            showError('carCheckoutError');
            isValid = false;
        }
    }

    // Display results if valid
    if (isValid) {
        const resultsDiv = document.getElementById('results');

        // Calculate rental duration
        const checkinDate = new Date(checkin);
        const checkoutDate = new Date(checkout);
        const duration = Math.ceil((checkoutDate - checkinDate) / (1000 * 60 * 60 * 24));

        // Create result content using DOM methods
        resultsDiv.innerHTML = ''; // Clear previous content

        const resultsHeading = document.createElement('h3');
        resultsHeading.textContent = 'Your Car Rental Summary';
        resultsDiv.appendChild(resultsHeading);

        const cityPara = document.createElement('p');
        const cityStrong = document.createElement('strong');
        cityStrong.textContent = 'City: ';
        cityPara.appendChild(cityStrong);
        cityPara.appendChild(document.createTextNode(city));
        resultsDiv.appendChild(cityPara);

        const carTypePara = document.createElement('p');
        const carTypeStrong = document.createElement('strong');
        carTypeStrong.textContent = 'Car Type: ';
        carTypePara.appendChild(carTypeStrong);
        carTypePara.appendChild(document.createTextNode(carType.charAt(0).toUpperCase() + carType.slice(1)));
        resultsDiv.appendChild(carTypePara);

        const checkinPara = document.createElement('p');
        const checkinStrong = document.createElement('strong');
        checkinStrong.textContent = 'Pick-up Date: ';
        checkinPara.appendChild(checkinStrong);
        checkinPara.appendChild(document.createTextNode(formatDate(checkin)));
        resultsDiv.appendChild(checkinPara);

        const checkoutPara = document.createElement('p');
        const checkoutStrong = document.createElement('strong');
        checkoutStrong.textContent = 'Drop-off Date: ';
        checkoutPara.appendChild(checkoutStrong);
        checkoutPara.appendChild(document.createTextNode(formatDate(checkout)));
        resultsDiv.appendChild(checkoutPara);

        const durationPara = document.createElement('p');
        const durationStrong = document.createElement('strong');
        durationStrong.textContent = 'Rental Duration: ';
        durationPara.appendChild(durationStrong);
        durationPara.appendChild(document.createTextNode(duration + ' day(s)'));
        resultsDiv.appendChild(durationPara);

        const notePara = document.createElement('p');
        notePara.style.marginTop = '1rem';
        notePara.style.padding = '1rem';
        notePara.style.backgroundColor = '#fff3cd';
        notePara.style.borderRadius = '4px';
        const noteStrong = document.createElement('strong');
        noteStrong.textContent = '✓ Your car rental is confirmed! ';
        notePara.appendChild(noteStrong);
        notePara.appendChild(document.createTextNode('We\'re preparing your ' + carType + ' for pickup in ' + city + '.'));
        resultsDiv.appendChild(notePara);

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
