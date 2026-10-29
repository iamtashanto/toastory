# glazekit Theme Tokens Specification

This document provides the formal design token reference for `glazekit`. All components (toasts, dialogs, action sheets, bottom sheets, and loading overlays) consume these CSS variables prefixed with `--gk-`.

Every theme sets these variables scoped to `[data-gk-theme="<name>"]` and responds automatically to user dark mode preferences or explicit application overrides.

---

## Token Reference Table

| CSS Variable | TypeScript Property | Category | Description | `ios-glass` (Light) | `ios-glass` (Dark) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `--gk-bg` | `bg` | color | Surface background color. Translucent in glass themes for backdrop blur. | `rgba(255, 255, 255, 0.72)` | `rgba(28, 28, 32, 0.74)` |
| `--gk-bg-solid` | `solid` | color | Opaque fallback color used when backdrop-filter is unsupported or in forced-colors/reduced-transparency modes. | `#ffffff` | `#1c1c1e` |
| `--gk-fg` | `fg` | color | Primary text and foreground color. | `#0a0a0c` | `#ffffff` |
| `--gk-muted` | `muted` | color | Secondary muted text, timestamps, and subtle hints. | `#2c2c32` | `#f0f0f6` |
| `--gk-border` | `border` | color | Border and separator color. | `rgba(255, 255, 255, 0.45)` | `rgba(255, 255, 255, 0.16)` |
| `--gk-shadow` | `shadow` | shadow | Box shadow layers providing depth and specular edge illumination. | `0 4px 12px rgba(0, 0, 0, 0.08), 0 16px 36px rgba(0, 0, 0, 0.14), inset 0 1px 0 rgba(255, 255, 255, 0.8), inset 1px 0 0 rgba(255, 255, 255, 0.5)` | `0 4px 16px rgba(0, 0, 0, 0.4), 0 20px 48px rgba(0, 0, 0, 0.55), inset 0 1px 0 rgba(255, 255, 255, 0.22), inset 1px 0 0 rgba(255, 255, 255, 0.12)` |
| `--gk-accent` | `accent` | color | Brand/accent color for primary action buttons, links, and focus rings. | `#003d8f` | `#b0dcff` |
| `--gk-accent-fg` | `accentFg` | color | Text color on top of primary action/accent buttons. | `#ffffff` | `#00152e` |
| `--gk-danger` | `danger` | color | Destructive action button background. | `#8a0a0a` | `#ff9494` |
| `--gk-danger-fg` | `dangerFg` | color | Text color on top of destructive action buttons. | `#ffffff` | `#2b0000` |
| `--gk-success` | `success` | color | Tone color for success toasts, badges, and status icons. | `#0d5926` | `#6ae69a` |
| `--gk-error` | `error` | color | Tone color for error toasts, alerts, and destructive badges. | `#8a0a0a` | `#ffc2c2` |
| `--gk-warning` | `warning` | color | Tone color for warning toasts and advisory badges. | `#5e3a00` | `#ffd470` |
| `--gk-info` | `info` | color | Tone color for informational toasts and badges. | `#003f8a` | `#a8d8ff` |
| `--gk-radius` | `radius` | dimension | Corner radius of notifications, dialogs, and sheets. | `20px` | `20px` |
| `--gk-blur` | `blur` | filter | Backdrop blur strength for glass surfaces. | `22px` | `22px` |
| `--gk-saturate` | `saturate` | filter | Backdrop color saturation multiplier for vibrant glass aesthetics. | `180%` | `180%` |
| `--gk-border-w` | `borderWidth` | dimension | Surface border stroke width. | `1px` | `1px` |
| `--gk-font` | `font` | typography | Font family stack for typography. | `-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Segoe UI", Roboto, system-ui, sans-serif` | `-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Segoe UI", Roboto, system-ui, sans-serif` |
| `--gk-ease` | `ease` | animation | Timing function for spring and entrance transitions. | `cubic-bezier(0.16, 1, 0.3, 1)` | `cubic-bezier(0.16, 1, 0.3, 1)` |
| `--gk-duration` | `duration` | animation | Default entrance and exit animation duration. | `340ms` | `340ms` |
| `--gk-z` | `zIndex` | dimension | Base z-index for toast containers (default: 99999). | `99999` | `99999` |
| `--gk-gap` | `gap` | dimension | Spacing between stacked toasts (default: 14px). | `14px` | `14px` |
| `--gk-width` | `width` | dimension | Max width of notification card (default: 380px). | `380px` | `380px` |

---

## Bundled Themes (21 Total)

glazekit ships with 21 themes covering glass, modern minimalist, editorial, and retro designs:

