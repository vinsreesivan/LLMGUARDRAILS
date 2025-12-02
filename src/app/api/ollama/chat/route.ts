import { NextRequest, NextResponse } from 'next/server';
import { ollamaClient, OllamaChatRequest } from '@/lib/ollama';

export async function POST(request: NextRequest) {
  try {
    const body: OllamaChatRequest = await request.json();

    // Validate required fields
    if (!body.model) {
      return NextResponse.json(
        { error: 'Model is required' },
        { status: 400 }
      );
    }

    if (!body.messages || !Array.isArray(body.messages) || body.messages.length === 0) {
      return NextResponse.json(
        { error: 'Messages array is required and must not be empty' },
        { status: 400 }
      );
    }

    // Send request to Ollama
    const response = await ollamaClient.chat(body);

    return NextResponse.json(response);
  } catch (error) {
    console.error('Ollama chat error:', error);
    return NextResponse.json(
      {
        error: 'Failed to process chat request',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
