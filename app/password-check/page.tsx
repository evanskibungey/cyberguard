'use client';

import { useState } from 'react';
import StrengthMeter from '@/components/StrengthMeter';
import { evaluatePassword } from '@/lib/password-strength';
import type { PasswordStrength } from '@/lib/types';

async function sha1Hex(str: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await window.crypto.subtle.digest('SHA-1', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('').toUpperCase();
}

export default function PasswordCheckPage() {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [strength, setStrength] = useState<PasswordStrength | null>(null);
  const [breachLoading, setBreachLoading] = useState(false);
  const [breachResult, setBreachResult] = useState<{ checked: boolean; count: number } | null>(null);
  const [breachError, setBreachError] = useState('');

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setPassword(val);
    setBreachResult(null);
    setBreachError('');
    if (val.length > 0) {
      setStrength(evaluatePassword(val));
    } else {
      setStrength(null);
    }
  }

  async function handleBreachCheck() {
    if (!password) return;
    setBreachLoading(true);
    setBreachError('');
    setBreachResult(null);

    try {
      const hash = await sha1Hex(password);
      const prefix = hash.slice(0, 5);
      const suffix = hash.slice(5);

      const res = await fetch('/api/breach-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prefix }),
      });

      if (!res.ok) {
        setBreachError('Breach check service unavailable. Try again later.');
        return;
      }

      const text = await res.text();
      const lines = text.split('\n');
      let count = 0;

      for (const line of lines) {
        const [hashSuffix, countStr] = line.trim().split(':');
        if (hashSuffix && hashSuffix.toUpperCase() === suffix) {
          count = parseInt(countStr, 10) || 0;
          break;
        }
      }

      setBreachResult({ checked: true, count });
    } catch {
      setBreachError('Network error during breach check. Please try again.');
    } finally {
      setBreachLoading(false);
    }
  }

  const score = strength?.score ?? 0;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">🔑 Password Checker</h1>
        <p className="text-slate-400">
          Evaluate password strength instantly and check if it has appeared in known data breaches.
          Your password never leaves your browser unencrypted.
        </p>
      </div>

      <div className="bg-[#1e293b] border border-[#1e3a5f] rounded-xl p-6 mb-6">
        <label htmlFor="password-input" className="block text-sm font-medium text-slate-300 mb-2">
          Enter a password to evaluate
        </label>
        <div className="relative">
          <input
            id="password-input"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={handleChange}
            placeholder="Type or paste a password…"
            className="w-full bg-[#0f172a] border border-[#334155] text-slate-100 placeholder-slate-500 rounded-lg px-4 py-3 pr-12 text-sm focus:outline-none focus:border-[#0ea5e9] transition-colors"
            autoComplete="new-password"
            maxLength={1000}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>
        </div>

        {password.length > 0 && (
          <StrengthMeter score={score as 0 | 1 | 2 | 3 | 4} />
        )}
      </div>

      {/* Strength details */}
      {strength && password.length > 0 && (
        <div className="bg-[#1e293b] border border-[#1e3a5f] rounded-xl p-6 mb-6">
          <h2 className="text-white font-semibold mb-4">Strength Analysis</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            {[
              { label: 'Uppercase', pass: /[A-Z]/.test(password) },
              { label: 'Lowercase', pass: /[a-z]/.test(password) },
              { label: 'Numbers', pass: /[0-9]/.test(password) },
              { label: 'Special chars', pass: /[^A-Za-z0-9]/.test(password) },
            ].map((item) => (
              <div
                key={item.label}
                className={`flex items-center gap-2 text-xs px-3 py-2 rounded-lg ${
                  item.pass
                    ? 'bg-green-900/30 border border-green-700 text-green-400'
                    : 'bg-[#0f172a] border border-[#334155] text-slate-500'
                }`}
              >
                <span>{item.pass ? '✓' : '✗'}</span>
                {item.label}
              </div>
            ))}
          </div>

          <div
            className={`text-xs px-3 py-2 rounded-lg mb-4 ${
              password.length >= 14
                ? 'bg-green-900/30 border border-green-700 text-green-400'
                : 'bg-amber-900/30 border border-amber-700 text-amber-400'
            }`}
          >
            {password.length >= 14 ? '✓' : '✗'} Length: {password.length} characters
            {password.length < 14 && ' (recommended: 14+)'}
          </div>

          {strength.tips.length > 0 && (
            <div>
              <p className="text-slate-400 text-sm font-medium mb-2">Improvement tips:</p>
              <ul className="space-y-1">
                {strength.tips.map((tip, i) => (
                  <li key={i} className="text-slate-400 text-sm flex items-start gap-2">
                    <span className="text-[#0ea5e9] mt-0.5">→</span> {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Breach check */}
      <div className="bg-[#1e293b] border border-[#1e3a5f] rounded-xl p-6">
        <h2 className="text-white font-semibold mb-1">Data Breach Check</h2>
        <p className="text-slate-400 text-sm mb-4">
          Checks whether this password appears in known breaches using the Have I Been Pwned
          k-anonymity model. Only the first 5 characters of a SHA-1 hash are sent — your
          actual password never leaves your device.
        </p>
        <button
          onClick={handleBreachCheck}
          disabled={!password || breachLoading}
          className="bg-[#0ea5e9] hover:bg-sky-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold px-5 py-2.5 rounded-lg transition-colors text-sm"
        >
          {breachLoading ? 'Checking…' : 'Check for Breaches'}
        </button>

        {breachError && (
          <p className="mt-3 text-red-400 text-sm">{breachError}</p>
        )}

        {breachResult && !breachLoading && (
          <div
            className={`mt-4 p-4 rounded-xl border ${
              breachResult.count > 0
                ? 'bg-red-900/30 border-red-700'
                : 'bg-green-900/30 border-green-700'
            }`}
          >
            {breachResult.count > 0 ? (
              <>
                <p className="text-red-300 font-semibold text-base">
                  ⚠️ Found in {breachResult.count.toLocaleString()} breach{breachResult.count !== 1 ? 'es' : ''}
                </p>
                <p className="text-red-400 text-sm mt-1">
                  This password has been exposed in known data breaches. Do not use it for any account.
                  Change it immediately if you are currently using it anywhere.
                </p>
              </>
            ) : (
              <>
                <p className="text-green-300 font-semibold text-base">
                  ✅ Not found in any known breaches
                </p>
                <p className="text-green-400 text-sm mt-1">
                  This password does not appear in the Have I Been Pwned database. This does not
                  guarantee absolute safety — always use a unique, strong password for each account.
                </p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
