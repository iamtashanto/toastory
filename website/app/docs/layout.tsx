'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { DOC_NAVIGATION } from '@/lib/docs/docs-data';

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex flex-col md:flex-row gap-8 items-start text-left">
      {/* Mobile nav toggle */}
      <div className="md:hidden w-full flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 mb-4">
        <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
          Docs Menu
        </span>
        <button
          type="button"
          onClick={() => setMobileNavOpen(!mobileNavOpen)}
          className="px-3 py-1 rounded-lg bg-blue-600 text-white text-xs font-medium"
        >
          {mobileNavOpen ? 'Close Menu' : 'Browse Topics ▾'}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`${
          mobileNavOpen ? 'block' : 'hidden'
        } md:block w-full md:w-64 flex-none sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto pr-3 space-y-8 scrollbar-thin scrollbar-thumb-white/10`}
        aria-label="Documentation Sidebar Navigation"
      >
        {DOC_NAVIGATION.map((section) => (
          <div key={section.title} className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--site-muted)] px-3">
              {section.title}
            </h4>
            <ul className="space-y-0.5 text-sm">
              {section.items.map((item) => {
                const href = `/docs/${item.slug}`;
                const isActive = pathname === href;
                return (
                  <li key={item.slug}>
                    <Link
                      href={href}
                      onClick={() => setMobileNavOpen(false)}
                      className={`block px-3 py-1.5 rounded-lg text-xs sm:text-sm transition-colors ${
                        isActive
                          ? 'bg-blue-500/15 text-blue-500 font-semibold border-l-2 border-blue-500 pl-2.5'
                          : 'text-[var(--site-muted)] hover:text-[var(--site-fg)] hover:bg-[var(--site-surface-raised)]'
                      }`}
                    >
                      {item.title}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </aside>

      {/* Main Documentation Content Area */}
      <div className="flex-1 w-full min-w-0 max-w-4xl">
        {children}
      </div>
    </div>
  );
}

