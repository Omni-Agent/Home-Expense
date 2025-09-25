-- Clear existing demo data and add corrected data with proper paid_by values
DELETE FROM expenses;

-- Insert demo data with expenses paid by both Samarth and Prachi
INSERT INTO expenses (date, name, category, amount, paid_by) VALUES
-- August 2025 entries
('2025-08-01', 'Rent', 'Housing', 1200, 'Samarth'),
('2025-08-03', 'Electricity Bill', 'Housing', 85, 'Prachi'),
('2025-08-05', 'WiFi Bill', 'Housing', 60, 'Samarth'),
('2025-08-07', 'Gas Bill', 'Housing', 45, 'Prachi'),
('2025-08-10', 'Groceries', 'Groceries', 120, 'Samarth'),
('2025-08-12', 'Pizza Night', 'Take out food', 35, 'Prachi'),
('2025-08-15', 'Cleaning Supplies', 'Household utilities', 25, 'Samarth'),
('2025-08-18', 'Uber Ride', 'Transportation', 18, 'Prachi'),
('2025-08-20', 'Movie Tickets', 'Entertainment', 28, 'Samarth'),
('2025-08-22', 'Groceries', 'Groceries', 95, 'Prachi'),
('2025-08-25', 'Chinese Takeout', 'Take out food', 42, 'Samarth'),
('2025-08-28', 'Laundry Detergent', 'Household utilities', 15, 'Prachi'),

-- September 2025 entries
('2025-09-01', 'Rent', 'Housing', 1200, 'Prachi'),
('2025-09-03', 'Electricity Bill', 'Housing', 92, 'Samarth'),
('2025-09-05', 'WiFi Bill', 'Housing', 60, 'Prachi'),
('2025-09-08', 'Gas Bill', 'Housing', 38, 'Samarth'),
('2025-09-10', 'Weekly Groceries', 'Groceries', 135, 'Prachi'),
('2025-09-12', 'Sushi Dinner', 'Take out food', 65, 'Samarth'),
('2025-09-15', 'Toilet Paper & Tissues', 'Household utilities', 22, 'Prachi'),
('2025-09-17', 'Gas Station', 'Transportation', 45, 'Samarth'),
('2025-09-20', 'Concert Tickets', 'Entertainment', 85, 'Prachi'),
('2025-09-22', 'Groceries', 'Groceries', 110, 'Samarth'),
('2025-09-25', 'Thai Food', 'Take out food', 38, 'Prachi'),
('2025-09-28', 'Dish Soap & Sponges', 'Household utilities', 12, 'Samarth');
