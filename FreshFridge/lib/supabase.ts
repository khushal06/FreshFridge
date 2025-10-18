import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://sborzwebjgskeioexvuv.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNib3J6d2Viamdza2Vpb2V4dnV2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA3Mzc5NzUsImV4cCI6MjA3NjMxMzk3NX0.E5TWwl375VgeLrtZwQ41cR8a_FNABabQhJjeQFZJWaI'

// Create client for both client and server side
export const supabase = createClient(supabaseUrl, supabaseKey)

// Database types
export interface FoodItem {
  id: string
  name: string
  category: string
  emoji: string
  expiry_date: string
  quantity: number
  unit: string
  added_date: string
  image_url?: string
  confidence?: number
  notes?: string
  created_at?: string
  updated_at?: string
}

export interface Recipe {
  id: string
  title: string
  subtitle: string
  emoji: string
  cook_time: string
  servings: string
  rating: number
  reviews: number
  calories: number
  ingredients: string[]
  instructions: string[]
  category: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  created_at?: string
  updated_at?: string
}

export interface ChatMessage {
  id: string
  message: string
  is_user: boolean
  timestamp: string
  session_id: string
  created_at?: string
}

export interface GroceryLog {
  id: string
  store_name: string
  amount: number
  date: string
  created_at?: string
}
