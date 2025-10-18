-- FreshFridge Database Schema for Supabase

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create food_items table
CREATE TABLE IF NOT EXISTS food_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  emoji TEXT NOT NULL,
  expiry_date DATE NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit TEXT NOT NULL DEFAULT 'piece',
  added_date DATE NOT NULL DEFAULT CURRENT_DATE,
  image_url TEXT,
  confidence REAL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create recipes table
CREATE TABLE IF NOT EXISTS recipes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT NOT NULL,
  emoji TEXT NOT NULL,
  cook_time TEXT NOT NULL,
  servings TEXT NOT NULL,
  rating REAL NOT NULL,
  reviews INTEGER NOT NULL,
  calories INTEGER NOT NULL,
  ingredients TEXT[] NOT NULL,
  instructions TEXT[] NOT NULL,
  category TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create chat_messages table
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  message TEXT NOT NULL,
  is_user BOOLEAN NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
  session_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_food_items_expiry_date ON food_items(expiry_date);
CREATE INDEX IF NOT EXISTS idx_food_items_category ON food_items(category);
CREATE INDEX IF NOT EXISTS idx_recipes_rating ON recipes(rating);
CREATE INDEX IF NOT EXISTS idx_chat_messages_session_id ON chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_timestamp ON chat_messages(timestamp);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_food_items_updated_at 
    BEFORE UPDATE ON food_items 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_recipes_updated_at 
    BEFORE UPDATE ON recipes 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE food_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Create policies for anonymous access (for demo purposes)
-- In production, you should implement proper authentication
CREATE POLICY "Allow all operations on food_items" ON food_items
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on recipes" ON recipes
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on chat_messages" ON chat_messages
    FOR ALL USING (true) WITH CHECK (true);

-- Insert some sample data
INSERT INTO food_items (name, category, emoji, expiry_date, quantity, unit, notes) VALUES
('Milk', 'Dairy', '🥛', CURRENT_DATE + INTERVAL '2 days', 1, 'carton', 'Sample item'),
('Bananas', 'Produce', '🍌', CURRENT_DATE + INTERVAL '1 day', 6, 'piece', 'Sample item'),
('Spinach', 'Produce', '🥬', CURRENT_DATE + INTERVAL '3 days', 1, 'bag', 'Sample item'),
('Eggs', 'Dairy', '🥚', CURRENT_DATE + INTERVAL '7 days', 12, 'piece', 'Sample item')
ON CONFLICT DO NOTHING;

INSERT INTO recipes (title, subtitle, emoji, cook_time, servings, rating, reviews, calories, ingredients, instructions, category, difficulty) VALUES
('Spinach Omelette', 'Perfect breakfast with fresh ingredients', '🥚', '10 min', '2', 4.8, 127, 320, 
 ARRAY['Eggs', 'Spinach', 'Cheese', 'Butter'], 
 ARRAY['Beat eggs in a bowl with salt and pepper', 'Heat butter in a non-stick pan', 'Add spinach and cook until wilted', 'Pour eggs over spinach and cook until set'],
 'Breakfast', 'Easy')
ON CONFLICT DO NOTHING;
