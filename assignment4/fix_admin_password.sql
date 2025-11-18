-- Fix Admin Password
-- This updates the admin account with a properly hashed password
-- Password will be: admin123

USE travel_deals;

-- Delete the old admin entry (if exists)
DELETE FROM users WHERE phone_number = '222-222-2222';

-- Note: You'll need to register the admin account through the registration page
-- OR manually hash the password using PHP
-- For now, use this SQL after hashing the password with PHP

-- To hash a password in PHP, run this command:
-- php -r "echo password_hash('admin123', PASSWORD_DEFAULT);"
-- Then update the VALUES below with the hashed output

INSERT INTO users (phone_number, password, first_name, last_name, date_of_birth, email, gender)
VALUES (
    '222-222-2222',
    -- REPLACE THIS WITH ACTUAL HASHED PASSWORD FROM PHP
    -- Run: php -r "echo password_hash('admin123', PASSWORD_DEFAULT);"
    '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    'Admin',
    'User',
    '01/01/1990',
    'admin@traveldeals.com',
    'Male'
);
