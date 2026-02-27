import { NextResponse } from 'next/server';

export async function GET() {
  const apiKey = process.env.NEWS_API_KEY;

  if (!apiKey || apiKey === 'your_key_here') {
    return NextResponse.json({ error: 'NEWS_API_KEY not set', keyPresent: false });
  }

  const url = new URL('https://newsapi.org/v2/everything');
  url.searchParams.set('q', 'cybersecurity');
  url.searchParams.set('language', 'en');
  url.searchParams.set('pageSize', '1');
  url.searchParams.set('apiKey', apiKey);

  try {
    const response = await fetch(url.toString());
    const body = await response.json();

    return NextResponse.json({
      keyPresent: true,
      keyPrefix: apiKey.slice(0, 6) + '...',
      httpStatus: response.status,
      ok: response.ok,
      newsApiResponse: body,
    });
  } catch (err) {
    return NextResponse.json({
      keyPresent: true,
      error: 'fetch threw an exception',
      detail: String(err),
    });
  }
}
