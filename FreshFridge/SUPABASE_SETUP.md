# Supabase Setup Guide for FreshFridge

## 🚀 Quick Setup

Your Supabase project is already configured with the provided API key and URL. Here's how to set up the database:

### 1. Set Up Database Tables

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Navigate to your project: `sborzwebjgskeioexvuv`
3. Go to **SQL Editor**
4. Copy and paste the contents of `supabase-setup.sql` into the SQL editor
5. Click **Run** to execute the script

This will create:
- `food_items` table for storing recognized food items
- `recipes` table for AI-generated recipes
- `chat_messages` table for chatbot conversations
- Sample data to get you started

### 2. Environment Variables

Create a `.env.local` file in your project root:

```bash
# Supabase Configuration (already configured)
NEXT_PUBLIC_SUPABASE_URL=https://sborzwebjgskeioexvuv.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNib3J6d2Viamdza2Vpb2V4dnV2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA3Mzc5NzUsImV4cCI6MjA3NjMxMzk3NX0.E5TWwl375VgeLrtZwQ41cR8a_FNABabQhJjeQFZJWaI

# AI Service API Keys (you'll need these)
GEMINI_API_KEY=your_gemini_api_key_here
OPENAI_API_KEY=your_openai_api_key_here
```

### 3. Get AI API Keys

#### Google Gemini API Key:
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add it to your `.env.local` file

#### OpenAI API Key (Optional):
1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Create a new API key
3. Add it to your `.env.local` file

### 4. Run the Application

```bash
npm run dev
```

## 🎯 Features Now Available

### ✅ **Camera Food Recognition**
- Take photos of your fridge
- AI automatically identifies food items
- Items are saved directly to Supabase
- Expiration dates estimated automatically

### ✅ **AI Chatbot**
- Ask questions about your inventory
- Get recipe suggestions
- Food safety tips
- All conversations saved to Supabase

### ✅ **Smart Recipe Generation**
- AI creates recipes based on available ingredients
- Recipes saved to Supabase for future reference
- Detailed cooking instructions and nutritional info

### ✅ **Real-time Data Sync**
- All data stored in Supabase cloud database
- Real-time updates across all components
- Persistent storage for all your food items and recipes

## 🔧 Database Schema

### Food Items Table
```sql
- id (UUID, Primary Key)
- name (Text)
- category (Text)
- emoji (Text)
- expiry_date (Date)
- quantity (Integer)
- unit (Text)
- added_date (Date)
- image_url (Text, Optional)
- confidence (Real, Optional)
- notes (Text, Optional)
```

### Recipes Table
```sql
- id (UUID, Primary Key)
- title (Text)
- subtitle (Text)
- emoji (Text)
- cook_time (Text)
- servings (Text)
- rating (Real)
- reviews (Integer)
- calories (Integer)
- ingredients (Text Array)
- instructions (Text Array)
- category (Text)
- difficulty (Text: Easy/Medium/Hard)
```

### Chat Messages Table
```sql
- id (UUID, Primary Key)
- message (Text)
- is_user (Boolean)
- timestamp (Timestamp)
- session_id (Text)
```

## 🚨 Troubleshooting

### Database Connection Issues
- Verify your Supabase project URL and API key are correct
- Check that the database tables were created successfully
- Ensure Row Level Security policies are set up

### AI Recognition Not Working
- Make sure you've added your Gemini API key to `.env.local`
- Check browser console for any API errors
- Verify camera permissions are enabled

### Chatbot Not Responding
- Ensure your API keys are valid and have sufficient credits
- Check the Supabase logs for any database errors
- Verify the chat_messages table was created properly

## 📊 Monitoring

You can monitor your application in the Supabase dashboard:
- **Table Editor**: View and edit your data
- **Logs**: Monitor API calls and errors
- **SQL Editor**: Run custom queries
- **API**: View your database API endpoints

## 🔐 Security Notes

- The current setup uses anonymous access for demo purposes
- In production, implement proper user authentication
- Consider setting up more restrictive RLS policies
- Regularly rotate your API keys

Your FreshFridge app is now fully integrated with Supabase! 🎉
