import { NextRequest, NextResponse } from 'next/server';
import { ollamaClient } from '@/lib/ollama';

export async function GET(request: NextRequest) {
  try {
    const isHealthy = await ollamaClient.health();

    if (isHealthy) {
      return NextResponse.json({
        status: 'healthy',
        message: 'Ollama server is running',
        baseUrl: process.env.OLLAMA_BASE_URL || 'http://localhost:11434',
      });
    } else {
      return NextResponse.json(
        {
          status: 'unhealthy',
          message: 'Ollama server is not responding',
          baseUrl: process.env.OLLAMA_BASE_URL || 'http://localhost:11434',
        },
        { status: 503 }
      );
    }
  } catch (error) {
    console.error('Ollama health check error:', error);
    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to check Ollama server health',
        details: error instanceof Error ? error.message : 'Unknown error',
        baseUrl: process.env.OLLAMA_BASE_URL || 'http://localhost:11434',
      },
      { status: 500 }
    );
  }
}
