'use client';

import { useState, useRef } from 'react';
import ResultCard from '@/components/ResultCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import type { ScanResult } from '@/lib/types';
import type { Metadata } from 'next';

// Note: metadata cannot be exported from a 'use client' component.
// Add a wrapper server component if needed; title is set via layout template.

type RiskLevel = 'safe' | 'danger' | 'unknown';

const THREAT_LABELS: Record<string, string> = {
  MALWARE: 'Malware',
  SOCIAL_ENGINEERING: 'Social Engineering / Phishing',
  UNWANTED_SOFTWARE: 'Unwanted Software',
  POTENTIALLY_HARMFUL_APPLICATION: 'Potentially Harmful Application',
};

export default function ScannerPage() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState('');
  const [validationError, setValidationError] = useState('');
  const [disabled, setDisabled] = useState(false);
  const cooldownRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function validateUrl(input: string): boolean {
    try {
      const parsed = new URL(input);
      return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch {
      return false;
    }
  }

  async function handleScan(e: React.FormEvent) {
    e.preventDefault();
    setValidationError('');
    setError('');
    setResult(null);

    if (!url.trim()) {
      setValidationError('Please enter a URL to scan.');
      return;
    }

    if (!validateUrl(url.trim())) {
      setValidationError('Please enter a valid URL starting with http:// or https://');
      return;
    }

    setLoading(true);
    setDisabled(true);

    try {
      const res = await fetch('/api/scan-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? 'Scan failed. Please try again.');
      } else {
        setResult(data);
      }
    } catch {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
      // Rate-limit UX: disable for 2 seconds
      cooldownRef.current = setTimeout(() => setDisabled(false), 2000);
    }
  }

  function getLevel(): RiskLevel {
    if (!result) return 'unknown';
    return result.safe ? 'safe' : 'danger';
  }

  function getTitle(): string {
    if (!result) return '';
    if (result.safe) return 'No threats detected';
    return `Threat detected: ${THREAT_LABELS[result.threatType ?? ''] ?? result.threatType}`;
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">🔍 URL Scanner</h1>
        <p className="text-slate-400">
          Paste any suspicious link below. We check it against Google&apos;s Safe Browsing database
          to detect phishing sites, malware, and unwanted software.
        </p>
      </div>

      <form onSubmit={handleScan} className="bg-[#1e293b] border border-[#1e3a5f] rounded-xl p-6">
        <label htmlFor="url-input" className="block text-sm font-medium text-slate-300 mb-2">
          URL to scan
        </label>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            id="url-input"
            type="text"
            value={url}
            onChange={(e) => { setUrl(e.target.value); setValidationError(''); }}
            placeholder="https://example.com/suspicious-link"
            className="flex-1 bg-[#0f172a] border border-[#334155] text-slate-100 placeholder-slate-500 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#0ea5e9] transition-colors"
            autoComplete="off"
            spellCheck={false}
          />
          <button
            type="submit"
            disabled={disabled || loading}
            className="bg-[#0ea5e9] hover:bg-sky-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold px-6 py-3 rounded-lg transition-colors text-sm whitespace-nowrap"
          >
            {loading ? 'Scanning…' : 'Scan URL'}
          </button>
        </div>

        {validationError && (
          <p className="mt-2 text-red-400 text-sm">{validationError}</p>
        )}

        <p className="mt-3 text-xs text-slate-500">
          Tip: Try <code className="text-sky-400">https://google.com</code> (safe) or{' '}
          <code className="text-sky-400">https://testsafebrowsing.appspot.com/s/phishing.html</code> (test threat).
        </p>
      </form>

      {loading && <LoadingSpinner message="Scanning URL against threat databases…" />}

      {error && !loading && (
        <div className="mt-6 bg-red-900/30 border border-red-700 rounded-xl p-4 flex items-start gap-3">
          <span className="text-red-400 text-xl">⚠️</span>
          <div>
            <p className="text-red-300 font-medium">Scan failed</p>
            <p className="text-red-400 text-sm mt-1">{error}</p>
            <button
              onClick={() => setError('')}
              className="mt-2 text-sm text-red-300 hover:text-white underline"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {result && !loading && (
        <ResultCard
          level={getLevel()}
          title={getTitle()}
          details={[
            { label: 'URL Scanned', value: url },
            ...(result.threatType
              ? [
                  { label: 'Threat Type', value: THREAT_LABELS[result.threatType] ?? result.threatType },
                  { label: 'Platform', value: result.platform ?? 'Any Platform' },
                ]
              : []),
          ]}
        >
          {result.safe ? (
            <p className="text-green-400 text-sm">
              This URL was not found in Google&apos;s Safe Browsing threat lists. Exercise normal caution
              when visiting any website.
            </p>
          ) : (
            <p className="text-red-300 text-sm">
              ⚠️ Do not visit this URL. It has been flagged in Google&apos;s threat database. If you
              received this link via email or message, report it as phishing.
            </p>
          )}
        </ResultCard>
      )}
    </div>
  );
}
