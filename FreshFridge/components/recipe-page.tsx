"use client"

import { useState, useEffect } from "react"
import { Clock, Users, Star, Search, Heart, Loader2, Sparkles, Trash2 } from "lucide-react"
import { dataService } from "@/lib/data-service"
import { Recipe } from "@/lib/supabase"

export default function RecipePage() {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)
  const [generatingSuggestions, setGeneratingSuggestions] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null)
  const [deletingRecipe, setDeletingRecipe] = useState<string | null>(null)

  useEffect(() => {
    const loadRecipes = async () => {
      try {
        const recipeData = await dataService.getRecipes()
        setRecipes(recipeData)
      } catch (error) {
        console.error('Error loading recipes:', error)
      } finally {
        setLoading(false)
      }
    }

    loadRecipes()
  }, [])

  const generateSuggestions = async () => {
    setGeneratingSuggestions(true)
    try {
      console.log('🍳 Generating AI recipes with KronosAI...')
      
      // Call the AI recipes API
      const response = await fetch('/api/ai-recipes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      
      if (!response.ok) {
        throw new Error('Failed to generate AI recipes')
      }
      
      const result = await response.json()
      console.log('✅ AI recipes generated:', result)
      
      // Refresh the recipes list to show the new AI-generated recipes
      const updatedRecipes = await dataService.getRecipes()
      setRecipes(updatedRecipes)
      
    } catch (error) {
      console.error('Error generating AI recipe suggestions:', error)
      // Fallback to regular recipe suggestions
      try {
        const foodItems = await dataService.getFoodItems()
        const suggestions = await dataService.generateRecipeSuggestions(foodItems)
        setRecipes(suggestions)
      } catch (fallbackError) {
        console.error('Fallback recipe generation also failed:', fallbackError)
      }
    } finally {
      setGeneratingSuggestions(false)
    }
  }

  const handleDeleteRecipe = async (recipeId: string) => {
    if (!confirm('Are you sure you want to delete this recipe?')) {
      return
    }

    setDeletingRecipe(recipeId)
    try {
      const success = await dataService.deleteRecipe(recipeId)
      if (success) {
        // Remove the recipe from the local state
        setRecipes(prev => prev.filter(recipe => recipe.id !== recipeId))
        console.log('✅ Recipe deleted successfully')
      } else {
        console.error('❌ Failed to delete recipe')
        alert('Failed to delete recipe. Please try again.')
      }
    } catch (error) {
      console.error('Error deleting recipe:', error)
      alert('Failed to delete recipe. Please try again.')
    } finally {
      setDeletingRecipe(null)
    }
  }

  const filteredRecipes = recipes.filter(recipe =>
    recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recipe.subtitle.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="space-y-12 px-8 lg:px-16">
      <div className="pt-24 pb-16">
        <h1 className="text-[57px] font-bold text-black mb-3 leading-[1.1] tracking-[-0.03em]">Recipe Ideas</h1>
        <p className="text-[#737373] text-[17px] leading-relaxed">Delicious meals with your ingredients</p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative max-w-2xl flex-1">
          <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#737373]" />
          <input
            type="text"
            placeholder="Search recipes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-14 pr-6 py-5 bg-white border border-[rgba(0,0,0,0.06)] rounded-full focus:outline-none focus:ring-4 focus:ring-[rgba(14,165,233,0.1)] focus:border-[#0EA5E9] text-black placeholder:text-[#737373] text-[17px] shadow-subtle transition-all duration-200"
          />
        </div>
        
        <button
          onClick={generateSuggestions}
          disabled={generatingSuggestions}
          className="flex items-center gap-3 px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 disabled:bg-blue-400 transition-colors"
        >
          {generatingSuggestions ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Sparkles className="w-5 h-5" />
          )}
          {generatingSuggestions ? 'Generating...' : 'AI Suggestions'}
        </button>
      </div>

      {filteredRecipes.length > 0 && (
        <div className="bg-white rounded-3xl shadow-dramatic overflow-hidden">
          <div className="p-24 text-center">
            <div className="text-9xl mb-12">{filteredRecipes[0].emoji}</div>
            <h2 className="text-[57px] font-bold text-black mb-6 leading-[1.1] tracking-[-0.03em]">{filteredRecipes[0].title}</h2>
            <p className="text-[#737373] text-[17px] mb-12">{filteredRecipes[0].subtitle}</p>

            <div className="flex items-center justify-center gap-16 mb-16 text-[17px]">
              <div className="flex items-center text-black">
                <Clock className="w-5 h-5 mr-3 text-[#737373]" />
                <span className="font-medium">{filteredRecipes[0].cook_time}</span>
              </div>
              <div className="flex items-center text-black">
                <Users className="w-5 h-5 mr-3 text-[#737373]" />
                <span className="font-medium">{filteredRecipes[0].servings} servings</span>
              </div>
              <div className="flex items-center text-black">
                <Star className="w-5 h-5 mr-3 text-[#FBBC04] fill-[#FBBC04]" />
                <span className="font-medium font-mono">{filteredRecipes[0].rating}</span>
                <span className="text-[#737373] ml-2">({filteredRecipes[0].reviews} reviews)</span>
              </div>
              <div className="text-black font-medium font-mono">{filteredRecipes[0].calories} cal</div>
            </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16 max-w-6xl mx-auto">
            <div className="bg-[#FAFAFA] rounded-2xl p-10 text-left">
              <h3 className="text-[24px] font-semibold text-black mb-8 tracking-[-0.02em]">Ingredients</h3>
              <div className="space-y-4">
                {filteredRecipes[0].ingredients.map((ingredient, index) => (
                  <label
                    key={index}
                    className="flex items-center p-4 hover:bg-white rounded-xl transition-colors cursor-pointer group"
                  >
                    <input type="checkbox" className="w-5 h-5 mr-5 accent-black rounded" />
                    <span className="text-black font-medium text-[17px] group-hover:translate-x-1 transition-transform duration-200">
                      {ingredient}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="bg-[#FAFAFA] rounded-2xl p-10 text-left">
              <h3 className="text-[24px] font-semibold text-black mb-8 tracking-[-0.02em]">Instructions</h3>
              <div className="space-y-6">
                {filteredRecipes[0].instructions.map((step, index) => (
                  <div key={index} className="flex items-start gap-5">
                    <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center text-[15px] font-bold flex-shrink-0 font-mono">
                      {index + 1}
                    </div>
                    <span className="text-black text-[17px] pt-2 leading-relaxed">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-4 max-w-md mx-auto">
            <button className="flex-1 bg-black text-white rounded-xl py-5 px-10 font-medium text-[15px] shadow-subtle hover-lift-small transition-all duration-200">
              Start Cooking
            </button>
            <button className="px-6 py-5 bg-white border border-[rgba(0,0,0,0.06)] rounded-xl hover:bg-[#FAFAFA] transition-all duration-200">
              <Heart className="w-6 h-6 text-black" />
            </button>
          </div>
        </div>
        </div>
      )}

      {filteredRecipes.length > 1 && (
        <div>
          <h2 className="text-[32px] font-semibold text-black mb-12 tracking-[-0.02em]">More Recipes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredRecipes.slice(1).map((recipe) => (
            <div
              key={recipe.id}
              className="bg-white rounded-2xl shadow-subtle hover-lift transition-all duration-300 overflow-hidden"
            >
              <div className="p-10 text-center">
                <div className="text-7xl mb-6">{recipe.emoji}</div>
                <h3 className="font-semibold text-black text-[24px] mb-3 tracking-[-0.02em]">{recipe.title}</h3>
                <p className="text-[15px] text-[#737373] mb-8">{recipe.subtitle}</p>

                <div className="flex items-center justify-center gap-6 text-[15px] text-[#737373] mb-6">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>{recipe.cook_time}</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-2" />
                    <span>{recipe.servings}</span>
                  </div>
                </div>


                <div className="flex gap-3">
                  <button 
                    onClick={() => setSelectedRecipe(recipe)}
                    className="flex-1 bg-black text-white rounded-xl py-3 px-6 font-medium text-[15px] hover-lift-small transition-all duration-200"
                  >
                    View Recipe
                  </button>
                  <button className="px-4 py-3 bg-white border border-[rgba(0,0,0,0.06)] rounded-xl hover:bg-[#FAFAFA] transition-all duration-200">
                    <Heart className="w-4 h-4 text-black" />
                  </button>
                  <button 
                    onClick={() => handleDeleteRecipe(recipe.id)}
                    disabled={deletingRecipe === recipe.id}
                    className="px-4 py-3 bg-red-50 border border-red-200 rounded-xl hover:bg-red-100 transition-all duration-200 disabled:opacity-50"
                    title="Delete Recipe"
                  >
                    {deletingRecipe === recipe.id ? (
                      <Loader2 className="w-4 h-4 text-red-600 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4 text-red-600" />
                    )}
                  </button>
                </div>
              </div>
            </div>
            ))}
          </div>
        </div>
      )}

      {filteredRecipes.length === 0 && (
        <div className="text-center py-24">
          <div className="text-6xl mb-8">🍽️</div>
          <h3 className="text-2xl font-semibold text-gray-900 mb-4">No recipes found</h3>
          <p className="text-gray-600 mb-8">
            {searchTerm ? 'Try adjusting your search terms' : 'Generate AI-powered recipe suggestions based on your inventory'}
          </p>
          <button
            onClick={generateSuggestions}
            disabled={generatingSuggestions}
            className="flex items-center gap-3 mx-auto px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 disabled:bg-blue-400 transition-colors"
          >
            {generatingSuggestions ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Sparkles className="w-5 h-5" />
            )}
            {generatingSuggestions ? 'Generating...' : 'Generate AI Suggestions'}
          </button>
        </div>
      )}

      {/* Recipe Detail Modal */}
      {selectedRecipe && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900">{selectedRecipe.title}</h2>
              <button 
                onClick={() => setSelectedRecipe(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Recipe Info */}
              <div className="text-center mb-8">
                <div className="text-6xl mb-4">{selectedRecipe.emoji}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{selectedRecipe.subtitle}</h3>
                <div className="flex items-center justify-center gap-6 text-gray-600">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{selectedRecipe.cook_time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>{selectedRecipe.servings} servings</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>🔥</span>
                    <span>{selectedRecipe.calories} cal</span>
                  </div>
                </div>
              </div>

              {/* Ingredients */}
              <div className="mb-8">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Ingredients</h4>
                <div className="bg-gray-50 rounded-xl p-4">
                  <ul className="space-y-2">
                    {Array.isArray(selectedRecipe.ingredients) ? (
                      selectedRecipe.ingredients.map((ingredient, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <span className="text-gray-400 mt-1">•</span>
                          <span className="text-gray-700">{ingredient}</span>
                        </li>
                      ))
                    ) : (
                      <li className="text-gray-700">{selectedRecipe.ingredients}</li>
                    )}
                  </ul>
                </div>
              </div>

              {/* Instructions */}
              <div className="mb-8">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Instructions</h4>
                <div className="space-y-4">
                  {Array.isArray(selectedRecipe.instructions) ? (
                    selectedRecipe.instructions.map((instruction, index) => (
                      <div key={index} className="flex gap-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">
                          {index + 1}
                        </div>
                        <p className="text-gray-700 pt-1">{instruction}</p>
                      </div>
                    ))
                  ) : (
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">
                        1
                      </div>
                      <p className="text-gray-700 pt-1">{selectedRecipe.instructions}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Recipe Info */}
              <div className="border-t border-gray-100 pt-6">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>Category: <span className="font-medium">{selectedRecipe.category}</span></span>
                  <span>Difficulty: <span className="font-medium">{selectedRecipe.difficulty}</span></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
