(() => {
  const allowedStates = {
    Texas: ['Austin', 'Dallas', 'Houston', 'San Antonio', 'El Paso'],
    California: ['Los Angeles', 'San Diego', 'San Jose', 'San Francisco', 'Sacramento']
  };

  const DATE_MIN = new Date('2024-09-01');
  const DATE_MAX = new Date('2024-12-01');

  function inRange(date) {
    const d = new Date(date);
    return !isNaN(d) && d >= DATE_MIN && d <= DATE_MAX;
  }

  function populateCitySelects() {
    const allCities = [...allowedStates.Texas, ...allowedStates.California];
    const origin = document.getElementById('origin');
    const dest = document.getElementById('destination');
    if (!origin || !dest) return;
    origin.innerHTML = allCities.map(c => `<option>${c}</option>`).join('');
    dest.innerHTML = allCities.map(c => `<option>${c}</option>`).join('');
  }

  function setTripTypeVisibility(type) {
    const row = document.getElementById('returnDateRow');
    if (!row) return;
    row.style.display = type === 'roundtrip' ? '' : 'none';
  }

  function passengersTotal() {
    const a = Number(document.getElementById('adults')?.value || 0);
    const c = Number(document.getElementById('children')?.value || 0);
    const i = Number(document.getElementById('infants')?.value || 0);
    return { a, c, i, total: a + c + i };
  }

  function validate(formVals) {
    const errors = [];
    if (!inRange(formVals.departDate)) errors.push('Departure date must be between Sep 1 and Dec 1, 2024.');
    if (formVals.tripType === 'roundtrip' && !inRange(formVals.returnDate)) errors.push('Return date must be between Sep 1 and Dec 1, 2024.');
    const allCities = [...allowedStates.Texas, ...allowedStates.California];
    if (!allCities.includes(formVals.origin)) errors.push('Origin must be a city in Texas or California.');
    if (!allCities.includes(formVals.destination)) errors.push('Destination must be a city in Texas or California.');
    const p = passengersTotal();
    if (p.a > 4 || p.c > 4 || p.i > 4) errors.push('Passengers per category cannot exceed 4.');
    if (p.total <= 0) errors.push('At least one passenger is required.');
    return errors;
  }

  function getFormVals() {
    const tripType = document.querySelector('input[name="tripType"]:checked')?.value || 'oneway';
    const origin = document.getElementById('origin')?.value || '';
    const destination = document.getElementById('destination')?.value || '';
    const departDate = document.getElementById('departDate')?.value || '';
    const returnDate = document.getElementById('returnDate')?.value || '';
    return { tripType, origin, destination, departDate, returnDate };
  }

  function formatFlight(f) {
    return `<div style="border:1px solid #ddd;padding:8px;border-radius:6px;margin:6px 0;">
      <div><strong>${f.flightId}</strong>: ${f.origin} → ${f.destination}</div>
      <div>Departs: ${f.departureDate} ${f.departureTime} | Arrives: ${f.arrivalDate} ${f.arrivalTime}</div>
      <div>Seats: ${f.availableSeats} | Price: $${f.price}</div>
      <button class="btn btn-amber" data-flight='${JSON.stringify(f)}'>Add to Cart</button>
    </div>`;
  }

  async function loadFlights() {
    const res = await fetch('data/flights.json');
    return await res.json();
  }

  function within3Days(targetIso, candidateIso) {
    const target = new Date(targetIso);
    const cand = new Date(candidateIso);
    const diff = Math.abs(cand - target) / (1000*60*60*24);
    return diff <= 3;
  }

  function findMatchingFlights(all, origin, destination, departDate, paxTotal) {
    return all.filter(f => f.origin === origin && f.destination === destination && f.availableSeats >= paxTotal && f.departureDate === departDate);
  }

  function findNearbyFlights(all, origin, destination, departDate, paxTotal) {
    return all.filter(f => f.origin === origin && f.destination === destination && f.availableSeats >= paxTotal && within3Days(departDate, f.departureDate));
  }

  function updateSummary(vals) {
    const p = passengersTotal();
    const s = document.getElementById('flightSummary');
    s.innerHTML = `<div class="results show"><h3>Search Summary</h3>
      <p><strong>Trip:</strong> ${vals.tripType}</p>
      <p><strong>From:</strong> ${vals.origin} <strong>To:</strong> ${vals.destination}</p>
      <p><strong>Depart:</strong> ${vals.departDate}${vals.tripType === 'roundtrip' ? ` | <strong>Return:</strong> ${vals.returnDate}` : ''}</p>
      <p><strong>Passengers:</strong> Adults ${p.a}, Children ${p.c}, Infants ${p.i}</p>
    </div>`;
  }

  function addToCart(flight) {
    const p = passengersTotal();
    const cartKey = 'a3_cart_flights';
    const existing = JSON.parse(localStorage.getItem(cartKey) || '[]');
    existing.push({ flight, passengers: p, addedAt: new Date().toISOString() });
    localStorage.setItem(cartKey, JSON.stringify(existing));
    alert('Flight added to cart.');
  }

  function wireResultButtons(container) {
    container.querySelectorAll('button[data-flight]').forEach(btn => {
      btn.addEventListener('click', () => {
        const data = JSON.parse(btn.getAttribute('data-flight'));
        addToCart(data);
      });
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    populateCitySelects();

    document.querySelectorAll('input[name="tripType"]').forEach(r => {
      r.addEventListener('change', () => setTripTypeVisibility(r.value));
    });
    setTripTypeVisibility(document.querySelector('input[name="tripType"]:checked')?.value || 'oneway');

    const paxToggle = document.getElementById('passengerToggle');
    const paxPanel = document.getElementById('passengerPanel');
    paxToggle?.addEventListener('click', () => {
      const show = paxPanel.style.display === 'none' || paxPanel.style.display === '';
      paxPanel.style.display = show ? 'block' : 'none';
      paxToggle.setAttribute('aria-expanded', String(show));
    });

    const form = document.getElementById('flightForm');
    const errorBox = document.getElementById('flightErrors');
    form?.addEventListener('submit', async (e) => {
      e.preventDefault();
      errorBox.textContent = '';
      const vals = getFormVals();
      const errs = validate(vals);
      if (errs.length) {
        errorBox.innerHTML = errs.map(e => `<div>• ${e}</div>`).join('');
        return;
      }

      updateSummary(vals);
      const { total } = passengersTotal();
      const allFlights = await loadFlights();

      const container = document.getElementById('flightResults');
      container.innerHTML = '';

      if (vals.tripType === 'oneway') {
        let matches = findMatchingFlights(allFlights, vals.origin, vals.destination, vals.departDate, total);
        if (matches.length === 0) {
          matches = findNearbyFlights(allFlights, vals.origin, vals.destination, vals.departDate, total);
        }
        if (matches.length === 0) {
          container.innerHTML = '<div class="results show"><p>No available flights found.</p></div>';
          return;
        }
        container.innerHTML = `<div class="results show"><h3>Available Flights</h3>${matches.map(formatFlight).join('')}</div>`;
        wireResultButtons(container);
      } else {
        // roundtrip: find outbound and return
        let departMatches = findMatchingFlights(allFlights, vals.origin, vals.destination, vals.departDate, total);
        if (departMatches.length === 0) departMatches = findNearbyFlights(allFlights, vals.origin, vals.destination, vals.departDate, total);
        let returnMatches = findMatchingFlights(allFlights, vals.destination, vals.origin, vals.returnDate, total);
        if (returnMatches.length === 0) returnMatches = findNearbyFlights(allFlights, vals.destination, vals.origin, vals.returnDate, total);

        if (departMatches.length === 0 && returnMatches.length === 0) {
          container.innerHTML = '<div class="results show"><p>No available flights found for both legs.</p></div>';
          return;
        }

        container.innerHTML = `<div class="results show">
          <h3>Departing Flights</h3>
          ${departMatches.map(formatFlight).join('') || '<p>None found.</p>'}
          <h3 style="margin-top:1rem;">Returning Flights</h3>
          ${returnMatches.map(formatFlight).join('') || '<p>None found.</p>'}
        </div>`;
        wireResultButtons(container);
      }
    });
  });
})();


