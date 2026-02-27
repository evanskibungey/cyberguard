import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prefix } = body;

    if (!prefix || typeof prefix !== 'string') {
      return NextResponse.json({ error: 'Prefix is required' }, { status: 400 });
    }

    // Must be exactly 5 uppercase hex characters
    if (!/^[A-F0-9]{5}$/.test(prefix)) {
      return NextResponse.json(
        { error: 'Prefix must be exactly 5 uppercase hex characters' },
        { status: 400 }
      );
    }

    const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`, {
      headers: {
        'Add-Padding': 'true',
        'User-Agent': 'CyberGuard-Awareness/1.0',
      },
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'Breach check service unavailable' }, { status: 502 });
    }

    const text = await response.text();
    return new NextResponse(text, {
      status: 200,
      headers: { 'Content-Type': 'text/plain' },
    });
  } catch {
    return NextResponse.json({ error: 'Breach check failed' }, { status: 500 });
  }
}
