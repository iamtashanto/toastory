# glazekit

Complete UI feedback toolkit: toast notifications, confirm / alert / prompt dialogs, action sheet, bottom sheet, loading overlay, and multi-step dialogs. Designed with an Apple-style glass aesthetic, WCAG 2.2 AA accessibility, zero runtime dependencies, and a unified API across plain JavaScript, React, Next.js, Vue, Nuxt, Angular, Svelte, Electron, and React Native (Expo + bare).

## Highlights

- **Zero Runtime Dependencies**: Published package contains zero runtime dependencies. Framework packages are optional peer dependencies.
- **Unified API**: Identical interface across browser, React, Vue, Svelte, Angular, and React Native.
- **Apple Glass Aesthetic**: 18 hand-crafted theme presets with frosted glass, saturation boost, and graceful solid-color fallbacks via `@supports not (backdrop-filter: blur())`.
- **WCAG 2.2 AA Accessibility**: Live regions (`aria-live="polite"` and `assertive`), focus traps with restoration, Esc key dismissals, keyboard hotkey navigation (`Alt+T`), and contrast-verified color tokens.
- **Ultra-lightweight Size Budget**: Core + Toast + 1 Theme is 5.2 KB gzip (budget < 6 KB). Full web bundle is 14.1 KB gzip (budget < 22 KB). Full tree-shaking guarantees toast-only imports omit dialog and overlay code.
- **SSR Safe**: Guarded DOM access for Next.js (App / Pages Router), Nuxt, SvelteKit, and Angular Universal.

---

## Installation

```bash
npm install glazekit
```

### Peer Dependencies (Optional)

Install only what your stack needs:

- **React / Next.js**: `react >= 18`
- **Vue / Nuxt**: `vue >= 3`
- **Angular**: `@angular/core >= 16`
- **Svelte / SvelteKit**: `svelte >= 4`
- **React Native / Expo**: `react-native`, `expo-blur`, `expo-haptics`
- **HTML Sanitization**: `dompurify >= 3` (glazekit bundles a built-in zero-dependency sanitizer by default)

---

## Quick Start

### Vanilla JavaScript / TypeScript

Import the theme CSS and the `ui` helper:

```html
<link rel="stylesheet" href="node_modules/glazekit/themes/ios-glass.toast.css" />
<link rel="stylesheet" href="node_modules/glazekit/themes/ios-glass.dialog.css" />

<script type="module">
  import { ui, toast } from 'glazekit';

  // Toast notification
  toast.success('Changes saved successfully!', {
    description: 'Your project is now in sync with remote.',
  });

  // Confirm dialog
  const result = await ui.confirm({
    title: 'Delete repository?',
    text: 'This action cannot be undone.',
    tone: 'danger',
    confirmButton: { label: 'Delete' },
    cancelButton: { label: 'Keep' },
  });

  if (result.isConfirmed) {
    toast.info('Repository deleted');
  }
</script>
```

### React / Next.js

Place `<Toaster />` in your root layout:

```tsx
import React from 'react';
import { Toaster, useToast } from 'glazekit/react';
import { ui } from 'glazekit';
import 'glazekit/themes/ios-glass.toast.css';
import 'glazekit/themes/ios-glass.dialog.css';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        {children}
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  );
}

export function ActionButton() {
  const toast = useToast();

  const handleUpload = () => {
    toast.promise(fetch('/api/upload'), {
      loading: 'Uploading document...',
      success: 'Document uploaded!',
      error: 'Upload failed',
    });
  };

  return <button onClick={handleUpload}>Upload</button>;
}
```

### Vue 3 / Nuxt

```vue
<script setup lang="ts">
import { GlazeToaster, useToast } from 'glazekit/vue';
import { ui } from 'glazekit';
import 'glazekit/themes/ios-glass.toast.css';
import 'glazekit/themes/ios-glass.dialog.css';

const toast = useToast();

const promptUser = async () => {
  const res = await ui.prompt({
    title: 'Folder Name',
    input: 'text',
    inputValue: 'New Folder',
  });
  if (res.isConfirmed) {
    toast.success(`Created: ${res.value}`);
  }
};
</script>

<template>
  <button @click="promptUser">New Folder</button>
  <GlazeToaster position="bottom-right" />
</template>
```

