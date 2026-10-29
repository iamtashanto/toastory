export interface DocSection {
  title: string;
  items: { slug: string; title: string; summary: string }[];
}

export interface DocArticle {
  slug: string;
  title: string;
  description: string;
  category: string;
  lastUpdated: string;
  content: string;
  optionsTable?: { name: string; type: string; defaultVal: string; description: string }[];
  frameworkTabs?: { name: string; code: string }[];
  playgroundLink?: string;
  headings?: { id: string; title: string }[];
}

export const DOC_NAVIGATION: DocSection[] = [
  {
    title: 'Getting Started',
    items: [
      { slug: 'getting-started/introduction', title: 'Introduction', summary: 'Overview, philosophy, zero dependencies, Apple glass' },
      { slug: 'getting-started/installation', title: 'Installation', summary: 'Package managers, CDN, and optional peer dependencies' },
      { slug: 'getting-started/quickstart', title: 'Quickstart', summary: '8-line setup across all 9 frameworks' },
      { slug: 'getting-started/setup-checklist', title: 'Setup Checklist', summary: 'Production readiness, CSP headers, SSR hydration' },
    ],
  },
  {
    title: 'Guides',
    items: [
      { slug: 'guides/toasts', title: 'Toasts Overview', summary: 'Types, titles, descriptions, icons, avatars, and timing' },
      { slug: 'guides/promise-toasts', title: 'Promise Toasts', summary: 'ui.toast.promise() with async states and unwrap()' },
      { slug: 'guides/updating-dismissing', title: 'Updating & Dismissal', summary: 'Dynamic mutations, programmatic close, and history' },
      { slug: 'guides/custom-content', title: 'Custom Content', summary: 'Custom JSX renderers, HTML sanitization, and badges' },
      { slug: 'guides/stacking-positioning', title: 'Stacking & Positioning', summary: '6 screen placements, 3D deck stacking, and hover expand' },
      { slug: 'guides/swipe-gestures', title: 'Swipe & Gestures', summary: '4-direction velocity snap, drag thresholds, touch actions' },
      { slug: 'guides/progress-timers', title: 'Progress & Timers', summary: 'Determinate tracks, circular rings, pausable timers' },
      { slug: 'guides/dialogs', title: 'Dialogs & Modals', summary: 'ui.confirm(), ui.alert(), tones, and focus trapping' },
      { slug: 'guides/prompts-inputs', title: 'Prompts & 16 Inputs', summary: 'Inputs: text, email, range, select, date, file, and OTP' },
      { slug: 'guides/validation-async', title: 'Validation & Locks', summary: 'Sync/async validation, live error messages, preConfirm' },
      { slug: 'guides/steps', title: 'Multi-Step Wizards', summary: 'ui.steps() for guided step-by-step onboarding flows' },
      { slug: 'guides/sheets-overlays', title: 'Sheets & Overlays', summary: 'Draggable bottom sheets, action sheets, loading overlays' },
      { slug: 'guides/island-hud', title: 'Island & HUD', summary: 'Floating compact island capsules for silent HUD notifications' },
      { slug: 'guides/ssr-server-actions', title: 'SSR & Server Actions', summary: 'Next.js App Router Server Actions toast feedback pattern' },
    ],
  },
  {
    title: 'Theming & Design System',
    items: [
      { slug: 'theming/overview', title: 'Theming Overview', summary: 'Apple glass aesthetic, 21 presets, solid fallbacks' },
      { slug: 'theming/tokens', title: 'Design Token Reference', summary: 'Complete CSS variables reference table' },
      { slug: 'theming/define-theme', title: 'Creating Custom Themes', summary: 'Programmatic defineTheme() authoring with contrast checks' },
      { slug: 'theming/dark-mode', title: 'Dark Mode Integration', summary: 'Auto detection, class overrides, and data attributes' },
      { slug: 'theming/customization', title: 'CSS Overrides & Headless', summary: 'Tailwind styling, custom classNames, unstyled headless' },
    ],
  },
  {
    title: 'Accessibility (A11y)',
    items: [
      { slug: 'accessibility/principles', title: 'WCAG 2.2 AA Principles', summary: 'Live regions, keyboard hotkey (Alt+T), focus traps' },
    ],
  },
  {
    title: 'Recipes',
    items: [
      { slug: 'recipes/form-submission', title: 'Form Submit Feedback', summary: 'Handle async submit with validation and promise feedback' },
      { slug: 'recipes/optimistic-undo', title: 'Optimistic UI with Undo', summary: 'Mutate immediately with a 5-second undo grace period' },
      { slug: 'recipes/file-upload', title: 'File Upload Progress', summary: 'Byte counters, percent badges, and upload tracks' },
      { slug: 'recipes/delete-type-to-confirm', title: 'Destructive Delete Guard', summary: 'Type-to-confirm modal preventing accidental deletions' },
      { slug: 'recipes/session-timeout', title: 'Session Inactivity Timeout', summary: '30-second live ticking countdown with extend handle' },
      { slug: 'recipes/otp-verification', title: '6-Box Discrete OTP Code', summary: 'Discrete cells, clipboard paste, and resend cooldown' },
    ],
  },
  {
    title: 'Migration',
    items: [
      { slug: 'migration/sonner', title: 'Migrating from Sonner', summary: 'Side-by-side code comparison and option mapping' },
      { slug: 'migration/sweetalert2', title: 'Migrating from SweetAlert2', summary: 'Upgrade Swal.fire to modern glass dialogs and bottom sheets' },
      { slug: 'migration/react-toastify', title: 'Migrating from React-Toastify', summary: 'Transition from React-Toastify to zero dependencies' },
      { slug: 'migration/react-hot-toast', title: 'Migrating from react-hot-toast', summary: 'Full dialog and gesture upgrade from react-hot-toast' },
    ],
  },
  {
    title: 'API Reference',
    items: [
      { slug: 'api/core', title: 'glazekit/core', summary: 'Core store, managers, timers, clock, accessibility rules' },
      { slug: 'api/web', title: 'glazekit (Web)', summary: 'Default web export: ui helper, toast API, DOM toaster' },
      { slug: 'api/react', title: 'glazekit/react', summary: 'React Toaster component, useToast() hook, SSR safety' },
      { slug: 'api/frameworks', title: 'Framework Adapters', summary: 'Vue, Angular, Svelte, and React Native subpaths' },
    ],
  },
  {
    title: 'Meta & Reference',
    items: [
      { slug: 'meta/faq', title: 'Frequently Asked Questions', summary: 'Answers to common architecture and usage questions' },
      { slug: 'meta/troubleshooting', title: 'Troubleshooting & Solutions', summary: 'Hydration errors, z-index stacking, CSP rules' },
      { slug: 'meta/benchmarks', title: 'Verifiable Benchmarks', summary: 'Size measurements, render latency, memory profiling' },
    ],
  },
];

