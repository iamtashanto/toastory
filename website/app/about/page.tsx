import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'About toastory — The All-in-One UI Feedback Toolkit',
  description:
    'Learn why toastory was built: unifying toasts, dialogs, action sheets, and loading overlays under an Apple-style frosted glass design with real spring physics and zero dependencies.',
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-20 text-left">
      {/* Header */}
      <div className="border-b border-[var(--site-border)] pb-8 mb-12">
        <span className="text-xs font-semibold text-blue-500 uppercase tracking-wider">Our Mission &amp; Story</span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-[var(--site-fg)] tracking-tight mt-1 mb-4">
          The Story Behind toastory
        </h1>
        <p className="text-base sm:text-lg text-[var(--site-muted)] max-w-2xl leading-relaxed">
          One unified UI feedback toolkit with Apple-grade glass aesthetics, real spring physics, and zero runtime dependencies — built for modern web and mobile applications.
        </p>
      </div>

      <div className="space-y-12 text-sm sm:text-base text-[var(--site-muted)] leading-relaxed">
        {/* The Problem */}
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-[var(--site-fg)]">Why Another Feedback Library?</h2>
          <p>
            For years, front-end developers have been forced to juggle multiple disjointed packages: one library for lightweight toasts (like Sonner or react-hot-toast), a different library for complex confirmation dialogs and prompts (like SweetAlert2), another custom implementation for bottom sheets or loading HUDs, and entirely distinct solutions when moving between React, Vue, Svelte, Angular, or React Native.
          </p>
          <p>
            This fragmentation causes bloated bundles, conflicting z-index stacks, inconsistent visual designs, and duplicate keyboard accessibility bugs.
          </p>
          <div className="p-6 rounded-2xl border border-[var(--site-border)] bg-[var(--site-surface-raised)] space-y-3">
            <h3 className="font-semibold text-[var(--site-fg)]">The toastory Solution:</h3>
            <p className="text-sm">
              <strong>toastory</strong> delivers the complete spectrum of UI feedback in a single npm package: toast notifications, confirm / prompt / alert dialogs, action sheets, bottom sheets, loading overlays, and multi-step dialogs. Same intuitive API, identical Apple-style frosted glass aesthetic, and guaranteed zero runtime dependencies.
            </p>
          </div>
        </section>

        {/* 4 Architectural Pillars */}
        <section className="space-y-6">
          <h2 className="text-xl sm:text-2xl font-bold text-[var(--site-fg)]">Core Engineering Pillars</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl border border-[var(--site-border)] bg-[var(--site-surface)] space-y-2">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold text-sm">
                01
              </div>
              <h3 className="font-bold text-[var(--site-fg)]">Zero Runtime Dependencies</h3>
              <p className="text-xs text-[var(--site-muted)]">
                No third-party runtime bloat. Zero supply-chain security risks. Pure, hand-crafted TypeScript with optional framework peer dependencies.
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-[var(--site-border)] bg-[var(--site-surface)] space-y-2">
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold text-sm">
                02
              </div>
              <h3 className="font-bold text-[var(--site-fg)]">Real Spring Physics &amp; Sound</h3>
              <p className="text-xs text-[var(--site-muted)]">
                Native spring entrance overshoot, 1:1 pointer tracking, velocity-based fling discard in all directions, and 14 synthesized Web Audio cues.
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-[var(--site-border)] bg-[var(--site-surface)] space-y-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-sm">
                03
              </div>
              <h3 className="font-bold text-[var(--site-fg)]">&lt; 6 KB Gzip Budget</h3>
              <p className="text-xs text-[var(--site-muted)]">
                Strictly enforced size limits: core + toast + 1 theme is under 6.00 KB gzip. Tree-shakable so unused dialogs and themes add 0 bytes.
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-[var(--site-border)] bg-[var(--site-surface)] space-y-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold text-sm">
                04
              </div>
              <h3 className="font-bold text-[var(--site-fg)]">WCAG 2.2 AA Accessibility</h3>
              <p className="text-xs text-[var(--site-muted)]">
                100% accessible: ARIA live regions, focus trap &amp; restore, ESC handling, contrast-checked tokens, and prefers-reduced-motion safety.
              </p>
            </div>
          </div>
        </section>

        {/* Creator & Support Section */}
        <section className="space-y-6 pt-4 border-t border-[var(--site-border)]">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 p-8 rounded-3xl border border-rose-500/25 bg-gradient-to-br from-rose-500/10 via-[var(--site-surface)] to-purple-500/10 shadow-xl">
            <div className="space-y-3 max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/15 text-rose-400 border border-rose-500/30">
                <span>Creator &amp; Maintainer</span>
              </div>
              <h3 className="text-2xl font-bold text-[var(--site-fg)]">Crafted by TA Shanto</h3>
              <p className="text-sm text-[var(--site-muted)] leading-relaxed">
                toastory is independently authored and maintained with passion for open-source excellence, thoughtful UX details, and high-performance software engineering.
              </p>
              <p className="text-sm text-[var(--site-muted)] leading-relaxed">
                If toastory speeds up your development workflow or elevates your product’s user experience, consider supporting ongoing research and maintenance.
              </p>
            </div>

            <div className="flex flex-col gap-3 w-full sm:w-auto shrink-0">
              <a
                href="https://www.supportkori.com/iamtashanto"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-semibold text-sm shadow-lg shadow-rose-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
                <span>Support on SupportKori</span>
              </a>

              <a
                href="https://github.com/iamtashanto/toastory"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[var(--site-surface-raised)] hover:bg-[var(--site-surface)] border border-[var(--site-border)] text-[var(--site-fg)] font-semibold text-xs transition-colors"
              >
                <span>Star on GitHub ★</span>
              </a>
            </div>
          </div>
        </section>

        {/* Quick Links */}
        <section className="flex flex-wrap items-center justify-between gap-4 pt-4 text-xs text-[var(--site-muted)]">
          <Link href="/playground" className="text-blue-400 hover:underline">
            ← Explore Live Studio Playground
          </Link>
          <Link href="/docs" className="text-blue-400 hover:underline">
            Read Documentation &amp; Guides →
          </Link>
        </section>
      </div>
    </div>
  );
}
