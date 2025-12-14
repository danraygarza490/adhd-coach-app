import { NextRequest, NextResponse } from 'next/server';
import { CoachingService } from '../../../../../../packages/ai/coach';

export async function POST(req: NextRequest) {
  try {
    const { message, history = [] } = await req.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    const connectionString = process.env.DATABASE_URL!;
    const coach = new CoachingService(connectionString);

    const response = await coach.chat(message, history);
    await coach.close();

    return NextResponse.json({ 
      response,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('Coach API error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export const runtime = 'nodejs';
