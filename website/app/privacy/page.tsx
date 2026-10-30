import React from 'react';

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-20 text-left">
      <div className="border-b border-[var(--site-border)] pb-6 mb-12">
        <span className="text-xs font-semibold text-blue-500 uppercase tracking-wider">Privacy & Telemetry</span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-[var(--site-fg)] tracking-tight mt-1 mb-4">
          Privacy Pledge
        </h1>
        <p className="text-base text-[var(--site-muted)]">
          Our unambiguous commitment to user privacy: we collect zero personal data.
        </p>
      </div>

      <div className="space-y-6 text-sm sm:text-base text-[var(--site-muted)] leading-relaxed">
        <div className="p-6 rounded-2xl border border-emerald-500/25 bg-emerald-500/5 space-y-2">
          <div className="text-base font-bold text-[var(--site-fg)] flex items-center gap-2">
            <span className="text-emerald-500">✓</span>
            Zero Telemetry Policy
          </div>
          <p className="text-xs sm:text-sm text-[var(--site-muted)]">
            The official toastory website and published npm package collect <strong>no analytics, no telemetry, no cookies, and no personal data</strong>.
          </p>
        </div>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-[var(--site-fg)]">1. What We Collect</h2>
          <p>
            <strong>Default: None.</strong> When visiting this website:
          </p>
          <ul className="list-disc list-inside space-y-1 text-[var(--site-muted)] pl-2">
            <li>No tracking cookies or marketing pixels are placed in your browser.</li>
            <li>No analytics scripts (such as Google Analytics or Facebook Pixel) are executed.</li>
            <li>No third-party font servers (like Google Fonts) are queried; all fonts use native system stacks.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-[var(--site-fg)]">2. Local Storage Usage</h2>
          <p>
            The website uses minimal local client-side state solely to preserve user interface preferences:
          </p>
          <ul className="list-disc list-inside space-y-1 text-[var(--site-muted)] pl-2">
            <li>Your chosen dark or light mode preference.</li>
            <li>Playground URL hash fragments (stored strictly in your browser&apos;s address bar, never transmitted to a server).</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-[var(--site-fg)]">3. Package Security</h2>
          <p>
            The published <code className="px-1.5 py-0.5 rounded bg-[var(--site-surface-raised)] border border-[var(--site-border)] text-[var(--site-fg)] font-mono text-xs">toastory</code> npm package contains zero post-install scripts, telemetry beacons, or network requests. It runs 100% offline and sandbox-safe.
          </p>
        </section>
      </div>
    </div>
  );
}

