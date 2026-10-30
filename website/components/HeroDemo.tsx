'use client';

import React, { useState } from 'react';
import { ui, toast } from 'toastory';

export function HeroDemo() {
  const [activeTheme, setActiveTheme] = useState('ios-glass');
  const [activePosition, setActivePosition] = useState<'top-right' | 'bottom-right' | 'top-center' | 'bottom-center'>('top-right');
  const [isStacked, setIsStacked] = useState(true);
  const [selectedDemo, setSelectedDemo] = useState<'success' | 'error' | 'promise' | 'confirm' | 'prompt' | 'sheet'>('success');
  const [showCode, setShowCode] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);

  const themes = [
    { id: 'ios-glass', name: 'iOS Glass' },
    { id: 'liquid-glass', name: 'Liquid Glass' },
    { id: 'essentials', name: 'Essentials' },
    { id: 'showcase', name: 'Showcase' },
    { id: 'neon', name: 'Cyber Neon' },
    { id: 'aurora', name: 'Aurora' },
    { id: 'sweet', name: 'Sweet Candy' },
    { id: 'brutal', name: 'Neo-Brutal' },
  ];

  const demoSnippets: Record<string, { label: string; code: string }> = {
    success: {
      label: 'Success Toast',
      code: `import { toast } from 'toastory';
import 'toastory/themes/${activeTheme}.css';

toast.success('Changes saved successfully', {
  description: 'Your configuration was synced to the cloud replica.',
  theme: '${activeTheme}',
  position: '${activePosition}',
  action: {
    label: 'View Logs',
    onClick: () => console.log('Viewing logs...')
  }
});`,
    },
    error: {
      label: 'Error Alert Toast',
      code: `import { toast } from 'toastory';
import 'toastory/themes/${activeTheme}.css';

toast.error('Build compilation failed', {
  description: 'Syntax error in src/worker.ts: unexpected token at line 42.',
  theme: '${activeTheme}',
  position: '${activePosition}',
  action: {
    label: 'Retry',
    onClick: () => console.log('Retrying build...')
  }
});`,
    },
    promise: {
      label: 'Async Promise Toast',
      code: `import { toast } from 'toastory';
import 'toastory/themes/${activeTheme}.css';

toast.promise(
  deployBuild(),
  {
    loading: 'Optimizing and tree-shaking bundle...',
    success: (data) => \`Deployed build \${data.id} in 420ms!\`,
    error: (err) => \`Failed: \${err.message}\`,
    description: 'Compiling ESM + CJS subpaths with zero dependencies.'
  },
  { theme: '${activeTheme}', position: '${activePosition}' }
);`,
    },
    confirm: {
      label: 'Confirm Modal Dialog',
      code: `import { ui } from 'toastory';
import 'toastory/themes/${activeTheme}.css';

const res = await ui.confirm({
  title: 'Destroy Production Cluster?',
  text: 'This operation will terminate 12 edge worker pods. This action cannot be undone.',
  tone: 'danger',
  theme: '${activeTheme}',
  confirmButton: { label: 'Destroy Pods', color: '#dc2626' },
  cancelButton: { label: 'Keep Running' }
});

if (res.isConfirmed) {
  console.log('Confirmed');
}`,
    },
    prompt: {
      label: 'Interactive Prompt Input',
      code: `import { ui } from 'toastory';
import 'toastory/themes/${activeTheme}.css';

const res = await ui.prompt({
  title: 'Rename Project Workspace',
  text: 'Enter a unique URL slug for your project repository:',
  placeholder: 'my-toastory-app',
  theme: '${activeTheme}',
  validate: (val) => (!val || val.length < 3 ? 'Slug must be at least 3 characters' : undefined)
});

if (res.isConfirmed && res.value) {
  console.log('Slug:', res.value);
}`,
    },
    sheet: {
      label: 'Mobile Bottom Sheet',
      code: `import { ui } from 'toastory';
import 'toastory/themes/${activeTheme}.css';

ui.bottomSheet({
  title: 'Select Deployment Region',
  text: 'Choose an edge cluster nearest to your application users:',
  theme: '${activeTheme}',
  confirmButton: { label: 'Deploy to us-east' },
  cancelButton: { label: 'Cancel' }
});`,
    },
  };

  const handleCopySnippet = async () => {
    try {
      await navigator.clipboard.writeText(demoSnippets[selectedDemo].code);
      setCodeCopied(true);
      setTimeout(() => setCodeCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleThemeChange = (themeId: string) => {
    setActiveTheme(themeId);
    ui.configure({ theme: themeId });
    toast.message(`Theme changed to ${themeId}`, {
      description: 'Active styling tokens updated across all feedback components.',
      duration: 2500,
      theme: themeId,
    });
  };

  const fireSuccessToast = () => {
    setSelectedDemo('success');
    toast.success('Changes saved successfully', {
      description: 'Your configuration was synced to the cloud replica.',
      theme: activeTheme,
      position: activePosition,
      action: {
        label: 'View Logs',
        onClick: () => {
          toast.info('Opening build telemetry...');
        },
      },
    });
  };

  const fireErrorToast = () => {
    setSelectedDemo('error');
    toast.error('Build compilation failed', {
      description: 'Syntax error in src/worker.ts: unexpected token at line 42.',
      theme: activeTheme,
      position: activePosition,
      action: {
        label: 'Retry',
        onClick: () => {
          fireSuccessToast();
        },
      },
    });
  };

  const firePromiseToast = () => {
    setSelectedDemo('promise');
    const fakeAsyncAction = new Promise<{ id: string }>((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() > 0.15) {
          resolve({ id: 'bundle-892' });
        } else {
          reject(new Error('Network handshake failed'));
        }
      }, 2000);
    });

    toast.promise(
      fakeAsyncAction,
      {
        loading: 'Optimizing and tree-shaking bundle...',
        success: (data: { id: string }) => `Deployed build ${data.id} in 420ms!`,
        error: (err: unknown) => `Failed: ${(err as { message?: string })?.message || 'Error'}`,
        description: 'Compiling ESM + CJS subpaths with zero dependencies.',
      },
      {
        theme: activeTheme,
        position: activePosition,
      }
    );
  };

  const fireConfirmDialog = async () => {
    setSelectedDemo('confirm');
    const res = await ui.confirm({
      title: 'Destroy Production Cluster?',
      text: 'This operation will terminate 12 edge worker pods. This action cannot be undone.',
      tone: 'danger',
      theme: activeTheme,
      confirmButton: { label: 'Destroy Pods', color: '#dc2626' },
      cancelButton: { label: 'Keep Running' },
    });

    if (res.isConfirmed) {
      toast.error('Production cluster destroyed.', { theme: activeTheme, position: activePosition });
    } else {
      toast.info('Cluster operation cancelled.', { theme: activeTheme, position: activePosition });
    }
  };

  const firePromptDialog = async () => {
    setSelectedDemo('prompt');
    const res = await ui.prompt({
      title: 'Rename Project Workspace',
      text: 'Enter a unique URL slug for your project repository:',
      placeholder: 'my-toastory-app',
      theme: activeTheme,
      validate: (val: unknown) => {
        if (!val || typeof val !== 'string' || val.trim().length < 3) return 'Project slug must be at least 3 characters.';
        return undefined;
      },
    });

    if (res.isConfirmed && res.value) {
      toast.success(`Project renamed to "${res.value}"`, { theme: activeTheme, position: activePosition });
    }
  };

  const fireBottomSheet = () => {
    setSelectedDemo('sheet');
    ui.bottomSheet({
      title: 'Select Deployment Region',
      text: 'Choose an edge cluster nearest to your application users:',
      theme: activeTheme,
      confirmButton: { label: 'Deploy to us-east' },
      cancelButton: { label: 'Cancel' },
    });
  };

  return (
    <div className="w-full relative rounded-3xl border border-[var(--site-border)] bg-[var(--site-surface-raised)] p-6 sm:p-8 shadow-xl backdrop-blur-2xl overflow-hidden text-left">
      {/* Background ambient lighting */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Control bar */}
      <div className="relative z-10 space-y-6">
        <div>
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--site-muted)]">
              Interactive Glass Dogfooding Demo
            </span>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-[var(--site-muted)]">Stack:</span>
              <button
                type="button"
                onClick={() => {
                  const next = !isStacked;
                  setIsStacked(next);
                  ui.configure({ stack: next ? 'stacked' : 'expanded' });
                }}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                  isStacked
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-[var(--site-surface)] border border-[var(--site-border)] text-[var(--site-muted)] hover:text-[var(--site-fg)]'
                }`}
              >
                {isStacked ? 'Deck Stacked' : 'List Expanded'}
              </button>
            </div>
          </div>

          {/* Theme switcher chips */}
          <div className="flex flex-wrap items-center gap-2">
            {themes.map((t) => {
              const isSelected = activeTheme === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => handleThemeChange(t.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 scale-105 font-semibold'
                      : 'bg-[var(--site-surface)] border border-[var(--site-border)] text-[var(--site-muted)] hover:text-[var(--site-fg)] hover:border-blue-500/30'
                  }`}
                  aria-pressed={isSelected}
                >
                  {t.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Triggers Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2">
          <button
            type="button"
            onClick={fireSuccessToast}
            className="flex flex-col items-center justify-center p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-semibold text-xs sm:text-sm transition-all hover:-translate-y-0.5 active:translate-y-0"
          >
            <span className="text-base mb-1">✓</span>
            Success Toast
          </button>

          <button
            type="button"
            onClick={fireErrorToast}
            className="flex flex-col items-center justify-center p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/25 hover:bg-rose-500/20 text-rose-700 dark:text-rose-300 font-semibold text-xs sm:text-sm transition-all hover:-translate-y-0.5 active:translate-y-0"
          >
            <span className="text-base mb-1">✕</span>
            Error Alert
          </button>

          <button
            type="button"
            onClick={firePromiseToast}
            className="flex flex-col items-center justify-center p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/25 hover:bg-blue-500/20 text-blue-700 dark:text-blue-300 font-semibold text-xs sm:text-sm transition-all hover:-translate-y-0.5 active:translate-y-0"
          >
            <span className="text-base mb-1">⟳</span>
            Promise Toast
          </button>

          <button
            type="button"
            onClick={fireConfirmDialog}
            className="flex flex-col items-center justify-center p-3.5 rounded-xl bg-purple-500/10 border border-purple-500/25 hover:bg-purple-500/20 text-purple-700 dark:text-purple-300 font-semibold text-xs sm:text-sm transition-all hover:-translate-y-0.5 active:translate-y-0"
          >
            <span className="text-base mb-1">⚠</span>
            Confirm Dialog
          </button>

          <button
            type="button"
            onClick={firePromptDialog}
            className="flex flex-col items-center justify-center p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/25 hover:bg-amber-500/20 text-amber-800 dark:text-amber-300 font-semibold text-xs sm:text-sm transition-all hover:-translate-y-0.5 active:translate-y-0"
          >
            <span className="text-base mb-1">✎</span>
            Prompt Input
          </button>

          <button
            type="button"
            onClick={fireBottomSheet}
            className="flex flex-col items-center justify-center p-3.5 rounded-xl bg-cyan-500/10 border border-cyan-500/25 hover:bg-cyan-500/20 text-cyan-800 dark:text-cyan-300 font-semibold text-xs sm:text-sm transition-all hover:-translate-y-0.5 active:translate-y-0"
          >
            <span className="text-base mb-1">⇡</span>
            Bottom Sheet
          </button>
        </div>

        {/* Code Preview & Copy Toolbar */}
        <div className="pt-1">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs py-2 px-3 rounded-xl bg-[var(--site-surface)] border border-[var(--site-border)] shadow-sm">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-[var(--site-fg)]">
                Selected: {demoSnippets[selectedDemo].label}
              </span>
              <button
                type="button"
                onClick={() => setShowCode(!showCode)}
                className="text-blue-500 hover:underline font-medium ml-1"
              >
                {showCode ? 'Hide Code ▲' : 'View Code Snippet ▼'}
              </button>
            </div>

            <button
              type="button"
              onClick={handleCopySnippet}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[var(--site-surface-raised)] border border-[var(--site-border)] hover:border-blue-500/40 text-[var(--site-fg)] text-xs font-medium transition-colors shadow-sm"
              aria-label="Copy snippet"
            >
              {codeCopied ? (
                <>
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span className="text-emerald-500 font-semibold">Copied!</span>
                </>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5 text-[var(--site-muted)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                  <span>Copy Snippet</span>
                </>
              )}
            </button>
          </div>

          {showCode && (
            <div className="mt-2 rounded-xl border border-[var(--site-border)] bg-[var(--site-card-bg)] overflow-hidden shadow-inner">
              <pre className="p-3.5 text-xs font-mono overflow-x-auto text-[var(--site-fg)] leading-relaxed">
                <code>{demoSnippets[selectedDemo].code}</code>
              </pre>
            </div>
          )}
        </div>

        {/* Position pills */}
        <div className="flex flex-wrap items-center justify-between text-xs text-[var(--site-muted)] pt-3 border-t border-[var(--site-border)]">
          <div className="flex items-center gap-2">
            <span>Placement:</span>
            {(['top-right', 'top-center', 'bottom-right', 'bottom-center'] as const).map((pos) => (
              <button
                key={pos}
                type="button"
                onClick={() => {
                  setActivePosition(pos);
                  ui.configure({ position: pos });
                }}
                className={`px-2 py-0.5 rounded transition-colors ${
                  activePosition === pos
                    ? 'bg-blue-600/15 text-blue-600 dark:bg-white/20 dark:text-white font-medium'
                    : 'text-[var(--site-muted)] hover:text-[var(--site-fg)]'
                }`}
              >
                {pos}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5 text-[var(--site-muted)]">
            <span>Dismiss all:</span>
            <button
              type="button"
              onClick={() => toast.dismissAll()}
              className="text-[var(--site-muted)] hover:text-[var(--site-fg)] underline"
            >
              clear stack
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
