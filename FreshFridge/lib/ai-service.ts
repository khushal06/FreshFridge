import { GoogleGenerativeAI } from '@google/generative-ai';
import OpenAI from 'openai';
import { FoodItem } from './supabase';

// Initialize AI services only on server side
const genAI = typeof window === 'undefined' ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '') : null;
const openai = typeof window === 'undefined' ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
}) : null;

// Clarifai configuration
const CLARIFAI_API_KEY = process.env.CLARIFAI_API_KEY || '03f36742dacd4a1086a5ca7f82f314fe';
const CLARIFAI_MODEL_ID = '1d5fd481e0cf4826aa72ec3ff049e044';

export interface FoodRecognitionResult {
  name: string;
  category: string;
  emoji: string;
  confidence: number;
  estimatedExpiryDays: number;
  suggestedQuantity?: number;
  suggestedUnit?: string;
}

export interface RecipeSuggestion {
  title: string;
  subtitle: string;
  emoji: string;
  cook_time: string;
  servings: string;
  ingredients: string[];
  instructions: string[];
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  rating: number;
  reviews: number;
  calories: number;
}

export interface ChatResponse {
  message: string;
  suggestions?: string[];
  actionItems?: string[];
}

class AIService {
  // Helper method to map food names to categories, emojis, and metadata
  private getFoodMapping(foodName: string): {
    name: string;
    category: string;
    emoji: string;
    expiryDays: number;
    quantity: number;
    unit: string;
  } {
    console.log(`🔍 getFoodMapping called with: "${foodName}"`);
    const foodMappings: { [key: string]: any } = {
      // Fruits - with multiple variations
      'apple': { name: 'Apple', category: 'Produce', emoji: '🍎', expiryDays: 7, quantity: 1, unit: 'piece' },
      'apples': { name: 'Apple', category: 'Produce', emoji: '🍎', expiryDays: 7, quantity: 1, unit: 'piece' },
      'banana': { name: 'Banana', category: 'Produce', emoji: '🍌', expiryDays: 5, quantity: 1, unit: 'piece' },
      'bananas': { name: 'Banana', category: 'Produce', emoji: '🍌', expiryDays: 5, quantity: 1, unit: 'piece' },
      'banana fruit': { name: 'Banana', category: 'Produce', emoji: '🍌', expiryDays: 5, quantity: 1, unit: 'piece' },
      'yellow fruit': { name: 'Banana', category: 'Produce', emoji: '🍌', expiryDays: 5, quantity: 1, unit: 'piece' },
      'orange': { name: 'Orange', category: 'Produce', emoji: '🍊', expiryDays: 7, quantity: 1, unit: 'piece' },
      'oranges': { name: 'Orange', category: 'Produce', emoji: '🍊', expiryDays: 7, quantity: 1, unit: 'piece' },
      'grape': { name: 'Grapes', category: 'Produce', emoji: '🍇', expiryDays: 7, quantity: 1, unit: 'bunch' },
      'grapes': { name: 'Grapes', category: 'Produce', emoji: '🍇', expiryDays: 7, quantity: 1, unit: 'bunch' },
      'strawberry': { name: 'Strawberries', category: 'Produce', emoji: '🍓', expiryDays: 3, quantity: 1, unit: 'container' },
      'strawberries': { name: 'Strawberries', category: 'Produce', emoji: '🍓', expiryDays: 3, quantity: 1, unit: 'container' },
      'blueberry': { name: 'Blueberries', category: 'Produce', emoji: '🫐', expiryDays: 7, quantity: 1, unit: 'container' },
      'blueberries': { name: 'Blueberries', category: 'Produce', emoji: '🫐', expiryDays: 7, quantity: 1, unit: 'container' },
      'cherry': { name: 'Cherries', category: 'Produce', emoji: '🍒', expiryDays: 7, quantity: 1, unit: 'container' },
      'cherries': { name: 'Cherries', category: 'Produce', emoji: '🍒', expiryDays: 7, quantity: 1, unit: 'container' },
      'peach': { name: 'Peach', category: 'Produce', emoji: '🍑', expiryDays: 5, quantity: 1, unit: 'piece' },
      'peaches': { name: 'Peach', category: 'Produce', emoji: '🍑', expiryDays: 5, quantity: 1, unit: 'piece' },
      'pear': { name: 'Pear', category: 'Produce', emoji: '🍐', expiryDays: 7, quantity: 1, unit: 'piece' },
      'pears': { name: 'Pear', category: 'Produce', emoji: '🍐', expiryDays: 7, quantity: 1, unit: 'piece' },
      'lemon': { name: 'Lemon', category: 'Produce', emoji: '🍋', expiryDays: 14, quantity: 1, unit: 'piece' },
      'lemons': { name: 'Lemon', category: 'Produce', emoji: '🍋', expiryDays: 14, quantity: 1, unit: 'piece' },
      'lime': { name: 'Lime', category: 'Produce', emoji: '🍋', expiryDays: 14, quantity: 1, unit: 'piece' },
      'limes': { name: 'Lime', category: 'Produce', emoji: '🍋', expiryDays: 14, quantity: 1, unit: 'piece' },
      'avocado': { name: 'Avocado', category: 'Produce', emoji: '🥑', expiryDays: 5, quantity: 1, unit: 'piece' },
      'avocados': { name: 'Avocado', category: 'Produce', emoji: '🥑', expiryDays: 5, quantity: 1, unit: 'piece' },
      
      // Vegetables
      'carrot': { name: 'Carrot', category: 'Produce', emoji: '🥕', expiryDays: 14, quantity: 1, unit: 'piece' },
      'carrots': { name: 'Carrot', category: 'Produce', emoji: '🥕', expiryDays: 14, quantity: 1, unit: 'piece' },
      'carrot vegetable': { name: 'Carrot', category: 'Produce', emoji: '🥕', expiryDays: 14, quantity: 1, unit: 'piece' },
      'orange vegetable': { name: 'Carrot', category: 'Produce', emoji: '🥕', expiryDays: 14, quantity: 1, unit: 'piece' },
      'root vegetable': { name: 'Carrot', category: 'Produce', emoji: '🥕', expiryDays: 14, quantity: 1, unit: 'piece' },
      'tomato': { name: 'Tomato', category: 'Produce', emoji: '🍅', expiryDays: 5, quantity: 1, unit: 'piece' },
      'tomatoes': { name: 'Tomato', category: 'Produce', emoji: '🍅', expiryDays: 5, quantity: 1, unit: 'piece' },
      'lettuce': { name: 'Lettuce', category: 'Produce', emoji: '🥬', expiryDays: 7, quantity: 1, unit: 'head' },
      'onion': { name: 'Onion', category: 'Produce', emoji: '🧅', expiryDays: 30, quantity: 1, unit: 'piece' },
      'onions': { name: 'Onion', category: 'Produce', emoji: '🧅', expiryDays: 30, quantity: 1, unit: 'piece' },
      'potato': { name: 'Potato', category: 'Produce', emoji: '🥔', expiryDays: 21, quantity: 1, unit: 'piece' },
      'potatoes': { name: 'Potato', category: 'Produce', emoji: '🥔', expiryDays: 21, quantity: 1, unit: 'piece' },
      'broccoli': { name: 'Broccoli', category: 'Produce', emoji: '🥦', expiryDays: 7, quantity: 1, unit: 'head' },
      'cucumber': { name: 'Cucumber', category: 'Produce', emoji: '🥒', expiryDays: 7, quantity: 1, unit: 'piece' },
      'cucumbers': { name: 'Cucumber', category: 'Produce', emoji: '🥒', expiryDays: 7, quantity: 1, unit: 'piece' },
      'pepper': { name: 'Bell Pepper', category: 'Produce', emoji: '🫑', expiryDays: 7, quantity: 1, unit: 'piece' },
      'peppers': { name: 'Bell Pepper', category: 'Produce', emoji: '🫑', expiryDays: 7, quantity: 1, unit: 'piece' },
      'bell pepper': { name: 'Bell Pepper', category: 'Produce', emoji: '🫑', expiryDays: 7, quantity: 1, unit: 'piece' },
      'corn': { name: 'Corn', category: 'Produce', emoji: '🌽', expiryDays: 5, quantity: 1, unit: 'ear' },
      'mushroom': { name: 'Mushrooms', category: 'Produce', emoji: '🍄', expiryDays: 5, quantity: 1, unit: 'container' },
      'mushrooms': { name: 'Mushrooms', category: 'Produce', emoji: '🍄', expiryDays: 5, quantity: 1, unit: 'container' },
      
      // Dairy
      'milk': { name: 'Milk', category: 'Dairy', emoji: '🥛', expiryDays: 7, quantity: 1, unit: 'carton' },
      'cheese': { name: 'Cheese', category: 'Dairy', emoji: '🧀', expiryDays: 14, quantity: 1, unit: 'block' },
      'yogurt': { name: 'Yogurt', category: 'Dairy', emoji: '🥛', expiryDays: 10, quantity: 1, unit: 'container' },
      'egg': { name: 'Eggs', category: 'Dairy', emoji: '🥚', expiryDays: 21, quantity: 12, unit: 'piece' },
      'eggs': { name: 'Eggs', category: 'Dairy', emoji: '🥚', expiryDays: 21, quantity: 12, unit: 'piece' },
      'butter': { name: 'Butter', category: 'Dairy', emoji: '🧈', expiryDays: 30, quantity: 1, unit: 'stick' },
      'cream': { name: 'Cream', category: 'Dairy', emoji: '🥛', expiryDays: 7, quantity: 1, unit: 'container' },
      
      // Protein
      'chicken': { name: 'Chicken', category: 'Protein', emoji: '🍗', expiryDays: 3, quantity: 1, unit: 'lb' },
      'beef': { name: 'Beef', category: 'Protein', emoji: '🥩', expiryDays: 3, quantity: 1, unit: 'lb' },
      'fish': { name: 'Fish', category: 'Protein', emoji: '🐟', expiryDays: 2, quantity: 1, unit: 'piece' },
      'pork': { name: 'Pork', category: 'Protein', emoji: '🥓', expiryDays: 3, quantity: 1, unit: 'lb' },
      'bacon': { name: 'Bacon', category: 'Protein', emoji: '🥓', expiryDays: 7, quantity: 1, unit: 'package' },
      'ham': { name: 'Ham', category: 'Protein', emoji: '🥩', expiryDays: 5, quantity: 1, unit: 'lb' },
      'turkey': { name: 'Turkey', category: 'Protein', emoji: '🦃', expiryDays: 3, quantity: 1, unit: 'lb' },
      'salmon': { name: 'Salmon', category: 'Protein', emoji: '🐟', expiryDays: 2, quantity: 1, unit: 'piece' },
      'tuna': { name: 'Tuna', category: 'Protein', emoji: '🐟', expiryDays: 2, quantity: 1, unit: 'can' },
      
      // Bread/Grains
      'bread': { name: 'Bread', category: 'Grains', emoji: '🍞', expiryDays: 7, quantity: 1, unit: 'loaf' },
      'rice': { name: 'Rice', category: 'Grains', emoji: '🍚', expiryDays: 365, quantity: 1, unit: 'bag' },
      'pasta': { name: 'Pasta', category: 'Grains', emoji: '🍝', expiryDays: 365, quantity: 1, unit: 'box' },
      'cereal': { name: 'Cereal', category: 'Grains', emoji: '🥣', expiryDays: 90, quantity: 1, unit: 'box' },
      'oats': { name: 'Oats', category: 'Grains', emoji: '🥣', expiryDays: 365, quantity: 1, unit: 'container' },
      'oatmeal': { name: 'Oatmeal', category: 'Grains', emoji: '🥣', expiryDays: 365, quantity: 1, unit: 'container' },
      
      // Drinks
      'water': { name: 'Water', category: 'Drinks', emoji: '💧', expiryDays: 365, quantity: 1, unit: 'bottle' },
      'juice': { name: 'Juice', category: 'Drinks', emoji: '🧃', expiryDays: 14, quantity: 1, unit: 'bottle' },
      'soda': { name: 'Soda', category: 'Drinks', emoji: '🥤', expiryDays: 365, quantity: 1, unit: 'can' },
      'coffee': { name: 'Coffee', category: 'Drinks', emoji: '☕', expiryDays: 365, quantity: 1, unit: 'bag' },
      'tea': { name: 'Tea', category: 'Drinks', emoji: '🍵', expiryDays: 365, quantity: 1, unit: 'box' },
      'wine': { name: 'Wine', category: 'Drinks', emoji: '🍷', expiryDays: 365, quantity: 1, unit: 'bottle' },
      'beer': { name: 'Beer', category: 'Drinks', emoji: '🍺', expiryDays: 365, quantity: 1, unit: 'bottle' },
      
      // Snacks & Sweets
      'chocolate': { name: 'Chocolate', category: 'Snacks', emoji: '🍫', expiryDays: 365, quantity: 1, unit: 'bar' },
      'cookies': { name: 'Cookies', category: 'Snacks', emoji: '🍪', expiryDays: 30, quantity: 1, unit: 'package' },
      'crackers': { name: 'Crackers', category: 'Snacks', emoji: '🍪', expiryDays: 90, quantity: 1, unit: 'box' },
      'chips': { name: 'Chips', category: 'Snacks', emoji: '🍟', expiryDays: 90, quantity: 1, unit: 'bag' },
      'nuts': { name: 'Nuts', category: 'Snacks', emoji: '🥜', expiryDays: 180, quantity: 1, unit: 'bag' },
      'popcorn': { name: 'Popcorn', category: 'Snacks', emoji: '🍿', expiryDays: 90, quantity: 1, unit: 'bag' },
      
      // Condiments & Sauces
      'ketchup': { name: 'Ketchup', category: 'Condiments', emoji: '🍅', expiryDays: 365, quantity: 1, unit: 'bottle' },
      'mustard': { name: 'Mustard', category: 'Condiments', emoji: '🌭', expiryDays: 365, quantity: 1, unit: 'bottle' },
      'mayo': { name: 'Mayonnaise', category: 'Condiments', emoji: '🥪', expiryDays: 90, quantity: 1, unit: 'jar' },
      'mayonnaise': { name: 'Mayonnaise', category: 'Condiments', emoji: '🥪', expiryDays: 90, quantity: 1, unit: 'jar' },
      'oil': { name: 'Cooking Oil', category: 'Condiments', emoji: '🫒', expiryDays: 365, quantity: 1, unit: 'bottle' },
      'vinegar': { name: 'Vinegar', category: 'Condiments', emoji: '🍶', expiryDays: 365, quantity: 1, unit: 'bottle' },
      
      // Frozen Foods
      'ice cream': { name: 'Ice Cream', category: 'Frozen', emoji: '🍦', expiryDays: 90, quantity: 1, unit: 'container' },
      'frozen pizza': { name: 'Frozen Pizza', category: 'Frozen', emoji: '🍕', expiryDays: 90, quantity: 1, unit: 'piece' },
      'frozen vegetables': { name: 'Frozen Vegetables', category: 'Frozen', emoji: '🥦', expiryDays: 365, quantity: 1, unit: 'bag' },
      
      // Pizza & Fast Food
      'pizza': { name: 'Pizza', category: 'Prepared', emoji: '🍕', expiryDays: 3, quantity: 1, unit: 'slice' },
      'sandwich': { name: 'Sandwich', category: 'Prepared', emoji: '🥪', expiryDays: 2, quantity: 1, unit: 'piece' },
      'burger': { name: 'Burger', category: 'Prepared', emoji: '🍔', expiryDays: 2, quantity: 1, unit: 'piece' },
    };

    // Try to find exact match first
    const normalizedName = foodName.toLowerCase().replace(/[^a-z]/g, '');
    console.log(`🔍 Normalized name: "${normalizedName}"`);
    if (foodMappings[normalizedName]) {
      console.log(`✅ Found exact match for "${normalizedName}"`);
      return foodMappings[normalizedName];
    }

    // Try to find partial matches
    for (const [key, mapping] of Object.entries(foodMappings)) {
      if (normalizedName.includes(key) || key.includes(normalizedName)) {
        console.log(`✅ Found partial match: "${normalizedName}" matches "${key}"`);
        return mapping;
      }
    }

    // Special case for common fruit variations
    if (normalizedName.includes('fruit') && normalizedName.includes('yellow')) {
      return { name: 'Banana', category: 'Produce', emoji: '🍌', expiryDays: 5, quantity: 1, unit: 'piece' };
    }
    
    if (normalizedName.includes('fruit') && normalizedName.includes('red')) {
      return { name: 'Apple', category: 'Produce', emoji: '🍎', expiryDays: 7, quantity: 1, unit: 'piece' };
    }
    
    // Special case for carrot variations
    if (normalizedName.includes('carrot') || normalizedName.includes('orange') && normalizedName.includes('vegetable')) {
      console.log(`🥕 Special carrot case matched for "${normalizedName}"`);
      return { name: 'Carrot', category: 'Produce', emoji: '🥕', expiryDays: 14, quantity: 1, unit: 'piece' };
    }

      // Try to guess category and emoji from common patterns
      const lowerName = foodName.toLowerCase();
      
      // Category-based fallbacks
      if (lowerName.includes('fruit') || lowerName.includes('berry')) {
        return { name: foodName.charAt(0).toUpperCase() + foodName.slice(1), category: 'Produce', emoji: '🍎', expiryDays: 7, quantity: 1, unit: 'piece' };
      }
      if (lowerName.includes('vegetable') || lowerName.includes('green') || lowerName.includes('leaf')) {
        return { name: foodName.charAt(0).toUpperCase() + foodName.slice(1), category: 'Produce', emoji: '🥬', expiryDays: 7, quantity: 1, unit: 'piece' };
      }
      if (lowerName.includes('meat') || lowerName.includes('chicken') || lowerName.includes('beef') || lowerName.includes('pork')) {
        return { name: foodName.charAt(0).toUpperCase() + foodName.slice(1), category: 'Protein', emoji: '🥩', expiryDays: 3, quantity: 1, unit: 'lb' };
      }
      if (lowerName.includes('dairy') || lowerName.includes('milk') || lowerName.includes('cheese')) {
        return { name: foodName.charAt(0).toUpperCase() + foodName.slice(1), category: 'Dairy', emoji: '🥛', expiryDays: 7, quantity: 1, unit: 'container' };
      }
      if (lowerName.includes('drink') || lowerName.includes('juice') || lowerName.includes('soda')) {
        return { name: foodName.charAt(0).toUpperCase() + foodName.slice(1), category: 'Drinks', emoji: '🧃', expiryDays: 14, quantity: 1, unit: 'bottle' };
      }
      if (lowerName.includes('bread') || lowerName.includes('grain') || lowerName.includes('cereal')) {
        return { name: foodName.charAt(0).toUpperCase() + foodName.slice(1), category: 'Grains', emoji: '🍞', expiryDays: 7, quantity: 1, unit: 'piece' };
      }
      if (lowerName.includes('snack') || lowerName.includes('chips') || lowerName.includes('cookies')) {
        return { name: foodName.charAt(0).toUpperCase() + foodName.slice(1), category: 'Snacks', emoji: '🍪', expiryDays: 30, quantity: 1, unit: 'package' };
      }
      
      // Default fallback
      console.log(`⚠️ Using default fallback for "${foodName}"`);
      return {
        name: foodName.charAt(0).toUpperCase() + foodName.slice(1),
        category: 'Other',
        emoji: '🥘',
        expiryDays: 7,
        quantity: 1,
        unit: 'piece'
      };
  }

