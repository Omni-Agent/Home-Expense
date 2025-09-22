-- Create expenses table for persistent storage
-- Updated schema to match the app's expense data structure
CREATE TABLE IF NOT EXISTS public.expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  category TEXT NOT NULL,
  date DATE NOT NULL,
  paid_by TEXT NOT NULL,
  status TEXT DEFAULT 'paid',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (since this is a personal expense tracker)
-- For a multi-user app, you would use auth.uid() = user_id instead
CREATE POLICY "Allow all operations on expenses" ON public.expenses
  FOR ALL USING (true)
  WITH CHECK (true);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS expenses_date_idx ON public.expenses(date);
CREATE INDEX IF NOT EXISTS expenses_category_idx ON public.expenses(category);
CREATE INDEX IF NOT EXISTS expenses_paid_by_idx ON public.expenses(paid_by);

-- Added demo data that matches the app's structure
INSERT INTO public.expenses (name, amount, category, date, paid_by, status) VALUES
  ('Rent Payment', 1200.00, 'Housing', '2025-01-01', 'Samarth', 'paid'),
  ('Grocery Shopping', 85.50, 'Groceries', '2025-01-02', 'Prachi', 'paid'),
  ('Electric Bill', 120.75, 'Household utilities', '2025-01-03', 'Samarth', 'paid'),
  ('Pizza Night', 45.20, 'Take out food', '2025-01-04', 'Prachi', 'paid'),
  ('Gas Station', 60.00, 'Transportation', '2025-01-05', 'Samarth', 'paid'),
  ('Movie Tickets', 28.00, 'Entertainment', '2025-01-06', 'Prachi', 'paid'),
  ('Internet Bill', 89.99, 'Household utilities', '2025-01-07', 'Samarth', 'paid'),
  ('Lunch Out', 32.50, 'Take out food', '2025-01-08', 'Prachi', 'paid'),
  ('Settlement Payment', 150.00, 'Housing', '2025-01-09', 'Paid Samarth', 'paid'),
  ('Settlement Payment', 75.00, 'Transportation', '2025-01-10', 'Paid Prachi', 'paid')
ON CONFLICT (id) DO NOTHING;
