-- Database Setup for Travel Deals Application
-- CS 6314 - Assignment #4

-- Create database
CREATE DATABASE IF NOT EXISTS travel_deals;
USE travel_deals;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    phone_number VARCHAR(12) PRIMARY KEY,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    date_of_birth VARCHAR(10) NOT NULL,
    email VARCHAR(100) NOT NULL,
    gender VARCHAR(10)
);

-- Insert admin user (password: admin123)
INSERT INTO users (phone_number, password, first_name, last_name, date_of_birth, email, gender)
VALUES ('222-222-2222', '$2y$10$YourHashedPasswordHere', 'Admin', 'User', '01/01/1990', 'admin@traveldeals.com', 'Other')
ON DUPLICATE KEY UPDATE phone_number=phone_number;

-- Flights table
CREATE TABLE IF NOT EXISTS flights (
    flight_id VARCHAR(20) PRIMARY KEY,
    origin VARCHAR(100) NOT NULL,
    destination VARCHAR(100) NOT NULL,
    departure_date DATE NOT NULL,
    arrival_date DATE NOT NULL,
    departure_time TIME NOT NULL,
    arrival_time TIME NOT NULL,
    available_seats INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL
);

-- Hotels table
CREATE TABLE IF NOT EXISTS hotels (
    hotel_id VARCHAR(20) PRIMARY KEY,
    hotel_name VARCHAR(200) NOT NULL,
    city VARCHAR(100) NOT NULL,
    price_per_night DECIMAL(10, 2) NOT NULL
);

-- Passengers table
CREATE TABLE IF NOT EXISTS passengers (
    ssn VARCHAR(11) PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    date_of_birth VARCHAR(10) NOT NULL,
    category VARCHAR(10) NOT NULL
);

-- Flight bookings table
CREATE TABLE IF NOT EXISTS flight_bookings (
    flight_booking_id INT AUTO_INCREMENT PRIMARY KEY,
    flight_id VARCHAR(20) NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    phone_number VARCHAR(12) NOT NULL,
    booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (flight_id) REFERENCES flights(flight_id),
    FOREIGN KEY (phone_number) REFERENCES users(phone_number)
);

-- Tickets table
CREATE TABLE IF NOT EXISTS tickets (
    ticket_id INT AUTO_INCREMENT PRIMARY KEY,
    flight_booking_id INT NOT NULL,
    ssn VARCHAR(11) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (flight_booking_id) REFERENCES flight_bookings(flight_booking_id),
    FOREIGN KEY (ssn) REFERENCES passengers(ssn)
);

-- Guesses (hotel guests) table
CREATE TABLE IF NOT EXISTS guesses (
    ssn VARCHAR(11) PRIMARY KEY,
    hotel_booking_id INT NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    date_of_birth VARCHAR(10) NOT NULL,
    category VARCHAR(10) NOT NULL
);

-- Hotel bookings table
CREATE TABLE IF NOT EXISTS hotel_bookings (
    hotel_booking_id INT AUTO_INCREMENT PRIMARY KEY,
    hotel_id VARCHAR(20) NOT NULL,
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    number_of_rooms INT NOT NULL,
    price_per_night DECIMAL(10, 2) NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    phone_number VARCHAR(12) NOT NULL,
    booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (hotel_id) REFERENCES hotels(hotel_id),
    FOREIGN KEY (phone_number) REFERENCES users(phone_number)
);

-- Add foreign key for guesses after hotel_bookings is created
ALTER TABLE guesses
ADD FOREIGN KEY (hotel_booking_id) REFERENCES hotel_bookings(hotel_booking_id);

-- Indexes for better performance
CREATE INDEX idx_flights_route ON flights(origin, destination, departure_date);
CREATE INDEX idx_hotels_city ON hotels(city);
CREATE INDEX idx_flight_bookings_phone ON flight_bookings(phone_number);
CREATE INDEX idx_hotel_bookings_phone ON hotel_bookings(phone_number);
CREATE INDEX idx_tickets_booking ON tickets(flight_booking_id);
CREATE INDEX idx_guesses_booking ON guesses(hotel_booking_id);