### Svelte

```svelte
<script lang="ts">
  import { glazeToaster } from 'glazekit/svelte';
  import { ui, toast } from 'glazekit';
  import 'glazekit/themes/ios-glass.toast.css';
  import 'glazekit/themes/ios-glass.dialog.css';

  function notify() {
    toast.success('Saved from Svelte!');
  }
</script>

<div use:glazeToaster={{ position: 'bottom-right' }}></div>
<button on:click={notify}>Trigger Notification</button>
```

### Angular

```typescript
import { Component } from '@angular/core';
import { GlazeService } from 'glazekit/angular';

@Component({
  selector: 'app-root',
  template: `
    <button (click)="notify()">Notify</button>
    <glaze-toaster position="bottom-right"></glaze-toaster>
  `,
})
export class AppComponent {
  constructor(private glaze: GlazeService) {}

  notify() {
    this.glaze.toast.success('Saved from Angular!');
  }
}
```

### React Native / Expo

```tsx
import React from 'react';
import { View, Button } from 'react-native';
import { Toaster, toast, ui } from 'glazekit/native';

export default function NativeApp() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button title="Show Toast" onPress={() => toast.success('Saved in React Native!')} />
      <Toaster position="top-center" />
    </View>
  );
}
```

---

## API Reference

### `ui.toast`

```typescript
ui.toast(message, options?)
ui.toast.success(message, options?)
ui.toast.error(message, options?)
ui.toast.info(message, options?)
ui.toast.warning(message, options?)
ui.toast.loading(message, options?)
ui.toast.message(message, options?)

// Async promise toasts with automatic state tracking
ui.toast.promise(promiseOrFn, {
  loading: 'Loading message',
  success: (data) => `Success: ${data}`,
  error: (err) => `Failed: ${err.message}`,
  description: 'Applies to resolved state',
  finally: () => {},
})

// Custom renderer
ui.toast.custom((item) => h('div', `Custom: ${item.id}`), options?)

// Management
ui.toast.update(id, patch)
ui.toast.dismiss(id?)
ui.toast.dismissAll()
ui.toast.getToasts()
ui.toast.getHistory()
ui.toast.types.add('customType', definition)
```

#### Toast Options

