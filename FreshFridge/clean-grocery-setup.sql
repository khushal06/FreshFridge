-- Just create the grocery_logs table and its components
CREATE TABLE IF NOT EXISTS grocery_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  store_name TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_grocery_logs_date ON grocery_logs(date);

ALTER TABLE grocery_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all operations on grocery_logs" ON grocery_logs
    FOR ALL USING (true) WITH CHECK (true);
