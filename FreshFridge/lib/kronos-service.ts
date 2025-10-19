import { FoodItem } from './supabase';

export interface KronosRecipe {
  title: string;
  subtitle: string;
  emoji: string;
  cookTime: number;
  servings: number;
  ingredients: string[];
  instructions: string[];
  category: string;
  difficulty: string;
  rating: number;
  reviewCount: number;
  calories: number;
  description: string;
}

class KronosService {
  private apiKey: string;
  private isInitialized: boolean = false;

  constructor() {
    this.apiKey = process.env.KRONOS_API_KEY || '';
    this.isInitialized = typeof window === 'undefined' && this.apiKey.length > 0;
    console.log('🔑 KronosAI API Key loaded:', this.apiKey ? 'Yes' : 'No');
    console.log('🔑 KronosAI initialized:', this.isInitialized);
  }

  async generateRecipesFromInventory(foodItems: FoodItem[]): Promise<KronosRecipe[]> {
    try {
      if (!this.isInitialized) {
        console.error('KronosAI not initialized - running on client side or missing API key');
        return this.getFallbackRecipes(foodItems);
      }

      console.log('🍳 Generating recipes with KronosAI based on inventory:', foodItems);

      const inventoryList = foodItems.map(item => `${item.name} (${item.quantity} ${item.unit})`).join(', ');

      const prompt = `
        You are a professional chef specializing in creative and healthy recipes.
        Based on the following ingredients in my fridge: ${inventoryList}

        Suggest 3 unique and delicious recipes. For each recipe, provide:
        1. Title (e.g., "Spicy Chicken Stir-Fry")
        2. Subtitle (e.g., "A quick and flavorful weeknight meal")
        3. Emoji (e.g., "🌶️")
        4. Cook time in minutes (number only, e.g., 25)
        5. Number of servings (number only, e.g., 4)
        6. List of ingredients (each on a new line, e.g., "2 chicken breasts, diced")
        7. Step-by-step instructions (each step on a new line, e.g., "1. Heat oil in a pan.")
        8. Category (e.g., "Dinner", "Breakfast", "Lunch", "Snack", "Dessert")
        9. Difficulty (e.g., "Easy", "Medium", "Hard")
        10. Estimated rating (e.g., 4.5)
        11. Estimated review count (e.g., 150)
        12. Estimated calories per serving (e.g., 350)

        Format the output as a JSON array of objects, like this:
        [
          {
            "title": "Recipe Title 1",
            "subtitle": "Recipe Subtitle 1",
            "emoji": "🍳",
            "cookTime": 30,
            "servings": 4,
            "ingredients": ["Ingredient 1", "Ingredient 2"],
            "instructions": ["Step 1", "Step 2"],
            "category": "Dinner",
            "difficulty": "Medium",
            "rating": 4.7,
            "reviewCount": 210,
            "calories": 450,
            "description": "A delicious recipe."
          }
        ]
        Make sure the recipes are practical, delicious, and use the available ingredients creatively.
      `;

      // Use the correct KronosLabs API endpoint
      const response = await fetch('https://api.kronoslabs.ai/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt: prompt,
          model: 'hermes',
          temperature: 0.7,
          is_stream: false
        })
      });

      if (!response.ok) {
        throw new Error(`KronosAI API error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      const content = result.choices[0].message.content;
      console.log('Raw KronosAI response content:', content);

      // Parse the JSON content
      const parsedRecipes: KronosRecipe[] = JSON.parse(content);
      return parsedRecipes;
    } catch (error) {
      console.error('❌ KronosAI recipe generation error:', error);
      return this.getFallbackRecipes(foodItems);
    }
  }

  private getFallbackRecipes(foodItems: FoodItem[]): KronosRecipe[] {
    console.log('🔄 Using fallback recipes for testing');
    
    const itemNames = foodItems.map(item => item.name.toLowerCase());
    console.log('📋 Available items:', itemNames);
    
    const fallbackRecipes: KronosRecipe[] = [];

    // Recipe 1: Fruit-based recipe if we have fruits
    const hasBanana = itemNames.some(name => name.includes('banana'));
    const hasApple = itemNames.some(name => name.includes('apple'));
    
    if (hasBanana || hasApple) {
      fallbackRecipes.push({
        title: 'Tropical Banana Bowl',
        subtitle: 'Sweet and energizing',
        emoji: '🥭',
        cookTime: 8,
        servings: 2,
        ingredients: ['2 bananas, sliced', '1 apple, diced', '1 tbsp coconut flakes', '1 tsp chia seeds', '1 tbsp honey', 'Lime juice'],
        instructions: ['Wash and prepare all fruits', 'Slice bananas and dice apple', 'Combine fruits in a bowl', 'Sprinkle with coconut flakes and chia seeds', 'Drizzle with honey and lime juice', 'Mix gently and serve'],
        category: 'Breakfast',
        difficulty: 'Easy',
        rating: 0,
        reviewCount: 0,
        calories: 150,
        description: 'A nutritious and energizing fruit bowl perfect for breakfast.'
      });
    }

    // Recipe 2: Protein-based recipe if we have chicken or eggs
    const hasChicken = itemNames.some(name => name.includes('chicken'));
    const hasEggs = itemNames.some(name => name.includes('egg'));
    
    if (hasChicken && hasEggs) {
      fallbackRecipes.push({
        title: 'Protein Power Scramble',
        subtitle: 'High-protein breakfast or lunch',
        emoji: '🍳',
        cookTime: 12,
        servings: 2,
        ingredients: ['3 eggs', '100g cooked chicken, shredded', '1/4 cup milk', '1 tbsp butter', 'Salt and pepper', 'Fresh herbs (optional)'],
        instructions: ['Whisk eggs with milk, salt, and pepper', 'Heat butter in a pan over medium heat', 'Add shredded chicken and warm through', 'Pour egg mixture into the pan', 'Scramble gently until eggs are cooked', 'Garnish with herbs and serve'],
        category: 'Breakfast',
        difficulty: 'Easy',
        rating: 0,
        reviewCount: 0,
        calories: 320,
        description: 'A protein-packed scramble perfect for fueling your day.'
      });
    } else if (hasEggs) {
      fallbackRecipes.push({
        title: 'Classic Scrambled Eggs',
        subtitle: 'Simple and satisfying',
        emoji: '🍳',
        cookTime: 8,
        servings: 2,
        ingredients: ['4 eggs', '2 tbsp milk', '2 tbsp butter', 'Salt and pepper', 'Fresh chives'],
        instructions: ['Whisk eggs with milk, salt, and pepper', 'Heat butter in a non-stick pan', 'Add eggs and cook over low heat', 'Stir gently until creamy', 'Garnish with chives and serve'],
        category: 'Breakfast',
        difficulty: 'Easy',
        rating: 0,
        reviewCount: 0,
        calories: 280,
        description: 'Perfectly creamy scrambled eggs made simple.'
      });
    }

    // Recipe 3: Green salad if we have spinach
    const hasSpinach = itemNames.some(name => name.includes('spinach'));
    
    if (hasSpinach) {
      fallbackRecipes.push({
        title: 'Fresh Spinach Salad',
        subtitle: 'Light and nutritious',
        emoji: '🥗',
        cookTime: 10,
        servings: 2,
        ingredients: ['2 cups fresh spinach', '1 cucumber, sliced', '1 tomato, diced', '1/4 cup olive oil', '2 tbsp lemon juice', 'Salt and pepper'],
        instructions: ['Wash and dry the spinach leaves', 'Slice cucumber and dice tomato', 'Combine all vegetables in a large bowl', 'Whisk olive oil with lemon juice', 'Drizzle dressing over salad', 'Toss gently and serve immediately'],
        category: 'Lunch',
        difficulty: 'Easy',
        rating: 0,
        reviewCount: 0,
        calories: 120,
        description: 'A fresh and healthy spinach salad packed with nutrients.'
      });
    }

    // Always ensure we have at least 2 different recipes
    if (fallbackRecipes.length < 2) {
      fallbackRecipes.push({
        title: 'Quick Pantry Meal',
        subtitle: 'Using what you have',
        emoji: '🍽️',
        cookTime: 15,
        servings: 2,
        ingredients: ['Available pantry items', 'Basic seasonings', 'Cooking oil', 'Salt and pepper'],
        instructions: ['Assess your available ingredients', 'Choose a cooking method (stir-fry, roast, etc.)', 'Season with salt, pepper, and herbs', 'Cook until tender and flavorful', 'Serve hot and enjoy'],
        category: 'Dinner',
        difficulty: 'Easy',
        rating: 0,
        reviewCount: 0,
        calories: 200,
        description: 'A flexible recipe that works with whatever you have on hand.'
      });
    }

    console.log(`✅ Generated ${fallbackRecipes.length} diverse fallback recipes`);
    return fallbackRecipes.slice(0, 3);
  }

  // New method for chatbot interactions
  async chatWithKitchenAssistant(message: string, foodItems: FoodItem[]): Promise<string> {
    try {
      if (!this.isInitialized) {
        console.error('KronosAI not initialized - running on client side or missing API key');
        return this.getFallbackChatResponse(message, foodItems);
      }

      console.log('🤖 Chatting with KronosAI kitchen assistant:', message);

      const inventoryList = foodItems.map(item => `${item.name} (${item.quantity} ${item.unit}, expires ${item.expiry_date})`).join(', ');

      const prompt = `
        You are a helpful kitchen assistant for the FreshKeep app. You help users manage their food inventory, suggest recipes, and provide cooking advice.
        
        Current inventory: ${inventoryList || 'No items in inventory'}
        
        User question: ${message}
        
        Please provide a helpful, friendly response. If the user asks about recipes, suggest specific dishes they can make with their current ingredients. If they ask about expiration dates, help them prioritize items that are expiring soon. Be practical, encouraging, and provide actionable advice.
        
        Keep your response concise but informative (2-3 sentences max). If suggesting recipes, mention specific ingredients from their inventory.
      `;

      const response = await fetch('https://api.kronoslabs.ai/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt: prompt,
          model: 'hermes',
          temperature: 0.7,
          is_stream: false
        })
      });

      if (!response.ok) {
        throw new Error(`KronosAI API error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      const content = result.choices[0].message.content;
      console.log('🤖 KronosAI chat response:', content);
      
      return content;
    } catch (error) {
      console.error('❌ KronosAI chat error:', error);
      return this.getFallbackChatResponse(message, foodItems);
    }
  }

  private getFallbackChatResponse(message: string, foodItems: FoodItem[]): string {
    const messageLower = message.toLowerCase();
    
    if (messageLower.includes('recipe') || messageLower.includes('cook') || messageLower.includes('make')) {
      const availableItems = foodItems.map(item => item.name).join(', ');
      return `Based on your current ingredients (${availableItems}), you could try making a simple stir-fry, fruit salad, or scrambled eggs. Would you like me to generate specific recipes for you?`;
    }
    
    if (messageLower.includes('expir') || messageLower.includes('soon')) {
      const expiringItems = foodItems.filter(item => {
        const expiryDate = new Date(item.expiry_date);
        const today = new Date();
        const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        return daysUntilExpiry <= 3;
      });
      
      if (expiringItems.length > 0) {
        const items = expiringItems.map(item => `${item.name} (expires ${item.expiry_date})`).join(', ');
        return `These items are expiring soon: ${items}. I recommend using them in your next meal!`;
      } else {
        return `Great news! All your items have several days before they expire. You have time to plan your meals.`;
      }
    }
    
    if (messageLower.includes('healthy')) {
      return `For healthy options, focus on your fresh produce like spinach and bananas. Try making a green smoothie or a fresh salad with your available ingredients!`;
    }
    
    if (messageLower.includes('waste')) {
      return `To reduce food waste, check expiration dates regularly, use expiring items first, and consider meal planning. Your current inventory looks well-managed!`;
    }
    
    return `I'm here to help with recipes, expiration tracking, and cooking tips! What would you like to know about your kitchen?`;
  }
}

export const kronosService = new KronosService();