# Assignment 3 Testing Guide

## Pre-Testing Setup
1. Open the website in a browser (use a local server if needed)
2. Open browser DevTools (F12) to check console for errors
3. Clear browser localStorage before starting: `localStorage.clear()`

---

## 1. Layout & Navigation Testing

### Test 1.1: CSS and Navigation
- [ ] Open `index.html` - verify `mystyle.css` is loaded
- [ ] Check all 7 pages have navigation bar with links to:
  - Home (index.html)
  - Stays
  - Flights
  - Cars
  - Cruises
  - Contact Us
  - Cart
- [ ] Verify navigation links work on all pages

### Test 1.2: Date/Time Display
- [ ] Check all pages display current local date/time in header
- [ ] Verify date/time updates every second
- [ ] Test on different pages - date/time should be consistent

### Test 1.3: Font Size Control
- [ ] Change font size dropdown (Default, Small, Large, X-Large)
- [ ] Verify main content font size changes
- [ ] Navigate to another page - font size should persist
- [ ] Refresh page - font size should be remembered

### Test 1.4: Background Color Control
- [ ] Change background color dropdown
- [ ] Verify background color changes
- [ ] Navigate to another page - background should persist
- [ ] Refresh page - background should be remembered

---

## 2. Contact Page Testing (`contact.html`)

### Test 2.1: Form Validation (Regex Required)
- [ ] **First Name**: 
  - Try "john" (lowercase) → should fail
  - Try "John" → should pass
  - Try "John123" → should fail
  - Try "John Doe" → should fail (no spaces)
- [ ] **Last Name**: Same tests as first name
- [ ] **First = Last Name**: 
  - Enter "John" for both → should show error "First name and last name cannot be the same"
- [ ] **Phone**: 
  - Try "(123)456-7890" → should pass
  - Try "123-456-7890" → should fail
  - Try "(123)4567890" → should fail
  - Try "1234567890" → should fail
- [ ] **Email**: 
  - Try "test@example.com" → should pass
  - Try "test@example" → should fail (no .)
  - Try "testexample.com" → should fail (no @)
  - Try "test@.com" → should fail
- [ ] **Gender**: 
  - Don't select any → should show error
  - Select any option → should pass
- [ ] **Comment**: 
  - Enter "short" (9 chars) → should fail
  - Enter "This is a longer comment" (10+ chars) → should pass

### Test 2.2: Form Submission
- [ ] Fill all fields correctly
- [ ] Click Submit
- [ ] Verify success message appears
- [ ] Check that a JSON file downloads (`contact-submission-*.json`)
- [ ] Open downloaded JSON - verify all data is correct
- [ ] Check localStorage for saved submission

---

## 3. Flights Page Testing (`flights.html`)

### Test 3.1: Trip Type Selection
- [ ] Select "One-way" → return date field should be hidden
- [ ] Select "Round-trip" → return date field should appear

### Test 3.2: Passenger Icon
- [ ] Click passenger icon (👤 Passengers)
- [ ] Verify passenger form appears/disappears
- [ ] Test adults, children, infants inputs (0-4 each)

### Test 3.3: Form Validation
- [ ] **Departure Date**: 
  - Try "2024-08-31" → should fail (before Sep 1)
  - Try "2024-12-02" → should fail (after Dec 1)
  - Try "2024-09-15" → should pass
  - Try "2024-12-01" → should pass
- [ ] **Origin/Destination**: 
  - Select cities from dropdown (should be TX/CA cities only)
  - Try invalid city → should fail
- [ ] **Passengers**: 
  - Set adults to 5 → should fail (max 4)
  - Set children to 5 → should fail
  - Set infants to 5 → should fail
  - Set all to 0 → should fail (at least 1 required)

### Test 3.4: One-Way Flight Search
- [ ] Select: One-way, Dallas → Los Angeles, Date: 2024-09-01
- [ ] Set passengers: 2 adults, 1 child, 0 infants
- [ ] Click Search
- [ ] Verify search summary displays entered info
- [ ] Check if flights are displayed with:
  - Flight ID, origin, destination
  - Departure/arrival dates and times
  - Available seats (must be ≥ 3 for this search)
  - Price
