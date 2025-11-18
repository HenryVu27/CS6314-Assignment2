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

  async function loadCruises() {
    const res = await fetch('data/cruises.xml');
    const xmlText = await res.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
    const cruiseNodes = xmlDoc.getElementsByTagName('cruise');
    const cruises = [];
    for (let i = 0; i < cruiseNodes.length; i++) {
      const c = cruiseNodes[i];
      cruises.push({
        id: c.getAttribute('id'),
        destination: c.getAttribute('destination'),
        departurePort: c.getAttribute('departurePort'),
        departureDate: c.getAttribute('departureDate'),
        duration: parseInt(c.getAttribute('duration')),
        pricePerPerson: parseFloat(c.getAttribute('pricePerPerson')),
        availableCabins: parseInt(c.getAttribute('availableCabins'))
      });
    }
    return cruises;
  }

  function findMatchingCruises(allCruises, vals) {
    return allCruises.filter(c => {
      const matchDestination = c.destination === vals.destination;
      const depDate = new Date(c.departureDate);
      const startDate = new Date(vals.departStart);
      const endDate = new Date(vals.departEnd);
      const matchDate = depDate >= startDate && depDate <= endDate;
      const matchDuration = c.duration >= vals.minDays && c.duration <= vals.maxDays;
      return matchDestination && matchDate && matchDuration && c.availableCabins > 0;
    });
  }

  function formatCruise(cruise, roomsNeeded, vals) {
    const totalGuests = vals.adults + vals.children + vals.infants;
    const totalPrice = cruise.pricePerPerson * totalGuests;
    return `
      <div style="border:1px solid #ddd;padding:12px;border-radius:6px;margin:8px 0;">
        <div><strong>${cruise.id}</strong> - ${cruise.destination}</div>
        <div>Departure Port: ${cruise.departurePort}</div>
        <div>Departure Date: ${cruise.departureDate}</div>
        <div>Duration: ${cruise.duration} days</div>
        <div>Available Cabins: ${cruise.availableCabins}</div>
        <div>Price per Person: $${cruise.pricePerPerson.toFixed(2)}</div>
        <div>Total Price (${totalGuests} guests): $${totalPrice.toFixed(2)}</div>
        <div>Rooms Needed: ${roomsNeeded}</div>
        <button class="btn btn-green add-cruise-btn" data-cruise='${JSON.stringify({...cruise, roomsNeeded, guests: vals})}'>Add to Cart</button>
      </div>
    `;
  }

  function addToCart(cruiseData) {
    const cartKey = 'a3_cart_cruises';
    const existing = JSON.parse(localStorage.getItem(cartKey) || '[]');
    existing.push({
      ...cruiseData,
      addedAt: new Date().toISOString()
    });
    localStorage.setItem(cartKey, JSON.stringify(existing));
    alert('Cruise added to cart!');
  }

  $(function() {
    $('#cruisesForm').on('submit', async function(e) {
      e.preventDefault();
      const v = getVals();
      const { errors, roomsNeeded } = validate(v);
      const $err = $('#cruiseErrors');
      $err.html('');
      if (errors.length) {
        $err.html(errors.map(e => `<div>• ${e}</div>`).join(''));
        return;
      }

      // Display summary
      $('#cruisesSummary').html(`<div class="results show"><h3>Search Summary</h3>
        <p><strong>Destination:</strong> ${v.destination}</p>
        <p><strong>Departing:</strong> ${v.departStart} → ${v.departEnd}</p>
        <p><strong>Duration:</strong> ${v.minDays}-${v.maxDays} days</p>
        <p><strong>Guests:</strong> Adults ${v.adults}, Children ${v.children}, Infants ${v.infants}</p>
        <p><strong>Rooms needed:</strong> ${roomsNeeded}</p>
      </div>`);

      // Load and display cruise results
      const allCruises = await loadCruises();
      const matches = findMatchingCruises(allCruises, v);

      const $results = $('#cruiseResults');
      if (matches.length === 0) {
        $results.html('<div class="results show"><p>No cruises found matching your criteria.</p></div>');
        return;
      }

      const resultsHtml = `
        <div class="results show">
          <h3>Available Cruises (${matches.length} found)</h3>
          ${matches.map(c => formatCruise(c, roomsNeeded, v)).join('')}
        </div>
      `;
      $results.html(resultsHtml);

      // Wire up add to cart buttons
      $('.add-cruise-btn').on('click', function() {
        const data = JSON.parse($(this).attr('data-cruise'));
        addToCart(data);
      });
    });
  });
})();


