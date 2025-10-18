# FreshFridge Setup Instructions

## Prerequisites

1. Node.js 18+ installed
2. API keys for AI services (Gemini and/or OpenAI)

## Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
Create a `.env.local` file in the root directory with:
```
GEMINI_API_KEY=your_gemini_api_key_here
OPENAI_API_KEY=your_openai_api_key_here
```

## Getting API Keys

### Google Gemini API Key
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add it to your `.env.local` file

### OpenAI API Key (Optional)
1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Create a new API key
3. Add it to your `.env.local` file

## Running the Application

1. Start the development server:
```bash
npm run dev
```

2. Open [http://localhost:3000](http://localhost:3000) in your browser

## Features

- **Camera Scanner**: Take photos of your fridge to automatically detect and add food items
- **AI Chatbot**: Ask questions about your inventory, get recipe suggestions, and food safety tips
- **Smart Inventory**: Track expiration dates, quantities, and categories
- **Recipe Suggestions**: Get personalized recipe recommendations based on available ingredients
- **Expiration Alerts**: Never waste food again with smart expiration tracking

## Database

The app uses SQLite for local storage. The database file (`freshfridge.db`) will be created automatically in the project root.

## Troubleshooting

- Make sure your camera permissions are enabled in your browser
- Ensure API keys are correctly set in `.env.local`
- Check browser console for any error messages