- [ ] If no exact match on date, check for flights within ±3 days
- [ ] Click "Add to Cart" on a flight
- [ ] Verify alert "Flight added to cart"
- [ ] Go to Cart page - verify flight appears

### Test 3.5: Round-Trip Flight Search
- [ ] Select: Round-trip, Houston → San Francisco
- [ ] Departure: 2024-09-05, Return: 2024-09-10
- [ ] Set passengers: 1 adult, 1 child
- [ ] Click Search
- [ ] Verify both "Departing Flights" and "Returning Flights" sections appear
- [ ] Add one departing flight to cart
- [ ] Add one returning flight to cart
- [ ] Go to Cart - verify both flights appear

### Test 3.6: No Flights Found
- [ ] Search for route with no available flights
- [ ] Verify appropriate message displays

---

## 4. Stays Page Testing (`stays.html`)

### Test 4.1: Form Validation (No Regex)
- [ ] **City**: 
  - Enter "New York" → should fail (not TX/CA)
  - Enter "Dallas" → should pass
- [ ] **Check-in/Check-out**: 
  - Try "2024-08-31" → should fail
  - Try "2024-12-02" → should fail
  - Try "2024-09-15" → should pass
  - Try check-out before check-in → should fail
- [ ] **Guests**: 
  - Set adults to 0 → should fail (at least 1 adult required)
  - Set 3 adults, 2 children (5 total, 2 per room) → should calculate 3 rooms
  - Set 2 adults, 1 child, 2 infants → should allow (infants don't count)

### Test 4.2: Hotel Search
- [ ] Enter: City: "Dallas", Check-in: 2024-09-10, Check-out: 2024-09-15
- [ ] Set: 2 adults, 1 child
- [ ] Click Search
- [ ] Verify summary shows: city, dates, guests, rooms needed (should be 2 rooms)
- [ ] Verify hotels in Dallas are displayed
- [ ] Check hotel info: ID, name, city, price per night
- [ ] Click "Add to Cart" on a hotel
- [ ] Go to Cart - verify hotel appears with correct details

---

## 5. Cars Page Testing (`cars.html`)

### Test 5.1: DOM Methods Verification
- [ ] Open DevTools Console
- [ ] Verify code uses DOM methods (not jQuery) - check `cars.js`
- [ ] Look for `document.getElementById`, `document.createElement`, etc.

### Test 5.2: Car Suggestions
- [ ] First visit: No suggestions should appear (no booking history)
- [ ] Book a hotel in "Dallas" (from Stays page)
- [ ] Go to Cars page
- [ ] Verify suggestions appear for cars in Dallas
- [ ] Click "Select" on a suggestion
- [ ] Verify city and car type are auto-filled

### Test 5.3: Form Validation
- [ ] **City**: Enter invalid city → should fail
- [ ] **Car Type**: 
  - Try "Sedan" → should fail
  - Try "Economy", "SUV", "Compact", "Midsize" → should pass
- [ ] **Dates**: Same validation as stays (Sep 1 - Dec 1, 2024)
- [ ] **Check-out before check-in**: Should fail

### Test 5.4: Car Search
- [ ] Enter: City: "Austin", Type: "SUV", Dates: 2024-09-20 to 2024-09-25
- [ ] Click Submit
- [ ] Verify summary displays
- [ ] Verify matching cars are displayed
- [ ] Click "Add to Cart"
- [ ] Go to Cart - verify car appears

---

## 6. Cruises Page Testing (`cruises.html`)

### Test 6.1: jQuery Verification
- [ ] Open DevTools Console
- [ ] Verify jQuery is loaded (check for `$` or `jQuery`)
- [ ] Verify code uses jQuery methods (check `cruises.js`)

### Test 6.2: Form Validation
- [ ] **Destination**: 
  - Try "Caribbean" → should fail
  - Try "Alaska", "Bahamas", "Europe", "Mexico" → should pass
- [ ] **Departing Between**: 
  - Start: "2024-08-31" → should fail
  - End: "2024-12-02" → should fail
  - Both within Sep 1 - Dec 1 → should pass
  - End before start → should fail
- [ ] **Duration**: 
  - Min: 2 → should fail (min 3)
  - Max: 11 → should fail (max 10)
  - Min: 3, Max: 10 → should pass
  - Min > Max → should fail
- [ ] **Guests**: 
  - 3 adults, 2 children (5 total, 2 per room) → should calculate 3 rooms
  - Infants can exceed 2 per room limit

### Test 6.3: Cruise Search
- [ ] Select: Destination: "Bahamas"
- [ ] Departing: 2024-09-08 to 2024-09-22
- [ ] Duration: Min 3, Max 5 days
- [ ] Guests: 2 adults, 1 child
- [ ] Click Submit
- [ ] Verify summary displays all entered info
- [ ] Verify matching cruises are displayed
- [ ] Check cruise info: ID, destination, port, date, duration, price, cabins
- [ ] Click "Add to Cart"
- [ ] Go to Cart - verify cruise appears

---

## 7. Cart Page Testing (`cart.html`)

### Test 7.1: Cart Display
- [ ] Add items from different pages (flight, hotel, car, cruise)
- [ ] Go to Cart page
- [ ] Verify all items are displayed in their sections
- [ ] Verify totals are calculated correctly

### Test 7.2: Flight Booking
- [ ] Add a one-way flight to cart
- [ ] Go to Cart
- [ ] Verify flight details displayed
- [ ] Verify total price calculated (adult full, child 70%, infant 10%)
- [ ] Fill in passenger details form:
  - First name, last name, DOB, SSN (4 digits) for each passenger
- [ ] Click "Book Flights"
- [ ] Verify:
  - Unique user-id generated
  - Unique booking number generated
  - Booking info displayed with all passenger details
  - JSON file downloads (`booked-flights.json`)
  - Updated flights JSON downloads (`updated-flights.json`)
  - Available seats decreased in updated file
  - Cart is cleared

### Test 7.3: Round-Trip Flight Booking
- [ ] Add departing and returning flights
- [ ] Go to Cart
- [ ] Fill passenger details for all passengers
- [ ] Click "Book Flights"
- [ ] Verify both flights are booked with same booking number
- [ ] Verify booking JSON includes both flights

### Test 7.4: Hotel Booking
- [ ] Add a hotel to cart
- [ ] Go to Cart
- [ ] Verify hotel details: ID, name, city, dates, rooms, price
- [ ] Verify total price = price per night × nights × rooms
- [ ] Click "Book Hotels"
- [ ] Verify:
  - Unique user-id and booking number
  - Booking JSON downloads
  - Updated hotels XML downloads
  - Available rooms decreased
  - Cart cleared

### Test 7.5: Car Booking
- [ ] Add a car to cart
- [ ] Go to Cart
- [ ] Verify car details and total price
- [ ] Click "Book Cars"
- [ ] Verify:
  - Booking XML downloads (not JSON)
  - Updated cars XML downloads
  - Car marked as unavailable
  - Cart cleared

### Test 7.6: Cruise Booking
- [ ] Add a cruise to cart
- [ ] Go to Cart
- [ ] Verify cruise details and total price
- [ ] Click "Book Cruises"
- [ ] Verify:
  - Booking JSON downloads
  - Updated cruises XML downloads
  - Available cabins decreased
  - Cart cleared

### Test 7.7: Price Calculations
- [ ] **Flights**: 
  - 1 adult ($200), 1 child ($140 = 70%), 1 infant ($20 = 10%)
  - Total should be $360
- [ ] **Hotels**: 
  - $120/night × 3 nights × 2 rooms = $720
- [ ] **Cars**: 
  - $50/day × 5 days = $250
- [ ] **Cruises**: 
  - $500/person × 3 guests = $1500

---

## 8. Data Files Testing

### Test 8.1: Flights JSON
- [ ] Open `data/flights.json`
- [ ] Verify at least 50 flights
- [ ] Verify all flights are between TX and CA cities
- [ ] Verify all dates are Sep 1 - Dec 1, 2024
- [ ] Check each flight has: flightId, origin, destination, dates, times, seats, price

### Test 8.2: Hotels XML
- [ ] Open `data/hotels.xml`
- [ ] Verify at least 20 hotels
- [ ] Check each hotel has: id, name, city, rooms, price
- [ ] Verify cities are in TX or CA

### Test 8.3: Cars XML
- [ ] Open `data/cars.xml`
- [ ] Verify at least 20 cars
- [ ] Check each car has: id, city, type, price, dates
- [ ] Verify types: Economy, SUV, Compact, Midsize
- [ ] Verify cities are in TX or CA

### Test 8.4: Cruises XML
- [ ] Open `data/cruises.xml`
- [ ] Verify cruises exist
- [ ] Check destinations: Alaska, Bahamas, Europe, Mexico
- [ ] Verify dates are Sep 1 - Dec 1, 2024
- [ ] Check durations are 3-10 days

---

## 9. Edge Cases & Error Handling

### Test 9.1: Empty Cart
- [ ] Go to Cart with no items
- [ ] Verify no errors occur
- [ ] Try to book → should show "No items in cart" message

### Test 9.2: Invalid Passenger Data
- [ ] Add flight to cart
- [ ] Go to Cart
- [ ] Leave passenger fields empty
- [ ] Click "Book Flights" → should show error
- [ ] Enter invalid SSN (not 4 digits) → should show error

### Test 9.3: Insufficient Seats/Rooms
- [ ] Search for flight with only 2 available seats
- [ ] Try to book for 3 passengers → should not show that flight
- [ ] Or if shown, booking should handle gracefully

### Test 9.4: Date Edge Cases
- [ ] Test exactly Sep 1, 2024 → should work
- [ ] Test exactly Dec 1, 2024 → should work
- [ ] Test Sep 30, 2024 → should work
- [ ] Test check-out = check-in → should fail (must be after)

### Test 9.5: Multiple Bookings
- [ ] Make multiple bookings
- [ ] Verify each gets unique user-id and booking number
- [ ] Verify data files update correctly each time

---

## 10. Cross-Browser Testing

- [ ] Test in Chrome
- [ ] Test in Firefox
- [ ] Test in Edge
- [ ] Verify localStorage works in all browsers
- [ ] Verify date/time display works
- [ ] Verify file downloads work

---

## 11. Code Quality Checks

### Test 11.1: JavaScript Methods
- [ ] **Cars page**: Uses DOM methods (not jQuery)
- [ ] **Cruises page**: Uses jQuery methods (not DOM)
- [ ] **Contact page**: Uses regex for validation
- [ ] **Stays page**: Does NOT use regex for validation

### Test 11.2: No Console Errors
- [ ] Open DevTools Console on each page
- [ ] Perform typical operations
- [ ] Verify no JavaScript errors appear

### Test 11.3: File Structure
- [ ] All HTML files in root
- [ ] All JS files in `js/` folder
- [ ] All data files in `data/` folder
- [ ] CSS file (`mystyle.css`) in root

---

## Quick Test Checklist Summary

**Must Test:**
1. ✅ All 7 pages load with navigation
2. ✅ Date/time displays and updates
3. ✅ Font size and background color persist
4. ✅ Contact form validation (all regex rules)
5. ✅ Contact form saves to JSON
6. ✅ Flights: one-way and round-trip searches
7. ✅ Flights: passenger form, validation, ±3 day fallback
8. ✅ Flights: price calculation (adult/child/infant)
9. ✅ Stays: validation, room calculation, hotel search
10. ✅ Cars: suggestions, DOM methods, booking
11. ✅ Cruises: jQuery methods, validation, search
12. ✅ Cart: displays all items, calculates totals
13. ✅ Cart: booking generates unique IDs, downloads files
14. ✅ Cart: updates data files (seats, rooms, cars, cabins)
15. ✅ Data files: 50+ flights, 20+ hotels, 20+ cars

---

## Notes for Testing

- **LocalStorage**: The app uses localStorage to simulate file storage. Clear it between major test sessions.
- **File Downloads**: The app triggers file downloads. Check your browser's download folder.
- **Date Format**: All dates should be in YYYY-MM-DD format.
- **Price Format**: Verify prices are calculated correctly (infants 10%, children 70%).
- **Unique IDs**: Each booking should have unique user-id and booking number.

---

## Common Issues to Watch For

1. **Date validation**: Ensure Sep 1 and Dec 1, 2024 are inclusive
2. **City validation**: Only TX/CA cities should be accepted
3. **Passenger limits**: Max 4 per category, but total can exceed
4. **Room calculation**: 2 guests per room, infants don't count
5. **File updates**: After booking, verify data files are updated
6. **Cart persistence**: Items should persist across page navigations
7. **Error messages**: Should be clear and helpful

