'use client';

import React from 'react';
import Link from 'next/link';
import { ui, toast } from 'glazekit';
import { CodeSnippet } from '@/components/CodeSnippet';

interface FeatureItem {
  id: string;
  group: string;
  title: string;
  description: string;
  snippet: string;
  docUrl: string;
  actionLabel: string;
  onTrigger: () => void;
}

export default function FeaturesPage() {
  const features: FeatureItem[] = [
    // Group: Toasts
    {
      id: 'toast-types',
      group: 'Toasts',
      title: 'Toast Types & Tone Colors',
      description: 'Pre-configured semantic types: success, error, warning, info, and custom neutral message cards.',
      docUrl: '/docs/guides/toasts',
      snippet: `toast.success('Project deployed!', { description: 'Live on production edge.' });`,
      actionLabel: 'Trigger Success',
      onTrigger: () => toast.success('Project deployed!', { description: 'Live on production edge.' }),
    },
    {
      id: 'toast-promise',
      group: 'Toasts',
      title: 'Async Promise Tracking with unwrap()',
      description: 'Streamline async operations with automated loading indicators, success/error transitions, and unwrapping.',
      docUrl: '/docs/guides/promise-toasts',
      snippet: `toast.promise(fetch('/api/sync'), {
  loading: 'Syncing with remote...',
  success: 'Everything in sync!',
  error: 'Sync failed'
});`,
      actionLabel: 'Trigger Promise Toast',
      onTrigger: () => {
        const dummy = new Promise((resolve) => setTimeout(resolve, 2000));
        toast.promise(dummy, {
          loading: 'Syncing with remote database...',
          success: 'Everything in sync!',
          error: 'Sync failed',
        });
      },
    },
    {
      id: 'toast-actions',
      group: 'Toasts',
      title: 'Interactive Action & Cancel Buttons',
      description: 'Attach primary action and cancellation buttons with visible keyboard rings and dismiss prevention.',
      docUrl: '/docs/guides/toasts',
      snippet: `toast('File moved to trash', {
  action: { label: 'Undo', onClick: () => restoreFile() }
});`,
      actionLabel: 'Trigger Action Toast',
      onTrigger: () => {
        toast('File moved to trash', {
          description: 'Deleted report-2026.pdf',
          action: { label: 'Undo', onClick: () => toast.success('File restored!') },
          cancel: { label: 'Dismiss' },
        });
      },
    },
    {
      id: 'toast-swipe',
      group: 'Toasts',
      title: 'Velocity Gesture Swipe Dismissal',
      description: '4-direction gesture physics with customizable threshold and mobile touch-action pan limits.',
      docUrl: '/docs/guides/swipe-gestures',
      snippet: `toast.info('Swipe me to dismiss', {
  swipeDirections: ['left', 'right', 'up']
});`,
      actionLabel: 'Trigger Swipeable Toast',
      onTrigger: () => toast.info('Swipe me left or right to dismiss!', { duration: 6000 }),
    },

    // Group: Dialogs
    {
      id: 'dlg-confirm',
      group: 'Dialogs',
      title: 'Modal Confirmations (`ui.confirm`)',
      description: 'Lightweight modal dialog with focus trapping, tone presets (info, warning, danger), and Esc handling.',
      docUrl: '/docs/guides/dialogs',
      snippet: `const result = await ui.confirm({
  title: 'Delete account?',
  text: 'All associated projects will be removed.',
  tone: 'danger'
});`,
      actionLabel: 'Open Confirm Dialog',
      onTrigger: async () => {
        await ui.confirm({
          title: 'Delete billing method?',
          text: 'This will revert your subscription to the Free tier.',
          tone: 'danger',
          confirmButton: { label: 'Delete Method', color: '#dc2626' },
        });
      },
    },
    {
      id: 'dlg-type-guard',
      group: 'Dialogs',
      title: 'Type-to-Confirm Security Guard',
      description: 'Prevent accidental destructive actions by requiring the user to type a specific confirmation string.',
      docUrl: '/docs/recipes/delete-type-to-confirm',
      snippet: `await ui.prompt({
  title: 'Confirm Repository Wipe',
  confirmText: 'glazekit',
  caseSensitive: true
});`,
      actionLabel: 'Open Guard Dialog',
      onTrigger: async () => {
        await ui.prompt({
          title: 'Confirm Database Reset',
          text: 'Type "RESET" below to confirm dropping all schema tables:',
          confirmText: 'RESET',
          caseSensitive: true,
          tone: 'danger',
        });
      },
    },
    {
      id: 'dlg-steps',
      group: 'Dialogs',
      title: 'Multi-Step Wizard Flow (`ui.steps`)',
      description: 'Create multi-step dialog wizards with automatic back/forward state preservation and aggregated results.',
      docUrl: '/docs/guides/steps',
      snippet: `const { values } = await ui.steps([
  { title: 'Step 1: Cluster Name', input: 'text' },
  { title: 'Step 2: Region', input: 'select', options: regions }
]);`,
      actionLabel: 'Launch Wizard',
      onTrigger: async () => {
        await ui.steps([
          { title: 'Step 1: Name Your Project', input: 'text', placeholder: 'my-project' },
          { title: 'Step 2: Primary Framework', input: 'select', options: ['React', 'Vue', 'Svelte', 'Angular'] },
        ]);
        toast.success('Wizard completed!');
      },
    },

    // Group: Inputs & OTP
    {
      id: 'input-otp',
      group: 'Inputs',
      title: '6-Box Discrete Numeric OTP Code',
      description: 'Individual auto-advancing input cells with clipboard paste parsing, numeric mode, and resend cooldown.',
      docUrl: '/docs/recipes/otp-verification',
      snippet: `await ui.prompt({
  title: 'Enter Verification Code',
  input: 'otp',
  otpLength: 6,
  resendCooldown: 30
});`,
      actionLabel: 'Open OTP Input',
      onTrigger: async () => {
        await ui.prompt({
          title: 'Enter 6-Digit Code',
          text: 'Security code dispatched via SMS:',
          input: 'otp',
          otpLength: 6,
          resendCooldown: 20,
        });
      },
    },
    {
      id: 'input-types',
      group: 'Inputs',
      title: '16 Form Input Types',
      description: 'Text, email, password, select, range, date, radio, checkbox, textarea, file, and datetime-local.',
      docUrl: '/docs/guides/prompts-inputs',
      snippet: `const { value } = await ui.prompt({
  title: 'Adjust Storage Allocation',
  input: 'range',
  inputValue: 50
});`,
      actionLabel: 'Open Range Slider Dialog',
      onTrigger: async () => {
        await ui.prompt({
          title: 'Set Memory Limit (GB)',
          input: 'range',
          inputValue: 16,
        });
      },
    },

    // Group: Sheets & Overlays
    {
      id: 'sheet-bottom',
      group: 'Sheets and overlay',
      title: 'Draggable Mobile Bottom Sheet',
      description: 'Slide-up modal sheet with responsive drag handle, customizable snap points (e.g. 40vh, 80vh), and swipe dismiss.',
      docUrl: '/docs/guides/sheets-overlays',
      snippet: `ui.bottomSheet({
  title: 'Deployment Options',
  snapPoints: [0.4, 0.85]
});`,
      actionLabel: 'Open Bottom Sheet',
      onTrigger: () => {
        ui.bottomSheet({
          title: 'Filter Search Results',
          text: 'Configure tags, author filters, and date ranges.',
          snapPoints: [0.4, 0.8],
          confirmButton: { label: 'Apply Filters' },
        });
      },
    },
    {
      id: 'sheet-action',
      group: 'Sheets and overlay',
      title: 'Action Sheet Menu (`ui.sheet`)',
      description: 'iOS-inspired stacked action list with destructive option styling and cancel buttons.',
      docUrl: '/docs/guides/sheets-overlays',
      snippet: `ui.sheet({
  title: 'Share Document',
  actions: [
    { label: 'Copy Link', value: 'copy' },
    { label: 'Email PDF', value: 'email' },
    { label: 'Delete', value: 'delete', style: 'destructive' }
  ]
});`,
      actionLabel: 'Open Action Sheet',
      onTrigger: () => {
        ui.sheet({
          title: 'Document Options',
          actions: [
            { label: 'Export as Markdown', value: 'md' },
            { label: 'Export as PDF', value: 'pdf' },
            { label: 'Delete Permanently', value: 'del', style: 'destructive' },
          ],
        });
      },
    },
    {
      id: 'overlay-loading',
      group: 'Sheets and overlay',
      title: 'Full Loading Overlay with Progress',
      description: 'Modal loading screen with animated spinner, dynamic text updates, and determinate progress bar.',
      docUrl: '/docs/guides/sheets-overlays',
      snippet: `const handle = ui.loading({ text: 'Starting migration...' });
handle.update({ progress: 0.5, text: 'Migrating tables...' });
setTimeout(() => handle.close(), 2000);`,
      actionLabel: 'Show Loading Overlay',
      onTrigger: () => {
        const handle = ui.loading({ text: 'Starting container deploy...', progress: 0.2 });
        setTimeout(() => handle.update({ progress: 0.7, text: 'Warming cache...' }), 1000);
        setTimeout(() => {
          handle.close();
          toast.success('Container live!');
        }, 2200);
      },
    },
  ];

  const groups = ['Toasts', 'Dialogs', 'Inputs', 'Sheets and overlay'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20 text-left">
      <div className="max-w-3xl mb-12">
        <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">Features Catalogue</span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mt-1 mb-4">
          Complete Feedback Toolkit
        </h1>
        <p className="text-base sm:text-lg text-gray-400 leading-relaxed">
          Every component and feature of glazekit with real runnable demos, TypeScript code snippets, and direct links to comprehensive documentation guides.
        </p>
      </div>

      <div className="space-y-16">
        {groups.map((grp) => {
          const items = features.filter((f) => f.group === grp);
          return (
            <section key={grp} className="space-y-6">
              <div className="flex items-center gap-3 border-b border-white/10 pb-3">
                <h2 className="text-xl sm:text-2xl font-bold text-white">{grp}</h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs bg-white/10 text-gray-300 font-mono">
                  {items.length} features
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="p-6 rounded-2xl border border-white/10 bg-[#10121b] flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <h3 className="text-lg font-bold text-white">{item.title}</h3>
                        <Link
                          href={item.docUrl}
                          className="text-xs text-blue-400 hover:underline flex-none"
                        >
                          Docs →
                        </Link>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-400 mb-4 leading-relaxed">
                        {item.description}
                      </p>
                      <CodeSnippet code={item.snippet} />
                    </div>

                    <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                      <span className="text-xs text-gray-400">Dogfooding live package:</span>
                      <button
                        type="button"
                        onClick={item.onTrigger}
                        className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs transition-colors shadow-md shadow-blue-500/20"
                      >
                        {item.actionLabel} ↵
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
