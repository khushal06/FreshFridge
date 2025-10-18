import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';
import { format, addDays } from 'date-fns';

export async function GET() {
  try {
    const items = db.getAllFoodItems();
    return NextResponse.json(items);
  } catch (error) {
    console.error('Error fetching food items:', error);
    return NextResponse.json({ error: 'Failed to fetch food items' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.name || !body.category || !body.emoji || !body.expiryDate) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const foodItem = db.addFoodItem({
      name: body.name,
      category: body.category,
      emoji: body.emoji,
      expiryDate: body.expiryDate,
      quantity: body.quantity || 1,
      unit: body.unit || 'piece',
      imageUrl: body.imageUrl,
      confidence: body.confidence,
      notes: body.notes,
    });

    return NextResponse.json(foodItem, { status: 201 });
  } catch (error) {
    console.error('Error creating food item:', error);
    return NextResponse.json({ error: 'Failed to create food item' }, { status: 500 });
  }
}
