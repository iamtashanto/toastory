import type { DocArticle } from './docs-data';

export const MIGRATION_ARTICLES: Record<string, DocArticle> = {
  // 1. MIGRATING FROM SONNER
  'migration/sonner': {
    slug: 'migration/sonner',
    title: 'Migrating from Sonner to toastory',
    description: 'Complete drop-in migration guide from Sonner to toastory with side-by-side API mappings, option comparisons, and extended feature guides.',
    category: 'Migration',
    lastUpdated: 'October 2026',
    headings: [
      { id: 'why-toastory', title: 'Why Migrate from Sonner?' },
      { id: 'quick-comparison', title: 'Quick API Comparison' },
      { id: 'option-mapping', title: 'Comprehensive Option Mapping Table' },
      { id: 'code-before-after', title: 'Side-by-Side Code Examples' },
      { id: 'advanced-patterns', title: 'Promises, Dismiss, and Custom Renderers' },
      { id: 'unlocking-dialogs', title: 'Unlocking Modal Dialogs, Prompts, and Bottom Sheets' },
      { id: 'framework-portability', title: 'Multi-Framework Portability' },
    ],
    content: `
# Migrating from Sonner to toastory

If you are currently using [Sonner](https://sonner.emilkowal.ski/), upgrading to **toastory** gives you full drop-in compatibility for all toast methods while adding a complete modal dialog toolkit, multi-step wizards, bottom sheets, and multi-framework support—all with zero runtime dependencies.

---

### Why Migrate from Sonner?

1. **Complete UI Feedback Toolkit**: Sonner only handles toasts. toastory handles toasts, confirmation modals (\`ui.confirm\`), prompt inputs (\`ui.prompt\`), alerts (\`ui.alert\`), multi-step wizards (\`ui.steps\`), bottom sheets (\`ui.bottomSheet\`), and loading overlays (\`ui.loading\`).
2. **Apple Frosted Glass System**: 21 handcrafted themes with specular highlight borders, deep physical blur, and automatic solid-color fallbacks for older devices.
3. **Multi-Framework Portability**: Sonner is React-only. toastory runs with the exact same API on React, Next.js, Vue, Nuxt, Angular, Svelte, Electron, and React Native.
4. **Zero Runtime Dependencies**: Strict zero third-party dependencies in the published bundle.

---

### Quick API Comparison

Both libraries share intuitive, chainable toast functions. You can replace your imports without changing your core application code:

\`\`\`typescript
// Before (Sonner)
import { toast, Toaster } from 'sonner';

toast.success('Event created', { description: 'Monday, 3:00 PM' });

// After (toastory)
import { toast, Toaster } from 'toastory/react';
import 'toastory/themes/ios-glass.css';

toast.success('Event created', { description: 'Monday, 3:00 PM' });
\`\`\`

---

### Comprehensive Option Mapping Table

Every Sonner option maps cleanly to toastory:

| Sonner Option | toastory Equivalent | Notes & Enhancements |
| :--- | :--- | :--- |
| \`toast(msg, opts)\` | \`toast(msg, opts)\` | Drop-in identical signature. |
| \`toast.success(msg, opts)\` | \`toast.success(msg, opts)\` | Displays green success badge with WCAG AA contrast. |
| \`toast.error(msg, opts)\` | \`toast.error(msg, opts)\` | Displays red error badge; announces assertively. |
| \`toast.info(msg, opts)\` | \`toast.info(msg, opts)\` | Displays neutral blue informational card. |
| \`toast.warning(msg, opts)\` | \`toast.warning(msg, opts)\` | Displays amber caution pill. |
| \`toast.loading(msg, opts)\` | \`toast.loading(msg, opts)\` | Displays animated glass spinner. |
| \`toast.promise(promise, msgs)\` | \`toast.promise(promise, msgs)\` | Identical syntax, plus returns \`.unwrap()\` to await the result. |
| \`toast.custom(fn, opts)\` | \`toast.custom(fn, opts)\` | Render any custom JSX / HTML. |
| \`toast.dismiss(id?)\` | \`toast.dismiss(id?)\` | Dismisses specific toast or all toasts if no ID passed. |
| \`description\` | \`description\` | Secondary subtitle text. |
| \`duration\` | \`duration\` | Auto-close timeout in ms (set to \`0\` for persistent). |
| \`action\` | \`action: { label, onClick }\` | Interactive action button. |
| \`cancel\` | \`cancel: { label, onClick }\` | Secondary cancel button. |
| \`closeButton\` | \`closeButton\` | Adds accessible close button with hover state. |
| \`richColors\` | \`richColors\` | Injects semantic background tint mixed with solid surface. |
| \`position\` | \`position\` | 6 screen placements (\`top-right\`, \`top-center\`, \`top-left\`, \`bottom-right\`, \`bottom-center\`, \`bottom-left\`). |
| \`expand\` | \`stack: 'expanded'\` | Expands notifications into a list instead of stacked deck. |
| \`theme="system"\` | \`mode: 'auto'\` | Supports \`'light'\`, \`'dark'\`, and \`'auto'\`. |

---

### Side-by-Side Code Examples

#### 1. Setup in Next.js App Router

\`\`\`tsx
// Before (Sonner: app/layout.tsx)
import { Toaster } from 'sonner';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Toaster position="top-right" richColors closeButton />
        {children}
      </body>
    </html>
  );
}
\`\`\`

\`\`\`tsx
// After (toastory: app/layout.tsx)
import { Toaster } from 'toastory/react';
import 'toastory/themes/ios-glass.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Toaster position="top-right" theme="ios-glass" mode="auto" richColors closeButton />
        {children}
      </body>
    </html>
  );
}
\`\`\`

---

#### 2. Async Action with Promise Feedback

\`\`\`typescript
// Before (Sonner)
toast.promise(saveUserData(data), {
  loading: 'Saving profile...',
  success: (res) => \`Saved profile for \${res.name}\`,
  error: 'Could not save profile.',
});

// After (toastory)
const handle = toast.promise(saveUserData(data), {
  loading: 'Saving profile...',
  success: (res) => \`Saved profile for \${res.name}\`,
  error: (err) => \`Failed: \${(err as Error).message}\`,
  description: 'Syncing encrypted attributes to edge nodes.',
});

// Optional: you can unwrap the original promise result
const result = await handle.unwrap();
\`\`\`

---

### Unlocking Modal Dialogs, Prompts, and Bottom Sheets

When migrating from Sonner, you no longer need separate modal libraries like SweetAlert2 or headless dialog primitives. toastory provides built-in dialog controllers with keyboard focus trapping, accessible live regions, and escape handling:

\`\`\`typescript
import { ui } from 'toastory';

// Confirmation Modal
const confirmRes = await ui.confirm({
  title: 'Delete Repository?',
  text: 'This will permanently destroy all issues and commits.',
  tone: 'danger',
  confirmButton: { label: 'Yes, Delete' },
});
if (confirmRes.isConfirmed) {
  toast.success('Repository deleted');
}

// User Input Prompt
const promptRes = await ui.prompt({
  title: 'Workspace Name',
  placeholder: 'e.g. acme-corp',
  validate: (val) => (!val ? 'Name is required' : undefined),
});
if (promptRes.isConfirmed) {
  toast.info(\`Workspace \${promptRes.value} created\`);
}
\`\`\`
`,
  },

  // 2. MIGRATING FROM SWEETALERT2
  'migration/sweetalert2': {
    slug: 'migration/sweetalert2',
    title: 'Migrating from SweetAlert2 to toastory',
    description: 'Modernize legacy SweetAlert2 alerts, prompts, and modal dialogs with Apple-style frosted glass, zero runtime dependencies, and strict TypeScript safety.',
    category: 'Migration',
    lastUpdated: 'October 2026',
    headings: [
      { id: 'why-modernize', title: 'Why Modernize SweetAlert2?' },
      { id: 'dialog-mapping', title: 'Swal.fire vs ui.confirm / ui.alert / ui.prompt' },
      { id: 'option-mapping', title: 'Option & Result Mapping Table' },
      { id: 'validation-locks', title: 'Input Validation and Async Locks' },
      { id: 'multi-step-wizards', title: 'Multi-Step Flows (Swal.queue vs ui.steps)' },
      { id: 'side-by-side', title: 'Side-by-Side Implementation Examples' },
    ],
    content: `
# Migrating from SweetAlert2 to toastory

SweetAlert2 has powered modal dialogs for over a decade. However, its legacy jQuery roots, 40 KB+ footprint, global state mutations, and dated skeuomorphic aesthetics make it a heavy fit for modern web apps.

**toastory** replaces SweetAlert2 with modern Apple frosted glass aesthetics, full WCAG 2.2 AA accessibility, focus trapping, and zero runtime dependencies.

---

### Why Modernize SweetAlert2?

- **Modern Frosted Glass Aesthetic**: Specular highlight borders and real physical blur instead of flat gray boxes.
- **Micro Bundle Size**: Full web bundle under 22 KB gzip (including toasts, dialogs, and sheets), compared to SweetAlert2 alone at 42 KB+.
- **Strict TypeScript Safety**: No \`any\` types; full autocompletion for 16 input types and return result objects.
- **Integrated Feedback System**: One package covers both floating notifications and blocking modal dialogs.

---

### Option & Result Mapping Table

| SweetAlert2 API | toastory Equivalent | Notes |
| :--- | :--- | :--- |
| \`Swal.fire({ title, text, icon })\` | \`ui.alert({ title, text, tone })\` | Accessible alert with focus trap. |
| \`Swal.fire({ showCancelButton: true })\` | \`ui.confirm({ ... })\` | Two-button confirmation modal. |
| \`Swal.fire({ input: 'text' })\` | \`ui.prompt({ input: 'text' })\` | 16 native input types supported. |
| \`Swal.fire({ input: 'select', inputOptions })\` | \`ui.prompt({ input: 'select', options })\` | Dropdown select support. |
| \`Swal.queue(steps)\` | \`ui.steps(stepList)\` | First-class multi-step flow with back button. |
| \`Swal.showLoading()\` | \`ui.loading({ text })\` | Indeterminate or progress overlay. |
| \`result.isConfirmed\` | \`result.isConfirmed\` | Identical boolean flag. |
| \`result.isDenied\` | \`result.isDenied\` | Identical boolean flag. |
| \`result.isDismissed\` | \`result.isDismissed\` | Identical boolean flag. |
| \`result.value\` | \`result.value\` | Typed value of prompt input. |
| \`result.dismiss\` | \`result.dismiss\` | Reason: \`'cancel'\`, \`'backdrop'\`, \`'close'\`, \`'esc'\`, \`'timer'\`. |
| \`preConfirm\` | \`preConfirm: async (val, handle)\` | Async confirmation hook with automatic button spinner. |

---

### Side-by-Side Implementation Examples

#### 1. Dangerous Destructive Confirmation

\`\`\`typescript
// Before (SweetAlert2)
const result = await Swal.fire({
  title: 'Are you sure?',
  text: 'You will not be able to recover this file!',
  icon: 'warning',
  showCancelButton: true,
  confirmButtonText: 'Yes, delete it!',
  cancelButtonText: 'Cancel',
  confirmButtonColor: '#d33',
});
if (result.isConfirmed) {
  Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
}
\`\`\`

\`\`\`typescript
// After (toastory)
import { ui, toast } from 'toastory';

const result = await ui.confirm({
  title: 'Are you sure?',
  text: 'You will not be able to recover this file!',
  tone: 'danger',
  confirmButton: { label: 'Yes, delete it!' },
  cancelButton: { label: 'Cancel' },
});

if (result.isConfirmed) {
  toast.success('Your file has been deleted.');
}
\`\`\`

---

#### 2. Input Prompt with Validation and Async Lock

\`\`\`typescript
// Before (SweetAlert2)
const { value: email } = await Swal.fire({
  title: 'Input email address',
  input: 'email',
  inputPlaceholder: 'Enter your email',
  inputValidator: (value) => {
    if (!value) return 'You need to write something!';
  },
  showCancelButton: true,
  showLoaderOnConfirm: true,
  preConfirm: async (val) => {
    await sendInvite(val);
  },
});
\`\`\`

\`\`\`typescript
// After (toastory)
const res = await ui.prompt({
  title: 'Input email address',
  input: 'email',
  placeholder: 'Enter your email',
  validate: (value) => {
    if (!value) return 'You need to write something!';
    return undefined; // valid
  },
  preConfirm: async (val) => {
    await sendInvite(val as string);
  },
});

if (res.isConfirmed) {
  toast.success(\`Invitation sent to \${res.value}\`);
}
\`\`\`
`,
  },

  // 3. MIGRATING FROM REACT-TOASTIFY
  'migration/react-toastify': {
    slug: 'migration/react-toastify',
    title: 'Migrating from React-Toastify to toastory',
    description: 'Transition from React-Toastify to toastory for 5x lighter bundles, zero dependencies, and modern frosted glass design.',
    category: 'Migration',
    lastUpdated: 'October 2026',
    headings: [
      { id: 'bundle-impact', title: 'Bundle Size & Performance Impact' },
      { id: 'api-mapping', title: 'Component & Method Mapping' },
      { id: 'side-by-side', title: 'Code Comparison: React-Toastify vs toastory' },
      { id: 'extended-features', title: 'Features Gained: Dialogs, Sheets & Gestures' },
    ],
    content: `
# Migrating from React-Toastify to toastory

React-Toastify is widely used, but its bundle size exceeds 30 KB, it injects heavy inline CSS, and it provides no dialog or bottom sheet primitives.

Upgrading to **toastory** reduces bundle overhead to under 6 KB for core notifications while introducing Apple frosted glass styling and touch gestures.

---

### Component & Method Mapping

| React-Toastify | toastory Equivalent | Notes |
| :--- | :--- | :--- |
| \`<ToastContainer />\` | \`<Toaster />\` | Import from \`toastory/react\`. |
| \`toast(msg)\` | \`toast(msg)\` | Default message toast. |
| \`toast.success(msg)\` | \`toast.success(msg)\` | Identical call syntax. |
| \`toast.error(msg)\` | \`toast.error(msg)\` | Identical call syntax. |
| \`toast.warn(msg)\` | \`toast.warning(msg)\` | Renamed to standard \`warning\`. |
| \`toast.info(msg)\` | \`toast.info(msg)\` | Identical call syntax. |
| \`autoClose: 3000\` | \`duration: 3000\` | Standard milliseconds duration. |
| \`hideProgressBar\` | \`progress: false\` | Built-in progress indicator control. |
| \`pauseOnHover\` | \`pauseOn: ['hover']\` | Granular pause reasons supported. |
| \`closeOnClick\` | \`closeOnClick\` | Identical boolean flag. |
| \`draggable\` | \`swipe\` | 4-direction velocity gesture dismissal. |

---

### Side-by-Side Code Comparison

\`\`\`tsx
// Before (React-Toastify)
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const notify = () => toast.success('Profile updated!', { autoClose: 3000 });
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <button onClick={notify}>Update</button>
    </>
  );
}
\`\`\`

\`\`\`tsx
// After (toastory)
import { Toaster, toast } from 'toastory/react';
import 'toastory/themes/ios-glass.css';

function App() {
  const notify = () => toast.success('Profile updated!', { duration: 3000 });
  return (
    <>
      <Toaster position="top-right" theme="ios-glass" mode="auto" />
      <button onClick={notify}>Update</button>
    </>
  );
}
\`\`\`
`,
  },

  // 4. MIGRATING FROM REACT-HOT-TOAST
  'migration/react-hot-toast': {
    slug: 'migration/react-hot-toast',
    title: 'Migrating from react-hot-toast to toastory',
    description: 'Upgrade from react-hot-toast to toastory with drop-in toast methods, enhanced promise handling, accessible dialogs, and Apple frosted glass styling.',
    category: 'Migration',
    lastUpdated: 'October 2026',
    headings: [
      { id: 'overview', title: 'Why Migrate from react-hot-toast?' },
      { id: 'api-mapping', title: 'Syntax & Method Equivalents' },
      { id: 'promises-async', title: 'Promise Handling & Dynamic Updates' },
      { id: 'adding-dialogs', title: 'Beyond Toasts: Confirm, Prompts, and Bottom Sheets' },
    ],
    content: `
# Migrating from react-hot-toast to toastory

**react-hot-toast** pioneered minimal React toast libraries. **toastory** retains that same developer ergonomic simplicity while modernizing visual fidelity, accessibility, and multi-framework support.

---

### Syntax & Method Equivalents

| react-hot-toast | toastory Equivalent | Notes |
| :--- | :--- | :--- |
| \`<Toaster />\` | \`<Toaster />\` | Import from \`toastory/react\`. |
| \`toast('Hello')\` | \`toast('Hello')\` | Direct string notification. |
| \`toast.success('Done')\` | \`toast.success('Done')\` | Green semantic success toast. |
| \`toast.error('Failed')\` | \`toast.error('Failed')\` | Red semantic error toast. |
| \`toast.loading('Loading')\` | \`toast.loading('Loading')\` | Glass loading spinner. |
| \`toast.promise(p, msgs)\` | \`toast.promise(p, msgs)\` | Async promise flow. |
| \`toast.custom(fn)\` | \`toast.custom(fn)\` | Custom JSX component rendering. |
| \`toast.dismiss(id)\` | \`toast.dismiss(id)\` | Dismiss single or all toasts. |

---

### Side-by-Side Promise Example

\`\`\`typescript
// Before (react-hot-toast)
toast.promise(
  fetchData(),
  {
    loading: 'Loading...',
    success: <b>Settings saved!</b>,
    error: <b>Could not save.</b>,
  }
);

// After (toastory)
const handle = toast.promise(
  fetchData(),
  {
    loading: 'Loading application data...',
    success: (data) => \`Settings saved for \${data.username}\`,
    error: (err) => \`Failed: \${(err as Error).message}\`,
    description: 'Synchronized with cloud replica.',
  }
);

// toastory also lets you unwrap the result:
const result = await handle.unwrap();
\`\`\`
`,
  },
};
