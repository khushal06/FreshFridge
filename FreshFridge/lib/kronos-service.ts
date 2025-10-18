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

      // Create inventory list for the prompt
      const inventoryList = foodItems.map(item => 
        `${item.name} (${item.quantity} ${item.unit})`
      ).join(', ');

      const prompt = `
You are a professional chef and nutritionist. Based on these available ingredients in my kitchen:

${inventoryList}

Generate 3 creative, delicious, and practical recipes that I can make with these ingredients. For each recipe, provide:

1. Title and subtitle
2. Appropriate emoji
3. Cook time in minutes
4. Number of servings
5. List of ingredients (use available items + common pantry staples like salt, pepper, oil, etc.)
6. Step-by-step cooking instructions
7. Category (Breakfast, Lunch, Dinner, Snack, Dessert)
8. Difficulty level (Easy, Medium, Hard)
9. Estimated rating (4.0-5.0)
10. Estimated review count (50-500)
11. Estimated calories per serving
12. Brief description

Format the response as JSON with this structure:
{
  "recipes": [
    {
      "title": "Recipe Title",
      "subtitle": "Brief subtitle",
      "emoji": "🍳",
      "cookTime": 20,
      "servings": 4,
      "ingredients": ["ingredient 1", "ingredient 2"],
      "instructions": ["step 1", "step 2"],
      "category": "Dinner",
      "difficulty": "Easy",
      "rating": 4.5,
      "reviewCount": 127,
      "calories": 320,
      "description": "Brief description"
    }
  ]
}

Make sure the recipes are practical, delicious, and use the available ingredients creatively.
`;

      // Use fetch to call KronosAI API (since we can't use the Python client in Node.js)
      const response = await fetch('https://api.kronoslabs.ai/v1/chat/completions', {
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

      // Parse the JSON response
      try {
        const parsed = JSON.parse(content);
        const recipes = parsed.recipes || [];
        
        console.log('✅ Generated recipes with KronosAI:', recipes);
        return recipes.map((recipe: any) => ({
          title: recipe.title || 'Untitled Recipe',
          subtitle: recipe.subtitle || 'Delicious recipe',
          emoji: recipe.emoji || '🍳',
          cookTime: recipe.cookTime || 30,
          servings: recipe.servings || 4,
          ingredients: recipe.ingredients || [],
          instructions: recipe.instructions || [],
          category: recipe.category || 'Dinner',
          difficulty: recipe.difficulty || 'Medium',
          rating: recipe.rating || 4.5,
          reviewCount: recipe.reviewCount || 100,
          calories: recipe.calories || 300,
          description: recipe.description || 'A delicious recipe'
        }));
      } catch (parseError) {
        console.error('Error parsing KronosAI response:', parseError);
        return this.getFallbackRecipes(foodItems);
      }

    } catch (error) {
      console.error('❌ KronosAI recipe generation error:', error);
      return this.getFallbackRecipes(foodItems);
    }
  }

  private getFallbackRecipes(foodItems: FoodItem[]): KronosRecipe[] {
    console.log('🔄 Using fallback recipes');
    
    const itemNames = foodItems.map(item => item.name.toLowerCase()).join(', ');
    
    // Generate fallback recipes based on available ingredients
    const fallbackRecipes: KronosRecipe[] = [];

    // Recipe 1: Simple stir-fry if we have vegetables
    if (itemNames.includes('carrot') || itemNames.includes('onion') || itemNames.includes('tomato')) {
      fallbackRecipes.push({
        title: 'Quick Vegetable Stir-Fry',
        subtitle: 'Fresh and healthy in minutes',
        emoji: '🥬',
        cookTime: 15,
        servings: 2,
        ingredients: [
          '2 carrots, sliced',
          '1 onion, chopped',
          '2 tomatoes, diced',
          '2 tbsp olive oil',
          'Salt and pepper to taste',
          '1 tsp garlic powder'
        ],
        instructions: [
          'Heat oil in a large pan over medium heat',
          'Add onions and cook until translucent',
          'Add carrots and cook for 3-4 minutes',
          'Add tomatoes and cook for 2-3 minutes',
          'Season with salt, pepper, and garlic powder',
          'Serve hot'
        ],
        category: 'Dinner',
        difficulty: 'Easy',
        rating: 4.3,
        reviewCount: 89,
        calories: 180,
        description: 'A quick and healthy vegetable stir-fry perfect for busy weeknights.'
      });
    }

    // Recipe 2: Simple fruit salad if we have fruits
    if (itemNames.includes('apple') || itemNames.includes('banana') || itemNames.includes('orange')) {
      fallbackRecipes.push({
        title: 'Fresh Fruit Salad',
        subtitle: 'Sweet and refreshing',
        emoji: '🍎',
        cookTime: 10,
        servings: 4,
        ingredients: [
          '2 apples, diced',
          '2 bananas, sliced',
          '1 orange, segmented',
          '1 tbsp honey',
          '1 tsp lemon juice',
          'Mint leaves for garnish'
        ],
        instructions: [
          'Wash and prepare all fruits',
          'Dice apples and slice bananas',
          'Segment the orange',
          'Combine all fruits in a bowl',
          'Drizzle with honey and lemon juice',
          'Garnish with mint leaves and serve'
        ],
        category: 'Snack',
        difficulty: 'Easy',
        rating: 4.7,
        reviewCount: 156,
        calories: 120,
        description: 'A refreshing fruit salad that celebrates the natural sweetness of fresh fruits.'
      });
    }

    // Recipe 3: Simple sandwich if we have bread and basic ingredients
    if (itemNames.includes('bread')) {
      fallbackRecipes.push({
        title: 'Classic Sandwich',
        subtitle: 'Simple and satisfying',
        emoji: '🥪',
        cookTime: 5,
        servings: 1,
        ingredients: [
          '2 slices of bread',
          'Lettuce leaves',
          'Tomato slices',
          'Cheese (optional)',
          'Mayonnaise or mustard',
          'Salt and pepper'
        ],
        instructions: [
          'Lay out two slices of bread',
          'Spread mayonnaise or mustard on both slices',
          'Add lettuce, tomato, and cheese',
          'Season with salt and pepper',
          'Close the sandwich and cut in half',
          'Serve immediately'
        ],
        category: 'Lunch',
        difficulty: 'Easy',
        rating: 4.2,
        reviewCount: 234,
        calories: 280,
        description: 'A classic sandwich that never goes out of style.'
      });
    }

    return fallbackRecipes.length > 0 ? fallbackRecipes : [{
      title: 'Simple Meal',
      subtitle: 'Make the most of your ingredients',
      emoji: '🍽️',
      cookTime: 20,
      servings: 2,
      ingredients: ['Available ingredients', 'Salt and pepper', 'Cooking oil'],
      instructions: [
        'Prepare your available ingredients',
        'Season with salt and pepper',
        'Cook using your preferred method',
        'Serve and enjoy'
      ],
      category: 'Dinner',
      difficulty: 'Easy',
      rating: 4.0,
      reviewCount: 50,
      calories: 250,
      description: 'A simple meal using your available ingredients.'
    }];
  }
}

export const kronosService = new KronosService();
