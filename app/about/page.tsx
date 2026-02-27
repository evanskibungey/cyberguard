import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About',
  description: 'About the CyberGuard Cybersecurity Awareness & Threat Detection System.',
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">About CyberGuard</h1>
        <p className="text-slate-400">
          A student project demonstrating real-world cybersecurity awareness and threat detection.
        </p>
      </div>

      {/* Purpose */}
      <section className="bg-[#1e293b] border border-[#1e3a5f] rounded-xl p-6 mb-6">
        <h2 className="text-xl font-bold text-white mb-3">Project Purpose</h2>
        <p className="text-slate-300 text-sm leading-relaxed mb-3">
          CyberGuard is a web-based Cybersecurity Awareness and Threat Detection platform built as a
          student project. It serves two primary purposes: educating everyday users about common
          cybersecurity threats and providing practical tools to assess whether a URL, password, or
          email header is potentially dangerous.
        </p>
        <p className="text-slate-300 text-sm leading-relaxed">
          The system integrates with real threat intelligence APIs to produce genuine, non-simulated
          results — not fake data. Every tool reflects production-quality security practices used by
          real security researchers and developers.
        </p>
      </section>

      {/* Features */}
      <section className="bg-[#1e293b] border border-[#1e3a5f] rounded-xl p-6 mb-6">
        <h2 className="text-xl font-bold text-white mb-4">Features</h2>
        <div className="space-y-3">
          {[
            { icon: '🔍', title: 'URL Scanner', desc: 'Checks links against Google Safe Browsing database to detect phishing, malware, and unwanted software.' },
            { icon: '🔑', title: 'Password Checker', desc: 'Real-time strength evaluation and k-anonymity breach check via Have I Been Pwned — password never sent in plain text.' },
            { icon: '📧', title: 'Email Header Analyzer', desc: 'Parses raw email headers entirely in the browser to flag spoofing, relay anomalies, and domain mismatches.' },
            { icon: '🧠', title: 'Phishing Quiz', desc: '15-question interactive quiz covering email phishing, smishing, fake websites, and social engineering.' },
            { icon: '📚', title: 'Threat Library', desc: '6 detailed threat category pages explaining attack methods, warning signs, and prevention tips.' },
            { icon: '📰', title: 'Live News Feed', desc: 'Latest cybersecurity headlines pulled from NewsAPI, updated hourly.' },
          ].map((f) => (
            <div key={f.title} className="flex gap-3">
              <span className="text-xl shrink-0">{f.icon}</span>
              <div>
                <p className="text-slate-200 font-medium text-sm">{f.title}</p>
                <p className="text-slate-400 text-sm">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Tech Stack */}
      <section className="bg-[#1e293b] border border-[#1e3a5f] rounded-xl p-6 mb-6">
        <h2 className="text-xl font-bold text-white mb-4">Technology Stack</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#1e3a5f]">
                <th className="text-left text-slate-400 font-medium pb-2 pr-4">Technology</th>
                <th className="text-left text-slate-400 font-medium pb-2 pr-4">Version</th>
                <th className="text-left text-slate-400 font-medium pb-2">Purpose</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e3a5f]">
              {[
                { tech: 'Next.js', version: '16', purpose: 'Full-stack framework with App Router' },
                { tech: 'React', version: '19', purpose: 'UI component library' },
                { tech: 'TypeScript', version: '5', purpose: 'Type-safe JavaScript' },
                { tech: 'Tailwind CSS', version: '4', purpose: 'Utility-first styling' },
                { tech: 'Vercel', version: '—', purpose: 'Deployment and hosting' },
              ].map((row) => (
                <tr key={row.tech}>
                  <td className="py-2 pr-4 text-slate-200 font-medium">{row.tech}</td>
                  <td className="py-2 pr-4 text-slate-400 font-mono">{row.version}</td>
                  <td className="py-2 text-slate-400">{row.purpose}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* APIs */}
      <section className="bg-[#1e293b] border border-[#1e3a5f] rounded-xl p-6 mb-6">
        <h2 className="text-xl font-bold text-white mb-4">External APIs</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#1e3a5f]">
                <th className="text-left text-slate-400 font-medium pb-2 pr-4">API</th>
                <th className="text-left text-slate-400 font-medium pb-2 pr-4">Used For</th>
                <th className="text-left text-slate-400 font-medium pb-2">Free Tier</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e3a5f]">
              {[
                { api: 'Google Safe Browsing', use: 'URL threat detection', free: '10,000 req/day' },
                { api: 'Have I Been Pwned', use: 'Password breach check', free: 'Unlimited (no key)' },
                { api: 'NewsAPI', use: 'Cybersecurity news feed', free: '100 req/day' },
              ].map((row) => (
                <tr key={row.api}>
                  <td className="py-2 pr-4 text-slate-200 font-medium">{row.api}</td>
                  <td className="py-2 pr-4 text-slate-400">{row.use}</td>
                  <td className="py-2 text-[#0ea5e9]">{row.free}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Security notes */}
      <section className="bg-[#1e293b] border border-[#1e3a5f] rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-3">Security & Privacy</h2>
        <ul className="space-y-2 text-slate-300 text-sm">
          <li className="flex gap-2"><span className="text-green-400 mt-0.5">✓</span> All external API keys are stored server-side — never exposed to the browser.</li>
          <li className="flex gap-2"><span className="text-green-400 mt-0.5">✓</span> Password breach checks use k-anonymity: only 5 chars of a SHA-1 hash are transmitted.</li>
          <li className="flex gap-2"><span className="text-green-400 mt-0.5">✓</span> Email header analysis runs entirely in the browser — no header data is sent to any server.</li>
          <li className="flex gap-2"><span className="text-green-400 mt-0.5">✓</span> No user data, sessions, or scan history is stored. Every visit starts fresh.</li>
          <li className="flex gap-2"><span className="text-green-400 mt-0.5">✓</span> All user input is validated before any API call is made.</li>
        </ul>
      </section>
    </div>
  );
}
