'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const navLinks = [
  { href: '/', label: 'Dashboard' },
  { href: '/scanner', label: 'URL Scanner' },
  { href: '/password-check', label: 'Password Check' },
  { href: '/email-analyzer', label: 'Email Analyzer' },
  { href: '/quiz', label: 'Phishing Quiz' },
  { href: '/learn', label: 'Threat Library' },
  { href: '/about', label: 'About' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-[#0f172a] border-b border-[#1e3a5f] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 text-[#0ea5e9] font-bold text-lg tracking-tight">
            <span className="text-2xl">🛡️</span>
            <span className="hidden sm:inline">CyberGuard</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? 'bg-[#0ea5e9] text-white'
                    : 'text-slate-300 hover:text-white hover:bg-[#1e3a5f]'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Hamburger */}
          <button
            className="lg:hidden p-2 rounded-md text-slate-300 hover:text-white hover:bg-[#1e3a5f] transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden bg-[#0f172a] border-t border-[#1e3a5f] px-4 pb-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={`block px-3 py-2 rounded-md text-sm font-medium mt-1 transition-colors ${
                pathname === link.href
                  ? 'bg-[#0ea5e9] text-white'
                  : 'text-slate-300 hover:text-white hover:bg-[#1e3a5f]'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
