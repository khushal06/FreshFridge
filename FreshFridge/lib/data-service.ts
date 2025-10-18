import { supabaseService } from './supabase-service'
import { FoodItem, Recipe, GroceryLog } from './supabase'
import { aiService } from './ai-service'
import { kronosService, KronosRecipe } from './kronos-service'

export interface QuickStats {
  totalItems: number
  urgentItems: number
  weeklySavings: number
  recipesThisWeek: number
}

class DataService {
  // Food Items
  async getFoodItems(): Promise<FoodItem[]> {
    return await supabaseService.getAllFoodItems()
  }

  async addFoodItem(item: Omit<FoodItem, 'id' | 'added_date' | 'created_at' | 'updated_at'>): Promise<FoodItem | null> {
    return await supabaseService.addFoodItem(item)
  }

  async updateFoodItem(id: string, updates: Partial<FoodItem>): Promise<FoodItem | null> {
    return await supabaseService.updateFoodItem(id, updates)
  }

  async deleteFoodItem(id: string): Promise<boolean> {
    return await supabaseService.deleteFoodItem(id)
  }

  // Recipes
  async getRecipes(): Promise<Recipe[]> {
    return await supabaseService.getAllRecipes()
  }

  async generateRecipeSuggestions(availableItems: FoodItem[]): Promise<Recipe[]> {
    try {
      // Only use AI on server side
      if (typeof window !== 'undefined') {
        console.log('AI recipe generation not available on client side')
        return []
      }
      
      const suggestions = await aiService.suggestRecipes(availableItems)
      
      // Save suggested recipes to Supabase
      const savedRecipes = []
      for (const recipe of suggestions) {
        const savedRecipe = await supabaseService.addRecipe(recipe)
        if (savedRecipe) savedRecipes.push(savedRecipe)
      }
      
      return savedRecipes
    } catch (error) {
      console.error('Error generating recipe suggestions:', error)
      return []
    }
  }

  // Generate AI recipes using KronosAI
  async generateAIRecipes(): Promise<KronosRecipe[]> {
    try {
      if (typeof window !== 'undefined') {
        console.error('KronosAI service can only be called on server side');
        return [];
      }
      
      const availableItems = await this.getFoodItems()
      console.log('🍳 Generating AI recipes for inventory:', availableItems)
      
      const aiRecipes = await kronosService.generateRecipesFromInventory(availableItems)
      
      // Convert KronosRecipe to Recipe format and save to database
      const recipes: Recipe[] = aiRecipes.map(kronosRecipe => ({
        id: '', // Will be set by Supabase
        title: kronosRecipe.title,
        subtitle: kronosRecipe.subtitle,
        emoji: kronosRecipe.emoji,
        cook_time: kronosRecipe.cookTime,
        servings: kronosRecipe.servings,
        ingredients: kronosRecipe.ingredients.join('\n'),
        instructions: kronosRecipe.instructions.join('\n'),
        category: kronosRecipe.category,
        difficulty: kronosRecipe.difficulty,
        rating: kronosRecipe.rating,
        review_count: kronosRecipe.reviewCount,
        calories: kronosRecipe.calories,
        description: kronosRecipe.description,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }));

      // Save recipes to database
      for (const recipe of recipes) {
        await supabaseService.addRecipe(recipe)
      }
      
      console.log('✅ Generated and saved AI recipes:', recipes.length)
      return aiRecipes
    } catch (error) {
      console.error('Error generating AI recipes:', error)
      return []
    }
  }

  // Grocery Logs
  async addGroceryLog(storeName: string, amount: number, date?: string): Promise<GroceryLog | null> {
    const logDate = date || new Date().toISOString().split('T')[0]
    return await supabaseService.addGroceryLog({
      store_name: storeName,
      amount,
      date: logDate,
    })
  }

  async getGroceryLogs(startDate?: string, endDate?: string): Promise<GroceryLog[]> {
    return await supabaseService.getGroceryLogs(startDate, endDate)
  }

  async getMonthlySpending(): Promise<{ month: string; amount: number }[]> {
    return await supabaseService.getMonthlySpending()
  }

  async getCurrentMonthSpending(): Promise<number> {
    return await supabaseService.getCurrentMonthSpending()
  }

  // Stats
  async getStats(): Promise<QuickStats> {
    return await supabaseService.getStats()
  }

  // Chat
  async sendChatMessage(message: string, sessionId?: string): Promise<any> {
    try {
      // Only use AI on server side
      if (typeof window !== 'undefined') {
        console.log('AI chat not available on client side')
        return {
          message: "AI chat is not available on the client side. Please use the server-side API.",
          suggestions: [],
          actionItems: []
        }
      }
      
      // Save user message
      if (sessionId) {
        await supabaseService.addChatMessage({
          message,
          is_user: true,
          timestamp: new Date().toISOString(),
          session_id: sessionId,
        })
      }

      // Get available food items for context
      const availableItems = await this.getFoodItems()
      
      // Get recent chat history for context
      const chatHistory = sessionId ? await supabaseService.getChatHistory(sessionId) : []
      const recentMessages = chatHistory.slice(-10).map(msg => 
        `${msg.is_user ? 'User' : 'Assistant'}: ${msg.message}`
      )

      // Get AI response
      const aiResponse = await aiService.chatWithAI(message, availableItems, recentMessages)
      
      // Save AI response
      if (sessionId) {
        await supabaseService.addChatMessage({
          message: aiResponse.message,
          is_user: false,
          timestamp: new Date().toISOString(),
          session_id: sessionId,
        })
      }

      return {
        response: aiResponse,
        sessionId: sessionId || 'default',
      }
    } catch (error) {
      console.error('Error sending chat message:', error)
      return null
    }
  }
}

export const dataService = new DataService()
