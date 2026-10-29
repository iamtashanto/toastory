import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { iosGlassTheme } from '../src/themes/ios-glass/tokens.ts';
import { liquidGlassTheme } from '../src/themes/liquid-glass/tokens.ts';
import { THEMES } from '../src/themes/themes.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DOCS_DIR = path.resolve(__dirname, '../docs');
const OUTPUT_FILE = path.join(DOCS_DIR, 'tokens.md');

interface TokenMeta {
  cssVar: string;
  prop: string;
  type: 'color' | 'dimension' | 'filter' | 'typography' | 'animation' | 'shadow';
  description: string;
  iosGlassLight: string;
  iosGlassDark: string;
}

const TOKEN_DEFINITIONS: TokenMeta[] = [
  {
    cssVar: '--gk-bg',
    prop: 'bg',
    type: 'color',
    description: 'Surface background color. Translucent in glass themes for backdrop blur.',
    iosGlassLight: iosGlassTheme.light.bg,
    iosGlassDark: iosGlassTheme.dark.bg,
  },
  {
    cssVar: '--gk-bg-solid',
    prop: 'solid',
    type: 'color',
    description: 'Opaque fallback color used when backdrop-filter is unsupported or in forced-colors/reduced-transparency modes.',
    iosGlassLight: iosGlassTheme.light.solid,
    iosGlassDark: iosGlassTheme.dark.solid,
  },
  {
    cssVar: '--gk-fg',
    prop: 'fg',
    type: 'color',
    description: 'Primary text and foreground color.',
    iosGlassLight: iosGlassTheme.light.fg,
    iosGlassDark: iosGlassTheme.dark.fg,
  },
  {
    cssVar: '--gk-muted',
    prop: 'muted',
    type: 'color',
    description: 'Secondary muted text, timestamps, and subtle hints.',
    iosGlassLight: iosGlassTheme.light.muted,
    iosGlassDark: iosGlassTheme.dark.muted,
  },
  {
    cssVar: '--gk-border',
    prop: 'border',
    type: 'color',
    description: 'Border and separator color.',
    iosGlassLight: iosGlassTheme.light.border,
    iosGlassDark: iosGlassTheme.dark.border,
  },
  {
    cssVar: '--gk-shadow',
    prop: 'shadow',
    type: 'shadow',
    description: 'Box shadow layers providing depth and specular edge illumination.',
    iosGlassLight: iosGlassTheme.light.shadow,
    iosGlassDark: iosGlassTheme.dark.shadow,
  },
  {
    cssVar: '--gk-accent',
    prop: 'accent',
    type: 'color',
    description: 'Brand/accent color for primary action buttons, links, and focus rings.',
    iosGlassLight: iosGlassTheme.light.accent,
    iosGlassDark: iosGlassTheme.dark.accent,
  },
  {
    cssVar: '--gk-accent-fg',
    prop: 'accentFg',
    type: 'color',
    description: 'Text color on top of primary action/accent buttons.',
    iosGlassLight: iosGlassTheme.light.accentFg,
    iosGlassDark: iosGlassTheme.dark.accentFg,
  },
  {
    cssVar: '--gk-danger',
    prop: 'danger',
    type: 'color',
    description: 'Destructive action button background.',
    iosGlassLight: iosGlassTheme.light.danger,
    iosGlassDark: iosGlassTheme.dark.danger,
  },
  {
    cssVar: '--gk-danger-fg',
    prop: 'dangerFg',
    type: 'color',
    description: 'Text color on top of destructive action buttons.',
    iosGlassLight: iosGlassTheme.light.dangerFg,
    iosGlassDark: iosGlassTheme.dark.dangerFg,
  },
  {
    cssVar: '--gk-success',
    prop: 'success',
    type: 'color',
    description: 'Tone color for success toasts, badges, and status icons.',
    iosGlassLight: iosGlassTheme.light.success,
    iosGlassDark: iosGlassTheme.dark.success,
  },
  {
    cssVar: '--gk-error',
    prop: 'error',
    type: 'color',
    description: 'Tone color for error toasts, alerts, and destructive badges.',
    iosGlassLight: iosGlassTheme.light.error,
    iosGlassDark: iosGlassTheme.dark.error,
  },
  {
    cssVar: '--gk-warning',
    prop: 'warning',
    type: 'color',
    description: 'Tone color for warning toasts and advisory badges.',
    iosGlassLight: iosGlassTheme.light.warning,
    iosGlassDark: iosGlassTheme.dark.warning,
  },
  {
    cssVar: '--gk-info',
    prop: 'info',
    type: 'color',
    description: 'Tone color for informational toasts and badges.',
    iosGlassLight: iosGlassTheme.light.info,
    iosGlassDark: iosGlassTheme.dark.info,
  },
  {
    cssVar: '--gk-radius',
    prop: 'radius',
    type: 'dimension',
    description: 'Corner radius of notifications, dialogs, and sheets.',
    iosGlassLight: iosGlassTheme.radius,
    iosGlassDark: iosGlassTheme.radius,
  },
  {
    cssVar: '--gk-blur',
    prop: 'blur',
    type: 'filter',
    description: 'Backdrop blur strength for glass surfaces.',
    iosGlassLight: iosGlassTheme.blur,
    iosGlassDark: iosGlassTheme.blur,
  },
  {
    cssVar: '--gk-saturate',
    prop: 'saturate',
    type: 'filter',
    description: 'Backdrop color saturation multiplier for vibrant glass aesthetics.',
    iosGlassLight: iosGlassTheme.saturate,
    iosGlassDark: iosGlassTheme.saturate,
  },
  {
    cssVar: '--gk-border-w',
    prop: 'borderWidth',
    type: 'dimension',
    description: 'Surface border stroke width.',
    iosGlassLight: iosGlassTheme.borderWidth ?? '1px',
    iosGlassDark: iosGlassTheme.borderWidth ?? '1px',
  },
  {
    cssVar: '--gk-font',
    prop: 'font',
    type: 'typography',
    description: 'Font family stack for typography.',
    iosGlassLight: iosGlassTheme.font ?? 'system font',
    iosGlassDark: iosGlassTheme.font ?? 'system font',
  },
  {
    cssVar: '--gk-ease',
    prop: 'ease',
    type: 'animation',
    description: 'Timing function for spring and entrance transitions.',
    iosGlassLight: iosGlassTheme.ease ?? 'cubic-bezier(0.16, 1, 0.3, 1)',
    iosGlassDark: iosGlassTheme.ease ?? 'cubic-bezier(0.16, 1, 0.3, 1)',
  },
  {
    cssVar: '--gk-duration',
    prop: 'duration',
    type: 'animation',
    description: 'Default entrance and exit animation duration.',
    iosGlassLight: iosGlassTheme.duration ?? '320ms',
    iosGlassDark: iosGlassTheme.duration ?? '320ms',
  },
  {
    cssVar: '--gk-z',
    prop: 'zIndex',
    type: 'dimension',
    description: 'Base z-index for toast containers (default: 99999).',
    iosGlassLight: '99999',
    iosGlassDark: '99999',
  },
  {
    cssVar: '--gk-gap',
    prop: 'gap',
    type: 'dimension',
    description: 'Spacing between stacked toasts (default: 14px).',
    iosGlassLight: '14px',
    iosGlassDark: '14px',
  },
  {
    cssVar: '--gk-width',
    prop: 'width',
    type: 'dimension',
    description: 'Max width of notification card (default: 380px).',
    iosGlassLight: '380px',
    iosGlassDark: '380px',
  },
];

