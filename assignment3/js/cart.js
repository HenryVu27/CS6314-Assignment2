(() => {
  function currency(n) { return `$${n.toFixed(2)}`; }

  function renderFlights() {
    const container = document.getElementById('cartFlights');
    const flights = JSON.parse(localStorage.getItem('a3_cart_flights') || '[]');
    if (flights.length === 0) { container.innerHTML = ''; return 0; }
    const total = flights.reduce((sum, item) => {
      const base = item.flight.price * item.passengers.a;
      const child = item.flight.price * 0.7 * item.passengers.c;
      const infant = item.flight.price * 0.1 * item.passengers.i;
      return sum + base + child + infant;
    }, 0);
    container.innerHTML = `<div class="results show"><h3>Flights</h3>
      ${flights.map(x => `<div style="margin:6px 0;">${x.flight.flightId} ${x.flight.origin} → ${x.flight.destination} | ${x.flight.departureDate} ${x.flight.departureTime}</div>`).join('')}
    </div>`;
    return total;
  }

  function renderStays() {
    const container = document.getElementById('cartStays');
    const stays = JSON.parse(localStorage.getItem('a3_cart_stays') || '[]');
    if (stays.length === 0) { container.innerHTML = ''; return 0; }
    const total = stays.reduce((sum, h) => sum + h.pricePerNight * h.nights * h.rooms, 0);
    container.innerHTML = `<div class="results show"><h3>Hotels</h3>
      ${stays.map(h => `<div style="margin:6px 0;">${h.hotelId} ${h.hotelName} in ${h.city} | Rooms ${h.rooms} | ${h.checkIn} → ${h.checkOut}</div>`).join('')}
    </div>`;
    return total;
  }

  function renderCars() {
    const container = document.getElementById('cartCars');
    const cars = JSON.parse(localStorage.getItem('a3_cart_cars') || '[]');
    if (cars.length === 0) { container.innerHTML = ''; return 0; }
    const total = cars.reduce((sum, c) => sum + c.pricePerDay * c.days, 0);
    container.innerHTML = `<div class="results show"><h3>Cars</h3>
      ${cars.map(c => `<div style="margin:6px 0;">${c.id} ${c.type} in ${c.city} | ${c.checkIn} → ${c.checkOut} (${c.days} days)</div>`).join('')}
    </div>`;
    return total;
  }

  function renderTotals() {
    const flightsTotal = renderFlights();
    const staysTotal = renderStays();
    const carsTotal = renderCars();
    const total = flightsTotal + staysTotal + carsTotal;
    document.getElementById('cartTotals').innerHTML = `<div class="results show"><h3>Total</h3>
      <p>Flights: ${currency(flightsTotal)}</p>
      <p>Hotels: ${currency(staysTotal)}</p>
      <p>Cars: ${currency(carsTotal)}</p>
      <p><strong>Grand Total: ${currency(total)}</strong></p>
    </div>`;
  }

  document.addEventListener('DOMContentLoaded', () => {
    renderTotals();

    function uid(prefix) { return `${prefix}-${Math.random().toString(36).slice(2, 8)}`; }

    // Minimal booking forms and JSON export
    const out = document.getElementById('bookingOutput');
    function download(name, data, type) {
      const blob = new Blob([data], { type });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = name; a.click();
      URL.revokeObjectURL(url);
    }

    document.getElementById('bookFlightsBtn')?.addEventListener('click', () => {
      const flights = JSON.parse(localStorage.getItem('a3_cart_flights') || '[]');
      if (flights.length === 0) { alert('No flights in cart.'); return; }
      const userId = uid('U');
      const bookingNumber = uid('BF');
      const payload = flights.map(x => ({
        userId, bookingNumber,
        flightId: x.flight.flightId,
        origin: x.flight.origin,
        destination: x.flight.destination,
        departureDate: x.flight.departureDate,
        arrivalDate: x.flight.arrivalDate,
        departureTime: x.flight.departureTime,
        arrivalTime: x.flight.arrivalTime,
        passengers: x.passengers
      }));
      out.innerHTML = `<div class="results show"><h3>Flight Bookings</h3><pre>${JSON.stringify(payload, null, 2)}</pre></div>`;
      download('booked-flights.json', JSON.stringify(payload, null, 2), 'application/json');
    });

    document.getElementById('bookHotelsBtn')?.addEventListener('click', () => {
      const hotels = JSON.parse(localStorage.getItem('a3_cart_stays') || '[]');
      if (hotels.length === 0) { alert('No hotels in cart.'); return; }
      const userId = uid('U');
      const bookingNumber = uid('BH');
      const payload = hotels.map(h => ({ userId, bookingNumber, ...h }));
      out.innerHTML = `<div class="results show"><h3>Hotel Bookings</h3><pre>${JSON.stringify(payload, null, 2)}</pre></div>`;
      download('booked-hotels.json', JSON.stringify(payload, null, 2), 'application/json');
    });

    document.getElementById('bookCarsBtn')?.addEventListener('click', () => {
      const cars = JSON.parse(localStorage.getItem('a3_cart_cars') || '[]');
      if (cars.length === 0) { alert('No cars in cart.'); return; }
      const userId = uid('U');
      const bookingNumber = uid('BC');
      // XML export per spec
      const rows = cars.map(c => `  <booking user-id="${userId}" booking-number="${bookingNumber}" car-id="${c.id}" city="${c.city}" type="${c.type}" check-in="${c.checkIn}" check-out="${c.checkOut}" days="${c.days}" price-per-day="${c.pricePerDay}" />`).join('\n');
      const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<carBookings>\n${rows}\n</carBookings>`;
      out.innerHTML = `<div class="results show"><h3>Car Bookings</h3><pre>${xml.replace(/</g,'&lt;')}</pre></div>`;
      download('booked-cars.xml', xml, 'application/xml');
    });
  });
})();


