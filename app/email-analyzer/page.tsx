'use client';

import { useState } from 'react';
import { parseEmailHeaders } from '@/lib/email-parser';
import type { ParsedEmailHeader } from '@/lib/types';

const MAX_HEADER_LENGTH = 50000;

export default function EmailAnalyzerPage() {
  const [raw, setRaw] = useState('');
  const [result, setResult] = useState<ParsedEmailHeader | null>(null);
  const [error, setError] = useState('');

  function handleAnalyze() {
    setError('');
    setResult(null);

    if (!raw.trim()) {
      setError('Please paste email headers before analyzing.');
      return;
    }

    if (raw.length > MAX_HEADER_LENGTH) {
      setError(`Input is too large. Maximum allowed: ${MAX_HEADER_LENGTH.toLocaleString()} characters.`);
      return;
    }

    try {
      const parsed = parseEmailHeaders(raw);
      setResult(parsed);
    } catch {
      setError('Failed to parse headers. Please ensure you pasted raw email header text.');
    }
  }

  const fields: { key: keyof ParsedEmailHeader; label: string }[] = [
    { key: 'from', label: 'From' },
    { key: 'replyTo', label: 'Reply-To' },
    { key: 'returnPath', label: 'Return-Path' },
    { key: 'messageId', label: 'Message-ID' },
    { key: 'originatingIp', label: 'X-Originating-IP' },
  ];

  const flaggedFields = new Set(result?.flags.map((f) => f.field) ?? []);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">📧 Email Header Analyzer</h1>
        <p className="text-slate-400">
          Paste the raw headers from a suspicious email to detect spoofing, domain mismatches,
          unusual relay paths, and other red flags. Analysis runs entirely in your browser — no
          data is sent to any server.
        </p>
      </div>

      {/* How to get headers */}
      <details className="bg-[#1e293b] border border-[#1e3a5f] rounded-xl p-4 mb-6 group">
        <summary className="cursor-pointer text-slate-300 text-sm font-medium list-none flex items-center justify-between">
          <span>📖 How to copy email headers</span>
          <span className="text-slate-500 group-open:rotate-180 transition-transform">▾</span>
        </summary>
        <ul className="mt-3 space-y-1.5 text-slate-400 text-sm">
          <li><strong className="text-slate-300">Gmail:</strong> Open email → ⋮ menu → "Show original" → Copy the full text</li>
          <li><strong className="text-slate-300">Outlook:</strong> Open email → File → Properties → Internet headers</li>
          <li><strong className="text-slate-300">Apple Mail:</strong> View → Message → All Headers, then select all</li>
          <li><strong className="text-slate-300">Thunderbird:</strong> View → Headers → All</li>
        </ul>
      </details>

      <div className="bg-[#1e293b] border border-[#1e3a5f] rounded-xl p-6 mb-6">
        <label htmlFor="header-input" className="block text-sm font-medium text-slate-300 mb-2">
          Raw email headers{' '}
          <span className="text-slate-500 font-normal">(max {MAX_HEADER_LENGTH.toLocaleString()} chars)</span>
        </label>
        <textarea
          id="header-input"
          rows={14}
          value={raw}
          onChange={(e) => setRaw(e.target.value.slice(0, MAX_HEADER_LENGTH))}
          placeholder={`Received: from mail.example.com (mail.example.com [192.168.1.1])
        by mx.google.com with ESMTP ...
From: "Suspicious Sender" <admin@paypa1.com>
Reply-To: collect@attacker-server.net
Message-ID: <abc123@mail.example.com>
Subject: Urgent: Verify your account
...`}
          className="w-full bg-[#0f172a] border border-[#334155] text-slate-100 placeholder-slate-600 rounded-lg px-4 py-3 text-xs font-mono focus:outline-none focus:border-[#0ea5e9] transition-colors resize-y"
        />
        <div className="flex items-center justify-between mt-3">
          <span className="text-xs text-slate-500">{raw.length.toLocaleString()} / {MAX_HEADER_LENGTH.toLocaleString()} characters</span>
          <div className="flex gap-3">
            <button
              onClick={() => { setRaw(''); setResult(null); setError(''); }}
              className="text-sm text-slate-400 hover:text-white transition-colors"
            >
              Clear
            </button>
            <button
              onClick={handleAnalyze}
              className="bg-[#0ea5e9] hover:bg-sky-400 text-white font-semibold px-5 py-2 rounded-lg transition-colors text-sm"
            >
              Analyze Headers
            </button>
          </div>
        </div>
        {error && <p className="mt-2 text-red-400 text-sm">{error}</p>}
      </div>

      {result && (
        <div className="space-y-6">
          {/* Flags summary */}
          {result.flags.length > 0 ? (
            <div className="bg-red-900/20 border border-red-700 rounded-xl p-5">
              <h2 className="text-red-300 font-semibold mb-3 flex items-center gap-2">
                <span>🚨</span> {result.flags.length} Suspicious Indicator{result.flags.length !== 1 ? 's' : ''} Detected
              </h2>
              <div className="space-y-3">
                {result.flags.map((flag, i) => (
                  <div
                    key={i}
                    className={`p-3 rounded-lg border ${
                      flag.severity === 'danger'
                        ? 'bg-red-900/30 border-red-700'
                        : 'bg-amber-900/30 border-amber-700'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#0f172a] text-slate-300">
                        {flag.field}
                      </span>
                      <span
                        className={`text-xs font-semibold uppercase ${
                          flag.severity === 'danger' ? 'text-red-400' : 'text-amber-400'
                        }`}
                      >
                        {flag.severity}
                      </span>
                    </div>
                    <p className={`text-sm ${flag.severity === 'danger' ? 'text-red-300' : 'text-amber-300'}`}>
                      {flag.message}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-green-900/20 border border-green-700 rounded-xl p-5">
              <p className="text-green-300 font-semibold flex items-center gap-2">
                <span>✅</span> No suspicious indicators detected
              </p>
              <p className="text-green-400 text-sm mt-1">
                The headers appear normal. Always exercise caution and verify the sender through known channels if unsure.
              </p>
            </div>
          )}

          {/* Parsed fields table */}
          <div className="bg-[#1e293b] border border-[#1e3a5f] rounded-xl overflow-hidden">
            <div className="px-5 py-3 border-b border-[#1e3a5f]">
              <h2 className="text-white font-semibold">Extracted Header Fields</h2>
            </div>
            <div className="divide-y divide-[#1e3a5f]">
              {fields.map(({ key, label }) => {
                const value = result[key] as string;
                const isFlagged = flaggedFields.has(label);
                return (
                  <div
                    key={key}
                    className={`px-5 py-3 flex flex-col sm:flex-row gap-1 sm:gap-4 ${
                      isFlagged ? 'bg-amber-900/10' : ''
                    }`}
                  >
                    <dt className="text-slate-400 text-xs font-medium w-36 shrink-0 pt-0.5 font-mono">
                      {label}
                      {isFlagged && <span className="ml-2 text-amber-400">⚠</span>}
                    </dt>
                    <dd className="text-slate-200 text-sm break-all font-mono">
                      {value || <span className="text-slate-500 italic">not found</span>}
                    </dd>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Received chain */}
          {result.receivedChain.length > 0 && (
            <div className="bg-[#1e293b] border border-[#1e3a5f] rounded-xl overflow-hidden">
              <div className="px-5 py-3 border-b border-[#1e3a5f] flex items-center justify-between">
                <h2 className="text-white font-semibold">Email Relay Chain</h2>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  result.receivedChain.length > 5
                    ? 'bg-amber-900/50 text-amber-400 border border-amber-700'
                    : 'bg-[#0f172a] text-slate-400'
                }`}>
                  {result.receivedChain.length} hop{result.receivedChain.length !== 1 ? 's' : ''}
                </span>
              </div>
              <div className="divide-y divide-[#1e3a5f]">
                {result.receivedChain.map((hop, i) => (
                  <div key={i} className="px-5 py-3 flex gap-3">
                    <span className="text-slate-500 text-xs font-mono w-6 shrink-0 pt-0.5">
                      {result.receivedChain.length - i}
                    </span>
                    <p className="text-slate-300 text-xs font-mono break-all">{hop}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
