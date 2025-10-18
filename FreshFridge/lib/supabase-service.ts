import { supabase, FoodItem, Recipe, ChatMessage, GroceryLog } from './supabase'
import { v4 as uuidv4 } from 'uuid'

class SupabaseService {
  // Food Items CRUD operations
  async addFoodItem(item: Omit<FoodItem, 'id' | 'added_date' | 'created_at' | 'updated_at'>): Promise<FoodItem | null> {
    try {
      
      const id = uuidv4()
      const addedDate = new Date().toISOString().split('T')[0]
      
      const { data, error } = await supabase
        .from('food_items')
        .insert({
          id,
          name: item.name,
          category: item.category,
          emoji: item.emoji,
          expiry_date: item.expiry_date,
          quantity: item.quantity,
          unit: item.unit,
          added_date: addedDate,
          image_url: item.image_url,
          confidence: item.confidence,
          notes: item.notes,
        })
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error adding food item:', error)
      return null
    }
  }

  async getFoodItem(id: string): Promise<FoodItem | null> {
    try {
      const { data, error } = await supabase
        .from('food_items')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching food item:', error)
      return null
    }
  }

  async getAllFoodItems(): Promise<FoodItem[]> {
    try {
      
      const { data, error } = await supabase
        .from('food_items')
        .select('*')
        .order('expiry_date', { ascending: true })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching food items:', error)
      return []
    }
  }

  async updateFoodItem(id: string, updates: Partial<FoodItem>): Promise<FoodItem | null> {
    try {
      const { data, error } = await supabase
        .from('food_items')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error updating food item:', error)
      return null
    }
  }

  async deleteFoodItem(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('food_items')
        .delete()
        .eq('id', id)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error deleting food item:', error)
      return false
    }
  }

  async getExpiringItems(days: number = 3): Promise<FoodItem[]> {
    try {
      const futureDate = new Date()
      futureDate.setDate(futureDate.getDate() + days)
      const futureDateStr = futureDate.toISOString().split('T')[0]

      const { data, error } = await supabase
        .from('food_items')
        .select('*')
        .lte('expiry_date', futureDateStr)
        .order('expiry_date', { ascending: true })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching expiring items:', error)
      return []
    }
  }

  // Recipe operations
  async addRecipe(recipe: Omit<Recipe, 'id' | 'created_at' | 'updated_at'>): Promise<Recipe | null> {
    try {
      const id = uuidv4()
      
      const { data, error } = await supabase
        .from('recipes')
        .insert({
          id,
          title: recipe.title,
          subtitle: recipe.subtitle,
          emoji: recipe.emoji,
          cook_time: recipe.cook_time,
          servings: recipe.servings,
          rating: recipe.rating,
          reviews: recipe.reviews,
          calories: recipe.calories,
          ingredients: recipe.ingredients,
          instructions: recipe.instructions,
          category: recipe.category,
          difficulty: recipe.difficulty,
        })
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error adding recipe:', error)
      return null
    }
  }

  async getRecipe(id: string): Promise<Recipe | null> {
    try {
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching recipe:', error)
      return null
    }
  }

  async getAllRecipes(): Promise<Recipe[]> {
    try {
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .order('rating', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching recipes:', error)
      return []
    }
  }

  // Chat operations
  async addChatMessage(message: Omit<ChatMessage, 'id' | 'created_at'>): Promise<ChatMessage | null> {
    try {
      const id = uuidv4()
      
      const { data, error } = await supabase
        .from('chat_messages')
        .insert({
          id,
          message: message.message,
          is_user: message.is_user,
          timestamp: message.timestamp,
          session_id: message.session_id,
        })
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error adding chat message:', error)
      return null
    }
  }

  async getChatHistory(sessionId: string): Promise<ChatMessage[]> {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('timestamp', { ascending: true })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching chat history:', error)
      return []
    }
  }

  // Grocery Log operations
  async addGroceryLog(log: Omit<GroceryLog, 'id' | 'created_at'>): Promise<GroceryLog | null> {
    try {
      
      const id = uuidv4()
      const { data, error } = await supabase
        .from('grocery_logs')
        .insert({
          id,
          store_name: log.store_name,
          amount: log.amount,
          date: log.date,
        })
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error adding grocery log:', error)
      return null
    }
  }

  async getGroceryLogs(startDate?: string, endDate?: string): Promise<GroceryLog[]> {
    try {
      
      let query = supabase
        .from('grocery_logs')
        .select('*')
        .order('date', { ascending: false })

      if (startDate) {
        query = query.gte('date', startDate)
      }
      
      if (endDate) {
        query = query.lte('date', endDate)
      }

      const { data, error } = await query

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching grocery logs:', error)
      return []
    }
  }

  async getMonthlySpending(): Promise<{ month: string; amount: number }[]> {
    try {
      
      const { data, error } = await supabase
        .from('grocery_logs')
        .select('date, amount')
        .order('date', { ascending: true })

      if (error) throw error

      // Group by month and sum amounts
      const monthlyData: { [key: string]: number } = {}
      
      data?.forEach(log => {
        const month = new Date(log.date).toISOString().slice(0, 7) // YYYY-MM format
        monthlyData[month] = (monthlyData[month] || 0) + log.amount
      })

      // Convert to array format
      const result = Object.entries(monthlyData).map(([month, amount]) => ({
        month: new Date(month + '-01').toLocaleDateString('en-US', { month: 'short' }),
        amount
      }))

      return result
    } catch (error) {
      console.error('Error fetching monthly spending:', error)
      return []
    }
  }

  async getCurrentMonthSpending(): Promise<number> {
    try {
      
      const now = new Date()
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0]
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0]
      
      const { data, error } = await supabase
        .from('grocery_logs')
        .select('amount')
        .gte('date', startOfMonth)
        .lte('date', endOfMonth)

      if (error) throw error

      const total = data?.reduce((sum, log) => sum + log.amount, 0) || 0
      return total
    } catch (error) {
      console.error('Error fetching current month spending:', error)
      return 0
    }
  }

  // Utility methods
  async getStats() {
    try {
      
      const [totalResult, urgentResult] = await Promise.all([
        supabase.from('food_items').select('id', { count: 'exact' }),
        supabase
          .from('food_items')
          .select('id', { count: 'exact' })
          .lte('expiry_date', new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split(' clearly')[0])
      ])

      const totalItems = totalResult.count || 0
      const urgentItems = urgentResult.count || 0

      return {
        totalItems,
        urgentItems,
        weeklySavings: urgentItems * 5, // Estimated $5 saved per item used before expiry
        recipesThisWeek: Math.floor(Math.random() * 10) + 5, // Mock data for now
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
      return {
        totalItems: 0,
        urgentItems: 0,
        weeklySavings: 0,
        recipesThisWeek: 0,
      }
    }
  }
}

export const supabaseService = new SupabaseService()
