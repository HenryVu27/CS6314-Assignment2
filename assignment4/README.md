# CS 6314 - Assignment #4: Travel Deals Web Application

## Project Overview
This is a comprehensive travel booking web application built with HTML, CSS, JavaScript, jQuery, XML, JSON, Ajax, PHP, and MySQL. The application allows users to search and book flights and hotels between Texas and California cities.

## Features
- **User Authentication**: Register, login, and session management
- **Flight Booking**: Search for one-way or round-trip flights with passenger management
- **Hotel Booking**: Search for hotels with flexible guest and room configurations
- **Shopping Cart**: Review and complete bookings
- **Admin Panel**: Load data from JSON/XML files and run complex queries
- **Contact Form**: Submit comments (stored in XML)
- **Account Management**: View bookings and search by various criteria

## File Structure

```
assignment4/
├── index.html              # Home page
├── register.html           # User registration
├── login.html              # User login
├── flights.html            # Flight search and booking
├── stays.html              # Hotel search and booking
├── contact-us.html         # Contact form
├── cart.html               # Shopping cart
├── my-account.html         # User account and admin panel
├── mystyle.css             # External stylesheet
├── common.js               # Common JavaScript functions
├── database_setup.sql      # Database schema
│
├── js/                     # JavaScript files
│   ├── register.js
│   ├── login.js
│   ├── contact.js
│   ├── flights.js
│   ├── stays.js
│   ├── cart.js
│   └── my-account.js
│
├── php/                    # PHP backend files
│   ├── config.php          # Database configuration
│   ├── register.php        # User registration handler
│   ├── login.php           # Login handler
│   ├── logout.php          # Logout handler
│   ├── check_session.php   # Session validation
│   ├── contact.php         # Contact form handler
│   ├── search_flights.php  # Flight search
│   ├── search_hotels.php   # Hotel search
│   ├── add_flight_to_cart.php
│   ├── add_hotel_to_cart.php
│   ├── get_cart.php        # Retrieve cart contents
│   ├── book_flights.php    # Complete flight booking
│   ├── book_hotel.php      # Complete hotel booking
│   ├── load_flights.php    # Load flights from JSON
│   ├── load_hotels.php     # Load hotels from XML
│   └── _admin_query_template.php  # Template for admin queries
│
└── data/                   # Data files
    ├── flights.json        # 55+ flight records
    ├── hotels.xml          # 24 hotel records
    └── contacts.xml        # User comments (created dynamically)
```

## Database Setup

### Prerequisites
- XAMPP, WAMP, or similar PHP/MySQL stack
- PHP 7.4 or higher
- MySQL 5.7 or higher

### Setup Instructions

1. **Start your PHP/MySQL server** (e.g., XAMPP)

