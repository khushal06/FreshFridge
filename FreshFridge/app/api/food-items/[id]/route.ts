import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const item = db.getFoodItem(params.id);
    
    if (!item) {
      return NextResponse.json({ error: 'Food item not found' }, { status: 404 });
    }

    return NextResponse.json(item);
  } catch (error) {
    console.error('Error fetching food item:', error);
    return NextResponse.json({ error: 'Failed to fetch food item' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    
    const updatedItem = db.updateFoodItem(params.id, body);
    
    if (!updatedItem) {
      return NextResponse.json({ error: 'Food item not found' }, { status: 404 });
    }

    return NextResponse.json(updatedItem);
  } catch (error) {
    console.error('Error updating food item:', error);
    return NextResponse.json({ error: 'Failed to update food item' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const success = db.deleteFoodItem(params.id);
    
    if (!success) {
      return NextResponse.json({ error: 'Food item not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Food item deleted successfully' });
  } catch (error) {
    console.error('Error deleting food item:', error);
    return NextResponse.json({ error: 'Failed to delete food item' }, { status: 500 });
  }
}
