// Constants for the FreshKeep app

export const CATEGORIES = ["All", "Dairy", "Produce", "Protein", "Drinks"] as const

export const SAMPLE_ITEMS = [
  { name: "Milk", date: "Oct 17, 2025", daysLeft: 2, category: "Dairy", emoji: "🥛" },
  { name: "Eggs", date: "Oct 17, 2025", daysLeft: 3, category: "Dairy", emoji: "🥚" },
  { name: "Spinach", date: "Oct 17, 2025", daysLeft: 3, category: "Produce", emoji: "🥬" },
  { name: "Chicken", date: "Oct 16, 2025", daysLeft: 11, category: "Protein", emoji: "🍗" },
  { name: "Apple Juice", date: "Oct 16, 2025", daysLeft: 7, category: "Drinks", emoji: "🧃" },
  { name: "Bananas", date: "Oct 15, 2025", daysLeft: 1, category: "Produce", emoji: "🍌" },
]

export const SAMPLE_RECIPES = [
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

export const NAVIGATION_ITEMS = [
  { id: "home", label: "Home" },
  { id: "inventory", label: "Pantry" },
  { id: "recipes", label: "Recipes" },
  { id: "insights", label: "Insights" },
]
