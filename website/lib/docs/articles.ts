import { DocArticle } from './docs-data';

// Helper to provide a comprehensive default article for any registered slug
export function getArticleBySlug(slug: string): DocArticle {
  if (ARTICLES_MAP[slug]) {
    return ARTICLES_MAP[slug];
  }

  // Generate structured fallback matching category
  const parts = slug.split('/');
  const categoryName = parts[0] ? parts[0].replace(/-/g, ' ').toUpperCase() : 'DOCUMENTATION';
  const rawTitle = parts[1] || parts[0];
  const formattedTitle = rawTitle
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  return {
    slug,
    title: `${formattedTitle} Guide`,
    description: `Complete guide and reference for ${formattedTitle} in glazekit.`,
    category: categoryName,
    lastUpdated: 'October 2026',
    headings: [
      { id: 'overview', title: 'Overview' },
      { id: 'usage', title: 'Code Example & Syntax' },
      { id: 'best-practices', title: 'Best Practices & Accessibility' },
    ],
    content: `
# ${formattedTitle}

This guide provides the complete documentation, configuration options, and implementation patterns for **${formattedTitle}** in glazekit.

---

### Overview

toastory provides a unified API contract across all supported platforms (plain JavaScript, React, Next.js, Vue, Nuxt, Angular, Svelte, and React Native). 

All feedback components share identical options, Apple-style frosted glass tokens, and WCAG 2.2 AA accessibility features.

\`\`\`typescript
import { ui, toast } from 'toastory';

// Interactive demonstration
toast.info('Exploring ${formattedTitle}', {
  description: 'Zero runtime dependencies with 21 responsive themes.'
});
\`\`\`

---

### Best Practices & Accessibility

1. **Live Regions**: Ensure notifications announce politely via \`aria-live="polite"\` or assertively via \`aria-live="assertive"\` for urgent errors.
2. **Keyboard Navigation**: Users can press \`Alt+T\` at any time to focus into the toast container or press \`Escape\` to dismiss active dialogs.
3. **Reduced Motion**: All spring physics and keyframe spins automatically degrade to instant opacity fades when \`prefers-reduced-motion: reduce\` is enabled.
`,
  };
}

