'use client';

import React from 'react';
import Link from 'next/link';
import { HeroDemo } from '@/components/HeroDemo';
import { FrameworkQuickstart } from '@/components/FrameworkQuickstart';
import { FeatureDemos } from '@/components/FeatureDemos';
import { ComparisonTable } from '@/components/ComparisonTable';

export default function HomePage() {
  return (
    <div className="relative overflow-hidden">
      {/* Background radial glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] pointer-events-none -z-10">
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-blue-600/15 rounded-full blur-[120px]" />
        <div className="absolute top-20 right-1/4 w-96 h-96 bg-purple-600/15 rounded-full blur-[140px]" />
      </div>

      <main id="main-content" className="max-w-7xl mx-auto px-4 sm:px-6 pt-12 sm:pt-20 pb-24">
        {/* 1. HERO SECTION */}
        <div className="text-center max-w-4xl mx-auto space-y-6">
          {/* Badge row */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--site-surface-raised)] border border-[var(--site-border)] text-xs text-[var(--site-muted)] shadow-sm">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-semibold text-[var(--site-fg)]">toastory v0.2.0</span>
            <span className="text-[var(--site-muted)]">•</span>
            <span>Zero Dependencies</span>
            <span className="text-[var(--site-muted)]">•</span>
            <span className="text-blue-500 font-mono font-medium">5.2 KB gzip</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-[var(--site-fg)] leading-[1.1]">
            All UI feedback in one package.{' '}
            <span className="text-gradient-accent">Apple-style glass.</span>
          </h1>

          {/* Subline */}
          <p className="text-base sm:text-xl text-[var(--site-muted)] max-w-2xl mx-auto leading-relaxed">
            Toasts, confirm / alert / prompt dialogs, bottom sheets, and loading overlays. One identical API across plain JS, React, Next.js, Vue, Nuxt, Angular, Svelte, and React Native.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href="/docs/getting-started/quickstart"
              className="px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5 active:translate-y-0"
            >
              Get Started in 2 Minutes →
            </Link>

            <Link
              href="/playground"
              className="px-6 py-3.5 rounded-xl bg-[var(--site-surface-raised)] hover:bg-[var(--site-surface)] border border-[var(--site-border)] text-[var(--site-fg)] font-semibold text-sm transition-all hover:-translate-y-0.5 active:translate-y-0 backdrop-blur-md shadow-sm"
            >
              Open Live Playground ↵
            </Link>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs text-[var(--site-muted)] pt-3">
            <span className="flex items-center gap-1.5 font-medium">
              <span className="text-emerald-500 font-bold">✓</span> WCAG 2.2 AA (0 axe errors)
            </span>
            <span className="text-[var(--site-muted)] opacity-40">•</span>
            <span className="flex items-center gap-1.5 font-medium">
              <span className="text-blue-500 font-bold">✓</span> TypeScript Strict
            </span>
            <span className="text-[var(--site-muted)] opacity-40">•</span>
            <span className="flex items-center gap-1.5 font-medium">
              <span className="text-purple-500 font-bold">✓</span> npm Provenance
            </span>
            <span className="text-[var(--site-muted)] opacity-40">•</span>
            <span className="flex items-center gap-1.5 font-medium">
              <span className="text-cyan-500 font-bold">✓</span> Tree-shakable CSS & JS
            </span>
          </div>
        </div>

        {/* 2. LIVE HERO DEMO */}
        <div className="mt-14 sm:mt-20">
          <HeroDemo />
        </div>

        {/* 3. EVERY PLATFORM SECTION */}
        <FrameworkQuickstart />

        {/* 4. FEATURE SECTIONS WITH LIVE DEMOS */}
        <FeatureDemos />

        {/* 5. HONEST COMPARISON TABLE */}
        <ComparisonTable />

        {/* 6. MIGRATION TEASERS */}
        <section className="my-20 p-8 rounded-3xl border border-[var(--site-border)] bg-[var(--site-surface)] text-left shadow-sm">
          <div className="max-w-3xl">
            <h3 className="text-xl sm:text-2xl font-bold text-[var(--site-fg)] mb-2">
              Migrating from Sonner, SweetAlert2 or React-Toastify?
            </h3>
            <p className="text-sm text-[var(--site-muted)] mb-6 leading-relaxed">
              toastory provides drop-in compatibility patterns with detailed side-by-side option maps so you can replace legacy dependencies in minutes.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <Link
                href="/docs/migration/sonner"
                className="p-3 rounded-xl bg-[var(--site-surface-raised)] border border-[var(--site-border)] hover:border-blue-500/40 text-[var(--site-fg)] text-xs font-medium transition-colors"
              >
                Sonner Migration Guide →
              </Link>
              <Link
                href="/docs/migration/sweetalert2"
                className="p-3 rounded-xl bg-[var(--site-surface-raised)] border border-[var(--site-border)] hover:border-blue-500/40 text-[var(--site-fg)] text-xs font-medium transition-colors"
              >
                SweetAlert2 Migration →
              </Link>
              <Link
                href="/docs/migration/react-toastify"
                className="p-3 rounded-xl bg-[var(--site-surface-raised)] border border-[var(--site-border)] hover:border-blue-500/40 text-[var(--site-fg)] text-xs font-medium transition-colors"
              >
                React-Toastify Migration →
              </Link>
              <Link
                href="/docs/migration/react-hot-toast"
                className="p-3 rounded-xl bg-[var(--site-surface-raised)] border border-[var(--site-border)] hover:border-blue-500/40 text-[var(--site-fg)] text-xs font-medium transition-colors"
              >
                react-hot-toast Migration →
              </Link>
            </div>
          </div>
        </section>

        {/* 7. FINAL CTA */}
        <section className="my-16 text-center space-y-6 max-w-2xl mx-auto py-12 px-6 rounded-3xl border border-blue-500/25 bg-blue-500/[0.04]">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--site-fg)]">
            Upgrade your UI feedback today.
          </h2>
          <p className="text-sm sm:text-base text-[var(--site-muted)]">
            Zero runtime dependencies. Apple-style frosted glass. Built for accessibility and multi-framework workflows.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href="/docs/getting-started/quickstart"
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all shadow-lg shadow-blue-500/30"
            >
              Read the Documentation →
            </Link>
            <Link
              href="/themes"
              className="px-6 py-3 rounded-xl bg-[var(--site-surface-raised)] hover:bg-[var(--site-surface)] border border-[var(--site-border)] text-[var(--site-fg)] font-semibold text-sm transition-all shadow-sm"
            >
              Explore 21 Themes
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
