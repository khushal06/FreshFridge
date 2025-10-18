import { NextRequest, NextResponse } from 'next/server';
import { aiService } from '@/lib/ai-service';
import { supabaseService } from '@/lib/supabase-service';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, sessionId } = body;
    
    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const currentSessionId = sessionId || uuidv4();
    
    // Save user message
    await supabaseService.addChatMessage({
      message,
      is_user: true,
      timestamp: new Date().toISOString(),
      session_id: currentSessionId,
    });

    // Get available food items for context
    const availableItems = await supabaseService.getAllFoodItems();
    
    // Get recent chat history for context
    const chatHistory = await supabaseService.getChatHistory(currentSessionId);
    const recentMessages = chatHistory.slice(-10).map(msg => 
      `${msg.is_user ? 'User' : 'Assistant'}: ${msg.message}`
    );

    // Get AI response
    const aiResponse = await aiService.chatWithAI(message, availableItems, recentMessages);
    
    // Save AI response
    await supabaseService.addChatMessage({
      message: aiResponse.message,
      is_user: false,
      timestamp: new Date().toISOString(),
      session_id: currentSessionId,
    });

    return NextResponse.json({
      response: aiResponse,
      sessionId: currentSessionId,
    });
  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json({ 
      error: 'Failed to process chat message',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
