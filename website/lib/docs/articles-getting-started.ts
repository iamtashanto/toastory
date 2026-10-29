import type { DocArticle } from './docs-data';

export const GETTING_STARTED_ARTICLES: Record<string, DocArticle> = {
  // 1. INTRODUCTION
  'getting-started/introduction': {
    slug: 'getting-started/introduction',
    title: 'Introduction to toastory',
    description: 'The unified UI feedback toolkit with Apple-style glass design and zero dependencies.',
    category: 'Getting Started',
    lastUpdated: 'October 2026',
    headings: [
      { id: 'why-toastory', title: 'Why toastory?' },
      { id: 'core-pillars', title: 'Core Pillars' },
      { id: 'architecture', title: 'Architecture Overview' },
      { id: 'next-steps', title: 'Next Steps' },
    ],
    content: `
# Introduction to toastory

**toastory** is a professional-grade UI feedback toolkit designed to eliminate the fragmentation of using multiple separate libraries for toasts, confirmation modals, prompts, bottom sheets, and loading indicators.

### Core Pillars

1. **Zero Runtime Dependencies**: The published package has zero dependencies. Optional peer dependencies (React, Vue, Svelte, Angular, React Native) are resolved only if used.
2. **Apple Frosted Glass System**: 21 handcrafted visual presets powered by CSS Custom Properties prefixed with \`--gk-\`.
3. **WCAG 2.2 AA Accessibility**: Tested across 96 permutations with 0 axe-core automated violations. Supports keyboard hotkeys (\`Alt+T\`), live regions, and focus trapping.
4. **Micro Footprint**: Core toast and 1 theme under 6 KB gzip; complete toolkit under 22 KB gzip.
`,
  },

  // 2. INSTALLATION
  'getting-started/installation': {
    slug: 'getting-started/installation',
    title: 'Installation Guide',
    description: 'Install toastory across npm, pnpm, yarn, bun, and deno, or via modern ESM CDNs.',
    category: 'Getting Started',
    lastUpdated: 'October 2026',
    headings: [
      { id: 'package-managers', title: 'Install via Package Manager' },
      { id: 'esm-cdn', title: 'Import via ESM CDN (esm.sh / unpkg)' },
      { id: 'optional-peers', title: 'Optional Peer Dependencies' },
    ],
    content: `
# Installation Guide

toastory is published on the public npm registry under the package name \`toastory\`.

### Install via Package Manager

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

### Import via ESM CDN (esm.sh)

For script tags or zero-build environments:

\`\`\`html
<script type="module">
  import { ui, toast } from 'https://esm.sh/toastory';
  import 'https://esm.sh/toastory/themes/ios-glass.css';

  toast.success('Loaded directly via CDN!');
</script>
\`\`\`
`,
  },

  // 3. QUICKSTART
  'getting-started/quickstart': {
    slug: 'getting-started/quickstart',
    title: '8-Line Quickstart Across All 9 Frameworks',
    description: 'Get up and running in seconds with copyable quickstart snippets for every platform.',
    category: 'Getting Started',
    lastUpdated: 'October 2026',
    headings: [
      { id: 'react-nextjs', title: 'React & Next.js App Router' },
      { id: 'vue-nuxt', title: 'Vue 3 & Nuxt' },
      { id: 'svelte', title: 'Svelte 4 & 5' },
      { id: 'vanilla-js', title: 'Plain JavaScript & Electron' },
    ],
    content: `
# 8-Line Quickstart Across All 9 Frameworks

### React & Next.js App Router

\`\`\`tsx
import { Toaster, toast } from 'toastory/react';
import 'toastory/themes/ios-glass.css';

export default function App() {
  return (
    <>
      <Toaster position="top-right" theme="ios-glass" mode="auto" richColors />
      <button onClick={() => toast.success('Quickstart completed!')}>Notify</button>
    </>
  );
}
\`\`\`

### Plain JavaScript

\`\`\`typescript
import { ui, toast } from 'toastory';
import 'toastory/themes/ios-glass.css';

ui.configure({ theme: 'ios-glass', position: 'top-right' });
toast.success('Vanilla JS initialized!');
\`\`\`
`,
  },

  // 4. SETUP CHECKLIST
  'getting-started/setup-checklist': {
    slug: 'getting-started/setup-checklist',
    title: 'Production Setup Checklist',
    description: 'Verification checklist for theme imports, CSP headers, SSR hydration, and accessibility.',
    category: 'Getting Started',
    lastUpdated: 'October 2026',
    headings: [
      { id: 'checklist', title: 'Deployment Readiness Checklist' },
      { id: 'csp-rules', title: 'Content Security Policy (CSP) Directives' },
    ],
    content: `
# Production Setup Checklist

Before deploying your application powered by toastory to production:

- [x] **Theme CSS Imported**: Ensure that \`toastory/themes/<theme>.css\` is imported in your global layout or entrypoint.
- [x] **Zero Dependencies**: Confirm no unnecessary third-party packages are pulled into your bundle.
- [x] **Reduced Motion**: Verify that animations respect \`prefers-reduced-motion: reduce\` (toastory automatically suppresses springs and transitions).
- [x] **CSP Directives**: toastory uses zero inline style attributes with \`eval()\` or unsanitized strings.

### Content Security Policy (CSP) Directives
\`\`\`
default-src 'self';
script-src 'self';
style-src 'self' 'unsafe-inline';
\`\`\`
`,
  },
};
