# toastory Official Website Architecture & Implementation Plan

## 1. Chosen Stack & Justification

- **Framework**: Next.js 16.4 (App Router) + React 19 + TypeScript (Strict Mode) + Tailwind CSS v4.
- **Why**: 
  - The website workspace is pre-initialized with Next.js 16.4 and React 19, aligned directly with the modern React ecosystem and SSR/SSG workflows.
  - Native static route prerendering (`next build --webpack`) outputs static HTML with minimal JS footprints for marketing and documentation pages, achieving high Lighthouse scores (target: ≥ 95 on mobile/desktop).
  - First-class Client Components (`'use client'`) enable interactive glass islands (live hero demo, interactive playground, themes gallery, and token customizer) using the real built `toastory` package.
  - Zero third-party CDN fonts or analytics; self-contained, offline-capable, and privacy-preserving.
  - Integrated fast client-side fuzzy search (dialog triggered via `Cmd+K` or `/`) indexing all guides, API references, recipes, and migration docs.

---

## 2. Sitemap

### Marketing & Interactive Hub
- `/` — Homepage: Hero, Live Hero Interactive Demo, Platform Quick-Starts, Feature Highlights, Comparison Table, Trust Indicators, Final CTA.
- `/features` — Complete Feature Catalogue: Grouped interactive demos for Toasts, Dialogs, Inputs, Sheets/Overlays, Themes, Accessibility, Performance, and Security.
- `/themes` — Theme Studio & Gallery: Grid of all 21 themes x Light/Dark modes x Variants, contrast rating badges, live triggers, and instant configuration copy.
- `/playground` — Interactive Sandbox: Configuration controls (theme, mode, position, stack, durations, gesture swipe), live feedback preview over selectable backgrounds, multi-framework code generator (Vanilla JS, React, Next.js, Vue, Svelte, Angular, React Native), URL hash sharing, and JSON export.

### Documentation (`/docs/*`)
- **Getting Started**:
  - `/docs` & `/docs/getting-started/introduction` — Overview, philosophy, zero dependencies, Apple glass design.
  - `/docs/getting-started/installation` — Installation across all package managers and CDN.
  - `/docs/getting-started/quickstart` — 8-line quickstart for Vanilla, React, Next.js, Vue, Nuxt, Angular, Svelte, React Native.
  - `/docs/getting-started/setup-checklist` — Production checklist, SSR guidelines, styling import verification.
- **Guides**:
  - `/docs/guides/toasts` — All toast types, options, titles, descriptions, icons, avatars, and timestamps.
  - `/docs/guides/promise-toasts` — `ui.toast.promise()` with loading, success, error handlers, and `.unwrap()`.
  - `/docs/guides/updating-dismissing` — Dynamic updating (`ui.toast.update()`), programmatic dismissal, and history.
  - `/docs/guides/custom-content` — Custom renderers, HTML sanitization, JSX/templates.
  - `/docs/guides/stacking-positioning` — 6 placement positions, expanded vs stacked modes, hover expansion, gaps.
  - `/docs/guides/swipe-gestures` — 4-directional swipe physics, velocity thresholds, touch-action handling.
  - `/docs/guides/progress-timers` — Countdown bars, circular rings, pausable timers, epoch tracking.
  - `/docs/guides/dialogs` — `ui.confirm()`, `ui.alert()`, custom buttons, icons, and tones.
  - `/docs/guides/prompts-inputs` — All 16 input types (text, password, range, file, select, radio, OTP 6-box).
  - `/docs/guides/validation-async` — Sync/async form validation and `preConfirm` loading state locks.
  - `/docs/guides/steps` — Multi-step wizard dialog flow with back/forward history.
  - `/docs/guides/sheets-overlays` — Action sheets, slide-up bottom sheets with drag handles, and full loading overlays.
  - `/docs/guides/island-hud` — Floating island HUD capsules for transient unobtrusive notifications.
  - `/docs/guides/ssr-server-actions` — Next.js Server Actions feedback and SSR hydration safety.
- **Theming**:
  - `/docs/theming/overview` — Glass architecture, backdrop-filter fallbacks, and theme registry.
  - `/docs/theming/tokens` — Full `--gk-*` CSS token reference table with Light/Dark values.
  - `/docs/theming/define-theme` — Programmatic theme authoring via `defineTheme()`.
  - `/docs/theming/dark-mode` — Light, dark, and auto modes, system detection, and toggle integration.
  - `/docs/theming/customization` — CSS overriding and headless unstyled mode.
- **Accessibility**:
  - `/docs/accessibility/principles` — WCAG 2.2 AA compliance breakdown, live regions (`aria-live`), focus traps, and keyboard shortcuts (`Alt+T`).
- **Recipes**:
  - `/docs/recipes/form-submission` — Real-world async form handling with toast feedback.
  - `/docs/recipes/optimistic-undo` — Optimistic UI mutation with actionable 5-second undo button.
  - `/docs/recipes/file-upload` — Byte-progress upload simulation.
  - `/docs/recipes/delete-type-to-confirm` — Destructive type-to-confirm security modal.
  - `/docs/recipes/session-timeout` — Session expiration warning with live countdown and timer extension.
  - `/docs/recipes/otp-verification` — 6-box discrete numeric authentication flow.
- **Migration**:
  - `/docs/migration/sonner` — Migration guide and API option map from Sonner.
  - `/docs/migration/react-toastify` — Migration guide and API option map from React-Toastify.
  - `/docs/migration/react-hot-toast` — Migration guide and API option map from react-hot-toast.
  - `/docs/migration/sweetalert2` — Migration guide and API option map from SweetAlert2.
  - `/docs/migration/notyf` — Migration guide and API option map from Notyf.