| Option            | Type                                                                    | Default              | Description                                         |
| :---------------- | :---------------------------------------------------------------------- | :------------------- | :-------------------------------------------------- |
| `id`              | `string \| number`                                                      | auto                 | Unique toast identifier                             |
| `type`            | `'success' \| 'error' \| 'info' \| 'warning' \| 'loading' \| 'message'` | `'message'`          | Visual variant                                      |
| `title`           | `string \| Node`                                                        | `undefined`          | Heading text                                        |
| `description`     | `string \| Node`                                                        | `undefined`          | Subtitle or body text                               |
| `icon`            | `Renderable \| false`                                                   | type icon            | Custom icon or disable icon                         |
| `avatar`          | `string \| Renderable`                                                  | `undefined`          | Avatar URL or element                               |
| `duration`        | `number`                                                                | `4000`               | Auto-dismiss duration in ms (`0` = persistent)      |
| `position`        | `ToastPosition`                                                         | `'bottom-right'`     | Position on screen (6 positions)                    |
| `action`          | `{ label, onClick }`                                                    | `undefined`          | Action button                                       |
| `cancel`          | `{ label, onClick }`                                                    | `undefined`          | Cancel button                                       |
| `closeButton`     | `boolean`                                                               | `true`               | Show close button                                   |
| `dismissible`     | `boolean`                                                               | `true`               | Allow user dismissals                               |
| `closeOnClick`    | `boolean`                                                               | `false`              | Dismiss on body click                               |
| `progress`        | `boolean`                                                               | `true`               | Show auto-dismiss timer progress bar                |
| `pauseOn`         | `('hover' \| 'focus' \| 'hidden')[]`                                    | `['hover', 'focus']` | Pause countdown triggers                            |
| `swipe`           | `boolean`                                                               | `true`               | Enable touch/drag swipe dismissal                   |
| `swipeDirections` | `('left' \| 'right' \| 'up' \| 'down')[]`                               | `['left', 'right']`  | Allowed swipe directions                            |
| `dragThreshold`   | `number`                                                                | `70`                 | Distance in px to trigger swipe dismiss             |
| `richColors`      | `boolean`                                                               | `false`              | Saturated background colors                         |
| `invert`          | `boolean`                                                               | `false`              | Invert light / dark mode                            |
| `theme`           | `string`                                                                | `'ios-glass'`        | Theme preset override                               |
| `className`       | `string`                                                                | `undefined`          | Additional CSS class                                |
| `classNames`      | `Record<string, string>`                                                | `undefined`          | Granular element class overrides                    |
| `style`           | `Record<string, string>`                                                | `undefined`          | Inline styles                                       |
| `unstyled`        | `boolean`                                                               | `false`              | Remove all built-in theme styles                    |
| `html`            | `string`                                                                | `undefined`          | Sanitized HTML content                              |
| `href`            | `string`                                                                | `undefined`          | Wrap toast in anchor link                           |
| `target`          | `'_self' \| '_blank'`                                                   | `'_self'`            | Anchor target                                       |
| `ariaLive`        | `'polite' \| 'assertive'`                                               | auto                 | Screen reader live region level                     |
| `role`            | `'status' \| 'alert'`                                                   | auto                 | Accessibility role                                  |
| `dedupe`          | `boolean`                                                               | `true`               | Deduplicate identical messages with a badge counter |
| `important`       | `boolean`                                                               | `false`              | Elevated priority in queue                          |
| `container`       | `string`                                                                | `undefined`          | Custom DOM container element ID                     |
| `dir`             | `'ltr' \| 'rtl' \| 'auto'`                                              | `'auto'`             | Text direction                                      |
| `onOpen`          | `(toast) => void`                                                       | `undefined`          | Hook triggered when toast renders                   |
| `onClose`         | `(toast) => void`                                                       | `undefined`          | Hook triggered when toast begins exit               |
| `onDismiss`       | `(toast) => void`                                                       | `undefined`          | Hook triggered when user dismisses                  |
| `onAutoClose`     | `(toast) => void`                                                       | `undefined`          | Hook triggered when timer expires                   |

---

### Dialogs and Sheets

```typescript
// Confirm Dialog
const res = await ui.confirm({
  title: 'Delete Item?',
  text: 'Are you sure you want to delete this item?',
  tone: 'danger',
});

// Alert Dialog
await ui.alert({
  title: 'Update Available',
  text: 'A new version has been downloaded.',
});

// Prompt Dialog
const prompt = await ui.prompt({
  title: 'Enter Email',
  input: 'email',
  placeholder: 'name@example.com',
  validate: (val) => (!val.includes('@') ? 'Invalid email address' : null),
});

// Multi-step Wizard
const wizard = await ui.steps([
  { title: 'Step 1', text: 'Introduction' },
  { title: 'Step 2', input: 'text', placeholder: 'Your Name' },
  { title: 'Step 3', text: 'All set!' },
]);

// Action Sheet
const sheet = await ui.sheet({
  title: 'Share Options',
  actions: [
    { label: 'Copy Link', value: 'copy' },
    { label: 'AirDrop', value: 'airdrop' },
  ],
});

// Bottom Sheet with Snap Points
ui.bottomSheet({
  title: 'Media Controls',
  snapPoints: [0.25, 0.6, 0.9],
});

// Loading Overlay
const loading = ui.loading({ text: 'Processing...' });
// Later: loading.update({ progress: 0.5 }); loading.close();
```

#### Dialog Result Structure

```typescript
interface DialogResult<T = unknown> {
  isConfirmed: boolean;
  isDenied: boolean;
  isDismissed: boolean;
  value?: T;
  dismiss?: 'cancel' | 'backdrop' | 'close' | 'esc' | 'timer';
}
```

