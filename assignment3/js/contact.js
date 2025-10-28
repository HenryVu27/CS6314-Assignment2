(() => {
  const NAME_REGEX = /^[A-Z][a-zA-Z]*$/; // Alphabetic, first letter capital
  const PHONE_REGEX = /^\(\d{3}\)\d{3}-\d{4}$/; // (ddd)ddd-dddd
  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // contains @ and .

  function collectFormValues(form) {
    const formData = new FormData(form);
    const gender = form.querySelector('input[name="gender"]:checked');
    return {
      firstName: formData.get('firstName')?.toString().trim() || '',
      lastName: formData.get('lastName')?.toString().trim() || '',
      phone: formData.get('phone')?.toString().trim() || '',
      gender: gender ? gender.value : '',
      email: formData.get('email')?.toString().trim() || '',
      comment: formData.get('comment')?.toString().trim() || ''
    };
  }

  function validate(values) {
    const errors = [];
    if (!values.firstName || !NAME_REGEX.test(values.firstName)) {
      errors.push('First name must be alphabetic with a leading capital letter.');
    }
    if (!values.lastName || !NAME_REGEX.test(values.lastName)) {
      errors.push('Last name must be alphabetic with a leading capital letter.');
    }
    if (values.firstName && values.lastName && values.firstName === values.lastName) {
      errors.push('First name and last name cannot be the same.');
    }
    if (!values.phone || !PHONE_REGEX.test(values.phone)) {
      errors.push('Phone must match the format (ddd)ddd-dddd.');
    }
    if (!values.gender) {
      errors.push('Please select a gender.');
    }
    if (!values.email || !EMAIL_REGEX.test(values.email)) {
      errors.push('Please enter a valid email address.');
    }
    if (!values.comment || values.comment.length < 10) {
      errors.push('Comment must be at least 10 characters long.');
    }
    return errors;
  }

  function showErrors(listEl, errors) {
    listEl.classList.add('show');
    listEl.innerHTML = errors.map(e => `<div>• ${e}</div>`).join('');
  }

  function clearErrors(listEl) {
    listEl.classList.remove('show');
    listEl.textContent = '';
  }

  function triggerJsonDownload(filename, obj) {
    const blob = new Blob([JSON.stringify(obj, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function saveSubmission(values) {
    const storageKey = 'a3_contact_submissions';
    const existing = JSON.parse(localStorage.getItem(storageKey) || '[]');
    existing.push({ ...values, submittedAt: new Date().toISOString() });
    localStorage.setItem(storageKey, JSON.stringify(existing));
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    triggerJsonDownload(`contact-submission-${timestamp}.json`, values);
  }

  document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contactForm');
    const errorBox = document.getElementById('contactErrors');
    const successBox = document.getElementById('contactSuccess');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      clearErrors(errorBox);
      successBox.style.display = 'none';
      const values = collectFormValues(form);
      const errors = validate(values);
      if (errors.length) {
        showErrors(errorBox, errors);
        return;
      }
      saveSubmission(values);
      successBox.textContent = 'Thank you! Your message has been saved. A JSON file was downloaded.';
      successBox.style.display = 'block';
      form.reset();
    });
  });
})();


