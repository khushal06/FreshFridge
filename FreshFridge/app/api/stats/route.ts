import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';

export async function GET() {
  try {
    const stats = db.getStats();
    const expiringItems = db.getExpiringItems(3);
    
    return NextResponse.json({
      ...stats,
      expiringItems,
      weeklySavings: stats.urgentItems * 5, // Estimated $5 saved per item used before expiry
      recipesThisWeek: Math.floor(Math.random() * 10) + 5, // Mock data for now
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
