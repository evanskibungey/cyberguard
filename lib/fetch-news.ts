import type { NewsArticle } from './types';

export async function fetchNews(): Promise<NewsArticle[]> {
  try {
    const apiKey = process.env.NEWS_API_KEY;
    if (!apiKey || apiKey === 'your_key_here') {
      return [];
    }

    const url = new URL('https://newsapi.org/v2/everything');
    url.searchParams.set('q', 'cybersecurity OR infosec OR "data breach" OR ransomware OR phishing');
    url.searchParams.set('language', 'en');
    url.searchParams.set('sortBy', 'publishedAt');
    url.searchParams.set('pageSize', '12');
    url.searchParams.set('apiKey', apiKey);

    const response = await fetch(url.toString(), {
      cache: 'no-store', // always fetch fresh, don't freeze at build time
    });

    if (!response.ok) {
      // log error status for Vercel function logs
      console.error('[fetchNews] NewsAPI error:', response.status, await response.text().catch(() => ''));
      return [];
    }

    const data = await response.json();

    return (data.articles ?? [])
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
  } catch {
    return [];
  }
}
