import { NextRequest, NextResponse } from 'next/server';
import { ollamaClient } from '@/lib/ollama';

export async function GET(request: NextRequest) {
  try {
    const response = await ollamaClient.listModels();
    return NextResponse.json(response);
  } catch (error) {
    console.error('Ollama models list error:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch Ollama models',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
