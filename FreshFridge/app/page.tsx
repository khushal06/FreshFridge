"use client"

import { useState } from "react"
import LandingPage from "@/components/landing-page"
import LoginPage from "@/components/login-page"
import HomePage from "@/components/home-page"
import InventoryPage from "@/components/inventory-page"
import RecipePage from "@/components/recipe-page"
import InsightsPage from "@/components/insights-page"
import { Home, Package, ChefHat, BarChart3 } from "lucide-react"

export default function App() {
  const [showLanding, setShowLanding] = useState(true)
  const [showLogin, setShowLogin] = useState(false)
  const [currentPage, setCurrentPage] = useState("home")

  if (showLanding) {
    return (
      <LandingPage
        onEnterApp={() => {
          setShowLanding(false)
          setShowLogin(true)
        }}
      />
    )
  }

  if (showLogin) {
    return (
      <LoginPage
        onLogin={() => setShowLogin(false)}
        onBackToHome={() => {
          setShowLogin(false)
          setShowLanding(true)
        }}
      />
    )
  }

  const navigation = [
    { id: "home", label: "Home", icon: Home },
    { id: "inventory", label: "Pantry", icon: Package },
    { id: "recipes", label: "Recipes", icon: ChefHat },
    { id: "insights", label: "Insights", icon: BarChart3 },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="bg-card border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-2xl flex items-center justify-center">
                <ChefHat className="w-6 h-6 text-primary-foreground" />
              </div>
              <h1 className="text-2xl font-bold text-foreground">FreshKeep</h1>
            </div>
            <div className="flex space-x-1">
              {navigation.map((item) => {
                const Icon = item.icon
                return (
                  <button
                    key={item.id}
                    onClick={() => setCurrentPage(item.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-colors ${
                      currentPage === item.id
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="hidden sm:inline">{item.label}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentPage === "home" && <HomePage />}
        {currentPage === "inventory" && <InventoryPage />}
        {currentPage === "recipes" && <RecipePage />}
        {currentPage === "insights" && <InsightsPage />}
      </main>
    </div>
  )
}
