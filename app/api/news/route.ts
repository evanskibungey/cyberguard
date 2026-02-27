import { NextResponse } from 'next/server';
import type { NewsArticle } from '@/lib/types';

export async function GET() {
  try {
    const apiKey = process.env.NEWS_API_KEY;
    if (!apiKey || apiKey === 'your_key_here') {
      return NextResponse.json([], {
        headers: { 'Cache-Control': 's-maxage=3600' },
      });
    }

    const url = new URL('https://newsapi.org/v2/everything');
    url.searchParams.set('q', 'cybersecurity OR infosec OR "data breach" OR ransomware OR phishing');
    url.searchParams.set('language', 'en');
    url.searchParams.set('sortBy', 'publishedAt');
    url.searchParams.set('pageSize', '12');
    url.searchParams.set('apiKey', apiKey);

    const response = await fetch(url.toString(), {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      return NextResponse.json([], {
        headers: { 'Cache-Control': 's-maxage=3600' },
      });
    }

    const data = await response.json();

    const articles: NewsArticle[] = (data.articles ?? [])
      .filter(
        (a: Record<string, unknown>) =>
          a.title &&
          a.title !== '[Removed]' &&
          a.description &&
          a.description !== '[Removed]' &&
          a.url
      )
      .map((a: Record<string, unknown>) => ({
        title: a.title as string,
        description: (a.description as string) ?? '',
        source: (a.source as { name?: string })?.name ?? 'Unknown',
        publishedAt: (a.publishedAt as string) ?? new Date().toISOString(),
        url: a.url as string,
        urlToImage: (a.urlToImage as string | null) ?? null,
      }));

    return NextResponse.json(articles, {
      headers: { 'Cache-Control': 's-maxage=3600' },
    });
  } catch {
    return NextResponse.json([], {
      headers: { 'Cache-Control': 's-maxage=3600' },
    });
  }
}
