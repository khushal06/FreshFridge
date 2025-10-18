import { NextRequest, NextResponse } from 'next/server';
import { aiService } from '@/lib/ai-service';
import { supabaseService } from '@/lib/supabase-service';
import { format, addDays } from 'date-fns';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const imageFile = formData.get('image') as File;
    
    if (!imageFile) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    // Convert image to base64
    const imageBuffer = await imageFile.arrayBuffer();
    const imageBase64 = Buffer.from(imageBuffer).toString('base64');

    // Recognize food items from image
    const recognizedItems = await aiService.recognizeFoodFromImage(imageBase64);

    return NextResponse.json({
      recognizedItems,
      message: `Successfully recognized ${recognizedItems.length} food items`
    });
  } catch (error) {
    console.error('Food recognition error:', error);
    return NextResponse.json({ 
      error: 'Failed to recognize food items',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
