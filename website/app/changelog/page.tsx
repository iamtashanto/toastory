import React from 'react';

export default function ChangelogPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-20 text-left">
      <div className="border-b border-white/10 pb-6 mb-12">
        <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">Release History</span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mt-1 mb-4">
          Changelog
        </h1>
        <p className="text-base text-gray-400">
          Strict semver releases for the published \`toastory\` package, generated with Changesets and npm provenance.
        </p>
      </div>

      <div className="space-y-12">
        {/* Release v0.1.0 */}
        <section className="relative pl-6 sm:pl-8 border-l-2 border-blue-500 space-y-4">
          <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-blue-600 border-4 border-[#0b0c12]" />

          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-2xl font-bold text-white">v0.1.0 — Initial Release</h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30">
              Latest
            </span>
            <span className="text-xs text-gray-400 font-mono">October 2026</span>
          </div>

          <p className="text-sm text-gray-300 leading-relaxed">
            The initial production release of toastory. Full feature parity with market leaders plus a premium frosted glass design system.
          </p>

          <div className="space-y-4 pt-2 text-sm text-gray-300">
            <div>
              <h3 className="font-semibold text-white mb-2">Core Features:</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-400 text-xs sm:text-sm pl-2">
                <li><strong className="text-white">Unified Feedback Contract</strong>: One API for toasts, confirm modals, prompts, steps, bottom sheets, and loading overlays.</li>
                <li><strong className="text-white">Zero Runtime Dependencies</strong>: Published package contains 0 required dependencies.</li>
                <li><strong className="text-white">21 Theme Presets</strong>: Full Light and Dark mode permutations with mathematical contrast checks.</li>
                <li><strong className="text-white">WCAG 2.2 AA Compliance</strong>: Live regions, focus trapping, and Esc key dismissal with 0 automated axe violations.</li>
                <li><strong className="text-white">Multi-Framework Adapters</strong>: First-class subpaths for React, Next.js, Vue, Nuxt, Angular, Svelte, and React Native.</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
