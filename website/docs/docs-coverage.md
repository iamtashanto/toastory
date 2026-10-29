# glazekit Documentation Coverage & Parity Audit

Audit mapping every public export, option, theme, variant, input type, and platform to its corresponding documentation page, verifying **zero uncovered features**.

---

## 1. Feature Parity Mapping

| Feature from \`docs/parity.md\` | glazekit Implementation | Documentation Route | Coverage Status |
| :--- | :--- | :--- | :---: |
| **Zero Runtime Dependencies** | 0 B required runtime dependencies | \`/docs/getting-started/introduction\` | Verified |
| **Gzip Core + Toast Size (< 6 KB)** | 5.20 KB measured | \`/docs/meta/benchmarks\` | Verified |
| **Full Web Bundle (< 22 KB)** | 14.10 KB measured | \`/docs/meta/benchmarks\` | Verified |
| **Framework Agnostic Node-Safe Core** | \`src/core\` / \`glazekit/core\` | \`/docs/api/core\` | Verified |
| **Multi-Framework Adapters** | React, Next.js, Vue, Nuxt, Angular, Svelte, RN | \`/docs/getting-started/quickstart\` | Verified |
| **Apple-Style Glass Design (21 Themes)** | Scoped \`--gk-*\` design tokens | \`/docs/theming/overview\`, \`/themes\` | Verified |
| **Dialog Toolkit (Confirm, Prompt, Alert)** | \`ui.confirm()\`, \`ui.prompt()\`, \`ui.alert()\` | \`/docs/guides/dialogs\` | Verified |
| **Bottom Sheet Drawer** | \`ui.bottomSheet()\` with snap points | \`/docs/guides/sheets-overlays\` | Verified |
| **Action Sheet** | \`ui.sheet()\` with destructive styles | \`/docs/guides/sheets-overlays\` | Verified |
| **Multi-Step Dialog Flow** | \`ui.steps()\` with history & back nav | \`/docs/guides/steps\` | Verified |
| **6-Box Discrete OTP Input** | Auto-advance, paste, resend timer | \`/docs/recipes/otp-verification\` | Verified |
| **Type-to-Confirm Guard** | \`confirmText\` case-sensitive matching | \`/docs/recipes/delete-type-to-confirm\` | Verified |
| **Live Session Countdown Timer** | Real-time seconds counter, pause/resume | \`/docs/recipes/session-timeout\` | Verified |
| **Determinate Progress (Ring & Bar)** | Progress bar and circular SVG ring | \`/docs/guides/progress-timers\` | Verified |
| **16 Form Input Types** | text, email, range, select, date, file, etc. | \`/docs/guides/prompts-inputs\` | Verified |
| **Promise Toast (\`unwrap()\`)** | \`ui.toast.promise()\` with loading states | \`/docs/guides/promise-toasts\` | Verified |
| **Deduplication Window & Keys** | \`dedupe\`, \`dedupeWindow\` | \`/docs/guides/toasts\` | Verified |
| **Gesture Swipe Dismiss** | 4-direction velocity snap physics | \`/docs/guides/swipe-gestures\` | Verified |
| **WCAG 2.2 AA Compliance** | Live regions, focus trap, 0 axe errors | \`/docs/accessibility/principles\` | Verified |

---

## 2. Public Export Coverage

| Export Name | Export Type | Documented In |
| :--- | :--- | :--- |
| \`ui\` | Default & Named Object | \`/docs/api/web\` |
| \`toast\` | Function + Shorthands | \`/docs/guides/toasts\`, \`/docs/api/web\` |
| \`toast.success\` | Function | \`/docs/guides/toasts\` |
| \`toast.error\` | Function | \`/docs/guides/toasts\` |
| \`toast.warning\` | Function | \`/docs/guides/toasts\` |
| \`toast.info\` | Function | \`/docs/guides/toasts\` |
| \`toast.loading\` | Function | \`/docs/guides/toasts\` |
| \`toast.promise\` | Function | \`/docs/guides/promise-toasts\` |
| \`toast.custom\` | Function | \`/docs/guides/custom-content\` |
| \`toast.update\` | Function | \`/docs/guides/updating-dismissing\` |
| \`toast.dismiss\` | Function | \`/docs/guides/updating-dismissing\` |
| \`toast.dismissAll\` | Function | \`/docs/guides/updating-dismissing\` |
| \`toast.getToasts\` | Function | \`/docs/guides/updating-dismissing\` |
| \`toast.getHistory\` | Function | \`/docs/guides/updating-dismissing\` |
| \`ui.confirm\` | Async Function | \`/docs/guides/dialogs\` |
| \`ui.alert\` | Async Function | \`/docs/guides/dialogs\` |
| \`ui.prompt\` | Async Function | \`/docs/guides/prompts-inputs\` |
| \`ui.steps\` | Async Function | \`/docs/guides/steps\` |
| \`ui.sheet\` | Async Function | \`/docs/guides/sheets-overlays\` |
| \`ui.bottomSheet\` | Function | \`/docs/guides/sheets-overlays\` |
| \`ui.loading\` | Function | \`/docs/guides/sheets-overlays\` |
| \`ui.configure\` | Function | \`/docs/api/web\`, \`/docs/theming/tokens\` |
| \`defineTheme\` | Function | \`/docs/theming/define-theme\` |

---

## 3. Platform Coverage

- **JavaScript / Vanilla**: \`/docs/getting-started/quickstart#vanilla-js\`
- **React**: \`/docs/getting-started/quickstart#react-next\`, \`/docs/api/react\`
- **Next.js (App & Pages Router)**: \`/docs/guides/ssr-server-actions\`
- **Vue & Nuxt**: \`/docs/getting-started/quickstart#vue-nuxt\`, \`/docs/api/frameworks\`
- **Angular**: \`/docs/api/frameworks\`
- **Svelte & SvelteKit**: \`/docs/getting-started/quickstart#svelte\`, \`/docs/api/frameworks\`
- **React Native (Expo & Bare)**: \`/docs/api/frameworks\`
- **Electron**: \`/docs/getting-started/quickstart\`

---

## Summary
- **Total Parity Features**: 19 / 19 (100% Coverage)
- **Total Public API Exports**: 23 / 23 (100% Coverage)
- **Uncovered Features**: **0**
