(() => {
  function currency(n) { return `$${n.toFixed(2)}`; }

  function renderFlights() {
    const container = document.getElementById('cartFlights');
    const flights = JSON.parse(localStorage.getItem('a3_cart_flights') || '[]');
    if (flights.length === 0) {
      container.innerHTML = '';
      document.getElementById('passengersForm').innerHTML = '';
      return 0;
    }
    const total = flights.reduce((sum, item) => {
      const base = item.flight.price * item.passengers.a;
      const child = item.flight.price * 0.7 * item.passengers.c;
      const infant = item.flight.price * 0.1 * item.passengers.i;
      return sum + base + child + infant;
    }, 0);
    container.innerHTML = `<div class="results show"><h3>Flights</h3>
      ${flights.map(x => `<div style="margin:6px 0;">${x.flight.flightId} ${x.flight.origin} → ${x.flight.destination} | ${x.flight.departureDate} ${x.flight.departureTime}</div>`).join('')}
    </div>`;

    // Render passenger details form
    renderPassengerForm(flights);
    return total;
  }

  function renderPassengerForm(flights) {
    const container = document.getElementById('passengersForm');
    if (flights.length === 0) {
      container.innerHTML = '';
      return;
    }

    // Calculate total passengers across all flights
    const totalPassengers = flights.reduce((sum, item) => {
      return sum + item.passengers.a + item.passengers.c + item.passengers.i;
    }, 0);

    // Generate form fields for each passenger
    let formHtml = '<div class="results show"><h3>Passenger Details</h3>';
    formHtml += '<p>Please enter details for all passengers:</p>';

    let passengerIndex = 0;
    flights.forEach((item, flightIdx) => {
      formHtml += `<h4 style="margin-top:12px;">Flight ${flightIdx + 1}: ${item.flight.flightId}</h4>`;

      // Adults
      for (let i = 0; i < item.passengers.a; i++) {
        passengerIndex++;
        formHtml += generatePassengerFields(passengerIndex, 'Adult', flightIdx);
      }

      // Children
      for (let i = 0; i < item.passengers.c; i++) {
        passengerIndex++;
        formHtml += generatePassengerFields(passengerIndex, 'Child', flightIdx);
      }

      // Infants
      for (let i = 0; i < item.passengers.i; i++) {
        passengerIndex++;
        formHtml += generatePassengerFields(passengerIndex, 'Infant', flightIdx);
      }
    });

    formHtml += '</div>';
    container.innerHTML = formHtml;
  }

  function generatePassengerFields(index, type, flightIdx) {
    return `
      <div style="border:1px solid #ddd; padding:8px; margin:8px 0; border-radius:4px;">
        <h5>Passenger ${index} (${type})</h5>
        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:8px;">
          <div>
            <label>First Name:</label>
            <input type="text" class="passenger-fname" data-flight="${flightIdx}" data-passenger="${index}" required style="width:100%; padding:4px;">
          </div>
          <div>
            <label>Last Name:</label>
            <input type="text" class="passenger-lname" data-flight="${flightIdx}" data-passenger="${index}" required style="width:100%; padding:4px;">
          </div>
          <div>
            <label>Date of Birth:</label>
            <input type="date" class="passenger-dob" data-flight="${flightIdx}" data-passenger="${index}" required style="width:100%; padding:4px;">
          </div>
          <div>
            <label>SSN (Last 4 digits):</label>
            <input type="text" class="passenger-ssn" data-flight="${flightIdx}" data-passenger="${index}" required pattern="\\d{4}" maxlength="4" placeholder="XXXX" style="width:100%; padding:4px;">
          </div>
        </div>
      </div>
    `;
  }

  function collectPassengerDetails() {
    const passengers = [];
    const fnameInputs = document.querySelectorAll('.passenger-fname');

    fnameInputs.forEach((input, idx) => {
      const flightIdx = input.getAttribute('data-flight');
      const passengerIdx = input.getAttribute('data-passenger');
      const lname = document.querySelectorAll('.passenger-lname')[idx].value.trim();
      const dob = document.querySelectorAll('.passenger-dob')[idx].value;
      const ssn = document.querySelectorAll('.passenger-ssn')[idx].value.trim();
      const fname = input.value.trim();

      if (!fname || !lname || !dob || !ssn) {
        throw new Error(`Please fill all fields for Passenger ${passengerIdx}`);
      }

      if (!/^\d{4}$/.test(ssn)) {
        throw new Error(`Invalid SSN for Passenger ${passengerIdx}. Must be 4 digits.`);
      }

      passengers.push({
        firstName: fname,
        lastName: lname,
        dateOfBirth: dob,
        ssn: ssn,
        flightIndex: parseInt(flightIdx)
      });
    });

    return passengers;
  }

  function renderStays() {
    const container = document.getElementById('cartStays');
    const stays = JSON.parse(localStorage.getItem('a3_cart_stays') || '[]');
    if (stays.length === 0) { container.innerHTML = ''; return 0; }
    const total = stays.reduce((sum, h) => sum + h.pricePerNight * h.nights * h.rooms, 0);
    container.innerHTML = `<div class="results show"><h3>Hotels</h3>
      ${stays.map(h => {
        const hotelTotal = h.pricePerNight * h.nights * h.rooms;
        return `<div style="margin:6px 0;">
          <div><strong>${h.hotelId}</strong> ${h.hotelName} in ${h.city}</div>
          <div>Guests: Adults ${h.guests.adults}, Children ${h.guests.children}, Infants ${h.guests.infants}</div>
          <div>Stay: ${h.checkIn} → ${h.checkOut} | Rooms: ${h.rooms} | Nights: ${h.nights}</div>
          <div>Price per night per room: $${h.pricePerNight.toFixed(2)} | Total: $${hotelTotal.toFixed(2)}</div>
        </div>`;
      }).join('')}
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

  function renderCruises() {
    const container = document.getElementById('cartCruises');
    const cruises = JSON.parse(localStorage.getItem('a3_cart_cruises') || '[]');
    if (cruises.length === 0) { container.innerHTML = ''; return 0; }
    const total = cruises.reduce((sum, c) => {
      const totalGuests = c.guests.adults + c.guests.children + c.guests.infants;
      return sum + c.pricePerPerson * totalGuests;
    }, 0);
    container.innerHTML = `<div class="results show"><h3>Cruises</h3>
      ${cruises.map(c => {
        const totalGuests = c.guests.adults + c.guests.children + c.guests.infants;
        return `<div style="margin:6px 0;">${c.id} - ${c.destination} | Port: ${c.departurePort} | Depart: ${c.departureDate} | ${c.duration} days | ${totalGuests} guests | ${c.roomsNeeded} rooms</div>`;
      }).join('')}
    </div>`;
    return total;
  }

  function renderTotals() {
    const flightsTotal = renderFlights();
    const staysTotal = renderStays();
    const carsTotal = renderCars();
    const cruisesTotal = renderCruises();
    const total = flightsTotal + staysTotal + carsTotal + cruisesTotal;
    document.getElementById('cartTotals').innerHTML = `<div class="results show"><h3>Total</h3>
      <p>Flights: ${currency(flightsTotal)}</p>
      <p>Hotels: ${currency(staysTotal)}</p>
      <p>Cars: ${currency(carsTotal)}</p>
      <p>Cruises: ${currency(cruisesTotal)}</p>
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

    document.getElementById('bookFlightsBtn')?.addEventListener('click', async () => {
      const flights = JSON.parse(localStorage.getItem('a3_cart_flights') || '[]');
      if (flights.length === 0) { alert('No flights in cart.'); return; }

      // Collect and validate passenger details
      let passengerDetails;
      try {
        passengerDetails = collectPassengerDetails();
      } catch (error) {
        alert(error.message);
        return;
      }

      const userId = uid('U');
      const bookingNumber = uid('BF');

      // Group passengers by flight
      const passengersByFlight = {};
      passengerDetails.forEach(p => {
        if (!passengersByFlight[p.flightIndex]) {
          passengersByFlight[p.flightIndex] = [];
        }
        passengersByFlight[p.flightIndex].push({
          firstName: p.firstName,
          lastName: p.lastName,
          dateOfBirth: p.dateOfBirth,
          ssn: p.ssn
        });
      });

      const payload = flights.map((x, idx) => ({
        userId,
        bookingNumber,
        flightId: x.flight.flightId,
        origin: x.flight.origin,
        destination: x.flight.destination,
        departureDate: x.flight.departureDate,
        arrivalDate: x.flight.arrivalDate,
        departureTime: x.flight.departureTime,
        arrivalTime: x.flight.arrivalTime,
        passengers: passengersByFlight[idx] || []
      }));

      // Update available seats in localStorage (simulating file update)
      await updateFlightSeats(flights);

      out.innerHTML = `<div class="results show"><h3>Flight Bookings</h3>
        <p><strong>User ID:</strong> ${userId}</p>
        <p><strong>Booking Number:</strong> ${bookingNumber}</p>
        <pre>${JSON.stringify(payload, null, 2)}</pre></div>`;
      download('booked-flights.json', JSON.stringify(payload, null, 2), 'application/json');

      // Clear the cart after successful booking
      localStorage.removeItem('a3_cart_flights');
      renderTotals();
      alert('Flight booking successful! Available seats have been updated.');
    });

    async function updateFlightSeats(bookedFlights) {
      try {
        // Load current flights data
        const res = await fetch('data/flights.json');
        const allFlights = await res.json();

        // Update seats for each booked flight
        bookedFlights.forEach(booking => {
          const flight = allFlights.find(f => f.flightId === booking.flight.flightId);
          if (flight) {
            const totalPassengers = booking.passengers.a + booking.passengers.c + booking.passengers.i;
            flight.availableSeats -= totalPassengers;
            if (flight.availableSeats < 0) flight.availableSeats = 0;
          }
        });

        // Store updated flights in localStorage (simulating file update)
        localStorage.setItem('a3_updated_flights', JSON.stringify(allFlights));

        // Download updated flights.json
        download('updated-flights.json', JSON.stringify(allFlights, null, 2), 'application/json');
      } catch (error) {
        console.error('Error updating flight seats:', error);
      }
    }

    document.getElementById('bookHotelsBtn')?.addEventListener('click', async () => {
      const hotels = JSON.parse(localStorage.getItem('a3_cart_stays') || '[]');
      if (hotels.length === 0) { alert('No hotels in cart.'); return; }
      const userId = uid('U');
      const bookingNumber = uid('BH');
      const payload = hotels.map(h => ({ userId, bookingNumber, ...h }));

      // Update available rooms in XML
      await updateHotelRooms(hotels);

      out.innerHTML = `<div class="results show"><h3>Hotel Bookings</h3>
        <p><strong>User ID:</strong> ${userId}</p>
        <p><strong>Booking Number:</strong> ${bookingNumber}</p>
        <pre>${JSON.stringify(payload, null, 2)}</pre></div>`;
      download('booked-hotels.json', JSON.stringify(payload, null, 2), 'application/json');

      // Clear cart after successful booking
      localStorage.removeItem('a3_cart_stays');
      renderTotals();
      alert('Hotel booking successful! Available rooms have been updated.');
    });

    async function updateHotelRooms(bookedHotels) {
      try {
        // Load current hotels XML
        const res = await fetch('data/hotels.xml');
        const xmlText = await res.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, 'text/xml');

        // Update rooms for each booked hotel
        bookedHotels.forEach(booking => {
          const hotels = xmlDoc.getElementsByTagName('hotel');
          for (let i = 0; i < hotels.length; i++) {
            const hotel = hotels[i];
            if (hotel.getAttribute('id') === booking.hotelId) {
              const currentRooms = parseInt(hotel.getAttribute('rooms'));
              const newRooms = Math.max(0, currentRooms - booking.rooms);
              hotel.setAttribute('rooms', newRooms.toString());
              break;
            }
          }
        });

        // Serialize updated XML
        const serializer = new XMLSerializer();
        const updatedXml = serializer.serializeToString(xmlDoc);

        // Store in localStorage and download
        localStorage.setItem('a3_updated_hotels', updatedXml);
        download('updated-hotels.xml', updatedXml, 'application/xml');
      } catch (error) {
        console.error('Error updating hotel rooms:', error);
      }
    }

    document.getElementById('bookCarsBtn')?.addEventListener('click', async () => {
      const cars = JSON.parse(localStorage.getItem('a3_cart_cars') || '[]');
      if (cars.length === 0) { alert('No cars in cart.'); return; }
      const userId = uid('U');
      const bookingNumber = uid('BC');

      // Update available cars in XML
      await updateAvailableCars(cars);

      // XML export per spec
      const rows = cars.map(c => `  <booking user-id="${userId}" booking-number="${bookingNumber}" car-id="${c.id}" city="${c.city}" type="${c.type}" check-in="${c.checkIn}" check-out="${c.checkOut}" days="${c.days}" price-per-day="${c.pricePerDay}" total-price="${(c.pricePerDay * c.days).toFixed(2)}" />`).join('\n');
      const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<carBookings>\n${rows}\n</carBookings>`;
      out.innerHTML = `<div class="results show"><h3>Car Bookings</h3>
        <p><strong>User ID:</strong> ${userId}</p>
        <p><strong>Booking Number:</strong> ${bookingNumber}</p>
        <pre>${xml.replace(/</g,'&lt;')}</pre></div>`;
      download('booked-cars.xml', xml, 'application/xml');

      // Clear cart after successful booking
      localStorage.removeItem('a3_cart_cars');
      renderTotals();
      alert('Car booking successful! Available cars have been updated.');
    });

    async function updateAvailableCars(bookedCars) {
      try {
        // Load current cars XML
        const res = await fetch('data/cars.xml');
        const xmlText = await res.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, 'text/xml');

        // Remove booked cars from available list
        bookedCars.forEach(booking => {
          const cars = xmlDoc.getElementsByTagName('car');
          for (let i = cars.length - 1; i >= 0; i--) {
            const car = cars[i];
            if (car.getAttribute('id') === booking.id) {
              // Mark as unavailable by setting availability to false
              car.setAttribute('available', 'false');
              break;
            }
          }
        });

        // Serialize updated XML
        const serializer = new XMLSerializer();
        const updatedXml = serializer.serializeToString(xmlDoc);

        // Store in localStorage and download
        localStorage.setItem('a3_updated_cars', updatedXml);
        download('updated-cars.xml', updatedXml, 'application/xml');
      } catch (error) {
        console.error('Error updating available cars:', error);
      }
    }

    document.getElementById('bookCruisesBtn')?.addEventListener('click', async () => {
      const cruises = JSON.parse(localStorage.getItem('a3_cart_cruises') || '[]');
      if (cruises.length === 0) { alert('No cruises in cart.'); return; }
      const userId = uid('U');
      const bookingNumber = uid('BCR');

      // Update available cabins in XML
      await updateCruiseCabins(cruises);

      // Create booking data
      const payload = cruises.map(c => {
        const totalGuests = c.guests.adults + c.guests.children + c.guests.infants;
        return {
          userId,
          bookingNumber,
          cruiseId: c.id,
          destination: c.destination,
          departurePort: c.departurePort,
          departureDate: c.departureDate,
          duration: c.duration,
          pricePerPerson: c.pricePerPerson,
          guests: c.guests,
          totalGuests,
          roomsNeeded: c.roomsNeeded,
          totalPrice: (c.pricePerPerson * totalGuests).toFixed(2)
        };
      });

      out.innerHTML = `<div class="results show"><h3>Cruise Bookings</h3>
        <p><strong>User ID:</strong> ${userId}</p>
        <p><strong>Booking Number:</strong> ${bookingNumber}</p>
        <pre>${JSON.stringify(payload, null, 2)}</pre></div>`;
      download('booked-cruises.json', JSON.stringify(payload, null, 2), 'application/json');

      // Clear cart after successful booking
      localStorage.removeItem('a3_cart_cruises');
      renderTotals();
      alert('Cruise booking successful! Available cabins have been updated.');
    });

    async function updateCruiseCabins(bookedCruises) {
      try {
        // Load current cruises XML
        const res = await fetch('data/cruises.xml');
        const xmlText = await res.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, 'text/xml');

        // Update cabins for each booked cruise
        bookedCruises.forEach(booking => {
          const cruises = xmlDoc.getElementsByTagName('cruise');
          for (let i = 0; i < cruises.length; i++) {
            const cruise = cruises[i];
            if (cruise.getAttribute('id') === booking.id) {
              const currentCabins = parseInt(cruise.getAttribute('availableCabins'));
              const newCabins = Math.max(0, currentCabins - booking.roomsNeeded);
              cruise.setAttribute('availableCabins', newCabins.toString());
              break;
            }
          }
        });

        // Serialize updated XML
        const serializer = new XMLSerializer();
        const updatedXml = serializer.serializeToString(xmlDoc);

        // Store in localStorage and download
        localStorage.setItem('a3_updated_cruises', updatedXml);
        download('updated-cruises.xml', updatedXml, 'application/xml');
      } catch (error) {
        console.error('Error updating cruise cabins:', error);
      }
    }
  });
})();


