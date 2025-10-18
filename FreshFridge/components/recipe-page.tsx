import { Clock, Users, Star, Search, Heart } from "lucide-react"

export default function RecipePage() {
  const recipes = [
    {
      id: 1,
      title: "Spinach Omelette",
      subtitle: "Perfect breakfast with fresh ingredients",
      emoji: "🥚",
      cookTime: "10 min",
      servings: "2",
      rating: 4.8,
      reviews: 127,
      calories: 320,
    },
    {
      id: 2,
      title: "Chicken Stir Fry",
      subtitle: "Quick and healthy dinner option",
      emoji: "🍗",
      cookTime: "20 min",
      servings: "4",
      rating: 4.6,
      reviews: 89,
      calories: 450,
    },
    {
      id: 3,
      title: "Banana Smoothie",
      subtitle: "Refreshing morning drink",
      emoji: "🍌",
      cookTime: "5 min",
      servings: "1",
      rating: 4.9,
      reviews: 203,
      calories: 180,
    },
  ]

  return (
    <div className="space-y-12 px-8 lg:px-16">
      <div className="pt-24 pb-16">
        <h1 className="text-[57px] font-bold text-black mb-3 leading-[1.1] tracking-[-0.03em]">Recipe Ideas</h1>
        <p className="text-[#737373] text-[17px] leading-relaxed">Delicious meals with your ingredients</p>
      </div>

      <div className="relative max-w-2xl mx-auto">
        <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#737373]" />
        <input
          type="text"
          placeholder="Search recipes..."
          className="w-full pl-14 pr-6 py-5 bg-white border border-[rgba(0,0,0,0.06)] rounded-full focus:outline-none focus:ring-4 focus:ring-[rgba(14,165,233,0.1)] focus:border-[#0EA5E9] text-black placeholder:text-[#737373] text-[17px] shadow-subtle transition-all duration-200"
        />
      </div>

      <div className="bg-white rounded-3xl shadow-dramatic overflow-hidden">
        <div className="p-24 text-center">
          <div className="text-9xl mb-12">🥚</div>
          <h2 className="text-[57px] font-bold text-black mb-6 leading-[1.1] tracking-[-0.03em]">Spinach Omelette</h2>
          <p className="text-[#737373] text-[17px] mb-12">Perfect breakfast with eggs & fresh spinach</p>

          <div className="flex items-center justify-center gap-16 mb-16 text-[17px]">
            <div className="flex items-center text-black">
              <Clock className="w-5 h-5 mr-3 text-[#737373]" />
              <span className="font-medium">10 min</span>
            </div>
            <div className="flex items-center text-black">
              <Users className="w-5 h-5 mr-3 text-[#737373]" />
              <span className="font-medium">2 servings</span>
            </div>
            <div className="flex items-center text-black">
              <Star className="w-5 h-5 mr-3 text-[#FBBC04] fill-[#FBBC04]" />
              <span className="font-medium font-mono">4.8</span>
              <span className="text-[#737373] ml-2">(127 reviews)</span>
            </div>
            <div className="text-black font-medium font-mono">320 cal</div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16 max-w-6xl mx-auto">
            <div className="bg-[#FAFAFA] rounded-2xl p-10 text-left">
              <h3 className="text-[24px] font-semibold text-black mb-8 tracking-[-0.02em]">Ingredients</h3>
              <div className="space-y-4">
                {["Eggs", "Spinach", "Cheese", "Butter"].map((ingredient, index) => (
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
                {[
                  "Beat eggs in a bowl with salt and pepper",
                  "Heat butter in a non-stick pan",
                  "Add spinach and cook until wilted",
                ].map((step, index) => (
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

      <div>
        <h2 className="text-[32px] font-semibold text-black mb-12 tracking-[-0.02em]">More Recipes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {recipes.slice(1).map((recipe) => (
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
                    <span>{recipe.cookTime}</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-2" />
                    <span>{recipe.servings}</span>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-2 mb-8">
                  <Star className="w-4 h-4 text-[#FBBC04] fill-[#FBBC04]" />
                  <span className="text-[15px] text-black font-medium font-mono">{recipe.rating}</span>
                  <span className="text-[15px] text-[#737373]">({recipe.reviews})</span>
                </div>

                <div className="flex gap-3">
                  <button className="flex-1 bg-black text-white rounded-xl py-3 px-6 font-medium text-[15px] hover-lift-small transition-all duration-200">
                    View Recipe
                  </button>
                  <button className="px-4 py-3 bg-white border border-[rgba(0,0,0,0.06)] rounded-xl hover:bg-[#FAFAFA] transition-all duration-200">
                    <Heart className="w-4 h-4 text-black" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
