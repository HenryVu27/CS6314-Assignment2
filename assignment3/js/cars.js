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

  async function loadCarsXML() {
    const res = await fetch('data/cars.xml');
    const text = await res.text();
    const parser = new DOMParser();
    return parser.parseFromString(text, 'application/xml');
  }

  function getVals() {
    return {
      city: document.getElementById('carCity')?.value || '',
      type: document.getElementById('carType')?.value || '',
      checkIn: document.getElementById('carCheckIn')?.value || '',
      checkOut: document.getElementById('carCheckOut')?.value || ''
    };
  }

  function validate(vals) {
    const errors = [];
    const cities = [...states.Texas, ...states.California];
    if (!cities.includes(vals.city)) errors.push('City must be in Texas or California.');
    if (!['Economy', 'SUV', 'Compact', 'Midsize'].includes(vals.type)) errors.push('Type must be Economy, SUV, Compact, or Midsize.');
    if (!inRange(vals.checkIn)) errors.push('Check-in must be between Sep 1 and Dec 1, 2024.');
    if (!inRange(vals.checkOut)) errors.push('Check-out must be between Sep 1 and Dec 1, 2024.');
    if (new Date(vals.checkOut) <= new Date(vals.checkIn)) errors.push('Check-out must be after check-in.');
    return errors;
  }

  function suggestFromHistory(xml) {
    const cartKey = 'a3_cart_cars';
    const bookingsKey = 'a3_cart_stays';
    const prev = JSON.parse(localStorage.getItem(cartKey) || '[]');
    const prevHotels = JSON.parse(localStorage.getItem(bookingsKey) || '[]');
    const recentCity = prev.at(-1)?.city || prevHotels.at(-1)?.city;
    if (!recentCity) return [];
    const nodes = [...xml.getElementsByTagName('car')];
    return nodes.filter(n => n.getAttribute('city') === recentCity).slice(0, 3);
  }

  function renderSuggestions(xml) {
    const suggestions = suggestFromHistory(xml);
    const box = document.getElementById('carSuggestions');
    if (!box) return;
    if (suggestions.length === 0) {
      box.innerHTML = '';
      return;
    }
    box.innerHTML = `<div class="results show"><h3>Suggested Cars</h3>
      ${suggestions.map(n => {
        const car = {
          id: n.getAttribute('id'),
          city: n.getAttribute('city'),
          type: n.getAttribute('type'),
          pricePerDay: Number(n.getAttribute('price'))
        };
        return `<div style="border:1px solid #ddd;padding:8px;border-radius:6px;margin:6px 0;">
          <div><strong>${car.id}</strong> - ${car.type} in ${car.city}</div>
          <div>Price per day: $${car.pricePerDay}</div>
          <button class="btn btn-amber" data-suggest='${JSON.stringify(car)}'>Select</button>
        </div>`;
      }).join('')}
    </div>`;

    box.querySelectorAll('button[data-suggest]').forEach(btn => {
      btn.addEventListener('click', () => {
        const car = JSON.parse(btn.getAttribute('data-suggest'));
        document.getElementById('carCity').value = car.city;
        document.getElementById('carType').value = car.type;
      });
    });
  }

  function addToCart(item, vals) {
    const cartKey = 'a3_cart_cars';
    const nights = Math.max(1, Math.round((new Date(vals.checkOut) - new Date(vals.checkIn)) / (1000*60*60*24)));
    const existing = JSON.parse(localStorage.getItem(cartKey) || '[]');
    existing.push({ ...item, checkIn: vals.checkIn, checkOut: vals.checkOut, days: nights, addedAt: new Date().toISOString() });
    localStorage.setItem(cartKey, JSON.stringify(existing));
    alert('Car added to cart.');
  }

  function renderResults(xml, vals) {
    const nodes = [...xml.getElementsByTagName('car')];
    const matches = nodes.filter(n => n.getAttribute('city') === vals.city && n.getAttribute('type') === vals.type);
    const container = document.getElementById('carsResults');
    if (matches.length === 0) {
      container.innerHTML = '<div class="results show"><p>No cars found.</p></div>';
      return;
    }
    container.innerHTML = `<div class="results show"><h3>Available Cars</h3>
      ${matches.map(n => {
        const car = {
          id: n.getAttribute('id'),
          city: n.getAttribute('city'),
          type: n.getAttribute('type'),
          pricePerDay: Number(n.getAttribute('price'))
        };
        return `<div style="border:1px solid #ddd;padding:8px;border-radius:6px;margin:6px 0;">
          <div><strong>${car.id}</strong> - ${car.type} in ${car.city}</div>
          <div>Price per day: $${car.pricePerDay}</div>
          <button class="btn btn-amber" data-car='${JSON.stringify(car)}'>Add to Cart</button>
        </div>`;
      }).join('')}
    </div>`;

    container.querySelectorAll('button[data-car]').forEach(btn => {
      btn.addEventListener('click', () => {
        addToCart(JSON.parse(btn.getAttribute('data-car')), vals);
      });
    });
  }

  document.addEventListener('DOMContentLoaded', async () => {
    populateCities();
    const xml = await loadCarsXML();
    renderSuggestions(xml);
    const form = document.getElementById('carsForm');
    const errorBox = document.getElementById('carsErrors');
    form?.addEventListener('submit', (e) => {
      e.preventDefault();
      errorBox.textContent = '';
      const vals = getVals();
      const errs = validate(vals);
      if (errs.length) {
        errorBox.innerHTML = errs.map(e => `<div>• ${e}</div>`).join('');
        return;
      }
      document.getElementById('carsSummary').innerHTML = `<div class="results show"><h3>Search Summary</h3>
        <p><strong>City:</strong> ${vals.city} | <strong>Type:</strong> ${vals.type}</p>
        <p><strong>Dates:</strong> ${vals.checkIn} → ${vals.checkOut}</p>
      </div>`;
      renderResults(xml, vals);
    });
  });
})();


