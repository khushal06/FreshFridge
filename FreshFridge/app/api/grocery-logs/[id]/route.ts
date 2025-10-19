import { NextRequest, NextResponse } from 'next/server';
import { dataService } from '@/lib/data-service';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    if (!id) {
      return NextResponse.json({ error: 'Grocery log ID is required' }, { status: 400 });
    }

    const success = await dataService.deleteGroceryLog(id);
    
    if (success) {
      return NextResponse.json({ message: 'Grocery log deleted successfully' });
    } else {
      return NextResponse.json({ error: 'Failed to delete grocery log' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error deleting grocery log:', error);
    return NextResponse.json({ 
      error: 'Failed to delete grocery log',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
