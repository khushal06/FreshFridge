import { NextRequest, NextResponse } from 'next/server';
import { dataService } from '@/lib/data-service';

export async function POST(request: NextRequest) {
  try {
    console.log('🍳 Generating AI recipes with KronosAI...');
    
    const aiRecipes = await dataService.generateAIRecipes();
    
    if (aiRecipes.length === 0) {
      return NextResponse.json({ 
        error: 'No recipes generated',
        message: 'Unable to generate AI recipes at this time'
      }, { status: 500 });
    }

    return NextResponse.json({
      recipes: aiRecipes,
      message: `Successfully generated ${aiRecipes.length} AI recipes`
    });
  } catch (error) {
    console.error('AI recipe generation error:', error);
    return NextResponse.json({ 
      error: 'Failed to generate AI recipes',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
