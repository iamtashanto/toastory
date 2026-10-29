import type { DocArticle } from './docs-data';

export const GUIDES_ARTICLES: Record<string, DocArticle> = {
  // 1. TOASTS OVERVIEW
  'guides/toasts': {
    slug: 'guides/toasts',
    title: 'Toasts Overview & Configuration',
    description: 'Learn how to trigger, configure, and customize non-intrusive toast notifications with Apple-style frosted glass aesthetics.',
    category: 'Guides',
    lastUpdated: 'October 2026',
    headings: [
      { id: 'anatomy', title: 'Anatomy of a Toast' },
      { id: 'semantic-types', title: 'Semantic Types' },
      { id: 'rich-colors', title: 'Rich Colors & Inversion' },
      { id: 'interactive-actions', title: 'Interactive Actions & Buttons' },
      { id: 'duration-persistence', title: 'Duration & Persistence' },
    ],
    content: `
# Toasts Overview & Configuration

toastory toasts deliver non-intrusive feedback designed with Apple-style frosted glass aesthetics and polite live regions.

### Semantic Types

toastory provides five standard semantic helper functions on the \`toast\` object:

\`\`\`typescript
import { toast } from 'toastory';

// 1. Neutral Message
toast('Changes auto-saved');

// 2. Success
toast.success('Project deployed', { description: 'Live on edge in 340ms' });

// 3. Error
toast.error('Network timeout', { description: 'Failed to reach cluster node' });

// 4. Warning
toast.warning('Storage limit near', { description: '92% of quota consumed' });

// 5. Info
toast.info('New version available', { description: 'Update to v0.1.1' });

// 6. Loading Spinner
const id = toast.loading('Exporting analytics archive...');
\`\`\`

---

### Interactive Actions & Buttons

Every toast supports primary actions and secondary cancel callbacks with accessible keyboard navigation:

\`\`\`typescript
toast.error('Failed to sync changes', {
  description: 'Conflict detected on branch main.',
  action: {
    label: 'Resolve Conflict',
    onClick: () => router.push('/conflicts'),
  },
  cancel: {
    label: 'Discard',
    onClick: () => revertLocalChanges(),
  },
  closeButton: true,
});
\`\`\`
`,
  },

  // 2. PROMISE TOASTS
  'guides/promise-toasts': {
    slug: 'guides/promise-toasts',
    title: 'Promise Toasts',
    description: 'Handle async operations with auto-transitioning loading, success, and error states, plus promise unwrapping.',
    category: 'Guides',
    lastUpdated: 'October 2026',
    headings: [
      { id: 'overview', title: 'Async Promise Lifecycle' },
      { id: 'dynamic-messages', title: 'Dynamic Return Values' },
      { id: 'unwrap-result', title: 'Unwrapping Results with unwrap()' },
      { id: 'finally-callback', title: 'Finally Cleanup Callback' },
    ],
    content: `
# Promise Toasts

When performing network requests, file uploads, or database mutations, \`ui.toast.promise()\` provides seamless status indicators that automatically transition based on the resolution or rejection of a JavaScript Promise.

\`\`\`typescript
import { toast } from 'toastory';

const handle = toast.promise(
  api.deployCluster({ region: 'us-east' }),
  {
    loading: 'Deploying edge cluster pods...',
    success: (data) => \`Cluster \${data.clusterId} is live!\`,
    error: (err) => \`Deployment failed: \${(err as Error).message}\`,
    description: 'Syncing worker configurations across 12 zones.',
    finally: () => refreshDashboard(),
  }
);

// Access the underlying return value directly:
const cluster = await handle.unwrap();
console.log('Deployed cluster IP:', cluster.ip);
\`\`\`
`,
  },

  // 3. UPDATING & DISMISSING
  'guides/updating-dismissing': {
    slug: 'guides/updating-dismissing',
    title: 'Updating & Programmatic Dismissal',
    description: 'Dynamically patch active toasts in place, close them programmatically, or inspect active history.',
    category: 'Guides',
    lastUpdated: 'October 2026',
    headings: [
      { id: 'updating-in-place', title: 'Updating Toasts In Place' },
      { id: 'dismissing', title: 'Dismissing Specific or All Toasts' },
      { id: 'history-inspection', title: 'Inspecting Active State & History' },
    ],
    content: `
# Updating & Programmatic Dismissal

toastory allows mutating any active toast by its unique string or numeric ID without causing DOM unmounts or jittery reflows.

### Updating Toasts In Place

\`\`\`typescript
import { toast } from 'toastory';

// 1. Launch a persistent loading toast
const toastId = toast.loading('Uploading assets...', { duration: 0 });

// 2. Later, patch it with new progress and text
toast.update(toastId, {
  title: 'Optimizing media...',
  description: 'Processed 8 of 10 files.',
});

// 3. Complete the toast as a success notification
toast.update(toastId, {
  type: 'success',
  title: 'Upload complete!',
  description: '10 files synced to S3.',
  duration: 4000,
});
\`\`\`

### Dismissal & History

\`\`\`typescript
// Dismiss specific toast by ID:
toast.dismiss(toastId);

// Dismiss all currently visible toasts at once:
toast.dismissAll();

// Retrieve all active toasts:
const active = toast.getToasts();

// Retrieve last 100 dismissed items:
const history = toast.getHistory();
\`\`\`
`,
  },

  // 4. CUSTOM CONTENT & RENDERERS
  'guides/custom-content': {
    slug: 'guides/custom-content',
    title: 'Custom Content & HTML Sanitization',
    description: 'Render bespoke JSX components, sanitized rich HTML, user avatars, and custom badge icons.',
    category: 'Guides',
    lastUpdated: 'October 2026',
    headings: [
      { id: 'custom-jsx', title: 'Custom JSX Renderers' },
      { id: 'html-sanitization', title: 'Sanitized HTML Support' },
      { id: 'avatars-badges', title: 'Avatars & Badges' },
    ],
    content: `
# Custom Content & HTML Sanitization

When standard title and description cards do not fit your product design, toastory provides custom component renderers and safe HTML injection.

### Custom JSX Component

\`\`\`tsx
import { toast } from 'toastory';

toast.custom((id) => (
  <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 text-white shadow-2xl">
    <img src="/avatar-dev.png" className="w-10 h-10 rounded-full" alt="Developer" />
    <div>
      <h4 className="font-semibold text-sm">Deployment Ready</h4>
      <p className="text-xs text-white/70">PR #48 passed all 12 checks.</p>
    </div>
    <button
      onClick={() => toast.dismiss(id)}
      className="ml-auto px-2.5 py-1 text-xs bg-blue-500 rounded-lg font-medium"
    >
      Merge
    </button>
  </div>
));
\`\`\`

### Safe HTML Rendering

HTML strings passed via the \`html\` option are automatically sanitized with DOMPurify when available, eliminating XSS vulnerabilities:

\`\`\`typescript
toast.info('Invoice generated', {
  html: '<strong>Invoice #1042</strong> has been generated for <em>$240.00 USD</em>.',
});
\`\`\`
`,
  },

  // 5. STACKING & POSITIONING
  'guides/stacking-positioning': {
    slug: 'guides/stacking-positioning',
    title: 'Stacking & Screen Positioning',
    description: 'Configure 6 screen anchor points, 3D stacked decks, expanded list mode, and mobile responsive adaptation.',
    category: 'Guides',
    lastUpdated: 'October 2026',
    headings: [
      { id: 'positions', title: 'Screen Placements' },
      { id: 'stacking-modes', title: 'Deck Stacking vs Expanded List' },
      { id: 'mobile-behavior', title: 'Automatic Mobile Adaptation' },
    ],
    content: `
# Stacking & Screen Positioning

toastory features an Apple-inspired 3D card deck stack that gracefully expands when the user hovers or focuses into notifications.

### Screen Placements

Configure the default container position via \`ui.configure()\` or override on individual calls:

- \`top-right\` (Default on desktop)
- \`top-center\`
- \`top-left\`
- \`bottom-right\`
- \`bottom-center\`
- \`bottom-left\`

\`\`\`typescript
import { ui } from 'toastory';

ui.configure({
  position: 'top-center',
  stack: true, // 3D card deck stacking
  maxVisible: 5,
  gap: 12,
});
\`\`\`
`,
  },

  // 6. SWIPE GESTURES
  'guides/swipe-gestures': {
    slug: 'guides/swipe-gestures',
    title: 'Swipe & Touch Gestures',
    description: 'Physics-based touch and mouse drag gestures with velocity-driven dismissal and directional snap.',
    category: 'Guides',
    lastUpdated: 'October 2026',
    headings: [
      { id: 'gesture-physics', title: 'Physics & Velocity Thresholds' },
      { id: 'directions', title: 'Allowed Swipe Directions' },
      { id: 'touch-actions', title: 'Pointer Event Handling' },
    ],
    content: `
# Swipe & Touch Gestures

Every toast is touch-interactive by default. Users can flick notifications horizontally or vertically on mobile screens or with a mouse on desktop.

\`\`\`typescript
import { toast } from 'toastory';

toast('Swipe me away!', {
  swipe: true,
  swipeDirections: ['right', 'up'],
  dragThreshold: 45, // drag distance in px required to trigger dismissal
});
\`\`\`
`,
  },

  // 7. PROGRESS TIMERS
  'guides/progress-timers': {
    slug: 'guides/progress-timers',
    title: 'Progress & Timers',
    description: 'Visual progress tracks, countdown bars, circular SVG rings, and pausable timer controls.',
    category: 'Guides',
    lastUpdated: 'October 2026',
    headings: [
      { id: 'progress-modes', title: 'Linear Progress Bars & Circular Rings' },
      { id: 'pausing-rules', title: 'Pause on Hover, Focus, or Tab Hidden' },
      { id: 'timer-handles', title: 'Programmatic Timer Controls' },
    ],
    content: `
# Progress & Timers

Display remaining duration visually with linear progress bars or circular indicator rings.

\`\`\`typescript
import { toast } from 'toastory';

toast.info('Session expiring soon', {
  duration: 6000,
  progress: true, // renders an animated countdown line at the bottom
  pauseOn: ['hover', 'focus', 'hidden'],
});
\`\`\`
`,
  },

  // 8. DIALOGS & MODALS
  'guides/dialogs': {
    slug: 'guides/dialogs',
    title: 'Dialogs & Modals Overview',
    description: 'Accessible modal dialogs with focus trapping, tone badges, button styling, and Escape key dismissal.',
    category: 'Guides',
    lastUpdated: 'October 2026',
    headings: [
      { id: 'confirm-alert', title: 'ui.confirm() & ui.alert()' },
      { id: 'tones', title: 'Semantic Tones (Danger, Warning, Info)' },
      { id: 'focus-trapping', title: 'Accessible Focus Trap & Return' },
    ],
    content: `
# Dialogs & Modals Overview

toastory includes a comprehensive modal dialog toolkit designed to replace legacy libraries like SweetAlert2 with modern Apple frosted glass aesthetics and full WCAG 2.2 AA accessibility.

### Confirmation Dialog

\`\`\`typescript
import { ui, toast } from 'toastory';

const res = await ui.confirm({
  title: 'Delete Production Database?',
  text: 'All cluster backups and records will be immediately erased.',
  tone: 'danger',
  confirmButton: { label: 'Destroy Database', color: '#dc2626' },
  cancelButton: { label: 'Keep Safe' },
  allowOutsideClick: false,
});

if (res.isConfirmed) {
  toast.error('Database destroyed');
}
\`\`\`
`,
  },

  // 9. PROMPTS & 16 INPUT TYPES
  'guides/prompts-inputs': {
    slug: 'guides/prompts-inputs',
    title: 'Prompts & 16 Input Types',
    description: 'Collect user data with 16 native input types, including text, passwords, ranges, file uploads, and 6-box discrete OTP.',
    category: 'Guides',
    lastUpdated: 'October 2026',
    headings: [
      { id: 'input-types', title: 'Supported Input Types' },
      { id: 'otp-box', title: '6-Box Discrete OTP Verification' },
      { id: 'select-radios', title: 'Dropdown Select & Radio Options' },
    ],
    content: `
# Prompts & 16 Input Types

\`ui.prompt()\` enables capturing typed user input in a modal glass container with zero extra form libraries.

### Supported Input Types
- \`text\`, \`password\`, \`email\`, \`number\`, \`tel\`, \`url\`, \`search\`
- \`textarea\`, \`select\`, \`radio\`, \`checkbox\`, \`range\`
- \`date\`, \`time\`, \`datetime-local\`, \`file\`

\`\`\`typescript
import { ui, toast } from 'toastory';

const res = await ui.prompt({
  title: 'Invite Teammate',
  text: 'Enter work email address:',
  input: 'email',
  placeholder: 'colleague@company.com',
  validate: (val) => (!val ? 'Email cannot be blank' : undefined),
});

if (res.isConfirmed) {
  toast.success(\`Invitation sent to \${res.value}\`);
}
\`\`\`
`,
  },

  // 10. VALIDATION & LOCKS
  'guides/validation-async': {
    slug: 'guides/validation-async',
    title: 'Validation & Async Locks',
    description: 'Synchronous and asynchronous input validation, live error messages, and preConfirm submission locks.',
    category: 'Guides',
    lastUpdated: 'October 2026',
    headings: [
      { id: 'sync-validation', title: 'Synchronous Validation' },
      { id: 'async-validation', title: 'Asynchronous Validation & API Checks' },
      { id: 'pre-confirm-locks', title: 'preConfirm Async Submission Locks' },
    ],
    content: `
# Validation & Async Locks

Prevent invalid submissions and display live inline error messages without closing the dialog.

\`\`\`typescript
import { ui } from 'toastory';

const res = await ui.prompt({
  title: 'Choose Organization Handle',
  input: 'text',
  placeholder: 'acme-inc',
  validate: async (val) => {
    if (!val || typeof val !== 'string' || val.length < 3) {
      return 'Handle must be at least 3 characters.';
    }
    const isTaken = await checkHandleAvailability(val);
    if (isTaken) {
      return 'This handle is already registered by another organization.';
    }
    return undefined; // valid
  },
  preConfirm: async (val) => {
    // Buttons enter loading spinner state while this promise runs
    return await api.createOrg(val as string);
  },
});
\`\`\`
`,
  },

  // 11. MULTI-STEP WIZARDS
  'guides/steps': {
    slug: 'guides/steps',
    title: 'Multi-Step Wizards (ui.steps)',
    description: 'Guide users through multi-stage setup flows with back navigation, state preservation, and final value collation.',
    category: 'Guides',
    lastUpdated: 'October 2026',
    headings: [
      { id: 'wizard-flow', title: 'Defining Step Arrays' },
      { id: 'back-navigation', title: 'Back Navigation & Value Preservation' },
      { id: 'collated-results', title: 'Accessing Collated Results' },
    ],
    content: `
# Multi-Step Wizards (ui.steps)

\`ui.steps()\` orchestrates sequential dialog prompts, maintaining progress dots, previous/next navigation buttons, and returning an aggregated array of answers.

\`\`\`typescript
import { ui, toast } from 'toastory';

const wizard = await ui.steps([
  {
    title: 'Step 1 of 3: Workspace',
    text: 'What should we call your team workspace?',
    input: 'text',
    placeholder: 'Acme Design',
  },
  {
    title: 'Step 2 of 3: Plan',
    text: 'Select your team billing tier:',
    input: 'select',
    options: { starter: 'Starter (Free)', pro: 'Pro ($20/mo)', enterprise: 'Enterprise' },
  },
  {
    title: 'Step 3 of 3: Region',
    text: 'Primary database deployment zone:',
    input: 'select',
    options: { 'us-east': 'US East (N. Virginia)', 'eu-west': 'EU West (Frankfurt)' },
  },
]);

if (wizard.isConfirmed) {
  const [workspaceName, planTier, region] = wizard.value as string[];
  toast.success(\`Workspace "\${workspaceName}" ready on \${region}!\`);
}
\`\`\`
`,
  },

  // 12. SHEETS & OVERLAYS
  'guides/sheets-overlays': {
    slug: 'guides/sheets-overlays',
    title: 'Sheets & Overlays',
    description: 'Draggable iOS-style bottom sheets, action sheets with destructive items, and blocking loading overlays.',
    category: 'Guides',
    lastUpdated: 'October 2026',
    headings: [
      { id: 'action-sheets', title: 'Action Sheets (ui.sheet)' },
      { id: 'bottom-sheets', title: 'Draggable Bottom Sheets (ui.bottomSheet)' },
      { id: 'loading-overlays', title: 'Loading Overlays (ui.loading)' },
    ],
    content: `
# Sheets & Overlays

### Action Sheet

\`\`\`typescript
import { ui } from 'toastory';

const sheet = await ui.sheet({
  title: 'Account Options',
  message: 'Select action for user @tashanto',
  actions: [
    { label: 'View Profile', value: 'profile' },
    { label: 'Export Activity Log', value: 'export' },
    { label: 'Revoke API Tokens', value: 'revoke', style: 'destructive' },
  ],
  cancelLabel: 'Cancel',
});
\`\`\`

### Draggable Bottom Sheet

\`\`\`typescript
await ui.bottomSheet({
  title: 'Edit Workspace Permissions',
  text: 'Drag down or click outside to dismiss this drawer.',
  confirmButton: { label: 'Save Changes' },
});
\`\`\`
`,
  },

  // 13. ISLAND & HUD
  'guides/island-hud': {
    slug: 'guides/island-hud',
    title: 'Dynamic Island & HUD Notifications',
    description: 'Compact capsule notifications designed for minimalist HUD status indicators and silent feedback.',
    category: 'Guides',
    lastUpdated: 'October 2026',
    headings: [
      { id: 'capsule-mode', title: 'Compact Pill / Island Geometry' },
      { id: 'hud-feedback', title: 'HUD Feedback Patterns' },
    ],
    content: `
# Dynamic Island & HUD Notifications

Using the \`pill\` theme preset, toastory transforms into an Apple Dynamic Island capsule that floats seamlessly at the top of the viewport.

\`\`\`typescript
import { toast } from 'toastory';

toast('Silent Mode: On', {
  theme: 'pill',
  position: 'top-center',
  duration: 2000,
});
\`\`\`
`,
  },

  // 14. SSR & SERVER ACTIONS
  'guides/ssr-server-actions': {
    slug: 'guides/ssr-server-actions',
    title: 'SSR & Server Actions Integration',
    description: 'Patterns for pairing Next.js App Router Server Actions with toastory client feedback.',
    category: 'Guides',
    lastUpdated: 'October 2026',
    headings: [
      { id: 'hydration-safety', title: 'SSR & Hydration Safety' },
      { id: 'server-actions', title: 'Handling Server Action Responses' },
    ],
    content: `
# SSR & Server Actions Integration

toastory is built from the ground up to be 100% SSR-safe. Core state stores and logic run in pure Node without accessing \`window\` or \`document\` at import time.

### Calling Toast from Server Action Transition

\`\`\`tsx
'use client';

import { useTransition } from 'react';
import { toast } from 'toastory';
import { updateAccountAction } from './actions';

export function ProfileForm() {
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      const res = await updateAccountAction(formData);
      if (res.success) {
        toast.success('Profile updated successfully!');
      } else {
        toast.error('Update failed', { description: res.error });
      }
    });
  };

  return (
    <form action={handleSubmit}>
      <button disabled={isPending}>{isPending ? 'Saving...' : 'Save'}</button>
    </form>
  );
}
\`\`\`
`,
  },
};