#### Supported Dialog Input Types (18 Types)

`text`, `email`, `password`, `number`, `tel`, `url`, `search`, `textarea`, `select`, `radio`, `checkbox`, `range`, `date`, `time`, `datetime-local`, `week`, `month`, `file`.

---

## Themes

glazekit ships with 18 distinct themes. Each theme comes as two minified CSS files: `<theme>.toast.css` and `<theme>.dialog.css`.

| Theme            | Aesthetic Character                                                              |
| :--------------- | :------------------------------------------------------------------------------- |
| `ios-glass`      | Apple iOS frosted blur, vibrant saturated borders, subtle specular reflection    |
| `liquid-glass`   | Apple VisionOS refractive fluid glass with elevated blur and specular highlights |
| `aurora`         | Shifting Northern Lights gradient mesh under blurred translucent substrate       |
| `classic-stack`  | Clean stacked card deck aesthetic                                                |
| `classic-bar`    | Left accent status indicator stripe                                              |
| `pill`           | Capsule pill shape with compact horizontal layout                                |
| `ripple`         | Concentric subtle glass glow rings                                               |
| `gradient-strip` | Vivid top gradient border glow                                                   |
| `sweet`          | Soft pillowy rounded surfaces with pastel micro-accents                          |
| `material`       | Material Design elevation, card ink boundaries, surface tints                    |
| `basic`          | Standard monochrome system dialogs                                               |
| `minimal`        | Ultra-clean hair-thin borders with transparent frosted fill                      |
| `flat`           | Zero-blur opaque modern flat surfaces                                            |
| `outline`        | High contrast transparent card with crisp stroked perimeter                      |
| `neon`           | Cyberpunk luminous glow and dark semi-translucent backdrop                       |
| `gradient`       | Rich multi-stop gradient background                                              |
| `brutal`         | Neo-brutalist high-contrast 2px hard black border with solid drop shadow         |
| `pastel`         | Gentle confectionery tints with low eye-strain contrast                          |

### CSS Variables (Prefix `--gk-`)

You can customize any theme using CSS variables:

```css
:root {
  --gk-bg: rgba(255, 255, 255, 0.72);
  --gk-fg: #1d1d1f;
  --gk-muted: #86868b;
  --gk-border: rgba(0, 0, 0, 0.08);
  --gk-radius: 18px;
  --gk-blur: 24px;
  --gk-saturate: 180%;
  --gk-shadow: 0 12px 36px rgba(0, 0, 0, 0.12);
  --gk-font: -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;
  --gk-success: #34c759;
  --gk-error: #ff3b30;
  --gk-warning: #ff9500;
  --gk-info: #007aff;
  --gk-accent: #007aff;
  --gk-z: 99999;
  --gk-gap: 12px;
  --gk-width: 360px;
  --gk-ease: cubic-bezier(0.16, 1, 0.3, 1);
  --gk-duration: 220ms;
}
```

---

## Global Configuration

Configure global defaults once at application start:

```typescript
import { ui } from 'glazekit';

ui.configure({
  theme: 'ios-glass',
  mode: 'auto', // 'light' | 'dark' | 'auto'
  position: 'bottom-right',
  duration: 4000,
  maxVisible: 5,
  gap: 12,
  stack: true,
  hotkey: 'alt+t',
  richColors: true,
  swipe: true,
});
```

---

## Accessibility (WCAG 2.2 AA)

- **Live Regions**: Toast updates announce via polite and assertive ARIA live regions.
- **Focus Management**: Dialogs trap focus, handle Tab cycling, and restore previous active element on close.
- **Keyboard Shortcuts**: `Alt+T` focuses the active toast region; `Escape` closes dialogs and toasts.
- **Reduced Motion**: Respects `prefers-reduced-motion: reduce` by disabling non-essential transitions.
- **Contrast**: Every theme color token is checked against WCAG 2.2 AA contrast requirements (minimum 4.5:1 for body text, 3:1 for large text and controls).

---

## License

MIT (c) 2026 glazekit authors
