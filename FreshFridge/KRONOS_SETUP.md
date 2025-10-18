# KronosAI Setup Guide

## 🔑 Getting Your API Key

1. **Sign up at KronosLabs**: Visit [KronosLabs](https://kronoslabs.ai) and create an account
2. **Get your API key**: Navigate to your dashboard and copy your API key
3. **Add to environment**: Add your API key to your `.env.local` file

## 📝 Environment Setup

Add this line to your `.env.local` file:

```bash
KRONOS_API_KEY=your-actual-api-key-here
```

## 🧪 Testing the Integration

1. **Add some items to your pantry** using the "Scan Item" feature
2. **Go to the Recipe page**
3. **Click "AI Suggestions"** button
4. **Watch as KronosAI generates** personalized recipes based on your inventory!

## 🔧 How It Works

- **Inventory Analysis**: KronosAI analyzes your current food items
- **Recipe Generation**: Creates 3 creative, practical recipes using your ingredients
- **Smart Suggestions**: Includes common pantry staples (salt, pepper, oil, etc.)
- **Automatic Saving**: Generated recipes are automatically saved to your database

## 📊 Features

- **Personalized Recipes**: Based on your actual inventory
- **Nutritional Info**: Includes calories, cook time, servings
- **Difficulty Levels**: Easy, Medium, Hard classifications
- **Categories**: Breakfast, Lunch, Dinner, Snack, Dessert
- **Ratings**: Estimated ratings and review counts
- **Fallback System**: If KronosAI is unavailable, uses built-in recipe suggestions

## 🚨 Troubleshooting

### API Key Issues
- Make sure your API key is correctly set in `.env.local`
- Restart your development server after adding the API key
- Check that the API key has proper permissions

### No Recipes Generated
- Ensure you have items in your pantry
- Check the browser console for error messages
- The system will fallback to built-in recipes if KronosAI fails

### Server-Side Only
- KronosAI integration only works on the server side
- The API calls are made from the backend, not the browser
- This ensures your API key remains secure

## 🎯 Example Usage

1. **Scan Items**: Add banana, apple, milk, bread to your pantry
2. **Click AI Suggestions**: KronosAI will generate recipes like:
   - Banana Bread
   - Apple Cinnamon Oatmeal
   - Fruit Smoothie Bowl
3. **View Recipes**: See detailed ingredients, instructions, and nutritional info
4. **Save & Use**: Recipes are automatically saved for future reference

Enjoy your AI-powered recipe suggestions! 🍳✨
