(() => {
  const DATE_MIN = new Date('2024-09-01');
  const DATE_MAX = new Date('2024-12-01');

  function inRange(date) {
    const d = new Date(date);
    return !isNaN(d) && d >= DATE_MIN && d <= DATE_MAX;
  }

  function getVals() {
    return {
      destination: document.getElementById('cruiseDestination')?.value || '',
      departStart: document.getElementById('departStart')?.value || '',
      departEnd: document.getElementById('departEnd')?.value || '',
      minDays: Number(document.getElementById('minDays')?.value || 0),
      maxDays: Number(document.getElementById('maxDays')?.value || 0),
      adults: Number(document.getElementById('cruiseAdults')?.value || 0),
      children: Number(document.getElementById('cruiseChildren')?.value || 0),
      infants: Number(document.getElementById('cruiseInfants')?.value || 0)
    };
  }

  function validate(vals) {
    const errors = [];
    if (!['Alaska','Bahamas','Europe','Mexico'].includes(vals.destination)) errors.push('Destination must be Alaska, Bahamas, Europe, or Mexico.');
    if (!inRange(vals.departStart) || !inRange(vals.departEnd)) errors.push('Departing between must be within Sep 1 - Dec 1, 2024.');
    if (new Date(vals.departEnd) < new Date(vals.departStart)) errors.push('End date cannot be before start date.');
    if (vals.minDays < 3) errors.push('Minimum duration cannot be less than 3 days.');
    if (vals.maxDays > 10) errors.push('Maximum duration cannot exceed 10 days.');
    if (vals.minDays > vals.maxDays) errors.push('Minimum days cannot exceed maximum days.');
    const roomsNeeded = Math.ceil(Math.max(1, vals.adults + vals.children) / 2);
    return { errors, roomsNeeded };
  }

  $(function() {
    $('#cruisesForm').on('submit', function(e) {
      e.preventDefault();
      const v = getVals();
      const { errors, roomsNeeded } = validate(v);
      const $err = $('#cruiseErrors');
      $err.html('');
      if (errors.length) {
        $err.html(errors.map(e => `<div>• ${e}</div>`).join(''));
        return;
      }
      $('#cruisesSummary').html(`<div class="results show"><h3>Search Summary</h3>
        <p><strong>Destination:</strong> ${v.destination}</p>
        <p><strong>Departing:</strong> ${v.departStart} → ${v.departEnd}</p>
        <p><strong>Duration:</strong> ${v.minDays}-${v.maxDays} days</p>
        <p><strong>Guests:</strong> Adults ${v.adults}, Children ${v.children}, Infants ${v.infants}</p>
        <p><strong>Rooms needed:</strong> ${roomsNeeded}</p>
      </div>`);
    });
  });
})();


