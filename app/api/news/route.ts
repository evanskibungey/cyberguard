import { NextResponse } from 'next/server';
import { fetchNews } from '@/lib/fetch-news';

export async function GET() {
  const articles = await fetchNews();
  return NextResponse.json(articles, {
    headers: { 'Cache-Control': 's-maxage=3600' },
  });
}
