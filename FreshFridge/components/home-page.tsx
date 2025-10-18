"use client"

import { useState, useEffect } from "react"
import { Package, Clock, ChefHat, TrendingUp, Plus, AlertTriangle, ShoppingCart } from "lucide-react"
import { dataService } from "@/lib/data-service"
import { FoodItem } from "@/lib/supabase"
import LogGroceries from "./log-groceries"

interface HomePageProps {
  onScanFridge?: () => void
}

export default function HomePage({ onScanFridge }: HomePageProps) {
  const [recentItems, setRecentItems] = useState<FoodItem[]>([])
  const [quickStats, setQuickStats] = useState({
    totalItems: 0,
    urgentItems: 0,
    weeklySavings: 0,
    recipesThisWeek: 0,
  })
  const [loading, setLoading] = useState(true)
  const [showLogGroceries, setShowLogGroceries] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      try {
        const [items, stats] = await Promise.all([
          dataService.getFoodItems(),
          dataService.getStats()
        ])
        
        setRecentItems(items.slice(0, 4)) // Show first 4 items
        setQuickStats(stats)
      } catch (error) {
        console.error('Error loading data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const handleGroceryLogged = async () => {
    // Refresh stats after logging groceries
    try {
      console.log('🛒 Groceries logged, refreshing home page stats...')
      const stats = await dataService.getStats()
      setQuickStats(stats)
      
      // Dispatch custom event to notify other components
      console.log('📡 Dispatching groceryLogged event...')
      window.dispatchEvent(new CustomEvent('groceryLogged'))
    } catch (error) {
      console.error('Error refreshing stats:', error)
    }
  }

  const getDaysLeft = (expiryDate: string) => {
    const today = new Date()
    const expiry = new Date(expiryDate)
    const diffTime = expiry.getTime() - today.getTime()
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  const isUrgent = (daysLeft: number) => daysLeft <= 2

  return (
    <div className="space-y-12 px-8 lg:px-16">
      <div className="pt-24 pb-16">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
          <div>
            <h1 className="text-[57px] font-bold text-black mb-3 leading-[1.1] tracking-[-0.03em]">Welcome back!</h1>
            <p className="text-[#737373] text-[17px] leading-relaxed">Here&apos;s what&apos;s happening in your kitchen</p>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={onScanFridge}
              className="flex items-center px-6 py-3 bg-white border border-[rgba(0,0,0,0.06)] rounded-xl hover:bg-[#FAFAFA] transition-all duration-200 text-[15px] font-medium shadow-subtle"
            >
              <Plus className="w-4 h-4 mr-3" />
              Scan Item
            </button>
            <button 
              onClick={() => setShowLogGroceries(true)}
              className="flex items-center px-6 py-3 bg-white border border-[rgba(0,0,0,0.06)] rounded-xl hover:bg-[#FAFAFA] transition-all duration-200 text-[15px] font-medium shadow-subtle"
            >
              <ShoppingCart className="w-4 h-4 mr-3" />
              Log Groceries
            </button>
            <button className="flex items-center px-6 py-3 bg-black text-white rounded-xl shadow-subtle hover-lift-small transition-all duration-200 text-[15px] font-medium">
              <ChefHat className="w-4 h-4 mr-3" />
              Find Recipe
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="bg-white rounded-2xl p-8 text-center shadow-subtle hover-lift transition-all duration-300">
          <div className="text-[56px] font-semibold text-black mb-2 leading-none tracking-[-0.03em] font-mono animate-count-up">
            {quickStats.totalItems}
          </div>
          <div className="text-[14px] text-[#737373] uppercase tracking-[0.1em] font-medium mb-3">Total Items</div>
          <div className="flex items-center justify-center text-xs text-[#10B981] font-medium">
            <TrendingUp className="w-3 h-3 mr-1" />
            +2 this week
          </div>
        </div>

        <div className="bg-white rounded-2xl p-8 text-center shadow-subtle hover-lift transition-all duration-300">
          <div className="text-[56px] font-semibold text-black mb-2 leading-none tracking-[-0.03em] font-mono animate-count-up">
            {quickStats.urgentItems}
          </div>
          <div className="text-[14px] text-[#737373] uppercase tracking-[0.1em] font-medium mb-3">Use Soon</div>
          <div className="flex items-center justify-center text-xs text-[#EF4444] font-medium">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Needs attention
          </div>
        </div>

        <div className="bg-white rounded-2xl p-8 text-center shadow-subtle hover-lift transition-all duration-300">
          <div className="text-[56px] font-semibold text-black mb-2 leading-none tracking-[-0.03em] font-mono animate-count-up">
            ${quickStats.weeklySavings}
          </div>
          <div className="text-[14px] text-[#737373] uppercase tracking-[0.1em] font-medium mb-3">Saved This Week</div>
          <div className="flex items-center justify-center text-xs text-[#10B981] font-medium">
            <TrendingUp className="w-3 h-3 mr-1" />
            +12% from last week
          </div>
        </div>

        <div className="bg-white rounded-2xl p-8 text-center shadow-subtle hover-lift transition-all duration-300">
          <div className="text-[56px] font-semibold text-black mb-2 leading-none tracking-[-0.03em] font-mono animate-count-up">
            {quickStats.recipesThisWeek}
          </div>
          <div className="text-[14px] text-[#737373] uppercase tracking-[0.1em] font-medium mb-3">Recipes Made</div>
          <div className="flex items-center justify-center text-xs text-[#10B981] font-medium">
            <ChefHat className="w-3 h-3 mr-1" />
            Great progress!
          </div>
        </div>
      </div>

      {/* Urgent Items */}
      <div className="bg-white rounded-2xl shadow-subtle overflow-hidden">
        <div className="p-8 border-b border-[rgba(0,0,0,0.06)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-[#EF4444]" />
              <h2 className="text-[24px] font-semibold text-black tracking-[-0.02em]">Items Expiring Soon</h2>
            </div>
            <span className="text-[13px] text-[#737373] font-medium">{recentItems.filter(item => isUrgent(getDaysLeft(item.expiry_date))).length} items</span>
          </div>
        </div>
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recentItems.filter(item => isUrgent(getDaysLeft(item.expiry_date))).map((item, index) => {
              const daysLeft = getDaysLeft(item.expiry_date)
              return (
              <div
                key={index}
                className="flex items-center gap-4 p-6 bg-[#FEF2F2] border border-[#FECACA] rounded-xl hover:bg-[#FEE2E2] transition-colors"
              >
                <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center text-3xl shadow-sm">
                  {item.emoji}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-black text-[17px] mb-1">{item.name}</h3>
                  <div className="flex items-center text-[#EF4444] text-[15px] font-medium">
                    <Clock className="w-4 h-4 mr-2" />
                    {daysLeft === 1 ? "Expires tomorrow" : `Expires in ${daysLeft} days`}
                  </div>
                </div>
                <button className="px-4 py-2 bg-[#EF4444] text-white rounded-lg text-[13px] font-medium hover:bg-[#DC2626] transition-colors">
                  Use Now
                </button>
              </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="bg-white rounded-2xl shadow-subtle overflow-hidden">
          <div className="p-8 border-b border-[rgba(0,0,0,0.06)]">
            <div className="flex items-center gap-3">
              <Package className="w-6 h-6 text-black" />
              <h2 className="text-[24px] font-semibold text-black tracking-[-0.02em]">Recent Items</h2>
            </div>
          </div>
          <div className="p-8">
            <div className="space-y-4">
              {recentItems.map((item, index) => {
                const daysLeft = getDaysLeft(item.expiry_date)
                return (
                <div key={index} className="flex items-center gap-4 p-4 hover:bg-[#FAFAFA] rounded-xl transition-colors">
                  <div className="w-12 h-12 bg-[#F5F5F5] rounded-lg flex items-center justify-center text-2xl">
                    {item.emoji}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-black text-[15px]">{item.name}</h3>
                    <p className="text-[#737373] text-[13px]">
                      {daysLeft === 1 ? "Expires tomorrow" : `${daysLeft} days left`}
                    </p>
                  </div>
                  {isUrgent(daysLeft) && (
                    <div className="px-2 py-1 bg-[#EF4444] text-white rounded-full text-[11px] font-bold uppercase tracking-wider">
                      Urgent
                    </div>
                  )}
                </div>
                )
              })}
            </div>
            <button className="w-full mt-6 py-3 border border-[rgba(0,0,0,0.06)] rounded-xl text-[15px] font-medium text-black hover:bg-[#FAFAFA] transition-colors">
              View All Items
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-subtle overflow-hidden">
          <div className="p-8 border-b border-[rgba(0,0,0,0.06)]">
            <div className="flex items-center gap-3">
              <ChefHat className="w-6 h-6 text-black" />
              <h2 className="text-[24px] font-semibold text-black tracking-[-0.02em]">Suggested Recipes</h2>
            </div>
          </div>
          <div className="p-8">
            <div className="space-y-4">
              {[
                { name: "Spinach Omelette", time: "10 min", emoji: "🥚", ingredients: 4 },
                { name: "Banana Smoothie", time: "5 min", emoji: "🍌", ingredients: 3 },
                { name: "Milk Pancakes", time: "15 min", emoji: "🥞", ingredients: 5 },
              ].map((recipe, index) => (
                <div key={index} className="flex items-center gap-4 p-4 hover:bg-[#FAFAFA] rounded-xl transition-colors">
                  <div className="w-12 h-12 bg-[#F5F5F5] rounded-lg flex items-center justify-center text-2xl">
                    {recipe.emoji}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-black text-[15px]">{recipe.name}</h3>
                    <p className="text-[#737373] text-[13px]">
                      {recipe.time} • {recipe.ingredients} ingredients
                    </p>
                  </div>
                  <button className="px-3 py-1.5 bg-black text-white rounded-lg text-[13px] font-medium hover:bg-gray-800 transition-colors">
                    Cook
                  </button>
                </div>
              ))}
            </div>
            <button className="w-full mt-6 py-3 border border-[rgba(0,0,0,0.06)] rounded-xl text-[15px] font-medium text-black hover:bg-[#FAFAFA] transition-colors">
              Browse All Recipes
            </button>
          </div>
        </div>
      </div>

      {/* Log Groceries Popup */}
      {showLogGroceries && (
        <LogGroceries
          onClose={() => setShowLogGroceries(false)}
          onGroceryLogged={handleGroceryLogged}
        />
      )}
    </div>
  )
}
