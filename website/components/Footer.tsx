import React from 'react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="w-full border-t border-white/10 bg-[#08090d] text-gray-400 py-16 px-4 sm:px-6 relative z-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-10">
        {/* Brand Column */}
        <div className="md:col-span-2 space-y-4">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-cyan-400 p-[1px]">
              <div className="w-full h-full bg-[#0b0c12] rounded-[7px] flex items-center justify-center">
                <svg className="w-4 h-4 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </div>
            </div>
            <span className="font-bold text-lg text-white">glazekit</span>
          </Link>
          <p className="text-sm text-gray-400 max-w-sm leading-relaxed">
            Complete UI feedback toolkit for modern web and mobile. Toasts, dialogs, bottom sheets, and loading overlays with an Apple-style frosted glass aesthetic.
          </p>
          <div className="flex flex-wrap items-center gap-2 pt-2 text-xs">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              Zero Dependencies
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-blue-400">
              WCAG 2.2 AA Verified
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-purple-400">
              MIT License
            </span>
          </div>
        </div>

        {/* Documentation Links */}
        <div>
          <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-3">Documentation</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/docs/getting-started/introduction" className="hover:text-white transition-colors">
                Introduction
              </Link>
            </li>
            <li>
              <Link href="/docs/getting-started/installation" className="hover:text-white transition-colors">
                Installation
              </Link>
            </li>
            <li>
              <Link href="/docs/getting-started/quickstart" className="hover:text-white transition-colors">
                Quickstart
              </Link>
            </li>
            <li>
              <Link href="/docs/guides/toasts" className="hover:text-white transition-colors">
                Toasts Guide
              </Link>
            </li>
            <li>
              <Link href="/docs/guides/dialogs" className="hover:text-white transition-colors">
                Dialogs & Prompts
              </Link>
            </li>
            <li>
              <Link href="/docs/theming/tokens" className="hover:text-white transition-colors">
                Token Reference
              </Link>
            </li>
          </ul>
        </div>

        {/* Interactive Hub */}
        <div>
          <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-3">Interactive Hub</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/playground" className="hover:text-white transition-colors">
                Live Playground
              </Link>
            </li>
            <li>
              <Link href="/themes" className="hover:text-white transition-colors">
                Themes Studio (21)
              </Link>
            </li>
            <li>
              <Link href="/features" className="hover:text-white transition-colors">
                Features Catalogue
              </Link>
            </li>
            <li>
              <Link href="/docs/accessibility/principles" className="hover:text-white transition-colors">
                Accessibility Report
              </Link>
            </li>
            <li>
              <Link href="/docs/recipes/form-submission" className="hover:text-white transition-colors">
                Recipe Library
              </Link>
            </li>
            <li>
              <Link href="/docs/api/core" className="hover:text-white transition-colors">
                API Reference
              </Link>
            </li>
          </ul>
        </div>

        {/* Community & Legal */}
        <div>
          <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-3">Trust & Security</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/changelog" className="hover:text-white transition-colors">
                Changelog (v0.1.0)
              </Link>
            </li>
            <li>
              <Link href="/roadmap" className="hover:text-white transition-colors">
                Public Roadmap
              </Link>
            </li>
            <li>
              <Link href="/security" className="hover:text-white transition-colors">
                Security Policy
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="hover:text-white transition-colors">
                Privacy Pledge
              </Link>
            </li>
            <li>
              <a
                href="https://github.com/glazekit/glazekit"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                GitHub Repository
              </a>
            </li>
            <li>
              <a
                href="https://www.npmjs.com/package/glazekit"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                npm Package
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 gap-4">
        <p>© 2026 glazekit maintainers. Released under the MIT License.</p>
        <p className="text-center sm:text-right">
          glazekit is an independent open-source project and is not affiliated with Sonner, React-Toastify, or SweetAlert2.
        </p>
      </div>
    </footer>
  );
}
