-- Insert demo data for August and September 2025
INSERT INTO public.expenses (title, amount, category, date, description) VALUES
-- August 2025 entries
('Rent', 1200.00, 'Housing', '2025-08-01', 'Monthly rent payment'),
('Electricity Bill', 85.00, 'Housing', '2025-08-03', 'Monthly electricity'),
('WiFi Bill', 60.00, 'Housing', '2025-08-05', 'Internet service'),
('Gas Bill', 45.00, 'Housing', '2025-08-07', 'Natural gas'),
('Groceries', 120.00, 'Groceries', '2025-08-10', 'Weekly shopping'),
('Pizza Night', 35.00, 'Take out food', '2025-08-12', 'Dinner delivery'),
('Cleaning Supplies', 25.00, 'Household utilities', '2025-08-15', 'Household items'),
('Uber Ride', 18.00, 'Transportation', '2025-08-18', 'Ride to downtown'),
('Movie Tickets', 28.00, 'Entertainment', '2025-08-20', 'Cinema night'),
('Groceries', 95.00, 'Groceries', '2025-08-22', 'Weekly shopping'),
('Chinese Takeout', 42.00, 'Take out food', '2025-08-25', 'Dinner order'),
('Laundry Detergent', 15.00, 'Household utilities', '2025-08-28', 'Cleaning supplies'),

-- September 2025 entries
('Rent', 1200.00, 'Housing', '2025-09-01', 'Monthly rent payment'),
('Electricity Bill', 92.00, 'Housing', '2025-09-03', 'Monthly electricity'),
('WiFi Bill', 60.00, 'Housing', '2025-09-05', 'Internet service'),
('Gas Bill', 38.00, 'Housing', '2025-09-08', 'Natural gas'),
('Weekly Groceries', 135.00, 'Groceries', '2025-09-10', 'Weekly shopping'),
('Sushi Dinner', 65.00, 'Take out food', '2025-09-12', 'Japanese restaurant'),
('Toilet Paper & Tissues', 22.00, 'Household utilities', '2025-09-15', 'Bathroom supplies'),
('Gas Station', 45.00, 'Transportation', '2025-09-17', 'Car fuel'),
('Concert Tickets', 85.00, 'Entertainment', '2025-09-20', 'Live music event'),
('Groceries', 110.00, 'Groceries', '2025-09-22', 'Weekly shopping'),
('Thai Food', 38.00, 'Take out food', '2025-09-25', 'Thai restaurant'),
('Dish Soap & Sponges', 12.00, 'Household utilities', '2025-09-28', 'Kitchen supplies')

ON CONFLICT DO NOTHING;
