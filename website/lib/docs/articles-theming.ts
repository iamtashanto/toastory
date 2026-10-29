import type { DocArticle } from './docs-data';

export const THEMING_ARTICLES: Record<string, DocArticle> = {
  // 1. THEMING OVERVIEW
  'theming/overview': {
    slug: 'theming/overview',
    title: 'Theming & Design System Overview',
    description: 'Learn how toastory powers Apple frosted glass with 21 themes, CSS custom properties, and solid fallbacks.',
    category: 'Theming & Design System',
    lastUpdated: 'October 2026',
    headings: [
      { id: 'glass-design', title: 'The Apple Glass Aesthetic' },
      { id: 'twenty-one-presets', title: '21 Distinct Visual Presets' },
      { id: 'solid-fallbacks', title: 'Automatic Solid Fallbacks' },
    ],
    content: `
# Theming & Design System Overview

toastory is built from the ground up around CSS Custom Properties prefixed with \`--gk-\`. Every component consumes these tokens scoped to \`[data-gk-theme="<name>"]\`.

### 21 Distinct Visual Presets

1. **ios-glass**: Authentic Apple frosted glass with specular highlight borders and 22px physical blur.
2. **liquid-glass**: Fluid optical refraction with chromatic edge glows.
3. **aurora**: Northern lights gradient ribbons with deep translucent darks.
4. **essentials**: Clean, refined neutral glass suitable for enterprise SaaS dashboards.
5. **showcase**: Expressive highlights and deep multi-layer drop shadows.
6. **classic-stack**: Sonner-style minimal borders and compact elevations.
7. **classic-bar**: Full-bleed accent indicator bars.
8. **pill**: Dynamic Island capsule geometry.
9. **ripple**: Animated edge gradient pulses.
10. **gradient-strip**: Vibrant linear gradient header strip.
11. **sweet**: Candy pastel palettes with soft shadows.
12. **material**: Material Design 3 elevation and tonal containers.
13. **basic**: Minimalist monochrome styling.
14. **minimal**: Ultra-thin borders and translucent surfaces.
15. **flat**: High-contrast solid flat colors.
16. **outline**: Crisp borders with transparent background.
17. **neon**: Cyberpunk glowing neon borders.
18. **gradient**: Rich mesh gradient backdrops.
19. **brutal**: Neo-brutalist black borders and hard drop shadows.
20. **pastel**: Soft soothing muted tones.
21. **dialogs**: High-contrast modal theme for alerts and confirmations.
`,
  },

  // 2. DESIGN TOKEN REFERENCE
  'theming/tokens': {
    slug: 'theming/tokens',
    title: 'Design Token Reference',
    description: 'Complete reference of CSS custom properties prefixed with --gk- governing surfaces, blur, typography, and tones.',
    category: 'Theming & Design System',
    lastUpdated: 'October 2026',
    headings: [
      { id: 'token-table', title: 'CSS Token Specifications' },
      { id: 'overriding-tokens', title: 'Overriding Tokens in CSS' },
    ],
    content: `
# Design Token Reference

All toastory components are styled using CSS Custom Properties prefixed with \`--gk-\`:

| Token | Purpose | Example Value |
| :--- | :--- | :--- |
| \`--gk-bg\` | Translucent background surface color | \`rgba(255, 255, 255, 0.72)\` |
| \`--gk-bg-solid\` | Fallback background for older browsers | \`#ffffff\` |
| \`--gk-fg\` | Primary foreground text color | \`#0a0a0c\` |
| \`--gk-muted\` | Secondary subtitle text color | \`#64748b\` |
| \`--gk-border\` | Border color and divider lines | \`rgba(255, 255, 255, 0.45)\` |
| \`--gk-radius\` | Corner border radius | \`20px\` |
| \`--gk-blur\` | CSS backdrop-filter blur radius | \`22px\` |
| \`--gk-saturate\` | CSS backdrop-filter saturation multiplier | \`180%\` |
| \`--gk-shadow\` | Multi-layer drop shadow and inner highlights | \`0 8px 32px rgba(0,0,0,0.12)\` |
| \`--gk-accent\` | Primary action and button background | \`#2563eb\` |
| \`--gk-accent-fg\` | Text on top of accent background | \`#ffffff\` |
| \`--gk-success\` | Success badge and status tone | \`#10b981\` |
| \`--gk-error\` | Error badge and danger button background | \`#ef4444\` |
| \`--gk-warning\` | Caution and warning tone | \`#f59e0b\` |
| \`--gk-info\` | Informational tone | \`#3b82f6\` |
| \`--gk-duration\` | Spring transition duration | \`0.38s\` |
| \`--gk-ease\` | Spring cubic-bezier easing curve | \`cubic-bezier(0.22, 1, 0.36, 1)\` |
`,
  },

  // 3. CREATING CUSTOM THEMES
  'theming/define-theme': {
    slug: 'theming/define-theme',
    title: 'Creating Custom Themes with defineTheme()',
    description: 'Programmatically register custom themes at runtime or in build steps with automated WCAG contrast verification.',
    category: 'Theming & Design System',
    lastUpdated: 'October 2026',
    headings: [
      { id: 'define-theme-api', title: 'defineTheme() Syntax' },
      { id: 'contrast-checking', title: 'Automated WCAG AA Contrast Checks' },
    ],
    content: `
# Creating Custom Themes with defineTheme()

You can author new themes dynamically using \`defineTheme()\`:

\`\`\`typescript
import { defineTheme, ui } from 'toastory';

defineTheme('midnight-emerald', {
  radius: '16px',
  blur: '20px',
  saturate: '160%',
  light: {
    bg: 'rgba(255, 255, 255, 0.8)',
    solid: '#ffffff',
    fg: '#064e3b',
    muted: '#047857',
    border: 'rgba(6, 78, 59, 0.15)',
    shadow: '0 8px 32px rgba(6, 78, 59, 0.08)',
    accent: '#059669',
    accentFg: '#ffffff',
    danger: '#dc2626',
    dangerFg: '#ffffff',
    success: '#059669',
    error: '#dc2626',
    warning: '#d97706',
    info: '#2563eb',
  },
  dark: {
    bg: 'rgba(6, 78, 59, 0.45)',
    solid: '#064e3b',
    fg: '#ecfdf5',
    muted: '#a7f3d0',
    border: 'rgba(255, 255, 255, 0.15)',
    shadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
    accent: '#10b981',
    accentFg: '#064e3b',
    danger: '#ef4444',
    dangerFg: '#ffffff',
    success: '#10b981',
    error: '#ef4444',
    warning: '#f59e0b',
    info: '#38bdf8',
  },
});

ui.configure({ theme: 'midnight-emerald' });
\`\`\`
`,
  },

  // 4. DARK MODE INTEGRATION
  'theming/dark-mode': {
    slug: 'theming/dark-mode',
    title: 'Dark Mode Integration',
    description: 'Automatic system dark mode detection, class-based toggles, and data attribute synchronization.',
    category: 'Theming & Design System',
    lastUpdated: 'October 2026',
    headings: [
      { id: 'modes', title: 'Light, Dark, and Auto Modes' },
      { id: 'tailwind-nextjs', title: 'Tailwind CSS & next-themes Integration' },
    ],
    content: `
# Dark Mode Integration

Every toastory theme ships with full light and dark token palettes. You can control the mode globally or per notification:

\`\`\`typescript
import { ui } from 'toastory';

// 1. Follow system OS preferences automatically
ui.configure({ mode: 'auto' });

// 2. Force light mode
ui.configure({ mode: 'light' });

// 3. Force dark mode
ui.configure({ mode: 'dark' });
\`\`\`

### Integrating with Tailwind CSS or next-themes

\`\`\`tsx
import { useTheme } from 'next-themes';
import { useEffect } from 'react';
import { ui } from 'toastory';

export function ThemeBridge() {
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    if (resolvedTheme === 'dark' || resolvedTheme === 'light') {
      ui.configure({ mode: resolvedTheme });
    }
  }, [resolvedTheme]);

  return null;
}
\`\`\`
`,
  },

  // 5. CSS OVERRIDES & HEADLESS
  'theming/customization': {
    slug: 'theming/customization',
    title: 'CSS Overrides & Headless Unstyled Mode',
    description: 'Customize styles via Tailwind classes, classNames sub-object targeting, or completely unstyled headless mode.',
    category: 'Theming & Design System',
    lastUpdated: 'October 2026',
    headings: [
      { id: 'class-names-object', title: 'classNames Sub-Object' },
      { id: 'tailwind-styling', title: 'Tailwind CSS Classes' },
      { id: 'unstyled-headless', title: 'Unstyled Headless Mode' },
    ],
    content: `
# CSS Overrides & Headless Unstyled Mode

### classNames Sub-Object

Target granular internal DOM nodes with Tailwind or custom CSS classes:

\`\`\`typescript
import { toast } from 'toastory';

toast.success('File synced', {
  classNames: {
    toast: 'shadow-2xl border-blue-500/30',
    title: 'font-mono text-sm tracking-tight',
    description: 'text-xs text-blue-200',
    actionButton: 'bg-blue-600 hover:bg-blue-500 text-white',
    closeButton: 'hover:bg-white/10',
  },
});
\`\`\`

### Unstyled Mode

Pass \`unstyled: true\` to strip all default library CSS while retaining accessibility, keyboard navigation, and physics gestures:

\`\`\`typescript
toast('Raw notification', {
  unstyled: true,
  className: 'my-custom-toast-container',
});
\`\`\`
`,
  },

  // 6. ACCESSIBILITY PRINCIPLES
  'accessibility/principles': {
    slug: 'accessibility/principles',
    title: 'WCAG 2.2 AA Accessibility Principles',
    description: 'Comprehensive accessibility: live regions, Alt+T hotkey navigation, keyboard focus traps, and contrast compliance.',
    category: 'Accessibility (A11y)',
    lastUpdated: 'October 2026',
    headings: [
      { id: 'live-regions', title: 'Polite & Assertive Live Regions' },
      { id: 'keyboard-hotkey', title: 'Keyboard Hotkey Navigation (Alt+T)' },
      { id: 'focus-trapping', title: 'Modal Focus Trap & Return' },
      { id: 'contrast-checking', title: 'Zero axe-core Violations' },
    ],
    content: `
# WCAG 2.2 AA Accessibility Principles

Accessibility is a headline feature of toastory. Every component has been evaluated with \`axe-core\` across 96 permutations with **0 automated accessibility violations**.

### Polite & Assertive Live Regions
- Informational and success toasts use \`aria-live="polite"\` and \`role="status"\`.
- High-priority error and danger toasts use \`aria-live="assertive"\` and \`role="alert"\`.

### Keyboard Hotkey (Alt+T)
Users can press \`Alt+T\` (customizable via \`hotkey\` option) from anywhere on the page to focus the notification region. Once focused, users can navigate buttons with \`Tab\` and dismiss notifications with \`Escape\`.

### Focus Trapping in Dialogs
When \`ui.confirm()\`, \`ui.alert()\`, or \`ui.prompt()\` is displayed:
1. Keyboard focus is safely trapped inside the modal container.
2. Initial focus lands on the action button or prompt input (or Cancel button for \`tone: 'danger'\`).
3. Pressing \`Escape\` safely dismisses the modal.
4. Upon closing, previous focus returns to the element that originally triggered the dialog.
`,
  },
};