export function generateTokensMarkdown(): string {
  const tableRows = TOKEN_DEFINITIONS.map(
    (t) =>
      `| \`${t.cssVar}\` | \`${t.prop}\` | ${t.type} | ${t.description} | \`${t.iosGlassLight}\` | \`${t.iosGlassDark}\` |`,
  ).join('\n');

  const themeList = THEMES.map((t) => `- **\`${t.name}\`**: ${t.radius} radius, ${t.blur} blur`).join('\n');

  return `# glazekit Theme Tokens Specification

This document provides the formal design token reference for \`glazekit\`. All components (toasts, dialogs, action sheets, bottom sheets, and loading overlays) consume these CSS variables prefixed with \`--gk-\`.

Every theme sets these variables scoped to \`[data-gk-theme="<name>"]\` and responds automatically to user dark mode preferences or explicit application overrides.

---

## Token Reference Table

| CSS Variable | TypeScript Property | Category | Description | \`ios-glass\` (Light) | \`ios-glass\` (Dark) |
| :--- | :--- | :--- | :--- | :--- | :--- |
${tableRows}

---

## Bundled Themes (21 Total)

glazekit ships with 21 themes covering glass, modern minimalist, editorial, and retro designs:

${themeList}

### Signature Glass Themes

1. **\`ios-glass\`**: Authentic Apple system notification look with high-translucency glass (\`rgba(255, 255, 255, 0.72)\` light / \`rgba(28, 28, 32, 0.74)\` dark), 22px backdrop blur, 180% saturation, specular inner edge borders, multi-layer elevation shadows, and Apple spring physics (\`cubic-bezier(0.16, 1, 0.3, 1)\`).
2. **\`liquid-glass\`**: Next-generation fluid glass aesthetic featuring 32px Gaussian blur, 200% saturation, dual radial specular highlights, 28px continuous curvature radius, and optional floating pill styling (\`.gk-toast--pill\`).
3. **\`aurora\`**: Translucent glass card augmented by a subtle animated aurora glow gradient (\`@keyframes gk-aurora-glow\`) that gently shifts behind the card. Automatically paused when \`prefers-reduced-motion: reduce\` is enabled.

---

## Dark Mode System

\`glazekit\` supports dark mode through three complementary mechanisms:

1. **Automatic system detection**: Responds to \`@media (prefers-color-scheme: dark)\` when configured with \`mode: 'auto'\`.
2. **Framework / Tailwind class integration**: Automatically detects \`.dark\` or \`[data-theme="dark"]\` on the \`<html>\` or \`<body>\` elements.
3. **Explicit container/call attribute**: Applied via \`[data-gk-mode="dark"]\` or \`ui.configure({ mode: 'dark' })\`.

---

## Accessibility & Fallback Guarantees

All glazekit themes comply with strict **WCAG 2.2 Level AA** contrast standards:
- **Normal text contrast**: $\\ge 4.5:1$ against the composite glass surface across both white (\`#ffffff\`) and pitch black (\`#000000\`) app backgrounds.
- **UI icons and accents**: $\\ge 3.0:1$ minimum contrast ratio.
- **No-backdrop fallback**: When \`backdrop-filter\` is not supported, components gracefully fall back to opaque \`--gk-bg-solid\`.
- **Forced colors & High Contrast**: In Windows High Contrast mode (\`forced-colors: active\`), background translucency is deactivated to maximize text legibility.
- **Reduced transparency**: Respects \`@media (prefers-reduced-transparency: reduce)\` by substituting transparent glass with solid colors and zero blur.
- **Mobile performance**: On mobile screens ($\\le 600\\text{px}$), blur radius is automatically capped to 12px (\`--gk-blur: min(var(--gk-blur), 12px)\`) to protect battery life and frame rates.

---

## Custom Themes API

Define custom themes via the TypeScript API:

\`\`\`typescript
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
  css: \`
    .gk-toast& {
      box-shadow: 0 0 15px rgba(0, 255, 238, 0.35);
      border-left: 3px solid var(--gk-accent);
    }
  \`,
});

// Use anywhere
ui.toast('Cyberpunk system active', { theme: 'cyberpunk' });
\`\`\`
`;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const md = generateTokensMarkdown();
  if (!fs.existsSync(DOCS_DIR)) {
    fs.mkdirSync(DOCS_DIR, { recursive: true });
  }
  fs.writeFileSync(OUTPUT_FILE, md, 'utf-8');
  console.log(`✓ Generated ${OUTPUT_FILE} successfully (${md.length} bytes).`);
}
