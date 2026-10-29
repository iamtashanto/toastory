'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ui, toast } from 'toastory';
import { CodeSnippet } from '@/components/CodeSnippet';

interface FeatureItem {
  id: string;
  group: 'Toasts & Promises' | 'Dialogs & Modals' | 'Forms & Inputs' | 'Wizards & Sheets' | 'Theming & Engine';
  title: string;
  description: string;
  snippet: string;
  docUrl: string;
  actionLabel: string;
  onTrigger: () => void | Promise<void>;
}

export default function FeaturesPage() {
  const [selectedGroup, setSelectedGroup] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const features: FeatureItem[] = [
    // --- Group 1: Toasts & Promises ---
    {
      id: 'toast-types',
      group: 'Toasts & Promises',
      title: 'Semantic Toast Types & Rich Colors',
      description: 'Pre-configured semantic types: success, error, warning, info, loading, and neutral cards with custom icons and rich tones.',
      docUrl: '/docs/guides/toasts',
      snippet: `toast.success('Project deployed!', {\n  description: 'Live on production edge in 340ms.',\n  richColors: true\n});`,
      actionLabel: 'Trigger Success',
      onTrigger: () => toast.success('Project deployed!', { description: 'Live on production edge in 340ms.', richColors: true }),
    },
    {
      id: 'toast-promise',
      group: 'Toasts & Promises',
      title: 'Async Promise Tracking with unwrap()',
      description: 'Streamline async operations with automated loading indicators, success/error transitions, and unwrap() error rejection.',
      docUrl: '/docs/guides/promise-toasts',
      snippet: `toast.promise(fetchDatabaseStats(), {\n  loading: 'Gathering cluster telemetry...',\n  success: 'Cluster healthy across 12 zones',\n  error: 'Failed to reach database replica'\n});`,
      actionLabel: 'Trigger Promise Toast',
      onTrigger: () => {
        const dummy = new Promise<{ nodes: number }>((resolve) => setTimeout(() => resolve({ nodes: 12 }), 2200));
        toast.promise(dummy, {
          loading: 'Gathering cluster telemetry...',
          success: (data) => `Cluster healthy across ${data.nodes} edge zones!`,
          error: 'Connection timeout',
          description: 'Queried at 0.1ms latency',
        });
      },
    },
    {
      id: 'toast-update',
      group: 'Toasts & Promises',
      title: 'Dynamic Toast Updates & Dismissal',
      description: 'Programmatically mutate active toast content, progress, or duration on the fly with toast.update(id, patch).',
      docUrl: '/docs/guides/updating-dismissing',
      snippet: `const id = toast.loading('Uploading 14.8 MB assets...');\nsetTimeout(() => {\n  toast.update(id, {\n    type: 'success',\n    title: 'Upload complete!',\n    description: 'Saved to encrypted S3 bucket.'\n  });\n}, 2000);`,
      actionLabel: 'Trigger Dynamic Update',
      onTrigger: () => {
        const id = toast.loading('Uploading 14.8 MB assets...', { duration: 0 });
        setTimeout(() => {
          toast.update(id, {
            type: 'success',
            title: 'Assets uploaded successfully!',
            description: 'SHA-256 integrity verified.',
            duration: 4000,
          });
        }, 1800);
      },
    },
    {
      id: 'toast-actions',
      group: 'Toasts & Promises',
      title: 'Interactive Action & Cancel Buttons',
      description: 'Attach primary action and cancellation buttons with keyboard focus rings, callbacks, and automatic dismiss.',
      docUrl: '/docs/guides/toasts',
      snippet: `toast('File moved to trash', {\n  description: 'analytics_2026.parquet',\n  action: { label: 'Undo', onClick: () => restoreFile() },\n  cancel: { label: 'Dismiss' }\n});`,
      actionLabel: 'Trigger Action Toast',
      onTrigger: () => {
        toast('File moved to trash', {
          description: 'analytics_2026.parquet',
          action: { label: 'Undo', onClick: () => toast.success('File restored from archive!') },
          cancel: { label: 'Dismiss' },
          duration: 6000,
        });
      },
    },
    {
      id: 'toast-swipe',
      group: 'Toasts & Promises',
      title: '4-Direction Velocity Gesture Physics',
      description: 'Fluid touch & mouse swipe physics with customizable drag threshold and velocity snap dismissal in any direction.',
      docUrl: '/docs/guides/swipe-gestures',
      snippet: `toast.info('Swipe me away!', {\n  swipeDirections: ['left', 'right', 'up', 'down'],\n  dragThreshold: 40\n});`,
      actionLabel: 'Trigger Swipeable Toast',
      onTrigger: () => toast.info('Swipe me in any direction to dismiss!', { duration: 8000 }),
    },
    {
      id: 'toast-progress',
      group: 'Toasts & Promises',
      title: 'Determinate Progress Bars & Circular Rings',
      description: 'Visual feedback for long-running operations with linear percentage bars or circular radial progress rings.',
      docUrl: '/docs/guides/progress-timers',
      snippet: `toast.loading('Compiling kernel...', {\n  progress: true,\n  duration: 5000\n});`,
      actionLabel: 'Trigger Progress Toast',
      onTrigger: () => toast.info('Auto-dismissing timer progress', { progress: true, duration: 5000 }),
    },
    {
      id: 'toast-pause',
      group: 'Toasts & Promises',
      title: 'Pausable Timers & Window Focus Sync',
      description: 'Timers automatically freeze when hovering, focusing elements, or switching browser tabs to avoid missed notifications.',
      docUrl: '/docs/guides/progress-timers',
      snippet: `toast('Hover to pause countdown', {\n  pauseOn: ['hover', 'focus', 'hidden'],\n  duration: 6000\n});`,
      actionLabel: 'Trigger Pausable Toast',
      onTrigger: () => toast.warning('Hover with mouse to pause countdown!', { duration: 6000 }),
    },
    {
      id: 'toast-custom-types',
      group: 'Toasts & Promises',
      title: 'Extensible Custom Types Registry',
      description: 'Register domain-specific toast variants with distinct brand colors, custom icons, and preset defaults.',
      docUrl: '/docs/guides/toasts',
      snippet: `ui.toast.types.add('backup', {\n  color: '#8b5cf6',\n  ariaLive: 'polite',\n  duration: 5000\n});`,
      actionLabel: 'Trigger Custom Type',
      onTrigger: () => {
        ui.toast.types.add('security', { color: '#06b6d4', duration: 4500 });
        toast('Security incident detected', {
          description: 'Login attempt from Frankfurt, DE',
          action: { label: 'Review', onClick: () => toast.info('Opening security log') },
        });
      },
    },

    // --- Group 2: Dialogs & Modals ---
    {
      id: 'dlg-confirm',
      group: 'Dialogs & Modals',
      title: 'Accessible Modal Confirmations (ui.confirm)',
      description: 'Promise-based modal dialog with focus trapping, tone presets (info, warning, danger), Esc key listener, and backdrop click control.',
      docUrl: '/docs/guides/dialogs',
      snippet: `const { isConfirmed } = await ui.confirm({\n  title: 'Delete billing method?',\n  text: 'Your current subscriptions will default to wire transfer.',\n  tone: 'danger',\n  confirmButton: { label: 'Remove Card' }\n});`,
      actionLabel: 'Open Confirm Dialog',
      onTrigger: async () => {
        const res = await ui.confirm({
          title: 'Delete billing method?',
          text: 'Your active subscription will switch to manual wire invoicing.',
          tone: 'danger',
          confirmButton: { label: 'Remove Card', color: '#dc2626' },
          cancelButton: { label: 'Keep Card' },
        });
        if (res.isConfirmed) toast.success('Billing method removed.');
      },
    },
    {
      id: 'dlg-alert',
      group: 'Dialogs & Modals',
      title: 'Accessible Alert Modals (ui.alert)',
      description: 'High-contrast accessible modal dialog for critical announcements, system notices, and policy agreements.',
      docUrl: '/docs/guides/dialogs',
      snippet: `await ui.alert({\n  title: 'Scheduled Maintenance',\n  text: 'API gateway will restart on Sunday at 02:00 UTC.',\n  tone: 'info',\n  confirmButton: { label: 'Acknowledge' }\n});`,
      actionLabel: 'Open Alert Dialog',
      onTrigger: async () => {
        await ui.alert({
          title: 'Scheduled Maintenance',
          text: 'The primary API cluster will restart on Sunday at 02:00 UTC for kernel patching.',
          tone: 'info',
          confirmButton: { label: 'Understood' },
        });
      },
    },
    {
      id: 'dlg-preconfirm',
      group: 'Dialogs & Modals',
      title: 'Async preConfirm & Button Loading States',
      description: 'Keep the modal open and display an animated spinner inside the confirm button until an async API call resolves or rejects.',
      docUrl: '/docs/guides/dialogs',
      snippet: `await ui.confirm({\n  title: 'Deploy to Production?',\n  preConfirm: async () => {\n    await triggerPipelineDeploy();\n  }\n});`,
      actionLabel: 'Trigger Async preConfirm',
      onTrigger: async () => {
        await ui.confirm({
          title: 'Deploy release v1.4.0?',
          text: 'Click Confirm to trigger the deployment pipeline with automated rollback guard.',
          confirmButton: { label: 'Deploy Now' },
          preConfirm: async () => {
            await new Promise((resolve) => setTimeout(resolve, 2000));
            toast.success('Pipeline triggered successfully!');
          },
        });
      },
    },
    {
      id: 'dlg-draggable',
      group: 'Dialogs & Modals',
      title: 'Draggable Dialogs & 15 Screen Positions',
      description: 'Users can freely drag modal dialogs around the screen, or position them across 15 coordinates (top, center, bottom, corners).',
      docUrl: '/docs/guides/dialogs',
      snippet: `await ui.alert({\n  title: 'Draggable Inspector',\n  text: 'Grab the modal header to reposition it anywhere.',\n  draggable: true\n});`,
      actionLabel: 'Open Draggable Modal',
      onTrigger: async () => {
        await ui.alert({
          title: 'Draggable Inspector',
          text: 'Grab the modal header and drag it anywhere across your viewport.',
          draggable: true,
          confirmButton: { label: 'Done Inspecting' },
        });
      },
    },
    {
      id: 'dlg-timer',
      group: 'Dialogs & Modals',
      title: 'Countdown Timers with Auto-Dismiss Bar',
      description: 'Attach auto-dismiss countdown timers with live animated progress bars and programmatic handle controllers.',
      docUrl: '/docs/guides/dialogs',
      snippet: `await ui.confirm({\n  title: 'Session Expiring',\n  text: 'Automatically logging out in 5 seconds...',\n  timer: 5000,\n  timerProgressBar: true\n});`,
      actionLabel: 'Open Timed Dialog',
      onTrigger: async () => {
        await ui.confirm({
          title: 'Inactivity Warning',
          text: 'Your security session will automatically refresh in 5 seconds.',
          timer: 5000,
          timerProgressBar: true,
          confirmButton: { label: 'Keep Active' },
        });
      },
    },

    // --- Group 3: Forms & Inputs ---
    {
      id: 'input-types',
      group: 'Forms & Inputs',
      title: '16 Built-in Form Input Types',
      description: 'Native input renderers: text, email, password, number, tel, url, search, textarea, select, radio, checkbox, range, date, time, file.',
      docUrl: '/docs/guides/prompts-inputs',
      snippet: `const { value } = await ui.prompt({\n  title: 'Select Deployment Region',\n  input: 'select',\n  options: { 'us-east': 'US East (N. Virginia)', 'eu-west': 'EU West (Ireland)' }\n});`,
      actionLabel: 'Open Select Prompt',
      onTrigger: async () => {
        const res = await ui.prompt({
          title: 'Select Production Region',
          text: 'Choose where your container cluster will be provisioned:',
          input: 'select',
          options: {
            'us-east': 'US East (N. Virginia)',
            'eu-west': 'EU West (Ireland)',
            'ap-southeast': 'Asia Pacific (Singapore)',
          },
        });
        if (res.isConfirmed && res.value) {
          toast.success(`Region selected: ${res.value}`);
        }
      },
    },
    {
      id: 'input-validation',
      group: 'Forms & Inputs',
      title: 'Sync & Async Input Validation',
      description: 'Enforce input rules with inline validation messages, regex patterns, or async server availability checks.',
      docUrl: '/docs/guides/prompts-inputs',
      snippet: `await ui.prompt({\n  title: 'Claim Username',\n  input: 'text',\n  validate: async (val) => {\n    if (!val || val.length < 3) return 'At least 3 characters required';\n    if (await isTaken(val)) return 'Username already registered';\n  }\n});`,
      actionLabel: 'Open Validated Prompt',
      onTrigger: async () => {
        const res = await ui.prompt({
          title: 'Claim Workspace Domain',
          input: 'text',
          placeholder: 'your-company',
          validate: (val) => {
            const str = String(val || '');
            if (!str || str.trim().length < 3) return 'Domain must be at least 3 characters long.';
            if (str.includes(' ')) return 'Spaces are not allowed.';
            return undefined;
          },
        });
        if (res.isConfirmed && res.value) {
          toast.success(`Domain "${res.value}.toastory.dev" claimed!`);
        }
      },
    },
    {
      id: 'input-type-guard',
      group: 'Forms & Inputs',
      title: 'Type-to-Confirm Security Guard',
      description: 'Eliminate accidental destructive actions by requiring the user to type a specific verification keyword.',
      docUrl: '/docs/recipes/delete-type-to-confirm',
      snippet: `await ui.prompt({\n  title: 'Confirm Repository Wipe',\n  text: 'Type "RESET" to confirm permanent deletion:',\n  confirmText: 'RESET',\n  caseSensitive: true,\n  tone: 'danger'\n});`,
      actionLabel: 'Open Guard Dialog',
      onTrigger: async () => {
        const res = await ui.prompt({
          title: 'Confirm Database Wipe',
          text: 'Type "DELETE" below to confirm dropping all schema tables:',
          confirmText: 'DELETE',
          caseSensitive: true,
          tone: 'danger',
        });
        if (res.isConfirmed) {
          toast.error('Database dropped.', { description: 'All records purged.' });
        }
      },
    },
    {
      id: 'input-otp',
      group: 'Forms & Inputs',
      title: '6-Cell Discrete Numeric OTP Code',
      description: 'Individual auto-advancing verification cells with clipboard paste parsing, numeric keypad mode, and resend cooldown timer.',
      docUrl: '/docs/recipes/otp-verification',
      snippet: `await ui.prompt({\n  title: 'Enter Verification Code',\n  input: 'otp',\n  otpLength: 6,\n  resendCooldown: 30\n});`,
      actionLabel: 'Open OTP Verification',
      onTrigger: async () => {
        const res = await ui.prompt({
          title: 'Two-Factor Authentication',
          text: 'Enter the 6-digit code sent to your authenticator app:',
          input: 'otp',
          otpLength: 6,
          resendCooldown: 25,
        });
        if (res.isConfirmed && res.value) {
          toast.success(`2FA Code Verified: ${res.value}`);
        }
      },
    },

    // --- Group 4: Wizards & Sheets ---
    {
      id: 'dlg-steps',
      group: 'Wizards & Sheets',
      title: 'Multi-Step Guided Wizards (ui.steps)',
      description: 'Assemble multi-page onboarding wizards with Back and Next navigation, per-step validation, and accumulated return values.',
      docUrl: '/docs/guides/steps',
      snippet: `const { values } = await ui.steps([\n  { title: 'Step 1: Workspace', input: 'text' },\n  { title: 'Step 2: Plan', input: 'select', options: ['Pro', 'Enterprise'] }\n]);`,
      actionLabel: 'Launch 3-Step Wizard',
      onTrigger: async () => {
        const res = await ui.steps([
          { title: 'Step 1 of 3: Organization', text: 'Enter team organization name:', input: 'text', placeholder: 'Acme Corp' },
          { title: 'Step 2 of 3: Primary Framework', text: 'Select client technology stack:', input: 'select', options: ['React & Next.js', 'Vue & Nuxt', 'Svelte', 'Angular'] },
          { title: 'Step 3 of 3: Review & Launch', text: 'Confirm workspace parameters to deploy.' },
        ]);
        if (res.isConfirmed) {
          toast.success('Workspace created!', { description: JSON.stringify(res.values) });
        }
      },
    },
    {
      id: 'sheet-bottom',
      group: 'Wizards & Sheets',
      title: 'Mobile Draggable Bottom Sheet (ui.bottomSheet)',
      description: 'Slide-up modal sheet with touch drag handle, velocity snap points (e.g. 40vh, 85vh), and fluid swipe dismissal.',
      docUrl: '/docs/guides/sheets-overlays',
      snippet: `ui.bottomSheet({\n  title: 'Deployment Options',\n  snapPoints: [0.4, 0.85],\n  confirmButton: { label: 'Apply Settings' }\n});`,
      actionLabel: 'Open Bottom Sheet',
      onTrigger: () => {
        ui.bottomSheet({
          title: 'Search Filters & Facets',
          text: 'Refine metrics by telemetry zone, status code, and latency distribution.',
          snapPoints: [0.4, 0.85],
          confirmButton: { label: 'Apply Filters' },
        });
      },
    },
    {
      id: 'sheet-action',
      group: 'Wizards & Sheets',
      title: 'iOS Action Sheet Menu (ui.sheet)',
      description: 'Stacked iOS-inspired action list with destructive option highlighting, neutral secondary items, and cancellation button.',
      docUrl: '/docs/guides/sheets-overlays',
      snippet: `ui.sheet({\n  title: 'Document Actions',\n  actions: [\n    { label: 'Copy Public URL', value: 'copy' },\n    { label: 'Export as PDF', value: 'pdf' },\n    { label: 'Delete File', value: 'delete', style: 'destructive' }\n  ]\n});`,
      actionLabel: 'Open Action Sheet',
      onTrigger: () => {
        ui.sheet({
          title: 'Document Operations',
          actions: [
            { label: 'Share via Secure Link', value: 'share' },
            { label: 'Duplicate File', value: 'duplicate' },
            { label: 'Archive Document', value: 'archive' },
            { label: 'Delete Permanently', value: 'delete', style: 'destructive' },
          ],
        });
      },
    },
    {
      id: 'overlay-loading',
      group: 'Wizards & Sheets',
      title: 'Full-Screen Loading Overlay with Progress',
      description: 'Modal loading backdrop with smooth spinner, dynamic percentage progress, and programmatic handle controller.',
      docUrl: '/docs/guides/sheets-overlays',
      snippet: `const handle = ui.loading({ text: 'Deploying worker...' });\nhandle.update({ progress: 0.6, text: 'Warming cache...' });\nsetTimeout(() => handle.close(), 2000);`,
      actionLabel: 'Show Loading Overlay',
      onTrigger: () => {
        const handle = ui.loading({ text: 'Provisioning edge workers...', progress: 0.25 });
        setTimeout(() => handle.update({ progress: 0.75, text: 'Propagating SSL certificates...' }), 1200);
        setTimeout(() => {
          handle.close();
          toast.success('Edge workers live in all regions!');
        }, 2400);
      },
    },

    // --- Group 5: Theming & Engine ---
    {
      id: 'theme-presets',
      group: 'Theming & Engine',
      title: '21 Handcrafted Glass & Solid Themes',
      description: 'Specular frosted glass (ios-glass, liquid-glass, aurora), retro brutalism, and clean flat styles with light & dark modes.',
      docUrl: '/docs/theming/overview',
      snippet: `import 'toastory/themes/ios-glass.css';\nui.configure({ theme: 'ios-glass', mode: 'auto' });`,
      actionLabel: 'Preview Glass Theme',
      onTrigger: () => {
        toast.success('Frosted glass theme active', {
          theme: 'ios-glass',
          description: 'Specular highlight border and physical backdrop blur.',
        });
      },
    },
    {
      id: 'engine-config',
      group: 'Theming & Engine',
      title: 'Centralized Global Configuration (ui.configure)',
      description: 'Define default themes, 6 screen placements, 3D deck stacking, pause triggers, and hotkeys in one call.',
      docUrl: '/docs/guides/stacking-positioning',
      snippet: `ui.configure({\n  theme: 'ios-glass',\n  position: 'top-right',\n  stack: 'stacked',\n  duration: 4000,\n  maxVisible: 5,\n  gap: 12\n});`,
      actionLabel: 'Test Configuration',
      onTrigger: () => {
        ui.configure({ position: 'top-right', stack: 'stacked' });
        toast.info('Global configuration updated', { description: 'Stacking mode: 3D deck with hover expansion.' });
      },
    },
    {
      id: 'zero-deps',
      group: 'Theming & Engine',
      title: 'Zero Dependencies & WCAG 2.2 AA Compliance',
      description: 'Strict 0 runtime dependencies in published bundle. < 6 KB gzip core + toast. 100% passed contrast checks & focus traps.',
      docUrl: '/docs/theming/accessibility',
      snippet: `// Zero runtime dependencies. Runs in plain Node, SSR, and browsers.\nimport { ui } from 'toastory';`,
      actionLabel: 'Run A11y Notification',
      onTrigger: () => {
        toast.success('Accessibility Verified', {
          description: 'WCAG 2.2 AA compliant contrast and ARIA live regions.',
        });
      },
    },
  ];

  const groups = ['All', 'Toasts & Promises', 'Dialogs & Modals', 'Forms & Inputs', 'Wizards & Sheets', 'Theming & Engine'];

  const filteredFeatures = features.filter((item) => {
    const matchesGroup = selectedGroup === 'All' || item.group === selectedGroup;
    const matchesSearch =
      searchQuery === '' ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.snippet.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesGroup && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20 text-left transition-colors">
      {/* Header Banner */}
      <div className="max-w-3xl mb-10">
        <span className="text-xs font-semibold text-blue-500 uppercase tracking-wider">Complete Feature Catalogue</span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-[var(--site-fg)] tracking-tight mt-1 mb-4">
          Every Feature. Zero Dependencies.
        </h1>
        <p className="text-base sm:text-lg text-[var(--site-muted)] leading-relaxed">
          Comprehensive listing of every feature shipping in the <code className="text-blue-500 font-mono">toastory</code> npm package. Every item includes runnable browser demos, TypeScript syntax snippets, and direct links to full documentation.
        </p>
      </div>

      {/* Filter Tabs and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 pb-6 border-b border-[var(--site-border)]">
        {/* Category Pill Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          {groups.map((grp) => {
            const count = grp === 'All' ? features.length : features.filter((f) => f.group === grp).length;
            const isActive = selectedGroup === grp;
            return (
              <button
                key={grp}
                type="button"
                onClick={() => setSelectedGroup(grp)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'bg-[var(--site-surface-raised)] border border-[var(--site-border)] text-[var(--site-muted)] hover:text-[var(--site-fg)] hover:bg-[var(--site-surface)]'
                }`}
              >
                <span>{grp}</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${isActive ? 'bg-blue-700/60 text-white' : 'bg-black/10 text-[var(--site-muted)]'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Live Search Input */}
        <div className="relative w-full md:w-72">
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search features or syntax..."
            className="w-full px-3.5 py-2 pl-9 text-xs rounded-xl bg-[var(--site-surface-raised)] border border-[var(--site-border)] text-[var(--site-fg)] placeholder-[var(--site-muted)] focus:outline-none focus:border-blue-500 transition-colors"
          />
          <svg
            className="w-4 h-4 text-[var(--site-muted)] absolute left-3 top-2.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Feature Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredFeatures.map((item) => (
          <div
            key={item.id}
            className="p-6 rounded-2xl border border-[var(--site-border)] bg-[var(--site-surface)] flex flex-col justify-between shadow-sm hover:border-blue-500/40 transition-all"
          >
            <div>
              <div className="flex items-start justify-between gap-4 mb-2">
                <div>
                  <span className="text-[10px] font-semibold tracking-wider text-blue-500 uppercase">
                    {item.group}
                  </span>
                  <h3 className="text-lg font-bold text-[var(--site-fg)] mt-0.5">{item.title}</h3>
                </div>
                <Link
                  href={item.docUrl}
                  className="text-xs text-blue-500 hover:underline flex-none font-medium"
                >
                  Docs →
                </Link>
              </div>
              <p className="text-xs sm:text-sm text-[var(--site-muted)] mb-4 leading-relaxed">
                {item.description}
              </p>
              <CodeSnippet code={item.snippet} />
            </div>

            <div className="mt-5 pt-4 border-t border-[var(--site-border)] flex items-center justify-between">
              <span className="text-xs text-[var(--site-muted)]">Live npm package test:</span>
              <button
                type="button"
                onClick={item.onTrigger}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs transition-colors shadow-md shadow-blue-500/20 active:scale-95"
              >
                {item.actionLabel} ↵
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredFeatures.length === 0 && (
        <div className="text-center py-16 border border-dashed border-[var(--site-border)] rounded-2xl">
          <p className="text-sm text-[var(--site-muted)]">No features matched &quot;{searchQuery}&quot;.</p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedGroup('All');
            }}
            className="mt-3 text-xs text-blue-500 hover:underline font-medium"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
