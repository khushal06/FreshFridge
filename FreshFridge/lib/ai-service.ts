import { GoogleGenerativeAI } from '@google/generative-ai';
import OpenAI from 'openai';
import { FoodItem } from './supabase';

// Initialize AI services only on server side
const genAI = typeof window === 'undefined' ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '') : null;
const openai = typeof window === 'undefined' ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
}) : null;

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
  // Food recognition using Gemini Vision
  async recognizeFoodFromImage(imageData: string): Promise<FoodRecognitionResult[]> {
    try {
      // Temporarily use fallback data while fixing Gemini API
      console.log('Using fallback mock data for food recognition (Gemini API not working)');
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
    } catch (error) {
      console.error('Food recognition error:', error);
      return [];
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
