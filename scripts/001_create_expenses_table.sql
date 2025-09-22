-- Create expenses table for persistent storage
CREATE TABLE IF NOT EXISTS public.expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  category TEXT NOT NULL,
  date DATE NOT NULL,
  description TEXT,
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
