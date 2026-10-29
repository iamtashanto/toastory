# toastory

Complete UI feedback toolkit: toast notifications, confirm / prompt / alert dialogs, sheets and loading overlays with frosted glass design. One API for modern web and mobile.

[![CI](https://img.shields.io/github/actions/workflow/status/iamtashanto/toastory/ci.yml?branch=main&label=CI)](https://github.com/iamtashanto/toastory/actions)
[![npm version](https://img.shields.io/npm/v/toastory?color=blue)](https://www.npmjs.com/package/toastory)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![Bundle Size](https://img.shields.io/badge/gzip-5.97%20KB-brightgreen)](https://bundlephobia.com/package/toastory)
[![TypeScript](https://img.shields.io/badge/Types-included-blue)](https://www.typescriptlang.org/)
[![Dependencies](https://img.shields.io/badge/dependencies-0-brightgreen)](https://www.npmjs.com/package/toastory?activeTab=dependencies)
[![Provenance](https://img.shields.io/badge/provenance-verified-success)](https://www.npmjs.com/package/toastory)

> **Unofficial.** Not affiliated with, endorsed by, or sponsored by Sonner, React-Toastify, react-hot-toast, Notyf, SweetAlert2, or their maintainers.

[Documentation](https://toastory.tashanto.com) · [Playground](https://toastory.tashanto.com/playground) · [Issues](https://github.com/iamtashanto/toastory/issues)

---

## Why

- **One API for every platform.** Write the same feedback calls across vanilla JavaScript, React, Next.js, Vue, Nuxt, Angular, Svelte, Electron, and React Native.
- **Accessible by default.** Built with WCAG 2.2 AA compliance, live regions, focus trapping, keyboard hotkey navigation (`Alt+T`), and contrast-verified color tokens.
- **Signature frosted glass aesthetics.** Frosted glass translucency with backdrop blur, saturation boost, specular highlights, and solid contrast fallbacks.
- **Zero runtime dependencies.** Published package contains zero dependencies with strict tree-shaking keeping toast-only bundles under 6 KB gzipped.
- **Promise-driven interactive dialogs.** Confirm, prompt, multi-step wizards, action sheets, and loading overlays return strongly typed asynchronous results.

---

## Install

```bash
npm install toastory
```

```bash
pnpm add toastory
```

```bash
yarn add toastory
```

```bash
bun add toastory
```

---

## Quick start

### Plain JavaScript

```html
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/toastory@0.1.0/dist/themes/ios-glass.css"
/>
<script type="module">
  import { ui, toast } from 'https://cdn.jsdelivr.net/npm/toastory@0.1.0/dist/index.js';
  toast.success('Deployment successful!');
  const res = await ui.confirm({ title: 'Delete repository?', tone: 'danger' });
  if (res.isConfirmed) toast.info('Repository removed');
</script>
```

### React

```tsx
import { Toaster, toast } from 'toastory/react';
import 'toastory/themes/ios-glass.css';

export function App() {
  return (
    <>
      <Toaster position="bottom-right" richColors />
      <button onClick={() => toast.success('Project saved!')}>Save</button>
    </>
  );
}
```

### Next.js (App Router)

```tsx
import { Toaster } from 'toastory/react';
import 'toastory/themes/ios-glass.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  );
}
```

### Vue 3

```vue
<script setup>
import { GlazeToaster, toast } from 'toastory/vue';
import 'toastory/themes/ios-glass.css';
</script>

<template>
  <GlazeToaster position="bottom-right" />
  <button @click="toast.success('Profile updated!')">Update</button>
</template>
```

### Nuxt

```ts
// plugins/toastory.client.ts
import { toastoryPlugin } from 'toastory/vue';
import 'toastory/themes/ios-glass.css';

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(toastoryPlugin);
});
```

### Angular

```ts
import { Component } from '@angular/core';
import { GlazeToasterComponent, GlazeService } from 'toastory/angular';
import 'toastory/themes/ios-glass.css';

@Component({
  standalone: true,
  imports: [GlazeToasterComponent],
  template: `<glaze-toaster /><button (click)="glaze.toast.success('Done!')">Run</button>`,
})
export class AppComponent {
  constructor(public glaze: GlazeService) {}
}
```

### Svelte

```svelte
<script>
  import { toast } from 'toastory/svelte';
  import 'toastory/themes/ios-glass.css';
</script>

<button on:click={() => toast.success('Saved to cloud!')}>Save</button>
```

### Electron

```js
import { ui, toast } from 'toastory';
import 'toastory/themes/ios-glass.css';

toast.success('Application initialized in renderer');
```

### React Native

```tsx
import { GlazeProvider, Toaster, toast } from 'toastory/native';
import { Button } from 'react-native';

export default function App() {
  return (
    <GlazeProvider>
      <Toaster position="bottom" />
      <Button title="Notify" onPress={() => toast.success('Native notification!')} />
    </GlazeProvider>
  );
}
```

---

## Themes

![toastory showcase themes](https://raw.githubusercontent.com/iamtashanto/toastory/main/design-refs/toasts-showcase-1.png)

Ships with 21 handcrafted themes supporting light, dark, and auto modes: `ios-glass`, `liquid-glass`, `aurora`, `classic-stack`, `classic-bar`, `pill`, `ripple`, `gradient-strip`, `sweet`, `material`, `basic`, `minimal`, `flat`, `outline`, `neon`, `gradient`, `brutal`, `pastel`, `essentials`, `showcase`, `dialogs`.

[Explore all themes in the Interactive Gallery](https://toastory.tashanto.com/themes)

---

## Features

| Capability    | Description                                                                               |
| ------------- | ----------------------------------------------------------------------------------------- |
| **Toasts**    | 6 positions, stacked/expanded modes, 4-direction swipe, progress countdown, promises      |
| **Dialogs**   | Confirm, alert, prompt with 19 typed inputs (including 6-box OTP and range), steps wizard |
| **Overlays**  | iOS action sheet, velocity snap draggable bottom sheet, blocking loading overlay          |
| **Themes**    | 21 presets, CSS tokens (`--gk-*`), live `ui.defineTheme()` custom registration            |
| **Platforms** | Vanilla JS, React, Next.js, Vue, Nuxt, Angular, Svelte, Electron, React Native            |

---

## Accessibility

- **WCAG 2.2 AA compliant**: 0 axe-core automated violations.
- **Live regions**: Polite (`role="status"`) and assertive (`role="alert"`) ARIA live region announcements.
- **Keyboard navigation**: Focus traps with restoration, Esc key handling, and `Alt+T` toast region hotkey.
- **Motion & Transparency**: Full respect for `prefers-reduced-motion` and `prefers-reduced-transparency`.
- **Contrast**: 1,512 mathematical color combinations mathematically verified >= 4.5:1.

---

## Browser and framework support

- **Browsers**: Chrome, Edge, Firefox, Safari (15.4+), iOS Safari, Android Chrome.
- **Frameworks**: React 18 & 19, Vue 3+, Angular 16+, Svelte 4 & 5, React Native (Expo + bare), Electron.
- **Environments**: SSR-safe (Next.js App/Pages Router, Nuxt, SvelteKit, Angular SSR).

---

## Comparison

| Feature                       |  `toastory`   |   Sonner   | React-Toastify | react-hot-toast | SweetAlert2  |
| ----------------------------- | :-----------: | :--------: | :------------: | :-------------: | :----------: |
| **Zero Runtime Dependencies** | **Yes (0 B)** |     No     |       No       |       No        |     Yes      |
| **Gzip Core + Toast Size**    |  **5.97 KB**  |  ~4.5 KB   |     ~14 KB     |     ~5.2 KB     |    ~15 KB    |
| **Multi-Framework Adapters**  | **All major** | React only |   React only   |   React only    |   Wrappers   |
| **Dialogs & Sheets Included** |    **Yes**    |     No     |       No       |       No        | Dialogs only |
| **Frosted Glass Themes**      | **Yes (21)**  |     No     |       No       |       No        |      No      |
| **WCAG 2.2 AA (0 errors)**    | **Verified**  |  Partial   |    Partial     |     Partial     |   Partial    |

---

## Migrating

Toastory supports familiar API signatures for quick migrations:

- **From Sonner**: Replace `sonner` with `toastory/react`. `toast(msg)`, `toast.success()`, `toast.promise()` work identically.
- **From React-Toastify**: Import `<Toaster />` from `toastory/react` and call `toast(...)`.
- **From SweetAlert2**: Replace `Swal.fire({ ... })` with `await ui.confirm({ ... })` or `await ui.prompt({ ... })`.

[Read the comprehensive Migration Guide](https://toastory.tashanto.com/docs/migration)

---

## Contributing

Contributions are welcome! Please read [`CONTRIBUTING.md`](https://github.com/iamtashanto/toastory/blob/main/CONTRIBUTING.md) for local development setup, coding standards, and testing procedures.

---

## License

[MIT](https://opensource.org/licenses/MIT) © 2026 toastory contributors
