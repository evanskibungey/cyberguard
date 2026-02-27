import { notFound } from 'next/navigation';
import Link from 'next/link';
import threatsData from '@/data/threats.json';
import type { ThreatEntry } from '@/lib/types';
import type { Metadata } from 'next';

const threats: ThreatEntry[] = threatsData as ThreatEntry[];

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return threats.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const threat = threats.find((t) => t.slug === slug);
  if (!threat) return { title: 'Not Found' };
  return {
    title: threat.title,
    description: threat.summary,
  };
}

export default async function ThreatDetailPage({ params }: Props) {
  const { slug } = await params;
  const threat = threats.find((t) => t.slug === slug);

  if (!threat) {
    notFound();
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-400 mb-6">
        <Link href="/learn" className="hover:text-[#0ea5e9] transition-colors">
          Threat Library
        </Link>
        <span>›</span>
        <span className="text-slate-200">{threat.title}</span>
      </div>

      {/* Hero */}
      <div className="bg-[#1e293b] border border-[#1e3a5f] rounded-xl p-8 mb-6">
        <div className="text-6xl mb-4">{threat.icon}</div>
        <h1 className="text-4xl font-bold text-white mb-3">{threat.title}</h1>
        <p className="text-slate-300 text-lg leading-relaxed">{threat.summary}</p>
      </div>

      {/* Description */}
      <section className="mb-6">
        <h2 className="text-xl font-bold text-white mb-3">What is it?</h2>
        <div className="bg-[#1e293b] border border-[#1e3a5f] rounded-xl p-6">
          {threat.description.split('\n\n').map((para, i) => (
            <p key={i} className="text-slate-300 text-sm leading-relaxed mb-3 last:mb-0">
              {para}
            </p>
          ))}
        </div>
      </section>

      {/* Warning Signs */}
      <section className="mb-6">
        <h2 className="text-xl font-bold text-white mb-3">
          ⚠️ Warning Signs
        </h2>
        <div className="bg-amber-900/20 border border-amber-700 rounded-xl p-6">
          <ul className="space-y-2">
            {threat.warningSigns.map((sign, i) => (
              <li key={i} className="flex items-start gap-3 text-sm">
                <span className="text-amber-400 mt-0.5 shrink-0">▶</span>
                <span className="text-amber-100">{sign}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Prevention Tips */}
      <section className="mb-8">
        <h2 className="text-xl font-bold text-white mb-3">
          🛡️ How to Protect Yourself
        </h2>
        <div className="bg-green-900/20 border border-green-700 rounded-xl p-6">
          <ul className="space-y-2">
            {threat.preventionTips.map((tip, i) => (
              <li key={i} className="flex items-start gap-3 text-sm">
                <span className="text-green-400 mt-0.5 shrink-0">✓</span>
                <span className="text-green-100">{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Navigation */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          href="/learn"
          className="flex-1 bg-[#1e293b] border border-[#1e3a5f] hover:border-[#0ea5e9] text-slate-300 hover:text-white font-medium px-5 py-3 rounded-lg transition-colors text-center text-sm"
        >
          ← Back to Threat Library
        </Link>
        <Link
          href="/quiz"
          className="flex-1 bg-[#0ea5e9] hover:bg-sky-400 text-white font-semibold px-5 py-3 rounded-lg transition-colors text-center text-sm"
        >
          Test Your Knowledge →
        </Link>
      </div>

      {/* Other threats */}
      <div className="mt-10">
        <h3 className="text-lg font-bold text-white mb-4">Other Threat Categories</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {threats
            .filter((t) => t.slug !== threat.slug)
            .map((t) => (
              <Link
                key={t.slug}
                href={`/learn/${t.slug}`}
                className="bg-[#1e293b] border border-[#1e3a5f] hover:border-[#0ea5e9] rounded-lg p-3 text-sm transition-colors group"
              >
                <span className="text-xl">{t.icon}</span>
                <p className="text-slate-300 group-hover:text-[#0ea5e9] font-medium mt-1 transition-colors">
                  {t.title}
                </p>
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
}
