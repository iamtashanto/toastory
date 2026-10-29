# Comparison Table Sources & Verification Ledger

Every comparison claim in the `glazekit` documentation and README is backed by verifiable, documented sources measured and verified as of **October 2026**.

---

## 1. Zero Runtime Dependencies

| Library | Status | Verification Source | Date Verified |
|---|:---:|---|:---:|
| **glazekit** | **Yes (0 B)** | `package.json` contains 0 runtime dependencies (`dependencies: {}`). | Oct 29, 2026 |
| **Sonner** | No | Requires `clsx` runtime dependency: [Sonner package.json](https://github.com/emilkowalski/sonner/blob/main/package.json) | Oct 2026 |
| **React-Toastify** | No | Requires `clsx` runtime dependency: [React-Toastify package.json](https://github.com/fkhadra/react-toastify/blob/master/package.json) | Oct 2026 |
| **react-hot-toast** | No | Requires `goober` CSS-in-JS runtime dependency: [react-hot-toast package.json](https://github.com/timolins/react-hot-toast/blob/main/package.json) | Oct 2026 |
| **SweetAlert2** | Yes (0 B) | Zero dependencies: [SweetAlert2 package.json](https://github.com/sweetalert2/sweetalert2/blob/main/package.json) | Oct 2026 |

---

## 2. Gzip Core + Toast Bundle Size

| Library | Gzip Size | Measurement Source | Date Verified |
|---|:---:|---|:---:|
| **glazekit** | **5.97 KB** | Verified via `scripts/size.mjs` (Core + Toast + Theme = 5,972 B). | Oct 29, 2026 |
| **Sonner** | ~4.5 KB | Measured via [Bundlephobia Sonner](https://bundlephobia.com/package/sonner) (min+gzip: 4.5 KB). | Oct 2026 |
| **React-Toastify** | ~14.0 KB | Measured via [Bundlephobia React-Toastify](https://bundlephobia.com/package/react-toastify) (min+gzip: 14.1 KB). | Oct 2026 |
| **react-hot-toast** | ~5.2 KB | Measured via [Bundlephobia react-hot-toast](https://bundlephobia.com/package/react-hot-toast) (min+gzip: 5.2 KB). | Oct 2026 |
| **SweetAlert2** | ~15.2 KB | Measured via [Bundlephobia SweetAlert2](https://bundlephobia.com/package/sweetalert2) (min+gzip: 15.2 KB). | Oct 2026 |

---

## 3. Multi-Framework Adapters

| Library | Adapters Supported | Source Documentation | Date Verified |
|---|:---:|---|:---:|
| **glazekit** | **All major** | First-party export subpaths for Vanilla JS, React, Next.js, Vue, Nuxt, Angular, Svelte, Electron, and React Native. | Oct 29, 2026 |
| **Sonner** | React only | Official library ships only React bindings: [Sonner Repository](https://github.com/emilkowalski/sonner). (Community ports are separate unmaintained packages). | Oct 2026 |
| **React-Toastify** | React only | Official library is React-specific: [React-Toastify Repository](https://github.com/fkhadra/react-toastify). | Oct 2026 |
| **react-hot-toast** | React only | Official library is React-specific: [react-hot-toast Repository](https://github.com/timolins/react-hot-toast). | Oct 2026 |
| **SweetAlert2** | Wrappers | Vanilla JavaScript core with community-maintained wrapper components: [SweetAlert2 Docs](https://sweetalert2.github.io/). | Oct 2026 |

---

## 4. Dialogs & Overlays Included

| Library | Scope | Source Documentation | Date Verified |
|---|:---:|---|:---:|
| **glazekit** | **Toasts, Dialogs & Sheets** | Includes `ui.toast`, `ui.confirm`, `ui.alert`, `ui.prompt`, `ui.steps`, `ui.sheet`, `ui.bottomSheet`, `ui.loading`. | Oct 29, 2026 |
| **Sonner** | Toasts only | Exclusively toast notifications: [Sonner Documentation](https://sonner.emilkowal.ski/). | Oct 2026 |
| **React-Toastify** | Toasts only | Exclusively toast notifications: [React-Toastify Documentation](https://fkhadra.github.io/react-toastify/). | Oct 2026 |
| **react-hot-toast** | Toasts only | Exclusively toast notifications: [react-hot-toast Documentation](https://react-hot-toast.com/). | Oct 2026 |
| **SweetAlert2** | Dialogs only | Modal alerts and prompts only. Does not ship toast notification queues or bottom sheet drawers: [SweetAlert2 Docs](https://sweetalert2.github.io/). | Oct 2026 |

---

## 5. Frosted Glass Themes

| Library | Glass Aesthetics | Source Documentation | Date Verified |
|---|:---:|---|:---:|
| **glazekit** | **Yes (21 Themes)** | 21 presets with hardware-accelerated `backdrop-filter: blur() saturate()`, specular highlights, and `@supports` fallbacks: `src/themes/`. | Oct 29, 2026 |
| **Sonner** | No | Solid/flat minimal cards: [Sonner Themes](https://sonner.emilkowal.ski/). | Oct 2026 |
| **React-Toastify** | No | Solid/flat colored boxes: [React-Toastify Styles](https://fkhadra.github.io/react-toastify/). | Oct 2026 |
| **react-hot-toast** | No | Minimalist flat cards: [react-hot-toast](https://react-hot-toast.com/). | Oct 2026 |
| **SweetAlert2** | No | Opaque modal shells: [SweetAlert2 Themes](https://sweetalert2.github.io/#themes). | Oct 2026 |

---

## 6. WCAG 2.2 AA Accessibility

| Library | Compliance Level | Verification Source | Date Verified |
|---|:---:|---|:---:|
| **glazekit** | **Verified (0 violations)** | 1,512 mathematical contrast checks passing (`scripts/contrast.ts`) + automated `axe-core` suite in `tests/web/a11y.test.ts`. | Oct 29, 2026 |
| **Sonner** | Partial | Provides `role="region"` and hotkeys, but lacks verified theme-level contrast matrices: [Sonner A11y](https://github.com/emilkowalski/sonner/blob/main/src/index.tsx). | Oct 2026 |
| **React-Toastify** | Partial | Basic ARIA live region support: [React-Toastify Accessibility](https://fkhadra.github.io/react-toastify/accessibility/). | Oct 2026 |
| **react-hot-toast** | Partial | Basic `role="status"` live region: [react-hot-toast Source](https://github.com/timolins/react-hot-toast). | Oct 2026 |
| **SweetAlert2** | Partial | Focus trap and WAI-ARIA modal role: [SweetAlert2 Accessibility Guide](https://github.com/sweetalert2/sweetalert2/wiki/Accessibility). | Oct 2026 |