export const ARTICLES_MAP: Record<string, DocArticle> = {
  // 1. GETTING STARTED: INTRODUCTION
  'getting-started/introduction': {
    slug: 'getting-started/introduction',
    title: 'Introduction to toastory',
    description: 'The unified UI feedback toolkit with Apple-style glass design and zero dependencies.',
    category: 'Getting Started',
    lastUpdated: 'October 2026',
    headings: [
      { id: 'why-glazekit', title: 'Why toastory?' },
      { id: 'core-pillars', title: 'Core Pillars' },
      { id: 'architecture', title: 'Architecture Overview' },
      { id: 'next-steps', title: 'Next Steps' },
    ],
    content: `
# Introduction to toastory

**toastory** is a professional-grade UI feedback toolkit designed to eliminate the fragmentation of using multiple separate libraries for toasts, confirmation modals, prompts, bottom sheets, and loading indicators.

Instead of installing Sonner for toasts, SweetAlert2 for modals, and a third-party library for bottom sheets, **toastory** provides one unified, coherent API designed with an Apple-style frosted glass aesthetic.

---

### Why toastory?

Most UI feedback libraries in the JavaScript ecosystem suffer from three critical shortcomings:

1. **Ecosystem Fragmentation**: Toast libraries do not handle complex modal prompts, OTP inputs, or step-by-step flows. You end up installing multiple heavy libraries with clashing visual aesthetics and inconsistent APIs.
2. **Framework Lock-in**: Libraries are often tightly coupled to React. If your team builds across Vue, Svelte, Angular, Next.js, or React Native, you have to learn and maintain completely different packages.
3. **Bloat and Runtime Dependencies**: Many libraries ship external styling engines, runtime animation suites, or icon dependencies that inflate client bundle sizes.

**toastory solves all three.** It ships with **zero runtime dependencies**, guarantees under **5.2 KB gzip** for core + toasts, and uses identical options whether you are coding in React, Svelte, or Vanilla JavaScript.

---

### Core Pillars

- **Unified Feedback Contract**: One consistent \`ui\` helper powering \`ui.toast()\`, \`ui.confirm()\`, \`ui.prompt()\`, \`ui.steps()\`, \`ui.sheet()\`, \`ui.bottomSheet()\`, and \`ui.loading()\`.
- **Apple Glass Aesthetic**: 21 hand-crafted theme presets with frosted glass, saturation boost, and graceful solid-color fallbacks via \`@supports not (backdrop-filter: blur())\`.
- **WCAG 2.2 AA Accessibility**: Polite and assertive live regions (\`aria-live\`), active focus trapping with automatic restoration, Esc key dismissals, and \`Alt+T\` keyboard navigation hotkeys.
- **SSR & Hydration Safety**: Guarded DOM access built specifically for Next.js (App & Pages Router), Nuxt 3, SvelteKit, and Angular Universal.
- **Tree-Shakable**: Toast-only imports omit dialog and overlay controllers from your production bundle.
`,
  },

  // 2. GETTING STARTED: INSTALLATION
  'getting-started/installation': {
    slug: 'getting-started/installation',
    title: 'Installation Guide',
    description: 'How to install toastory across package managers, CDNs, and optional peer frameworks.',
    category: 'Getting Started',
    lastUpdated: 'October 2026',
    headings: [
      { id: 'package-managers', title: 'Package Managers' },
      { id: 'peer-dependencies', title: 'Optional Peer Dependencies' },
      { id: 'cdn-usage', title: 'CDN & Vanilla Script Tags' },
    ],
    content: `
# Installing toastory

toastory is published as a single, self-contained package to npm under the name \`toastory\`.

### Package Managers

Install the core package using your package manager of choice:

\`\`\`bash
# npm
npm install toastory

# pnpm
pnpm add toastory

# yarn
yarn add toastory

# bun
bun add toastory
\`\`\`

---

### Optional Peer Dependencies

toastory published package contains **zero required runtime dependencies**. Framework adapters are exposed as optional peer dependencies. You only install what your project consumes:

- **React & Next.js**: \`react >= 18\`, \`react-dom >= 18\`
- **Vue & Nuxt**: \`vue >= 3.3\`
- **Angular**: \`@angular/core >= 16\`
- **Svelte**: \`svelte >= 4\`
- **React Native**: \`react-native >= 0.72\`, \`react-native-reanimated >= 3\`, \`expo-blur\`, \`expo-haptics\`
- **HTML Sanitization**: \`dompurify >= 3\` (toastory bundles a built-in zero-dependency sanitizer by default)

---

### CDN & Vanilla Script Tags

You can use toastory directly in the browser without a build step:

\`\`\`html
<!-- Theme Stylesheet -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/glazekit/dist/themes/ios-glass.css" />

<!-- ES Module Import -->
<script type="module">
  import { ui, toast } from 'https://cdn.jsdelivr.net/npm/glazekit/+esm';

  toast.success('Loaded from CDN!');
</script>
\`\`\`
`,
  },

  // 3. GETTING STARTED: QUICKSTART
  'getting-started/quickstart': {
    slug: 'getting-started/quickstart',
    title: 'Quickstart Guide',
    description: 'Get up and running with toastory in under two minutes across any framework.',
    category: 'Getting Started',
    lastUpdated: 'October 2026',
    headings: [
      { id: 'react-next', title: 'React & Next.js Quickstart' },
      { id: 'vanilla-js', title: 'Vanilla JavaScript / TypeScript' },
      { id: 'vue-nuxt', title: 'Vue & Nuxt Quickstart' },
      { id: 'svelte', title: 'Svelte Quickstart' },
    ],
    content: `
# Quickstart Guide

Get up and running with working toasts and dialogs in under two minutes.

### React & Next.js App Router

1. Add the \`<Toaster />\` component to your root layout and import your chosen theme CSS:

\`\`\`tsx
// app/layout.tsx
import { Toaster } from 'toastory/react';
import 'toastory/themes/ios-glass.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Toaster position="top-right" theme="ios-glass" />
        {children}
      </body>
    </html>
  );
}
\`\`\`

2. Trigger feedback from any client component:

\`\`\`tsx
'use client';
import { toast, ui } from 'toastory/react';

export function ActionButton() {
  const handleClick = async () => {
    // 1. Trigger a toast
    toast.success('Changes saved to cloud!', { description: 'Sync completed.' });

    // 2. Trigger an interactive confirmation modal
    const result = await ui.confirm({
      title: 'Deploy to Production?',
      tone: 'warning',
      confirmButton: { label: 'Deploy Now' }
    });

    if (result.isConfirmed) {
      toast.info('Deployment initiated...');
    }
  };

  return <button onClick={handleClick}>Run Action</button>;
}
\`\`\`

---

### Vanilla JavaScript / TypeScript

In plain HTML/JS applications, import the theme CSS and the \`ui\` or \`toast\` helper:

\`\`\`javascript
import { ui, toast } from 'toastory';
import 'toastory/themes/ios-glass.css';

// Toast
toast.success('Asset uploaded successfully!');

// Confirm Dialog
const res = await ui.confirm({
  title: 'Delete branch?',
  tone: 'danger',
  confirmButton: { label: 'Delete Branch' }
});

if (res.isConfirmed) {
  toast.error('Branch deleted.');
}
\`\`\`
`,
  },

  // 4. GETTING STARTED: SETUP CHECKLIST
  'getting-started/setup-checklist': {
    slug: 'getting-started/setup-checklist',
    title: 'Production Setup Checklist',
    description: 'Ensure your toastory integration is optimized, secure, and SSR-safe.',
    category: 'Getting Started',
    lastUpdated: 'October 2026',
    headings: [
      { id: 'checklist', title: 'Checklist Items' },
      { id: 'csp-config', title: 'Content Security Policy (CSP)' },
      { id: 'z-index-layering', title: 'Z-Index Layering' },
    ],
    content: `
# Production Setup Checklist

Follow this checklist before shipping applications powered by toastory to production.

### Checklist Items

- [x] **Theme CSS Imported**: Ensure that \`toastory/themes/<theme>.css\` is imported in your global layout or entrypoint.
- [x] **SSR Boundary**: Ensure that components calling \`ui.confirm()\` or \`toast()\` in Next.js App Router have the \`'use client'\` directive.
- [x] **Z-Index Layering**: Default toast container uses \`--gk-z: 99999\`. If you have modals with higher z-indices, configure \`ui.configure({ zIndex: ... })\`.
- [x] **Reduced Motion**: Verify that animations respect \`prefers-reduced-motion: reduce\` (toastory automatically suppresses springs and transitions).
- [x] **HTML Sanitization**: If using the \`html\` option in toasts or dialogs, verify that user-generated inputs are sanitized via the built-in sanitizer or DOMPurify.

---

### Content Security Policy (CSP)

toastory does not inject inline \`<style>\` tags by default when using pre-built theme CSS files. If you use \`defineTheme\` dynamically, add a CSP \`style-src\` nonce or configure Shadow DOM mode:

\`\`\`javascript
import { configure } from 'toastory';

configure({
  shadow: true // Isolates all toast markup inside a ShadowRoot
});
\`\`\`
`,
  },

  // 5. GUIDES: TOASTS
  'guides/toasts': {
    slug: 'guides/toasts',
    title: 'Toast Notifications Guide',
    description: 'Comprehensive guide to creating, styling, and customizing toast notifications.',
    category: 'Guides',
    lastUpdated: 'October 2026',
    headings: [
      { id: 'basic-usage', title: 'Basic Usage & Shorthands' },
      { id: 'action-cancel', title: 'Actions & Cancel Buttons' },
      { id: 'icons-avatars', title: 'Icons, Avatars & Badges' },
      { id: 'options-table', title: 'Complete Toast Options Table' },
    ],
    optionsTable: [
      { name: 'title', type: 'string', defaultVal: 'undefined', description: 'Primary heading text of the notification.' },
      { name: 'description', type: 'string', defaultVal: 'undefined', description: 'Secondary descriptive body text.' },
      { name: 'duration', type: 'number', defaultVal: '4000', description: 'Time in ms before auto-close. 0 makes toast persistent.' },
      { name: 'position', type: 'ToastPosition', defaultVal: "'top-right'", description: 'Screen placement (6 positions).' },
      { name: 'action', type: 'ToastAction', defaultVal: 'undefined', description: 'Action button with label and onClick handler.' },
      { name: 'cancel', type: 'ToastAction', defaultVal: 'undefined', description: 'Secondary cancel button.' },
      { name: 'closeButton', type: 'boolean', defaultVal: 'false', description: 'Renders an accessible close icon button.' },
      { name: 'richColors', type: 'boolean', defaultVal: 'false', description: 'Applies tinted background matching the status color.' },
      { name: 'swipe', type: 'boolean', defaultVal: 'true', description: 'Enables touch gesture swipe dismissal.' },
    ],
    content: `
# Toast Notifications

toastory toasts deliver non-intrusive feedback designed with Apple-style frosted glass aesthetics and polite live regions.

### Basic Usage & Shorthands

Use semantic shorthands for immediate tone-colored notifications:

\`\`\`typescript
import { toast } from 'toastory';

// Success notification
toast.success('Changes committed', {
  description: 'Revision b9a17 pushed to origin/main.'
});

// Error alert
toast.error('Connection timed out', {
  description: 'Could not establish WebSocket connection.'
});

// Warning notice
toast.warning('Storage limit approaching', {
  description: 'Your database is at 88% capacity.'
});

// Info notice
toast.info('New version available', {
  description: 'Reload the window to apply updates.'
});

// Loading persistent toast
const id = toast.loading('Exporting customer data...');
\`\`\`

---

### Actions & Cancel Buttons

You can attach actionable buttons directly to any toast:

\`\`\`typescript
toast('File moved to trash', {
  description: 'annual-report-2026.pdf',
  duration: 6000,
  action: {
    label: 'Undo',
    onClick: () => {
      restoreFile();
      toast.success('File restored!');
    }
  },
  cancel: {
    label: 'Dismiss'
  }
});
\`\`\`
`,
  },

  // 6. GUIDES: PROMISE TOASTS
  'guides/promise-toasts': {
    slug: 'guides/promise-toasts',
    title: 'Promise Toasts & Async Flows',
    description: 'Track asynchronous promises with seamless loading, success, and error states.',
    category: 'Guides',
    lastUpdated: 'October 2026',
    headings: [
      { id: 'promise-api', title: 'The ui.toast.promise() API' },
      { id: 'unwrapping', title: 'Unwrapping the Underlying Promise' },
      { id: 'dynamic-messages', title: 'Dynamic Message Callbacks' },
    ],
    content: `
# Promise Toasts

Handling asynchronous workflows like API calls, file uploads, and background tasks is made effortless with \`toast.promise()\`.

### The \`toast.promise()\` API

Pass a Promise (or a function returning a Promise) along with loading, success, and error configurations:

\`\`\`typescript
import { toast } from 'toastory';

toast.promise(
  saveUserSettings(payload),
  {
    loading: 'Saving profile preferences...',
    success: 'Preferences updated successfully!',
    error: 'Failed to update preferences.'
  }
);
\`\`\`

---

### Dynamic Message Callbacks

You can pass functions to \`success\` or \`error\` to incorporate resolved values or error messages into the toast:

\`\`\`typescript
toast.promise(
  createWorkspace({ name: 'Acme' }),
  {
    loading: 'Provisioning dedicated cluster...',
    success: (data) => \`Cluster \${data.name} is now live at \${data.url}!\`,
    error: (err) => \`Deployment error: \${err.message}\`,
    description: (state) => state.status === 'success' ? 'DNS propagated.' : 'Check logs.'
  }
);
\`\`\`

---

### Unwrapping the Underlying Promise

\`toast.promise()\` returns an object containing the toast ID and an \`unwrap()\` method that returns the original Promise:

\`\`\`typescript
const { unwrap } = toast.promise(fetchData(), {
  loading: 'Loading...',
  success: 'Done!',
  error: 'Failed!'
});

// Await the raw value without breaking your async flow:
const data = await unwrap();
\`\`\`
`,
  },

  // 7. GUIDES: DIALOGS
  'guides/dialogs': {
    slug: 'guides/dialogs',
    title: 'Dialogs: Confirm & Alert',
    description: 'Modern modal dialogs with focus trapping, tone badges, and accessible keyboard loops.',
    category: 'Guides',
    lastUpdated: 'October 2026',
    headings: [
      { id: 'confirm-dialogs', title: 'Confirmation Dialogs' },
      { id: 'alert-dialogs', title: 'System Alerts' },
      { id: 'danger-tone', title: 'Destructive Danger Confirmations' },
    ],
    content: `
# Confirmation & Alert Dialogs

toastory includes an accessible modal dialog toolkit designed to replace legacy libraries like SweetAlert2.

### Confirmation Dialogs (\`ui.confirm\`)

\`ui.confirm()\` opens a modal card with confirm and cancel actions, returning a structured result:

\`\`\`typescript
import { ui, toast } from 'toastory';

const result = await ui.confirm({
  title: 'Publish changes to production?',
  text: 'All connected clients will immediately receive the update.',
  confirmButton: { label: 'Publish Now' },
  cancelButton: { label: 'Keep Draft' }
});

if (result.isConfirmed) {
  toast.success('Published successfully!');
} else if (result.isDismissed) {
  console.log('Dismissed via:', result.dismiss); // 'cancel' | 'backdrop' | 'esc' | 'timer'
}
\`\`\`

---

### Destructive Danger Confirmations

Set \`tone: 'danger'\` for critical destructive actions. In danger mode, toastory automatically sets initial keyboard focus on the **Cancel** button to prevent accidental Enter-key activations:

\`\`\`typescript
const res = await ui.confirm({
  title: 'Terminate Cloud Instance?',
  text: 'All running processes and ephemeral storage will be wiped.',
  tone: 'danger',
  confirmButton: {
    label: 'Terminate Instance',
    color: '#dc2626'
  },
  cancelButton: {
    label: 'Abort'
  }
});
\`\`\`
`,
  },

  // 8. GUIDES: PROMPTS & INPUTS
  'guides/prompts-inputs': {
    slug: 'guides/prompts-inputs',
    title: 'Prompts & Interactive Inputs',
    description: 'Collect user data with 16 input types including 6-box OTP code inputs.',
    category: 'Guides',
    lastUpdated: 'October 2026',
    headings: [
      { id: 'prompt-overview', title: 'Prompt Overview' },
      { id: 'supported-inputs', title: '16 Supported Input Types' },
      { id: 'otp-input', title: 'Discrete 6-Box OTP Code Verification' },
    ],
    content: `
# Prompts & Interactive Inputs

Use \`ui.prompt()\` to gather validated input directly from users inside an accessible modal dialog.

### 16 Supported Input Types

toastory natively supports the following input types:
\`text\`, \`email\`, \`password\`, \`number\`, \`tel\`, \`url\`, \`search\`, \`textarea\`, \`select\`, \`radio\`, \`checkbox\`, \`range\`, \`date\`, \`time\`, \`datetime-local\`, and \`otp\`.

\`\`\`typescript
import { ui, toast } from 'toastory';

// Range input prompt
const { isConfirmed, value } = await ui.prompt({
  title: 'Set Resource Allocation',
  text: 'Select maximum memory ceiling in gigabytes:',
  input: 'range',
  inputValue: 16,
  inputAttributes: { min: '2', max: '64', step: '2' }
});

if (isConfirmed) {
  toast.success(\`Allocated \${value} GB memory.\`);
}
\`\`\`

---

### Discrete 6-Box OTP Code Verification

Set \`input: 'otp'\` for 6-box discrete numeric verification with clipboard paste auto-filling:

\`\`\`typescript
const res = await ui.prompt({
  title: 'Two-Factor Authentication',
  text: 'Enter the 6-digit numeric security code from your SMS:',
  input: 'otp',
  otpLength: 6,
  resendCooldown: 30,
  onResend: () => {
    dispatchNewSms();
    toast.info('New security code dispatched!');
  }
});

if (res.isConfirmed) {
  verifyTokenOnBackend(res.value);
}
\`\`\`
`,
  },

  // 9. THEMING: OVERVIEW
  'theming/overview': {
    slug: 'theming/overview',
    title: 'Theming Architecture',
    description: 'Learn how toastory powers Apple frosted glass with 21 themes and solid fallbacks.',
    category: 'Theming & Design System',
    lastUpdated: 'October 2026',
    headings: [
      { id: 'glass-design', title: 'Apple Glass Aesthetic' },
      { id: 'theme-presets', title: '21 Built-in Theme Presets' },
      { id: 'solid-fallbacks', title: 'Solid Fallback Mechanism' },
    ],
    content: `
# Theming Architecture

toastory is built from the ground up around CSS Custom Properties prefixed with \`--gk-\`. Every component consumes these tokens scoped to \`[data-gk-theme="<name>"]\`.

### Apple Glass Aesthetic

Glass themes use layered box shadows and specular highlight borders:

\`\`\`css
.gk-toast {
  background: var(--gk-bg);
  border: var(--gk-border-w) solid var(--gk-border);
  box-shadow: var(--gk-shadow);
  -webkit-backdrop-filter: blur(var(--gk-blur)) saturate(var(--gk-saturate));
  backdrop-filter: blur(var(--gk-blur)) saturate(var(--gk-saturate));
}
\`\`\`

---

### 21 Built-in Theme Presets

toastory ships with 21 distinct visual design presets:

1. \`ios-glass\`: Apple iOS frosted glass with specular highlight borders and deep blur
2. \`liquid-glass\`: Fluid iridescent refraction with glowing highlight halos
3. \`essentials\`: Clean solid neutral surfaces engineered for enterprise
4. \`showcase\`: Colorful gradient cards with luminous status indicators
5. \`dialogs\`: Optimized specifically for modal confirmations and sheets
6. \`aurora\`: Rotating Northern Lights multi-color animated glow
7. \`classic-stack\`: 4px left colored status indicator rail
8. \`classic-bar\`: 4px top colored alert rail
9. \`pill\`: Capsule shape with compact touch targets
10. \`ripple\`: Circular clip-path expanding ripple transition
11. \`gradient-strip\`: Multi-stop dynamic linear gradient line
12. \`sweet\`: Soft candy curves inspired by SweetAlert2
13. \`material\`: Google Material 3 elevation shadows
14. \`basic\`: Ultra-light zero-distraction neutral card
15. \`minimal\`: Monochrome high-contrast typography
16. \`flat\`: Zero drop-shadow modern flat surface
17. \`outline\`: Transparent hollow card with 2px stroke
18. \`neon\`: Cyberpunk black surface with radioactive glow
19. \`gradient\`: Sunset gradient wash
20. \`brutal\`: Neo-brutalist raw box with 3px solid black border
21. \`pastel\`: Dreamy lavender and mint hues
`,
  },

  // 10. THEMING: TOKENS
  'theming/tokens': {
    slug: 'theming/tokens',
    title: 'Design Token Reference',
    description: 'Complete specification of all CSS variables and theme tokens.',
    category: 'Theming & Design System',
    lastUpdated: 'October 2026',
    headings: [
      { id: 'tokens-table', title: 'Complete Token Specification Table' },
      { id: 'custom-css-vars', title: 'Overriding Tokens with CSS' },
    ],
    optionsTable: [
      { name: '--gk-bg', type: 'color', defaultVal: 'rgba(255,255,255,0.72)', description: 'Surface background color (translucent for glass blur).' },
      { name: '--gk-bg-solid', type: 'color', defaultVal: '#ffffff', description: 'Opaque fallback color for browsers without backdrop-filter.' },
      { name: '--gk-fg', type: 'color', defaultVal: '#0a0a0c', description: 'Primary foreground and text color.' },
      { name: '--gk-muted', type: 'color', defaultVal: '#2c2c32', description: 'Secondary body text, timestamps, and subtle hints.' },
      { name: '--gk-border', type: 'color', defaultVal: 'rgba(255,255,255,0.45)', description: 'Border stroke color.' },
      { name: '--gk-shadow', type: 'shadow', defaultVal: '0 4px 12px rgba(0,0,0,0.08)', description: 'Box shadow depth definition.' },
      { name: '--gk-accent', type: 'color', defaultVal: '#003d8f', description: 'Primary action and link color.' },
      { name: '--gk-danger', type: 'color', defaultVal: '#8a0a0a', description: 'Destructive action button background.' },
      { name: '--gk-radius', type: 'dimension', defaultVal: '20px', description: 'Corner border radius.' },
      { name: '--gk-blur', type: 'filter', defaultVal: '22px', description: 'Backdrop blur strength.' },
      { name: '--gk-saturate', type: 'filter', defaultVal: '180%', description: 'Backdrop color saturation boost.' },
    ],
    content: `
# Design Token Reference

Every theme sets these CSS variables scoped to \`[data-gk-theme="<name>"]\` and responds automatically to light, dark, or system mode.

---

### Overriding Tokens with CSS

You can override any token globally or for specific containers in your CSS:

\`\`\`css
/* Custom brand overrides */
:root {
  --gk-accent: #2563eb;
  --gk-radius: 16px;
  --gk-font: Inter, system-ui, sans-serif;
}
\`\`\`
`,
  },

  // 11. ACCESSIBILITY: PRINCIPLES
  'accessibility/principles': {
    slug: 'accessibility/principles',
    title: 'WCAG 2.2 AA Accessibility Principles',
    description: 'How toastory achieves zero axe-core errors and full keyboard and screen reader accessibility.',
    category: 'Accessibility (A11y)',
    lastUpdated: 'October 2026',
    headings: [
      { id: 'wcag-commitment', title: 'Accessibility Commitment' },
      { id: 'live-regions', title: 'Screen Reader Live Regions' },
      { id: 'focus-management', title: 'Focus Trapping & Restoration' },
      { id: 'keyboard-map', title: 'Keyboard Navigation Map' },
    ],
    content: `
# WCAG 2.2 AA Accessibility Principles

Accessibility is a headline feature of glazekit. Every component has been evaluated with axe-core across 96 permutations with **0 automated accessibility violations**.

---

### Screen Reader Live Regions

- **Standard Notifications**: Assigned \`role="status"\` and \`aria-live="polite"\` so screen readers announce them during natural speech pauses without interrupting the user.
- **Urgent Errors & Destructive Warnings**: Escalate to \`role="alert"\` and \`aria-live="assertive"\`.
- **Throttled Countdowns**: Inactivity timers throttle audio announcements to critical milestones (30s, 10s, 5s) to avoid flooding screen readers with 60 notifications per minute.

---

### Focus Trapping & Restoration

- **Active Dialogs**: Modals actively trap Tab / Shift+Tab loops within the dialog container.
- **Restoration**: On dismissal (via Escape or button click), focus is restored to the previous active element that launched the dialog.

---

### Keyboard Navigation Map

| Key / Combination | Target | Behavior |
| :--- | :--- | :--- |
| **Alt + T** | Toasts Container | Moves keyboard focus directly into the active toast stack. |
| **Escape** | Toast or Dialog | Dismisses the active toast or closes the modal dialog. |
| **Tab / Shift+Tab** | Active Dialog | Cycles focus through focusable inputs and buttons. |
| **Arrow Down / Up** | Toast Deck | Roves keyboard focus across stacked notifications. |
| **Enter** | Action Button | Triggers button onClick handler or submits dialog. |
`,
  },

  // 12. RECIPES: OPTIMISTIC UNDO
  'recipes/optimistic-undo': {
    slug: 'recipes/optimistic-undo',
    title: 'Recipe: Optimistic UI with Undo',
    description: 'Implement immediate optimistic mutations with a 5-second undo grace window.',
    category: 'Recipes',
    lastUpdated: 'October 2026',
    headings: [
      { id: 'pattern-overview', title: 'The Optimistic Undo Pattern' },
      { id: 'code-implementation', title: 'Complete Code Implementation' },
    ],
    content: `
# Recipe: Optimistic UI with Undo

Optimistic UI updates give users the perception of instant software by executing visual state changes before remote server confirmation.

### Complete Code Implementation

\`\`\`typescript
import { toast } from 'toastory';

export function deleteMessageOptimistic(messageId: string) {
  // 1. Instantly remove from local state
  removeMessageFromUi(messageId);

  let undone = false;

  // 2. Fire 5-second undo toast
  toast('Message deleted', {
    duration: 5000,
    progress: 'bar',
    action: {
      label: 'Undo',
      onClick: () => {
        undone = true;
        restoreMessageInUi(messageId);
        toast.info('Message restored.');
      }
    },
    onClose: (_, reason) => {
      // 3. Commit mutation to backend only if not undone
      if (!undone && reason === 'auto') {
        api.deleteMessage(messageId).catch(() => {
          restoreMessageInUi(messageId);
          toast.error('Failed to sync deletion with server.');
        });
      }
    }
  });
}
\`\`\`
`,
  },

  // 13. MIGRATION: SONNER
  'migration/sonner': {
    slug: 'migration/sonner',
    title: 'Migrating from Sonner',
    description: 'Side-by-side code comparisons and option mapping from Sonner to glazekit.',
    category: 'Migration',
    lastUpdated: 'October 2026',
    headings: [
      { id: 'overview', title: 'Why Migrate from Sonner?' },
      { id: 'option-mapping', title: 'Option Mapping Table' },
      { id: 'code-comparison', title: 'Side-by-Side Code Comparison' },
    ],
    content: `
# Migrating from Sonner to toastory

toastory provides drop-in API parity with Sonner's toast methods, while adding dialogs, multi-step wizards, bottom sheets, and multi-framework support.

### Option Mapping Table

| Sonner Option | toastory Equivalent | Notes |
| :--- | :--- | :--- |
| \`toast(message)\` | \`toast(message)\` | Identical syntax. |
| \`toast.success(msg)\` | \`toast.success(msg)\` | Identical syntax. |
| \`toast.error(msg)\` | \`toast.error(msg)\` | Identical syntax. |
| \`toast.promise(p, { loading, success, error })\` | \`toast.promise(p, { loading, success, error })\` | Identical syntax, plus \`.unwrap()\`. |
| \`<Toaster />\` | \`<Toaster />\` | Available from \`toastory/react\`. |
| \`theme="system"\` | \`mode="auto"\` | Supports 'light', 'dark', and 'auto'. |
| \`richColors\` | \`richColors\` | Identical boolean flag. |
| \`expand\` | \`stack="expanded"\` | Supports 'stacked' or 'expanded'. |
| \`closeButton\` | \`closeButton\` | Identical boolean flag. |

---

### Side-by-Side Code Comparison

\`\`\`typescript
// Before (Sonner)
import { toast } from 'sonner';
toast.success('Event created', { description: 'Monday at 9am' });

// After (toastory)
import { toast } from 'toastory';
toast.success('Event created', { description: 'Monday at 9am' });
\`\`\`
`,
  },

  // 14. API REFERENCE: CORE
  'api/core': {
    slug: 'api/core',
    title: 'API Reference: toastory/core',
    description: 'Technical reference for framework-agnostic headless core exports.',
    category: 'API Reference',
    lastUpdated: 'October 2026',
    headings: [
      { id: 'exports', title: 'Core Exports' },
      { id: 'store-manager', title: 'ToastManager & Store' },
      { id: 'dialog-manager', title: 'DialogManager' },
    ],
    content: `
# API Reference: toastory/core

The \`toastory/core\` subpath contains the pure Node-safe, zero-DOM state machines and store controllers that power all platform adapters.

### Core Exports

\`\`\`typescript
import {
  createToastManager,
  createToastStore,
  createDialogManager,
  createConfigStore,
  createTimer,
  runPromiseToast,
  runSteps,
  DEFAULT_CONFIG
} from 'toastory/core';
\`\`\`

- **\`createToastManager(opts)\`**: Creates an isolated toast state machine with deduplication, auto-close timers, and priority queues.
- **\`createDialogManager(clock)\`**: Manages FIFO dialog queues with asynchronous submission locks.
- **\`DEFAULT_CONFIG\`**: Immutable default configuration object.
`,
  },

  // 15. META: FAQ
  'meta/faq': {
    slug: 'meta/faq',
    title: 'Frequently Asked Questions (FAQ)',
    description: 'Common questions regarding bundle size, browser support, and accessibility.',
    category: 'Meta & Reference',
    lastUpdated: 'October 2026',
    headings: [
      { id: 'zero-deps', title: 'Is toastory truly zero runtime dependencies?' },
      { id: 'browser-support', title: 'Which browsers are supported?' },
      { id: 'bundle-size', title: 'How is the 5.2 KB bundle size achieved?' },
    ],
    content: `
# Frequently Asked Questions

### Is toastory truly zero runtime dependencies?
**Yes.** The published package on npm has zero entries in \`dependencies\`. All framework bindings (React, Vue, Svelte, Angular, React Native) are marked as optional peer dependencies.

---

### Which browsers are supported?
toastory supports all modern browsers:
- Chrome / Chromium >= 88
- Safari / iOS Safari >= 14
- Firefox >= 85
- Edge >= 88

For older browsers lacking \`backdrop-filter\`, toastory automatically falls back to solid background colors via CSS \`@supports\`.

---

### How is the 5.2 KB bundle size achieved?
toastory uses pure TypeScript compiled with tsup (esbuild) with strict tree-shaking flags. Toast logic is completely decoupled from modal and bottom sheet controllers.
`,
  },
};
