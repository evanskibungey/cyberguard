import { unstable_noStore as noStore } from 'next/cache';
import Link from 'next/link';
import NewsCard from '@/components/NewsCard';
import { fetchNews } from '@/lib/fetch-news';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CyberGuard — Cybersecurity Awareness & Threat Detection',
  description:
    'Scan URLs, check passwords, analyze email headers, and learn about cybersecurity threats.',
};

const tools = [
  {
    href: '/scanner',
    icon: '🔍',
    title: 'URL Scanner',
    description:
      'Check any suspicious link against Google Safe Browsing to detect phishing, malware, and unwanted software.',
    cta: 'Scan a URL',
    color: 'border-sky-700 hover:border-sky-500',
  },
  {
    href: '/password-check',
    icon: '🔑',
    title: 'Password Checker',
    description:
      'Evaluate password strength in real-time and check if it has appeared in known data breaches — without sending your password anywhere.',
    cta: 'Check Password',
    color: 'border-green-700 hover:border-green-500',
  },
  {
    href: '/email-analyzer',
    icon: '📧',
    title: 'Email Header Analyzer',
    description:
      'Paste raw email headers to detect spoofing, suspicious relay paths, and domain mismatches.',
    cta: 'Analyze Headers',
    color: 'border-amber-700 hover:border-amber-500',
  },
  {
    href: '/quiz',
    icon: '🧠',
    title: 'Phishing Quiz',
    description:
      'Test your ability to spot phishing emails, smishing texts, and fake websites across 15 real-world scenarios.',
    cta: 'Take the Quiz',
    color: 'border-purple-700 hover:border-purple-500',
  },
];

export default async function HomePage() {
  noStore(); // always fetch news fresh on every request, never statically bake it in
  const news = await fetchNews();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Hero */}
      <section className="text-center py-16">
        <div className="inline-flex items-center gap-2 bg-[#0ea5e9]/10 border border-[#0ea5e9]/30 text-[#0ea5e9] text-sm font-medium px-4 py-1.5 rounded-full mb-6">
          <span>🛡️</span> Cybersecurity Awareness Platform
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight mb-4">
          Stay Safe Online with
          <br />
          <span className="text-[#0ea5e9]">Real Threat Intelligence</span>
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-8">
          Scan suspicious URLs, check if your passwords have been breached, analyze email headers for
          spoofing, and sharpen your phishing detection skills — all in one place.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/scanner"
            className="bg-[#0ea5e9] hover:bg-sky-400 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            🔍 Scan a URL
          </Link>
          <Link
            href="/quiz"
            className="bg-[#1e293b] hover:bg-[#334155] border border-[#1e3a5f] text-white font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            🧠 Take the Quiz
          </Link>
          <Link
            href="/learn"
            className="bg-[#1e293b] hover:bg-[#334155] border border-[#1e3a5f] text-white font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            📚 Threat Library
          </Link>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-white mb-2">Security Tools</h2>
        <p className="text-slate-400 mb-6">Practical tools powered by real threat intelligence APIs.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {tools.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className={`bg-[#1e293b] border ${tool.color} rounded-xl p-5 flex flex-col gap-3 transition-colors group`}
            >
              <span className="text-3xl">{tool.icon}</span>
              <h3 className="text-white font-semibold text-base group-hover:text-[#0ea5e9] transition-colors">
                {tool.title}
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed flex-1">{tool.description}</p>
              <span className="text-[#0ea5e9] text-sm font-medium">{tool.cta} →</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-[#1e293b] border border-[#1e3a5f] rounded-xl p-6 mb-16 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
        {[
          { value: '10K+', label: 'Daily URL Scans (Google)' },
          { value: '15B+', label: 'Breached Passwords (HIBP)' },
          { value: '15', label: 'Quiz Questions' },
          { value: '6', label: 'Threat Categories' },
        ].map((stat) => (
          <div key={stat.label}>
            <p className="text-2xl font-bold text-[#0ea5e9]">{stat.value}</p>
            <p className="text-slate-400 text-xs mt-1">{stat.label}</p>
          </div>
        ))}
      </section>

      {/* News Feed */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">Latest Cybersecurity News</h2>
            <p className="text-slate-400 text-sm">Real-time headlines from across the security community.</p>
          </div>
        </div>

        {news.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {news.map((article, i) => (
              <NewsCard key={i} article={article} />
            ))}
          </div>
        ) : (
          <div className="bg-[#1e293b] border border-[#1e3a5f] rounded-xl p-10 text-center">
            <p className="text-slate-400 text-lg mb-2">📰 No news available</p>
            <p className="text-slate-500 text-sm">
              Configure your <code className="text-sky-400">NEWS_API_KEY</code> in{' '}
              <code className="text-sky-400">.env.local</code> to display live headlines.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
