import { NextRequest, NextResponse } from 'next/server';
import { ollamaClient, OllamaGenerateRequest } from '@/lib/ollama';

export async function POST(request: NextRequest) {
  try {
    const body: OllamaGenerateRequest = await request.json();

    // Validate required fields
    if (!body.model) {
      return NextResponse.json(
        { error: 'Model is required' },
        { status: 400 }
      );
    }

    if (!body.prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    // Send request to Ollama
    const response = await ollamaClient.generate(body);

    return NextResponse.json(response);
  } catch (error) {
    console.error('Ollama generate error:', error);
    return NextResponse.json(
      {
        error: 'Failed to process generate request',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
