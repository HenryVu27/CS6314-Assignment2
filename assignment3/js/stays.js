(() => {
  const states = {
    Texas: ['Austin', 'Dallas', 'Houston', 'San Antonio', 'El Paso'],
    California: ['Los Angeles', 'San Diego', 'San Jose', 'San Francisco', 'Sacramento']
  };
  const DATE_MIN = new Date('2024-09-01');
  const DATE_MAX = new Date('2024-12-01');

  function inRange(date) {
    const d = new Date(date);
    return !isNaN(d) && d >= DATE_MIN && d <= DATE_MAX;
  }

  function populateCities() {
    const list = document.getElementById('cityList');
    if (!list) return;
    const cities = [...states.Texas, ...states.California];
    list.innerHTML = cities.map(c => `<option value="${c}"></option>`).join('');
  }

  function validate(vals) {
    const errors = [];
    const cities = [...states.Texas, ...states.California];
    if (!cities.includes(vals.city)) errors.push('City must be in Texas or California.');
    if (!inRange(vals.checkIn)) errors.push('Check-in must be between Sep 1 and Dec 1, 2024.');
    if (!inRange(vals.checkOut)) errors.push('Check-out must be between Sep 1 and Dec 1, 2024.');
    if (new Date(vals.checkOut) <= new Date(vals.checkIn)) errors.push('Check-out must be after check-in.');
    // 2 guests per room max, infants can exceed
    const adults = Number(vals.adults || 0);
    const children = Number(vals.children || 0);
    const infants = Number(vals.infants || 0);
    const nonInfants = adults + children;
    const roomsNeeded = Math.ceil(Math.max(1, nonInfants) / 2);
    if (adults < 1) errors.push('At least one adult is required.');
    return { errors, roomsNeeded };
  }

  function getVals() {
    return {
      city: document.getElementById('stayCity')?.value || '',
      checkIn: document.getElementById('checkIn')?.value || '',
      checkOut: document.getElementById('checkOut')?.value || '',
      adults: document.getElementById('stayAdults')?.value || '0',
      children: document.getElementById('stayChildren')?.value || '0',
      infants: document.getElementById('stayInfants')?.value || '0'
    };
  }

  async function loadHotels() {
    const res = await fetch('data/hotels.xml');
    const text = await res.text();
    const parser = new DOMParser();
    return parser.parseFromString(text, 'application/xml');
  }

  function hotelsForCity(xml, city) {
    const nodes = [...xml.getElementsByTagName('hotel')];
    return nodes.filter(h => h.getAttribute('city') === city);
  }

  function renderResults(hotels, summary, vals, rooms) {
    const container = document.getElementById('staysResults');
    container.innerHTML = `<div class="results show"><h3>Available Hotels</h3>
      ${hotels.map(h => {
        const price = h.getAttribute('price');
        const id = h.getAttribute('id');
        const name = h.getAttribute('name');
        return `<div style="border:1px solid #ddd;padding:8px;border-radius:6px;margin:6px 0;">
          <div><strong>${id}</strong> - ${name} (${h.getAttribute('city')})</div>
          <div>Price per night: $${price}</div>
          <button class="btn btn-green" data-hotel='${JSON.stringify({
            hotelId: id,
            hotelName: name,
            city: h.getAttribute('city'),
            pricePerNight: Number(price)
          })}'>Add to Cart</button>
        </div>`;
      }).join('')}
    </div>`;

    document.querySelectorAll('button[data-hotel]').forEach(btn => {
      btn.addEventListener('click', () => {
        const item = JSON.parse(btn.getAttribute('data-hotel'));
        const cartKey = 'a3_cart_stays';
        const nights = Math.max(1, Math.round((new Date(vals.checkOut) - new Date(vals.checkIn)) / (1000*60*60*24)));
        const guests = {
          adults: Number(vals.adults),
          children: Number(vals.children),
          infants: Number(vals.infants)
        };
        const existing = JSON.parse(localStorage.getItem(cartKey) || '[]');
        existing.push({ ...item, checkIn: vals.checkIn, checkOut: vals.checkOut, rooms, nights, guests, addedAt: new Date().toISOString() });
        localStorage.setItem(cartKey, JSON.stringify(existing));
        alert('Hotel added to cart.');
      });
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    populateCities();
    const form = document.getElementById('staysForm');
    const errorBox = document.getElementById('staysErrors');
    const summary = document.getElementById('staysSummary');
    form?.addEventListener('submit', async (e) => {
      e.preventDefault();
      errorBox.textContent = '';
      const vals = getVals();
      const { errors, roomsNeeded } = validate(vals);
      if (errors.length) {
        errorBox.innerHTML = errors.map(e => `<div>• ${e}</div>`).join('');
        return;
      }

      summary.innerHTML = `<div class="results show"><h3>Search Summary</h3>
        <p><strong>City:</strong> ${vals.city}</p>
        <p><strong>Dates:</strong> ${vals.checkIn} → ${vals.checkOut}</p>
        <p><strong>Guests:</strong> Adults ${vals.adults}, Children ${vals.children}, Infants ${vals.infants}</p>
        <p><strong>Rooms needed:</strong> ${roomsNeeded}</p>
      </div>`;

      const xml = await loadHotels();
      const hotels = hotelsForCity(xml, vals.city);
      renderResults(hotels, summary, vals, roomsNeeded);
    });
  });
})();


