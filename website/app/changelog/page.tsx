import React from 'react';

export default function ChangelogPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-20 text-left">
      <div className="border-b border-[var(--site-border)] pb-6 mb-12">
        <span className="text-xs font-semibold text-blue-500 uppercase tracking-wider">Release History</span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-[var(--site-fg)] tracking-tight mt-1 mb-4">
          Changelog
        </h1>
        <p className="text-base text-[var(--site-muted)]">
          Strict semver releases for the published `toastory` package, generated with Changesets and npm provenance.
        </p>
      </div>

      <div className="space-y-12">
        {/* Release v0.3.0 */}
        <section className="relative pl-6 sm:pl-8 border-l-2 border-purple-500 space-y-4">
          <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-purple-600 border-4 border-[var(--site-bg)]" />

          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-2xl font-bold text-[var(--site-fg)]">
              v0.3.0 — Real Spring Physics, Dynamic Island, 10 SVG Robot Mascots &amp; Full Lifecycle Audit
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-purple-500/20 text-purple-400 border border-purple-500/30">
              Latest
            </span>
            <span className="text-xs text-[var(--site-muted)] font-mono">November 2026</span>
          </div>

          <p className="text-sm text-[var(--site-muted)] leading-relaxed">
            Unified showcase release combining real analytical damped harmonic oscillator spring physics, 4-way velocity fling swipe dismissal, Apple Dynamic Island morphing, 10 animated SVG robot mascots, 14 acoustic mallet Web Audio cues, custom close/discard controls, and drop-in <code>react-native-toast-message</code> v2.5.2 compatibility.
          </p>

          <div className="space-y-4 pt-2 text-sm text-[var(--site-muted)]">
            <div>
              <h3 className="font-semibold text-[var(--site-fg)] mb-2">Key Highlights:</h3>
              <ul className="list-disc list-inside space-y-1.5 text-[var(--site-muted)] text-xs sm:text-sm pl-2">
                <li><strong className="text-[var(--site-fg)]">Real Spring Physics &amp; Velocity Fling</strong>: Analytical damped harmonic oscillator solver (<code>springPosition</code>, <code>springEasing</code>, <code>Spring.snappy | bouncy | gentle | smooth | default</code>) with 4-direction pointer velocity tracking and momentum fling dismissal.</li>
                <li><strong className="text-[var(--site-fg)]">10 Animated SVG Robot Mascots</strong>: Built-in <code>character</code> / <code>robotVariant</code> prop with 10 animated SVG mascots (<code>idle</code>, <code>wave</code>, <code>success</code>, <code>error</code>, <code>think</code>, <code>loading</code>, <code>sleep</code>, <code>shock</code>, <code>search</code>, <code>headPalm</code>).</li>
                <li><strong className="text-[var(--site-fg)]">Dynamic Island Morphing &amp; Silent HUD</strong>: <code>island: true</code> morphs from a compact capsule into a full interactive card; <code>hud: true</code> renders compact non-intrusive HUD pills.</li>
                <li><strong className="text-[var(--site-fg)]">Custom Discard / Close Text &amp; Icons</strong>: Full control over close button labels and icons via <code>closeText</code>, <code>discardText</code>, <code>closeIcon</code>, and <code>discardIcon</code>.</li>
                <li><strong className="text-[var(--site-fg)]">Rich Banners, Badges, Timestamps &amp; Switches</strong>: Added <code>image</code> header banners, <code>kbd</code> shortcut badges, relative <code>timestamp</code>, and interactive <code>toggle</code> switches.</li>
                <li><strong className="text-[var(--site-fg)]">14 Web Audio Synthesizer Cues</strong>: Added acoustic mallet and ambient cues (<code>marimba</code>, <code>crystal</code>, <code>subtle</code>, <code>harp</code>) with automatic filter node cleanup.</li>
                <li><strong className="text-[var(--site-fg)]">RN Toast Message v2.5.2 Compatibility</strong>: Added <code>Toast.show(&#123; type, text1, text2, visibilityTime, autoHide &#125;)</code> and <code>Toast.hide()</code> across Core, Web, and React Native.</li>
                <li><strong className="text-[var(--site-fg)]">Zero-Leak Memory &amp; SSR Hardening</strong>: Audited and hardened listener cleanup, modal scroll restoration, OTP timer guards, and React <code>useSyncExternalStore</code> SSR snapshots while keeping Core + Toast + 1 Theme at <code>5.97 KB</code> gzip.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Release v0.2.0 */}
        <section className="relative pl-6 sm:pl-8 border-l-2 border-blue-500 space-y-4">
          <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-blue-600 border-4 border-[var(--site-bg)]" />

          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-2xl font-bold text-[var(--site-fg)]">v0.2.0 — 7 Placement Positions, Synthesized Sound Engine & Native Presets</h2>
            <span className="text-xs text-[var(--site-muted)] font-mono">November 2026</span>
          </div>

          <p className="text-sm text-[var(--site-muted)] leading-relaxed">
            Full 7-position layout with center placement, zero-dependency Web Audio harmonic sound synthesizer, closed-form CSS spring easing curve generation, React Native/Expo spring presets and haptics, and complete multi-framework parity.
          </p>

          <div className="space-y-4 pt-2 text-sm text-[var(--site-muted)]">
            <div>
              <h3 className="font-semibold text-[var(--site-fg)] mb-2">Key Highlights:</h3>
              <ul className="list-disc list-inside space-y-1 text-[var(--site-muted)] text-xs sm:text-sm pl-2">
                <li><strong className="text-[var(--site-fg)]">7 Toast Positions</strong>: Complete support for `top-left`, `top-center`, `top-right`, `center` / `middle`, `bottom-left`, `bottom-center`, and `bottom-right`.</li>
                <li><strong className="text-[var(--site-fg)]">Harmonic Sound Engine</strong>: Zero-dependency Web Audio API synthesizer with 10 built-in cues (`success`, `error`, `warning`, `info`, `ding`, `pop`, `chime`, `bell`, `message`, `bubble`) + custom notes and audio URLs.</li>
                <li><strong className="text-[var(--site-fg)]">Closed-Form CSS Spring Easing</strong>: <code>springEasing(&#123; stiffness, damping, mass &#125;)</code> in <code>toastory/core</code> baking physics into GPU-accelerated CSS <code>linear(...)</code> curves.</li>
                <li><strong className="text-[var(--site-fg)]">4-Direction Swipe Dismissal</strong>: Center toasts support natural 4-way gesture flick (`up`, `down`, `left`, `right`).</li>
                <li><strong className="text-[var(--site-fg)]">React Native & Expo Floating Island</strong>: `nativeSpring` (`glide`, `snappy`), `nativeTiming` (`normal`, `exit`), `gap`, `closeButton`, `visibleToasts`, and non-blocking `expo-haptics`.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Release v0.1.3 */}
        <section className="relative pl-6 sm:pl-8 border-l-2 border-[var(--site-border)] space-y-4">
          <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-[var(--site-border)] border-4 border-[var(--site-bg)]" />

          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-2xl font-bold text-[var(--site-fg)]">v0.1.3 — Premium Glass Aesthetics & Button Micro-Interactions</h2>
            <span className="text-xs text-[var(--site-muted)] font-mono">October 2026</span>
          </div>

          <p className="text-sm text-[var(--site-muted)] leading-relaxed">
            Elevated specular glass aesthetics across all 21 themes, refined action & cancel buttons with micro-interactions, authentic Neo-Brutal typography & hard shadows, dialog elevation, and light mode hydration fixes.
          </p>

          <div className="space-y-4 pt-2 text-sm text-[var(--site-muted)]">
            <div>
              <h3 className="font-semibold text-[var(--site-fg)] mb-2">Key Highlights:</h3>
              <ul className="list-disc list-inside space-y-1 text-[var(--site-muted)] text-xs sm:text-sm pl-2">
                <li><strong className="text-[var(--site-fg)]">Apple-Style Glass Pill Buttons</strong>: Specular highlights, translucent frosted backgrounds, and hover micro-interactions for `ios-glass`, `liquid-glass`, `showcase`, and `aurora`.</li>
                <li><strong className="text-[var(--site-fg)]">Authentic Neo-Brutal Theme</strong>: Monospace font, uppercase actions, 3px solid borders, and sharp offset drop shadows with press-down animations.</li>
                <li><strong className="text-[var(--site-fg)]">Dialog Button Depth</strong>: Confirm, deny, and cancel buttons now feature smooth transitions, specular highlight borders, and tone-specific elevation.</li>
                <li><strong className="text-[var(--site-fg)]">Strict Size Budget Maintained</strong>: Streamlined CSS structure to keep Core + Toast + 1 Theme under 6.00 KB.</li>
                <li><strong className="text-[var(--site-fg)]">Website Light Mode & Themes Integration</strong>: Direct npm theme imports and synchronized theme switching without static CSS dependencies.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Release v0.1.2 */}
        <section className="relative pl-6 sm:pl-8 border-l-2 border-[var(--site-border)] space-y-4">
          <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-[var(--site-border)] border-4 border-[var(--site-bg)]" />

          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-2xl font-bold text-[var(--site-fg)]">v0.1.2 — Production Verification & Interactive Demos</h2>
            <span className="text-xs text-[var(--site-muted)] font-mono">October 2026</span>
          </div>

          <p className="text-sm text-[var(--site-muted)] leading-relaxed">
            Verified 100% test pass across all 23 suites, live code snippet viewers with 1-click copy across demo controls, multi-package manager support including Deno, and full dark/light glass elevation.
          </p>

          <div className="space-y-4 pt-2 text-sm text-[var(--site-muted)]">
            <div>
              <h3 className="font-semibold text-[var(--site-fg)] mb-2">Enhancements & Capabilities:</h3>
              <ul className="list-disc list-inside space-y-1 text-[var(--site-muted)] text-xs sm:text-sm pl-2">
                <li><strong className="text-[var(--site-fg)]">Interactive Code Preview</strong>: Live 1-click copy snippet toggle in the Hero interactive demo for immediate implementation.</li>
                <li><strong className="text-[var(--site-fg)]">Deno & Multi-PM Support</strong>: Added verified commands for npm, pnpm, yarn, bun, and deno across all quickstarts.</li>
                <li><strong className="text-[var(--site-fg)]">Rigorous A11y & Contrast</strong>: 1512/1512 theme and mode permutations verified against WCAG 2.2 AA standards.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Release v0.1.1 */}
        <section className="relative pl-6 sm:pl-8 border-l-2 border-[var(--site-border)] space-y-4">
          <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-[var(--site-muted)] border-4 border-[var(--site-bg)]" />

          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-2xl font-bold text-[var(--site-fg)]">v0.1.1 — Responsive Toast Layout & Full Light Mode Parity</h2>
            <span className="text-xs text-[var(--site-muted)] font-mono">October 2026</span>
          </div>

          <p className="text-sm text-[var(--site-muted)] leading-relaxed">
            Responsive flex wrapping for toast action buttons and description content, top-anchored close button, and WCAG 2.2 AA compliant light mode contrast.
          </p>

          <div className="space-y-4 pt-2 text-sm text-[var(--site-muted)]">
            <div>
              <h3 className="font-semibold text-[var(--site-fg)] mb-2">Enhancements & Fixes:</h3>
              <ul className="list-disc list-inside space-y-1 text-[var(--site-muted)] text-xs sm:text-sm pl-2">
                <li><strong className="text-[var(--site-fg)]">Responsive Action Wrapping</strong>: Multi-action buttons automatically wrap cleanly beneath long title and description content.</li>
                <li><strong className="text-[var(--site-fg)]">Full Light Mode Parity</strong>: High-contrast tokens, gradient headings, and card surfaces across all pages and themes.</li>
                <li><strong className="text-[var(--site-fg)]">Zero-Dependency Size Integrity</strong>: Preserved strict &lt; 6.00 KB Core + Toast and &lt; 22.00 KB full bundle budget.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Release v0.1.0 */}
        <section className="relative pl-6 sm:pl-8 border-l-2 border-[var(--site-border)] space-y-4">
          <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-[var(--site-muted)] border-4 border-[var(--site-bg)]" />

          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-2xl font-bold text-[var(--site-fg)]">v0.1.0 — Initial Release</h2>
            <span className="text-xs text-[var(--site-muted)] font-mono">October 2026</span>
          </div>

          <p className="text-sm text-[var(--site-muted)] leading-relaxed">
            The initial production release of toastory. Full feature parity with market leaders plus a premium frosted glass design system.
          </p>

          <div className="space-y-4 pt-2 text-sm text-[var(--site-muted)]">
            <div>
              <h3 className="font-semibold text-[var(--site-fg)] mb-2">Core Features:</h3>
              <ul className="list-disc list-inside space-y-1 text-[var(--site-muted)] text-xs sm:text-sm pl-2">
                <li><strong className="text-[var(--site-fg)]">Unified Feedback Contract</strong>: One API for toasts, confirm modals, prompts, steps, bottom sheets, and loading overlays.</li>
                <li><strong className="text-[var(--site-fg)]">Zero Runtime Dependencies</strong>: Published package contains 0 required dependencies.</li>
                <li><strong className="text-[var(--site-fg)]">21 Theme Presets</strong>: Full Light and Dark mode permutations with mathematical contrast checks.</li>
                <li><strong className="text-[var(--site-fg)]">WCAG 2.2 AA Compliance</strong>: Live regions, focus trapping, and Esc key dismissal with 0 automated axe violations.</li>
                <li><strong className="text-[var(--site-fg)]">Multi-Framework Adapters</strong>: First-class subpaths for React, Next.js, Vue, Nuxt, Angular, Svelte, and React Native.</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
