'use client';

import type { NewsArticle } from '@/lib/types';

interface NewsCardProps {
  article: NewsArticle;
}

export default function NewsCard({ article }: NewsCardProps) {
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(article.publishedAt));

  return (
    <article className="bg-[#1e293b] border border-[#1e3a5f] rounded-xl overflow-hidden flex flex-col hover:border-[#0ea5e9] transition-colors">
      {article.urlToImage && (
        <div className="h-40 overflow-hidden bg-[#0f172a]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={article.urlToImage}
            alt={article.title}
            className="w-full h-full object-cover opacity-80"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
        </div>
      )}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-xs text-[#0ea5e9] font-medium truncate">{article.source}</span>
          <span className="text-xs text-slate-500 shrink-0">{formattedDate}</span>
        </div>
        <h3 className="text-slate-100 font-semibold text-sm leading-snug mb-2 line-clamp-3">
          {article.title}
        </h3>
        {article.description && (
          <p className="text-slate-400 text-xs leading-relaxed line-clamp-3 flex-1">
            {article.description}
          </p>
        )}
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 text-xs text-[#0ea5e9] hover:text-sky-300 font-medium transition-colors"
        >
          Read full article →
        </a>
      </div>
    </article>
  );
}