  // Food recognition using Clarifai Food API
  async recognizeFoodFromImage(imageData: string): Promise<FoodRecognitionResult[]> {
    try {
      if (typeof window !== 'undefined') {
        console.error('Clarifai API can only be called on server side');
        // Fallback to mock data for client side
        return [
          {
            name: "Apple",
            category: "Produce",
            emoji: "🍎",
            confidence: 0.85,
            estimatedExpiryDays: 7,
            suggestedQuantity: 1,
            suggestedUnit: "piece"
          },
          {
            name: "Banana",
            category: "Produce", 
            emoji: "🍌",
            confidence: 0.80,
            estimatedExpiryDays: 5,
            suggestedQuantity: 1,
            suggestedUnit: "piece"
          },
          {
            name: "Milk",
            category: "Dairy",
            emoji: "🥛",
            confidence: 0.90,
            estimatedExpiryDays: 3,
            suggestedQuantity: 1,
            suggestedUnit: "carton"
          }
        ];
      }

      console.log('🍎 Using Clarifai Food API for food recognition...');
      
      // Call Clarifai REST API
      const response = await fetch(`https://api.clarifai.com/v2/users/clarifai/apps/main/models/food-item-recognition/versions/${CLARIFAI_MODEL_ID}/outputs`, {
        method: 'POST',
        headers: {
          'Authorization': `Key ${CLARIFAI_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          inputs: [
            {
              data: {
                image: {
                  base64: imageData
                }
              }
            }
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`Clarifai API error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      
      if (result.status.code !== 10000) {
        throw new Error(`Clarifai API error: ${result.status.description}`);
      }

      const concepts = result.outputs[0].data.concepts;
      console.log('🔍 Clarifai detected concepts:', concepts.slice(0, 10));
      console.log('🍌 Looking for banana-related concepts:', concepts.filter(c => 
        c.name.toLowerCase().includes('banana') || 
        c.name.toLowerCase().includes('fruit') ||
        c.name.toLowerCase().includes('yellow')
      ));

      // Convert Clarifai concepts to our food recognition format
      const foodItems: FoodRecognitionResult[] = concepts
        .filter(concept => concept.value > 0.5) // Lower threshold to catch more items
        .slice(0, 5) // Limit to top 5 items
        .map(concept => {
          const foodName = concept.name;
          const confidence = concept.value;
          
          console.log(`🔍 Processing concept: "${foodName}" with confidence ${confidence}`);
          
          // Map food names to categories and emojis
          const foodMapping = this.getFoodMapping(foodName);
          
          console.log(`📋 Mapped "${foodName}" to:`, foodMapping);
          
          return {
            name: foodMapping.name,
            category: foodMapping.category,
            emoji: foodMapping.emoji,
            confidence: confidence,
            estimatedExpiryDays: foodMapping.expiryDays,
            suggestedQuantity: foodMapping.quantity,
            suggestedUnit: foodMapping.unit
          };
        });

      console.log('✅ Clarifai food recognition results:', foodItems);
      return foodItems;

    } catch (error) {
      console.error('❌ Clarifai food recognition error:', error);
      // Fallback to mock data on error
      return [
        {
          name: "Apple",
          category: "Produce",
          emoji: "🍎",
          confidence: 0.85,
          estimatedExpiryDays: 7,
          suggestedQuantity: 1,
          suggestedUnit: "piece"
        },
        {
          name: "Banana",
          category: "Produce", 
          emoji: "🍌",
          confidence: 0.80,
          estimatedExpiryDays: 5,
          suggestedQuantity: 1,
          suggestedUnit: "piece"
        },
        {
          name: "Milk",
          category: "Dairy",
          emoji: "🥛",
          confidence: 0.90,
          estimatedExpiryDays: 3,
          suggestedQuantity: 1,
          suggestedUnit: "carton"
        }
      ];
    }
  }

  // Recipe suggestions based on available ingredients
  async suggestRecipes(availableItems: FoodItem[]): Promise<RecipeSuggestion[]> {
    try {
      if (!genAI) {
        console.error('Gemini AI not initialized - running on client side');
        return [];
      }
      
      const itemNames = availableItems.map(item => `${item.name} (${item.quantity} ${item.unit})`).join(', ');
      
      const prompt = `
        Based on these available ingredients: ${itemNames}
        
        Suggest 3-5 recipes that can be made with these ingredients. For each recipe, provide:
        
        1. Title and subtitle
        2. Appropriate emoji
        3. Cook time
        4. Number of servings
        5. List of ingredients (use available items + common pantry staples)
        6. Step-by-step instructions
        7. Category (Breakfast, Lunch, Dinner, Snack, Dessert)
        8. Difficulty level (Easy, Medium, Hard)
        9. Estimated rating (4.0-5.0)
        10. Estimated review count (50-500)
        11. Estimated calories per serving
        
        Return as JSON array with exact field names:
        [
          {
            "title": "string",
            "subtitle": "string",
            "emoji": "string", 
            "cook_time": "string",
            "servings": "string",
            "ingredients": ["string"],
            "instructions": ["string"],
            "category": "string",
            "difficulty": "Easy|Medium|Hard",
            "rating": number,
            "reviews": number,
            "calories": number
          }
        ]
      `;

      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      throw new Error('Failed to parse recipe suggestions');
    } catch (error) {
      console.error('Recipe suggestion error:', error);
      return [];
    }
  }

  // Chat with AI about inventory
  async chatWithAI(message: string, availableItems: FoodItem[], recentMessages: string[] = []): Promise<ChatResponse> {
    try {
      if (!genAI) {
        console.error('Gemini AI not initialized - running on client side');
        return {
          message: "AI service is not available on the client side. Please use the server-side API.",
          suggestions: [],
          actionItems: []
        };
      }
      
      const context = `
        You are a helpful kitchen assistant for FreshKeep, a smart fridge management app.
        
        Current inventory:
        ${availableItems.map(item => `- ${item.name} (${item.quantity} ${item.unit}) - Expires: ${item.expiry_date}`).join('\n')}
        
        Recent conversation:
        ${recentMessages.slice(-5).join('\n')}
        
        User question: ${message}
        
        Provide a helpful response about the user's inventory, recipe suggestions, food safety, or general kitchen advice.
        If the user asks about recipes, suggest specific dishes they can make with their available ingredients.
        If they ask about expiration, highlight items that need attention.
        Be conversational, helpful, and practical.
        
        Also provide:
        1. Up to 3 relevant suggestions (e.g., "Try making a smoothie with your bananas")
        2. Up to 3 action items (e.g., "Use your milk before it expires tomorrow")
        
        Respond in a friendly, helpful tone as a kitchen assistant.
      `;

      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const result = await model.generateContent(context);
      const response = await result.response;
      const text = response.text();
      
      // Parse response to extract suggestions and action items
      const suggestions = [];
      const actionItems = [];
      
      // Simple parsing - in a real app, you might want more sophisticated parsing
      const lines = text.split('\n');
      for (const line of lines) {
        if (line.includes('suggestion:') || line.includes('try:')) {
          suggestions.push(line.replace(/.*suggestion:|.*try:/i, '').trim());
        }
        if (line.includes('action:') || line.includes('do:')) {
          actionItems.push(line.replace(/.*action:|.*do:/i, '').trim());
        }
      }
      
      return {
        message: text,
        suggestions: suggestions.slice(0, 3),
        actionItems: actionItems.slice(0, 3),
      };
    } catch (error) {
      console.error('Chat AI error:', error);
      return {
        message: "I'm sorry, I'm having trouble processing your request right now. Please try again later.",
        suggestions: [],
        actionItems: [],
      };
    }
  }

  // Alternative OpenAI implementation
  async chatWithOpenAI(message: string, availableItems: FoodItem[]): Promise<ChatResponse> {
    try {
      if (!openai) {
        console.error('OpenAI not initialized - running on client side');
        return {
          message: "AI service is not available on the client side. Please use the server-side API.",
          suggestions: [],
          actionItems: []
        };
      }
      
      const context = `
        You are a helpful kitchen assistant for FreshKeep. User's inventory: ${availableItems.map(item => `${item.name} (${item.quantity} ${item.unit})`).join(', ')}
        
        User question: ${message}
        
        Provide a helpful, conversational response about their inventory, recipes, or kitchen advice.
      `;

      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a helpful kitchen assistant for FreshKeep." },
          { role: "user", content: context }
        ],
        max_tokens: 500,
      });

      return {
        message: completion.choices[0].message.content || "I'm sorry, I couldn't process your request.",
        suggestions: [],
        actionItems: [],
      };
    } catch (error) {
      console.error('OpenAI chat error:', error);
      return {
        message: "I'm sorry, I'm having trouble processing your request right now.",
        suggestions: [],
        actionItems: [],
      };
    }
  }
}

export const aiService = new AIService();
