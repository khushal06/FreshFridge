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
    
    // Save recognized items to database
    const savedItems = [];
    for (const item of recognizedItems) {
      const expiryDate = format(addDays(new Date(), item.estimatedExpiryDays), 'yyyy-MM-dd');
      
      const savedItem = await supabaseService.addFoodItem({
        name: item.name,
        category: item.category,
        emoji: item.emoji,
        expiry_date: expiryDate,
        quantity: item.suggestedQuantity || 1,
        unit: item.suggestedUnit || 'piece',
        confidence: item.confidence,
        notes: `Recognized via AI (confidence: ${Math.round(item.confidence * 100)}%)`,
      });
      
      if (savedItem) savedItems.push(savedItem);
    }

    return NextResponse.json({
      recognizedItems,
      savedItems,
      message: `Successfully recognized and saved ${savedItems.length} food items`
    });
  } catch (error) {
    console.error('Food recognition error:', error);
    return NextResponse.json({ 
      error: 'Failed to recognize food items',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
