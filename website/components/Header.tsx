'use client';

import React, { useState, useEffect, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ui } from 'toastory';
import { SearchModal } from './SearchModal';

function subscribeToTheme(callback: () => void) {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener('storage', callback);
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  return () => {
    window.removeEventListener('storage', callback);
    observer.disconnect();
  };
}

function getThemeSnapshot(): 'dark' | 'light' {
  if (typeof window === 'undefined') return 'dark';
  const saved = localStorage.getItem('toastory-theme');
  const docMode = document.documentElement.getAttribute('data-theme') as 'dark' | 'light' | null;
  return (saved === 'light' || saved === 'dark' ? saved : docMode) || 'dark';
}

function getThemeServerSnapshot(): 'dark' | 'light' {
  return 'dark';
}

export function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const themeMode = useSyncExternalStore(subscribeToTheme, getThemeSnapshot, getThemeServerSnapshot);
  const pathname = usePathname();

  useEffect(() => {
    ui.configure({ mode: themeMode });
  }, [themeMode]);

  useEffect(() => {
    // Keyboard shortcut to open search modal
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      } else if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleTheme = () => {
    const next = themeMode === 'dark' ? 'light' : 'dark';
    localStorage.setItem('toastory-theme', next);
    document.documentElement.setAttribute('data-theme', next);
    if (next === 'light') {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
    }
    ui.configure({ mode: next });
  };

  const navLinks = [
    { label: 'Features', href: '/features' },
    { label: 'Themes', href: '/themes' },
    { label: 'Playground', href: '/playground' },
    { label: 'Docs', href: '/docs' },
    { label: 'Recipes', href: '/docs/recipes/form-submission' },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-[var(--site-border)] bg-[var(--site-surface)] backdrop-blur-xl backdrop-saturate-150 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Logo & Version */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-cyan-400 p-[1px] shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
                <div className="w-full h-full bg-[var(--site-bg)] rounded-[11px] flex items-center justify-center backdrop-blur-sm">
                  <svg className="w-5 h-5 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <rect x="3" y="3" width="18" height="18" rx="5" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </div>
              </div>
              <span className="font-bold text-lg tracking-tight text-[var(--site-fg)] flex items-center gap-1.5">
                toastory
              </span>
            </Link>

            <Link
              href="/changelog"
              className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-blue-500/10 text-blue-500 border border-blue-500/20 hover:bg-blue-500/20 transition-colors"
            >
              v0.1.1
            </Link>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6" aria-label="Main Navigation">
            {navLinks.map((link) => {
              const isActive = pathname.startsWith(link.href) && (link.href !== '/' || pathname === '/');
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors ${
                    isActive ? 'text-blue-500 font-semibold' : 'text-[var(--site-muted)] hover:text-[var(--site-fg)]'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Action Tools */}
          <div className="flex items-center gap-2.5">
            {/* Search Trigger Button */}
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--site-surface-raised)] border border-[var(--site-border)] text-[var(--site-muted)] hover:text-[var(--site-fg)] hover:bg-[var(--site-surface)] transition-colors text-sm"
              aria-label="Open documentation search"
            >
              <svg className="w-4 h-4 text-[var(--site-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span className="hidden sm:inline text-xs text-[var(--site-muted)]">Search</span>
              <kbd className="hidden lg:inline-flex items-center px-1.5 py-0.5 text-[10px] text-[var(--site-muted)] bg-[var(--site-surface)] border border-[var(--site-border)] rounded">
                ⌘K
              </kbd>
            </button>

            {/* Dark / Light Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded-lg text-[var(--site-muted)] hover:text-[var(--site-fg)] hover:bg-[var(--site-surface-raised)] transition-colors"
              aria-label={`Switch to ${themeMode === 'dark' ? 'light' : 'dark'} mode`}
              title="Toggle theme mode"
            >
              {themeMode === 'dark' ? (
                <svg className="w-4 h-4 text-amber-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>

            {/* GitHub Link */}
            <a
              href="https://github.com/iamtashanto/toastory"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg text-[var(--site-muted)] hover:text-[var(--site-fg)] hover:bg-[var(--site-surface-raised)] transition-colors"
              aria-label="toastory GitHub repository"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
            </a>

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-[var(--site-muted)] hover:text-[var(--site-fg)] hover:bg-[var(--site-surface-raised)]"
              aria-label="Toggle mobile menu"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-white/10 bg-[#0b0c12]/95 px-4 pt-3 pb-6 space-y-2 backdrop-blur-2xl">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2.5 rounded-lg text-base font-medium text-gray-300 hover:text-white hover:bg-white/5"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs text-gray-400 px-3">
              <span>Version: v0.1.0 (MIT)</span>
              <Link href="/changelog" onClick={() => setIsMobileMenuOpen(false)} className="text-blue-400">
                Changelog →
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Global Search Dialog Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}

