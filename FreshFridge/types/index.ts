// Types for the FreshKeep app
export interface InventoryItem {
  id: string
  name: string
  category: string
  emoji: string
  expiryDate: string
  daysLeft: number
  isUrgent: boolean
}

export interface Recipe {
  id: string
  title: string
  subtitle: string
  emoji: string
  cookTime: string
  servings: string
  rating: number
  reviews: number
  calories: number
  ingredients: string[]
  instructions: string[]
}

export interface QuickStats {
  totalItems: number
  urgentItems: number
  weeklySavings: number
  recipesThisWeek: number
}

export interface ChartData {
  month: string
  waste?: number
  amount?: number
}