- **`essentials`**: 14px radius, 0px blur
- **`showcase`**: 16px radius, 18px blur
- **`ios-glass`**: 20px radius, 22px blur
- **`liquid-glass`**: 28px radius, 32px blur
- **`dialogs`**: 20px radius, 0px blur
- **`aurora`**: 20px radius, 28px blur
- **`classic-stack`**: 8px radius, 0px blur
- **`classic-bar`**: 4px radius, 0px blur
- **`pill`**: 999px radius, 0px blur
- **`ripple`**: 16px radius, 0px blur
- **`gradient-strip`**: 12px radius, 0px blur
- **`sweet`**: 14px radius, 0px blur
- **`material`**: 4px radius, 0px blur
- **`basic`**: 6px radius, 0px blur
- **`minimal`**: 8px radius, 0px blur
- **`flat`**: 6px radius, 0px blur
- **`outline`**: 10px radius, 0px blur
- **`neon`**: 10px radius, 0px blur
- **`gradient`**: 14px radius, 0px blur
- **`brutal`**: 0px radius, 0px blur
- **`pastel`**: 16px radius, 0px blur

### Signature Glass Themes

1. **`ios-glass`**: Authentic Apple system notification look with high-translucency glass (`rgba(255, 255, 255, 0.72)` light / `rgba(28, 28, 32, 0.74)` dark), 22px backdrop blur, 180% saturation, specular inner edge borders, multi-layer elevation shadows, and Apple spring physics (`cubic-bezier(0.16, 1, 0.3, 1)`).
2. **`liquid-glass`**: Next-generation fluid glass aesthetic featuring 32px Gaussian blur, 200% saturation, dual radial specular highlights, 28px continuous curvature radius, and optional floating pill styling (`.gk-toast--pill`).
3. **`aurora`**: Translucent glass card augmented by a subtle animated aurora glow gradient (`@keyframes gk-aurora-glow`) that gently shifts behind the card. Automatically paused when `prefers-reduced-motion: reduce` is enabled.

---

## Dark Mode System

`glazekit` supports dark mode through three complementary mechanisms:

1. **Automatic system detection**: Responds to `@media (prefers-color-scheme: dark)` when configured with `mode: 'auto'`.
2. **Framework / Tailwind class integration**: Automatically detects `.dark` or `[data-theme="dark"]` on the `<html>` or `<body>` elements.
3. **Explicit container/call attribute**: Applied via `[data-gk-mode="dark"]` or `ui.configure({ mode: 'dark' })`.

---

## Accessibility & Fallback Guarantees

All glazekit themes comply with strict **WCAG 2.2 Level AA** contrast standards:
- **Normal text contrast**: $\ge 4.5:1$ against the composite glass surface across both white (`#ffffff`) and pitch black (`#000000`) app backgrounds.
- **UI icons and accents**: $\ge 3.0:1$ minimum contrast ratio.
- **No-backdrop fallback**: When `backdrop-filter` is not supported, components gracefully fall back to opaque `--gk-bg-solid`.
- **Forced colors & High Contrast**: In Windows High Contrast mode (`forced-colors: active`), background translucency is deactivated to maximize text legibility.
- **Reduced transparency**: Respects `@media (prefers-reduced-transparency: reduce)` by substituting transparent glass with solid colors and zero blur.
- **Mobile performance**: On mobile screens ($\le 600\text{px}$), blur radius is automatically capped to 12px (`--gk-blur: min(var(--gk-blur), 12px)`) to protect battery life and frame rates.

---

## Custom Themes API

Define custom themes via the TypeScript API:

```typescript
import { ui } from 'glazekit';

ui.defineTheme('cyberpunk', {
  radius: '4px',
  blur: '10px',
  saturate: '220%',
  light: {
    bg: 'rgba(255, 255, 255, 0.85)',
    solid: '#ffffff',
    fg: '#050505',
    muted: '#4a4a4a',
    border: '#00ffee',
    shadow: '0 0 20px rgba(0, 255, 238, 0.3)',
    accent: '#ff0055',
    accentFg: '#ffffff',
    danger: '#ff0033',
    dangerFg: '#ffffff',
    success: '#00ff88',
    error: '#ff0055',
    warning: '#ffaa00',
    info: '#00ccff',
  },
  dark: {
    bg: 'rgba(10, 10, 18, 0.85)',
    solid: '#0a0a12',
    fg: '#f0f0ff',
    muted: '#a0a0b8',
    border: '#00ffee',
    shadow: '0 0 25px rgba(0, 255, 238, 0.4)',
    accent: '#00ffee',
    accentFg: '#001a1a',
    danger: '#ff3366',
    dangerFg: '#ffffff',
    success: '#00ff99',
    error: '#ff3366',
    warning: '#ffbb00',
    info: '#00e5ff',
  },
  css: `
    .gk-toast& {
      box-shadow: 0 0 15px rgba(0, 255, 238, 0.35);
      border-left: 3px solid var(--gk-accent);
    }
  `,
});

// Use anywhere
ui.toast('Cyberpunk system active', { theme: 'cyberpunk' });
```
