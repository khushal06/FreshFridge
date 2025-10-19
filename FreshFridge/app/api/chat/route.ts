import { NextRequest, NextResponse } from 'next/server';
import { kronosService } from '@/lib/kronos-service';
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

    // Get AI response using KronosAI
    const aiResponseText = await kronosService.chatWithKitchenAssistant(message, availableItems);
    
    // Save AI response
    await supabaseService.addChatMessage({
      message: aiResponseText,
      is_user: false,
      timestamp: new Date().toISOString(),
      session_id: currentSessionId,
    });

    return NextResponse.json({
      response: { message: aiResponseText },
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
