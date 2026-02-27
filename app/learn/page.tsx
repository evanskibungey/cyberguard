import Link from 'next/link';
import threatsData from '@/data/threats.json';
import type { ThreatEntry } from '@/lib/types';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Threat Library',
  description: 'Learn about common cybersecurity threats including phishing, malware, ransomware, and more.',
};

const threats: ThreatEntry[] = threatsData as ThreatEntry[];

export default function LearnPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">📚 Threat Awareness Library</h1>
        <p className="text-slate-400 max-w-2xl">
          Learn about the most common cybersecurity threats in plain language. Each guide covers
          what the attack is, how to recognize it, and how to protect yourself.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {threats.map((threat) => (
          <Link
            key={threat.slug}
            href={`/learn/${threat.slug}`}
            className="bg-[#1e293b] border border-[#1e3a5f] hover:border-[#0ea5e9] rounded-xl p-6 flex flex-col gap-3 transition-colors group"
          >
            <div className="text-4xl">{threat.icon}</div>
            <h2 className="text-white font-bold text-xl group-hover:text-[#0ea5e9] transition-colors">
              {threat.title}
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed flex-1">{threat.summary}</p>
            <div className="flex items-center gap-4 text-xs text-slate-500 mt-1">
              <span>⚠️ {threat.warningSigns.length} warning signs</span>
              <span>🛡️ {threat.preventionTips.length} prevention tips</span>
            </div>
            <span className="text-[#0ea5e9] text-sm font-medium">Learn more →</span>
          </Link>
        ))}
      </div>

      <div className="mt-12 bg-[#1e293b] border border-[#1e3a5f] rounded-xl p-6 text-center">
        <p className="text-slate-300 text-base mb-4">
          Ready to test your knowledge?
        </p>
        <Link
          href="/quiz"
          className="bg-[#0ea5e9] hover:bg-sky-400 text-white font-semibold px-6 py-3 rounded-lg transition-colors inline-block"
        >
          🧠 Take the Phishing Quiz
        </Link>
      </div>
    </div>
  );
}