- **API Reference**:
  - `/docs/api/core` — `toastory/core` store, managers, timers, clock, accessibility rules.
  - `/docs/api/web` — `toastory` (web) `ui`, `toast`, configuration, engine, and DOM toaster.
  - `/docs/api/react` — `toastory/react` `<Toaster />`, `useToast()`, hooks.
  - `/docs/api/frameworks` — Vue, Angular, Svelte, and React Native adapters and support matrix.
- **Governance & Meta**:
  - `/docs/meta/faq` — Frequently Asked Questions.
  - `/docs/meta/troubleshooting` — Hydration, z-index, CSP, and Shadow DOM solutions.
  - `/docs/meta/benchmarks` — Verifiable size, render latency, and memory benchmarks.

### Standalone Pages
- `/changelog` — Release history, versions, and semver notes.
- `/roadmap` — Public roadmap and planned capabilities.
- `/security` — Security policy, DOM sanitization standards, and reporting guidelines.
- `/privacy` — Privacy pledge: zero tracking, zero cookies, zero external font calls.
- `/404` — Accessible, branded not found page.
- `/sitemap.xml` & `/robots.txt` — SEO indexing feeds.
- `/llms.txt` & `/llms-full.txt` — AI agent and LLM structured API context endpoints.

---

## 3. Design Tokens & Styling Architecture

- **Visual Identity**: Apple-inspired luminous frosted glass aesthetics (`backdrop-filter: blur(24px) saturate(180%)`), deep dark slate foundation (`#0b0c10`), crisp hairlines (`rgba(255,255,255,0.12)`), fluid typography.
- **Tokens**:
  - `--site-bg`: `#0b0c10` (hero dark), `#ffffff` (light mode option).
  - `--site-surface`: `rgba(22, 24, 34, 0.72)`.
  - `--site-border`: `rgba(255, 255, 255, 0.12)`.
  - `--site-accent`: `#3b82f6` (luminous sapphire).
  - `--site-accent-glow`: `rgba(59, 130, 246, 0.35)`.
- **Motion**: 200–350ms cubic-bezier spring easing (`cubic-bezier(0.16, 1, 0.3, 1)`). Fully disabled when `prefers-reduced-motion` is active.
- **Typography**: System font stack (`-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, system-ui, sans-serif`). Zero external network requests to third-party CDNs.

---

## 4. Component List

1. `Header`: Sticky glass navbar with blur, logo, section links, search trigger (`Cmd+K`), GitHub link, version chip, and mobile menu drawer.
2. `Footer`: Sitemap, trust indicators, copyright, security, and licence notes.
3. `SearchModal`: Accessible dialog modal supporting fuzzy keyword search across all docs and API topics with arrow-key roving tabindex.
4. `HeroDemo`: Live interactive dogfooding demo running on Next.js client island with toast triggers, theme chips, and stack manipulation.
5. `CodeBlock`: Syntax-highlighted code container with copy button and language badge.
6. `FrameworkTabs`: Multi-framework switcher (React, Next.js, Vue, Svelte, Angular, Native, Vanilla) syncing code samples.
7. `PlaygroundApp`: Full interactive studio with live preview, controls drawer, preset picker, and code exporter.
8. `ThemesGallery`: Complete 21-theme visual cards with dynamic light/dark toggles and live triggering.
9. `DocsLayout`: Sidebar navigation with collapsible sections, on-page table of contents, and breadcrumbs.
10. `ComparisonTable`: Objective, verified feature and bundle-size comparison matrix.

---

## 5. Performance & Accessibility Budgets

- **Lighthouse Goals**: ≥ 95 on Performance, Accessibility, Best Practices, and SEO.
- **Size Target**: Initial HTML < 50 KB, Zero external CSS/font requests.
- **WCAG 2.2 AA**:
  - Keyboard navigation for every interactive element with high-contrast `:focus-visible` rings.
  - Polite and assertive live regions (`aria-live`) for dynamic toast announcements.
  - Dialog focus trapping with `Escape` restoration.
  - Skip to main content link on all pages.

---

## 6. Implementation Steps

1. **toastory Package Setup**: Embed full self-contained `toastory` package bundle and themes into `website/lib/glazekit` so all pages, playground, and demos dogfood the exact code.
2. **Global Layout & Navigation**: Glass header, accessible mobile drawer, footer, search modal, and styling foundations.
3. **Marketing Home (`/`)**: Hero, live hero demo, multi-framework quick-starts, interactive feature showcases, comparison table, trust section.
4. **Features Catalogue (`/features`)**: Exhaustive interactive catalog of every feature with code snippets and live triggers.
5. **Theme Studio (`/themes`)**: Interactive 21-theme gallery with mode toggle, variant replay, and contrast data.
6. **Playground (`/playground`)**: Complete configurator, live canvas, code generator for 6 frameworks, URL hash state persistence.
7. **Documentation System (`/docs/*`)**: All 30+ documentation guides, recipes, migration guides, theming reference, and API specifications.
8. **Meta & SEO Endpoints**: `/changelog`, `/roadmap`, `/security`, `/privacy`, `/sitemap.xml`, `/robots.txt`, `/llms.txt`, `/llms-full.txt`.
9. **Quality Gate Verification**: Run `next build --webpack` and `npm run lint` until 100% green and error-free.

