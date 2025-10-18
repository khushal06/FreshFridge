import { NextRequest, NextResponse } from 'next/server';
import { supabaseService } from '@/lib/supabase-service';
import { aiService } from '@/lib/ai-service';

export async function GET() {
  try {
    const recipes = await supabaseService.getAllRecipes();
    return NextResponse.json(recipes);
  } catch (error) {
    console.error('Error fetching recipes:', error);
    return NextResponse.json({ error: 'Failed to fetch recipes' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // If request includes availableItems, generate AI suggestions
    if (body.availableItems) {
      const suggestedRecipes = await aiService.suggestRecipes(body.availableItems);
      
      // Save suggested recipes to database
      const savedRecipes = [];
      for (const recipe of suggestedRecipes) {
        const savedRecipe = await supabaseService.addRecipe(recipe);
        if (savedRecipe) savedRecipes.push(savedRecipe);
      }
      
      return NextResponse.json(savedRecipes);
    }
    
    // Otherwise, save a manually created recipe
    if (!body.title || !body.subtitle || !body.emoji || !body.cook_time) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const recipe = await supabaseService.addRecipe({
      title: body.title,
      subtitle: body.subtitle,
      emoji: body.emoji,
      cook_time: body.cook_time,
      servings: body.servings || '2',
      rating: body.rating || 4.5,
      reviews: body.reviews || 100,
      calories: body.calories || 300,
      ingredients: body.ingredients || [],
      instructions: body.instructions || [],
      category: body.category || 'Dinner',
      difficulty: body.difficulty || 'Medium',
    });

    return NextResponse.json(recipe, { status: 201 });
  } catch (error) {
    console.error('Error creating recipe:', error);
    return NextResponse.json({ error: 'Failed to create recipe' }, { status: 500 });
  }
}
