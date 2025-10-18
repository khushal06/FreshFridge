-- Create grocery_logs table only (without existing triggers)
CREATE TABLE IF NOT EXISTS grocery_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  store_name TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_grocery_logs_date ON grocery_logs(date);

-- Enable Row Level Security
ALTER TABLE grocery_logs ENABLE ROW LEVEL SECURITY;

-- Create policy for anonymous access (for demo purposes)
CREATE POLICY "Allow all operations on grocery_logs" ON grocery_logs
    FOR ALL USING (true) WITH CHECK (true);
