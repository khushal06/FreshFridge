"use client"

import { useState } from "react"
import { Package, Calendar, Clock, Search } from "lucide-react"

export default function InventoryPage() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [searchTerm, setSearchTerm] = useState("")

  const categories = ["All", "Dairy", "Produce", "Protein", "Drinks"]

  const items = [
    { name: "Milk", date: "Oct 17, 2025", daysLeft: 2, category: "Dairy", emoji: "🥛" },
    { name: "Eggs", date: "Oct 17, 2025", daysLeft: 3, category: "Dairy", emoji: "🥚" },
    { name: "Spinach", date: "Oct 17, 2025", daysLeft: 3, category: "Produce", emoji: "🥬" },
    { name: "Chicken", date: "Oct 16, 2025", daysLeft: 11, category: "Protein", emoji: "🍗" },
    { name: "Apple Juice", date: "Oct 16, 2025", daysLeft: 7, category: "Drinks", emoji: "🧃" },
    { name: "Bananas", date: "Oct 15, 2025", daysLeft: 1, category: "Produce", emoji: "🍌" },
  ]

  const filteredItems = items.filter((item) => {
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const getExpiryColor = (daysLeft: number) => {
    if (daysLeft <= 2) return "text-[#EF4444]"
    if (daysLeft <= 5) return "text-[#F97316]"
    return "text-[#10B981]"
  }

  return (
    <div className="space-y-12 px-8 lg:px-16">
      <div className="pt-24 pb-16">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
          <div>
            <h1 className="text-[57px] font-bold text-black mb-3 leading-[1.1] tracking-[-0.03em]">My Pantry</h1>
            <p className="text-[#737373] text-[17px] leading-relaxed">Keep track of your fresh ingredients</p>
          </div>
          <div className="text-left sm:text-right">
            <div className="text-[56px] font-semibold text-black leading-none tracking-[-0.03em] font-mono">
              {items.length}
            </div>
            <div className="text-[14px] text-[#737373] uppercase tracking-[0.1em] font-medium mt-2">Total Items</div>
          </div>
        </div>
      </div>

      <div className="relative max-w-2xl mx-auto">
        <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#737373]" />
        <input
          type="text"
          placeholder="Search ingredients..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-14 pr-20 py-5 bg-white border border-[rgba(0,0,0,0.06)] rounded-full focus:outline-none focus:ring-4 focus:ring-[rgba(14,165,233,0.1)] focus:border-[#0EA5E9] text-black placeholder:text-[#737373] text-[17px] shadow-subtle transition-all duration-200"
        />
        <div className="absolute right-6 top-1/2 transform -translate-y-1/2 px-3 py-1 bg-[#F5F5F5] rounded-md text-[13px] text-[#737373] font-mono">
          ⌘K
        </div>
      </div>

      <div className="border-b border-[rgba(0,0,0,0.06)]">
        <div className="flex gap-12 max-w-4xl mx-auto">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`pb-4 text-[15px] font-medium tracking-[0.02em] transition-all duration-200 relative ${
                selectedCategory === category ? "text-black" : "text-[#737373] hover:text-black"
              }`}
            >
              {category}
              <span className="ml-2 text-[13px] text-[#A3A3A3]">
                ({category === "All" ? items.length : items.filter((i) => i.category === category).length})
              </span>
              {selectedCategory === category && (
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-black rounded-t-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredItems.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-subtle hover-lift transition-all duration-300 overflow-hidden group"
          >
            <div className="p-8">
              <div className="flex items-start justify-between mb-6">
                <div className="w-20 h-20 bg-[#F5F5F5] rounded-2xl flex items-center justify-center text-4xl relative">
                  {item.emoji}
                  {item.daysLeft <= 2 && (
                    <div className="absolute top-2 right-2 px-2 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wider bg-[#EF4444]/90 text-white backdrop-blur-sm">
                      Urgent
                    </div>
                  )}
                </div>
              </div>

              <h3 className="font-semibold text-black text-[24px] mb-4 tracking-[-0.02em]">{item.name}</h3>

              <div className="space-y-3 mb-6">
                <div className="flex items-center text-[15px] text-[#737373]">
                  <Calendar className="w-4 h-4 mr-3" />
                  <span>{item.date}</span>
                </div>
                <div className={`flex items-center text-[15px] font-medium ${getExpiryColor(item.daysLeft)}`}>
                  <Clock className="w-4 h-4 mr-3" />
                  <span>
                    {item.daysLeft === 0
                      ? "Expired"
                      : item.daysLeft === 1
                        ? "1 day left"
                        : `${item.daysLeft} days left`}
                  </span>
                </div>
              </div>

              <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <button className="flex-1 bg-black text-white rounded-xl py-3 px-6 font-medium text-[15px] hover-lift-small transition-all duration-200">
                  Edit
                </button>
                <button className="flex-1 bg-[#F5F5F5] text-black rounded-xl py-3 px-6 font-medium text-[15px] hover:bg-[#E5E5E5] transition-all duration-200">
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="bg-white rounded-2xl p-24 text-center shadow-subtle">
          <div className="w-32 h-32 bg-[#F5F5F5] rounded-full flex items-center justify-center mx-auto mb-8">
            <Package className="w-16 h-16 text-[#A3A3A3]" />
          </div>
          <h3 className="text-[32px] font-semibold text-black mb-3 tracking-[-0.02em]">No items found</h3>
          <p className="text-[#737373] mb-12 text-[17px]">
            {searchTerm
              ? "Try adjusting your search terms"
              : `No items in the ${selectedCategory.toLowerCase()} category`}
          </p>
          <button className="bg-black text-white rounded-xl py-4 px-10 font-medium text-[15px] shadow-subtle hover-lift-small transition-all duration-200">
            Add New Item
          </button>
        </div>
      )}
    </div>
  )
}
