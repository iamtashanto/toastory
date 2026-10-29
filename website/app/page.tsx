'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { HeroDemo } from '@/components/HeroDemo';
import { FrameworkQuickstart } from '@/components/FrameworkQuickstart';
import { FeatureDemos } from '@/components/FeatureDemos';
import { ComparisonTable } from '@/components/ComparisonTable';

export default function HomePage() {
  const [pkgManager, setPkgManager] = useState<'npm' | 'pnpm' | 'yarn' | 'bun'>('npm');
  const [installCopied, setInstallCopied] = useState(false);

  const installCommands = {
    npm: 'npm install toastory',
    pnpm: 'pnpm add toastory',
    yarn: 'yarn add toastory',
    bun: 'bun add toastory',
  };

  const handleCopyInstall = async () => {
    try {
      await navigator.clipboard.writeText(installCommands[pkgManager]);
      setInstallCopied(true);
      setTimeout(() => setInstallCopied(false), 2000);
    } catch {
      // fallback
    }
  };

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
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-gray-300">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold text-white">toastory v0.1.0</span>
            <span className="text-gray-500">•</span>
            <span>Zero Dependencies</span>
            <span className="text-gray-500">•</span>
            <span className="text-blue-400 font-mono">5.2 KB gzip</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1]">
            All UI feedback in one package.{' '}
            <span className="text-gradient-accent">Apple-style glass.</span>
          </h1>

          {/* Subline */}
          <p className="text-base sm:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
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
              className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white font-semibold text-sm transition-all hover:-translate-y-0.5 active:translate-y-0 backdrop-blur-md"
            >
              Open Live Playground ↵
            </Link>
          </div>

          {/* Copyable install command */}
          <div className="pt-4 max-w-md mx-auto">
            <div className="flex items-center justify-between p-1.5 rounded-xl bg-[#0e1017] border border-white/10 shadow-inner">
              {/* Package manager tabs */}
              <div className="flex items-center gap-1">
                {(['npm', 'pnpm', 'yarn', 'bun'] as const).map((pm) => (
                  <button
                    key={pm}
                    type="button"
                    onClick={() => setPkgManager(pm)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-colors ${
                      pkgManager === pm ? 'bg-white/15 text-white font-semibold' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {pm}
                  </button>
                ))}
              </div>

              {/* Command text & Copy */}
              <div className="flex items-center gap-2 pr-1">
                <span className="font-mono text-xs text-blue-400">{installCommands[pkgManager]}</span>
                <button
                  type="button"
                  onClick={handleCopyInstall}
                  className="p-1.5 rounded-md hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                  aria-label="Copy install command"
                >
                  {installCopied ? (
                    <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <rect x="9" y="9" width="13" height="13" rx="2" strokeWidth="2" />
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" strokeWidth="2" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-gray-400 pt-2">
            <span className="flex items-center gap-1.5">
              <span className="text-emerald-400">✓</span> WCAG 2.2 AA (0 axe errors)
            </span>
            <span className="text-gray-600">•</span>
            <span className="flex items-center gap-1.5">
              <span className="text-blue-400">✓</span> TypeScript Strict
            </span>
            <span className="text-gray-600">•</span>
            <span className="flex items-center gap-1.5">
              <span className="text-purple-400">✓</span> npm Provenance
            </span>
            <span className="text-gray-600">•</span>
            <span className="flex items-center gap-1.5">
              <span className="text-cyan-400">✓</span> Tree-shakable CSS & JS
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
        <section className="my-20 p-8 rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.03] to-transparent text-left">
          <div className="max-w-3xl">
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
              Migrating from Sonner, SweetAlert2 or React-Toastify?
            </h3>
            <p className="text-sm text-gray-400 mb-6 leading-relaxed">
              toastory provides drop-in compatibility patterns with detailed side-by-side option maps so you can replace legacy dependencies in minutes.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <Link
                href="/docs/migration/sonner"
                className="p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white text-xs font-medium transition-colors"
              >
                Sonner Migration Guide →
              </Link>
              <Link
                href="/docs/migration/sweetalert2"
                className="p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white text-xs font-medium transition-colors"
              >
                SweetAlert2 Migration →
              </Link>
              <Link
                href="/docs/migration/react-toastify"
                className="p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white text-xs font-medium transition-colors"
              >
                React-Toastify Migration →
              </Link>
              <Link
                href="/docs/migration/react-hot-toast"
                className="p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white text-xs font-medium transition-colors"
              >
                react-hot-toast Migration →
              </Link>
            </div>
          </div>
        </section>

        {/* 7. FINAL CTA */}
        <section className="my-16 text-center space-y-6 max-w-2xl mx-auto py-12 px-6 rounded-3xl border border-blue-500/20 bg-gradient-to-b from-blue-600/10 to-transparent">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Upgrade your UI feedback today.
          </h2>
          <p className="text-sm sm:text-base text-gray-300">
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
              className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-sm transition-all"
            >
              Explore 21 Themes
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