2. **Create the database**:
   - Open phpMyAdmin (usually at http://localhost/phpmyadmin)
   - Create a new database named `travel_deals`
   - Import the `database_setup.sql` file or run it in the SQL tab

3. **Configure database connection**:
   - Edit `php/config.php` if your MySQL credentials differ from defaults:
     ```php
     define('DB_HOST', 'localhost');
     define('DB_USER', 'root');
     define('DB_PASS', '');  // Your MySQL password
     define('DB_NAME', 'travel_deals');
     ```

4. **Set up admin user**:
   - The admin phone number is: `222-222-2222`
   - After setting up the database, register this account through the registration page
   - Or manually insert: Password should be hashed using PHP's `password_hash()`

## Running the Application

1. Place the `assignment4` folder in your web server's document root:
   - XAMPP: `C:\xampp\htdocs\assignment4`
   - WAMP: `C:\wamp\www\assignment4`

2. Access the application:
   - Open your browser and go to: `http://localhost/assignment4/index.html`

3. **First-time setup**:
   - Register a new account
   - Login as admin (222-222-2222) to load data
   - Go to My Account page
   - Click "Load Flights JSON to Database"
   - Click "Load Hotels XML to Database"

## User Guide

### Registration & Login
1. Navigate to Register page
2. Fill in all required fields:
   - Phone: Format ddd-ddd-dddd (unique)
   - Password: Minimum 8 characters (confirm twice)
   - First Name, Last Name, Date of Birth (MM/DD/YYYY), Email (must contain @ and .com)
   - Gender: Optional
3. After registration, login with your phone number and password

### Searching Flights
1. Go to Flights page
2. Select trip type (One-way or Round Trip)
3. Choose origin and destination cities
4. Select departure date (and return date for round trips)
5. Click the passenger icon to specify number of adults, children, and infants (max 4 each)
6. Click Search Flights
7. Select your desired flight(s) and add to cart

### Searching Hotels
1. Go to Stays page
2. Select a city
3. Choose check-in and check-out dates
4. Enter number of guests by category
   - Max 2 adults/children per room (infants don't count towards room limit)
5. Click Search Hotels
6. Select a hotel and add to cart

### Booking
1. Go to Cart page
2. Review your selected flights/hotels
3. Enter passenger/guest details for each person:
   - First Name, Last Name, Date of Birth, SSN
4. Click "Book Flights" or "Book Hotel"
5. View confirmation in My Account page

### Contact Us
1. Must be logged in
2. Enter a comment (minimum 10 characters)
3. Submit - your information will be saved to contacts.xml

### Admin Functions (Phone: 222-222-2222)
1. Load data from JSON/XML files
2. Run various queries:
   - Search bookings by ID
   - View September 2024 bookings
   - Search by passenger SSN
   - View flights from Texas
   - View expensive bookings
   - And more...

## Validation Rules

### Registration
- Phone: ddd-ddd-dddd format, must be unique
- Password: Minimum 8 characters, must match confirmation
- DOB: MM/DD/YYYY format
- Email: Must contain @ and .com

### Flights
- Departure date: Between Sep 1, 2024 and Dec 1, 2024
- Origin/Destination: Must be cities in Texas or California
- Passengers: Max 4 per category (adults, children, infants)

### Hotels
- Check-in/out: Between Sep 1, 2024 and Dec 1, 2024
- City: Must be in Texas or California
- Guests: Max 2 regular guests per room (infants exempt)

## Pricing

### Flights
- Adult: Full price
- Children: 70% of adult price
- Infants: 10% of adult price

### Hotels
- Price per night × Number of rooms × Number of nights

## Technical Details

### Technologies Used
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Styling**: Custom CSS with Google Fonts (Poppins, Quicksand)
- **Backend**: PHP 7.4+
- **Database**: MySQL
- **Data Formats**: JSON (flights), XML (hotels, contacts)
- **Session Management**: PHP sessions
- **Security**: Password hashing with bcrypt

### Database Schema

**Tables:**
- `users` - User accounts
- `flights` - Available flights
- `hotels` - Available hotels
- `passengers` - Flight passenger information
- `flight_bookings` - Flight booking records
- `tickets` - Individual flight tickets
- `guesses` - Hotel guest information
- `hotel_bookings` - Hotel booking records

## Additional PHP Files Needed

The following PHP files need to be created using the template in `php/_admin_query_template.php`:

1. **get_flight_booking.php** - Retrieve flight booking by ID
2. **get_hotel_booking.php** - Retrieve hotel booking by ID
3. **get_september_bookings.php** - Get all bookings for September 2024
4. **search_by_ssn.php** - Search bookings by SSN
5. **admin_texas_flights.php** - Flights from Texas (Sep-Oct 2024)
6. **admin_texas_hotels.php** - Hotels in Texas (Sep-Oct 2024)
7. **admin_expensive_hotels.php** - Most expensive booked hotels
8. **admin_infant_flights.php** - Flights with infant passengers
9. **admin_infant_children_flights.php** - Flights with infant and 5+ children
10. **admin_expensive_flights.php** - Most expensive booked flights
11. **admin_texas_no_infants.php** - Texas flights without infants
12. **admin_california_flights.php** - Count flights to California (Sep-Oct 2024)

Each file should follow the template structure and implement the specific SQL query for its purpose.

## Customization Features

Users can customize their viewing experience:
- **Font Size**: Small, Medium, Large, Extra Large
- **Background Color**: Color picker
- Settings are saved in localStorage

## Troubleshooting

### Common Issues

1. **Database connection error**
   - Verify MySQL is running
   - Check credentials in `php/config.php`
   - Ensure database exists

2. **Flights/Hotels not appearing**
   - Login as admin
   - Load data from JSON/XML files in My Account page

3. **Session not persisting**
   - Check if sessions are enabled in PHP
   - Verify session_start() is called

4. **Cannot book flights/hotels**
   - Ensure you're logged in
   - Check that passenger/guest information is complete
   - Verify database tables exist

## Assignment Requirements Met

✅ 7 web pages (index, stays, flights, contact-us, register, login, cart, my-account)
✅ External CSS file (mystyle.css)
✅ Navigation bar on all pages
✅ User registration with validation
✅ Login system with phone + password
✅ Current date/time display
✅ User name displayed after login
✅ Contact form with XML storage
✅ Font size and background color customization
✅ JSON file with 50+ flights
✅ XML file with 20+ hotels
✅ Admin data loading functionality
✅ Flight search (one-way and round trip)
✅ Hotel search with guest management
✅ Passenger selection (adults, children, infants)
✅ Cart system
✅ Booking system with database storage
✅ Account page with query functionality
✅ Admin query functions

## Notes

- All dates are in YYYY-MM-DD format for database consistency
- Phone numbers are stored with dashes (ddd-ddd-dddd)
- SSN format: ddd-dd-dddd
- Admin phone: 222-222-2222
- Sample data spans Sep 1 - Dec 1, 2024

## Author
CS 6314 - Fall 2025
Assignment #4

## Submission

To submit this assignment:
1. Ensure all files are in the `assignment4` folder
2. Test all functionality
3. Export your database (phpMyAdmin → Export)
4. Zip the entire `assignment4` folder
5. Submit the zip file

---
**Due Date**: December 3, 2025, 11:59 PM
