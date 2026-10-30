'use client';

import React, { useState, useEffect } from 'react';
import { ui, toast } from 'toastory';
import type { ToastPosition, ToastOptions } from 'toastory';
import { THEME_REGISTRY } from '@/lib/theme-generator';
import { CodeSnippet } from '@/components/CodeSnippet';

export default function PlaygroundPage() {
  const [theme, setTheme] = useState('ios-glass');
  const [mode, setMode] = useState<'dark' | 'light'>('dark');
  const [position, setPosition] = useState<ToastPosition>('top-right');
  const [stack, setStack] = useState<'stacked' | 'expanded'>('stacked');
  const [duration, setDuration] = useState(4000);
  const [richColors, setRichColors] = useState(false);
  const [invert, setInvert] = useState(false);
  const [closeButton, setCloseButton] = useState(true);
  const [dir, setDir] = useState<'ltr' | 'rtl'>('ltr');
  const [feedbackKind, setFeedbackKind] = useState<'toast' | 'promise' | 'confirm' | 'prompt' | 'alert' | 'steps' | 'sheet' | 'bottomSheet' | 'loading'>('toast');
  const [toastType, setToastType] = useState<'success' | 'error' | 'info' | 'warning' | 'loading'>('success');
  const [dialogTone, setDialogTone] = useState<'info' | 'warning' | 'danger'>('danger');
  const [promptInputType, setPromptInputType] = useState<'text' | 'email' | 'password' | 'number' | 'range' | 'select' | 'date' | 'otp'>('text');
  const [backdrop, setBackdrop] = useState<'blur' | 'dim' | 'none'>('blur');
  const [allowOutsideClick, setAllowOutsideClick] = useState(true);
  const [allowEscape, setAllowEscape] = useState(true);
  const [draggable, setDraggable] = useState(false);
  const [reverseButtons, setReverseButtons] = useState(false);
  const [swipeEnabled, setSwipeEnabled] = useState(true);
  const [title, setTitle] = useState('Deployment Finished');
  const [description, setDescription] = useState('All 24 microservices updated in us-east-1.');
  const [actionLabel, setActionLabel] = useState('View Telemetry');
  const [cancelLabel, setCancelLabel] = useState('Dismiss');
  const [progress, setProgress] = useState<'none' | 'bar' | 'ring'>('bar');
  const [canvasBg, setCanvasBg] = useState<'mesh' | 'slate' | 'cyber' | 'light'>('mesh');
  const [activeCodeTab, setActiveCodeTab] = useState<'react' | 'js' | 'nextjs' | 'vue' | 'svelte' | 'native'>('react');
  const [shareFeedback, setShareFeedback] = useState(false);
  const [isPromiseLoading, setIsPromiseLoading] = useState(false);

  // Sync state from URL hash on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash) {
      const timer = setTimeout(() => {
        try {
          const decoded = JSON.parse(decodeURIComponent(window.location.hash.slice(1)));
          if (decoded.theme) setTheme(decoded.theme);
          if (decoded.mode) setMode(decoded.mode);
          if (decoded.position) setPosition(decoded.position);
          if (decoded.title) setTitle(decoded.title);
          if (decoded.description) setDescription(decoded.description);
          if (decoded.feedbackKind) setFeedbackKind(decoded.feedbackKind);
          if (decoded.duration !== undefined) setDuration(decoded.duration);
          if (decoded.richColors !== undefined) setRichColors(decoded.richColors);
          if (decoded.invert !== undefined) setInvert(decoded.invert);
          if (decoded.backdrop) setBackdrop(decoded.backdrop);
          if (decoded.promptInputType) setPromptInputType(decoded.promptInputType);
        } catch {
          // ignore invalid hash
        }
      }, 50);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleShareUrl = () => {
    const stateObj = {
      theme,
      mode,
      position,
      title,
      description,
      feedbackKind,
      duration,
      richColors,
      invert,
      backdrop,
      promptInputType,
    };
    const hash = '#' + encodeURIComponent(JSON.stringify(stateObj));
    window.location.hash = hash;
    navigator.clipboard.writeText(window.location.href);
    setShareFeedback(true);
    toast.success('Playground link copied to clipboard!');
    setTimeout(() => setShareFeedback(false), 2500);
  };

  const applyPreset = (preset: 'deployment' | 'promise' | 'danger' | 'otp' | 'wizard' | 'sheet' | 'bottomSheet' | 'loading') => {
    if (preset === 'deployment') {
      setFeedbackKind('toast');
      setToastType('success');
      setTitle('Deployment Succeeded');
      setDescription('12 edge containers live on us-east in 410ms.');
      setActionLabel('View Telemetry');
      setCancelLabel('Dismiss');
      setTheme('ios-glass');
      setRichColors(true);
      setProgress('bar');
    } else if (preset === 'promise') {
      setFeedbackKind('promise');
      setTitle('Database Migration');
      setDescription('Executing schema migration for postgresql v16 cluster.');
      setTheme('liquid-glass');
    } else if (preset === 'danger') {
      setFeedbackKind('confirm');
      setDialogTone('danger');
      setTitle('Terminate Worker Cluster?');
      setDescription('This will permanently destroy 16 active worker containers.');
      setActionLabel('Destroy Cluster');
      setCancelLabel('Cancel');
      setTheme('dialogs');
      setBackdrop('blur');
    } else if (preset === 'otp') {
      setFeedbackKind('prompt');
      setPromptInputType('otp');
      setTitle('Two-Factor Verification');
      setDescription('Enter the 6-digit authentication token generated by your app:');
      setActionLabel('Verify Token');
      setTheme('ios-glass');
      setBackdrop('blur');
    } else if (preset === 'wizard') {
      setFeedbackKind('steps');
      setTitle('Workspace Setup');
      setDescription('3-stage guided onboarding flow.');
      setTheme('aurora');
    } else if (preset === 'sheet') {
      setFeedbackKind('sheet');
      setTitle('Project Actions');
      setDescription('Choose operation for repository toastory.');
      setTheme('ios-glass');
    } else if (preset === 'bottomSheet') {
      setFeedbackKind('bottomSheet');
      setTitle('Search Filters & Sorting');
      setDescription('Refine metrics by telemetry zone, status code, and latency distribution.');
      setActionLabel('Apply Filters');
      setTheme('ios-glass');
      setBackdrop('blur');
    } else if (preset === 'loading') {
      setFeedbackKind('loading');
      setTitle('Building Project Bundle');
      setDescription('Optimizing 124 chunks with tree-shaking...');
      setTheme('ios-glass');
    }
    toast.info(`Loaded preset: ${preset}`);
  };

  const handleReset = () => {
    setTheme('ios-glass');
    setMode('dark');
    setPosition('top-right');
    setStack('stacked');
    setDuration(4000);
    setRichColors(false);
    setInvert(false);
    setCloseButton(true);
    setDir('ltr');
    setFeedbackKind('toast');
    setToastType('success');
    setDialogTone('danger');
    setPromptInputType('text');
    setBackdrop('blur');
    setAllowOutsideClick(true);
    setAllowEscape(true);
    setDraggable(false);
    setReverseButtons(false);
    setSwipeEnabled(true);
    setTitle('Deployment Finished');
    setDescription('All 24 microservices updated in us-east-1.');
    setActionLabel('View Telemetry');
    setCancelLabel('Dismiss');
    setProgress('bar');
    window.location.hash = '';
    toast.info('Playground reset to defaults.');
  };

  const handleExportJson = () => {
    const json = JSON.stringify(
      {
        theme,
        mode,
        position,
        stack,
        duration,
        richColors,
        invert,
        closeButton,
        dir,
        title,
        description,
        actionLabel,
        cancelLabel,
        feedbackKind,
        promptInputType,
        backdrop,
        allowOutsideClick,
        allowEscape,
        draggable,
        reverseButtons,
        progress,
      },
      null,
      2
    );
    navigator.clipboard.writeText(json);
    toast.success('Configuration JSON copied to clipboard!');
  };

  const handleFire = async () => {
    ui.configure({
      theme,
      mode,
      position,
      stack,
      dir,
      richColors,
      duration,
      closeButton,
    });

    if (feedbackKind === 'toast') {
      const opts: ToastOptions = {
        title,
        description,
        theme,
        position,
        duration,
        richColors,
        invert,
        closeButton,
        dir,
        swipeDirections: swipeEnabled ? ['left', 'right', 'up', 'down'] : [],
        action: actionLabel
          ? {
              label: actionLabel,
              onClick: () => toast.info(`Action clicked: ${actionLabel}`, { theme }),
            }
          : undefined,
        cancel: cancelLabel
          ? {
              label: cancelLabel,
              onClick: () => toast.info('Dismissed by user', { theme }),
            }
          : undefined,
      };
      if (progress !== 'none') opts.progress = progress === 'bar';

      if (toastType === 'success') toast.success(title, opts);
      else if (toastType === 'error') toast.error(title, opts);
      else if (toastType === 'warning') toast.warning(title, opts);
      else if (toastType === 'info') toast.info(title, opts);
      else toast.loading(title, opts);
    } else if (feedbackKind === 'promise') {
      setIsPromiseLoading(true);
      const fakePromise = new Promise<{ id: string }>((resolve, reject) => {
        setTimeout(() => {
          setIsPromiseLoading(false);
          if (toastType === 'error') reject(new Error('Process terminated with error code 1'));
          else resolve({ id: 'tx_98412' });
        }, 2200);
      });

      toast.promise(
        fakePromise,
        {
          loading: 'Executing async operation...',
          success: (data) => `Completed successfully! (Ref: ${data.id})`,
          error: (err) => `Failed: ${(err as Error).message}`,
          description,
        },
        { theme, position, duration, richColors }
      );
    } else if (feedbackKind === 'confirm') {
      const res = await ui.confirm({
        title,
        text: description,
        theme,
        tone: dialogTone,
        backdrop,
        allowOutsideClick,
        allowEscape,
        draggable,
        reverseButtons,
        confirmButton: { label: actionLabel || 'Confirm Action' },
        cancelButton: { label: cancelLabel || 'Dismiss' },
      });
      if (res.isConfirmed) toast.success('Confirmed by user!', { theme });
      else toast.info('Action was dismissed.', { theme });
    } else if (feedbackKind === 'alert') {
      await ui.alert({
        title,
        text: description,
        theme,
        tone: dialogTone,
        backdrop,
        allowOutsideClick,
        allowEscape,
        draggable,
        confirmButton: { label: actionLabel || 'Acknowledge' },
      });
    } else if (feedbackKind === 'prompt') {
      const res = await ui.prompt({
        title,
        text: description,
        input: promptInputType,
        placeholder: 'Type value here...',
        theme,
        backdrop,
        allowOutsideClick,
        allowEscape,
        draggable,
        options: promptInputType === 'select' ? { standard: 'Standard Tier', pro: 'Pro ($29/mo)', enterprise: 'Enterprise' } : undefined,
        validate: (val) => (!val ? 'Input cannot be empty' : undefined),
      });
      if (res.isConfirmed) {
        toast.success(`Received input: "${res.value}"`, { theme });
      }
    } else if (feedbackKind === 'steps') {
      const res = await ui.steps([
        { title: 'Step 1 of 3: Workspace', text: 'Enter team workspace name:', input: 'text', placeholder: 'Acme Inc' },
        { title: 'Step 2 of 3: Plan', text: 'Select team billing tier:', input: 'select', options: { pro: 'Pro ($20/mo)', enterprise: 'Enterprise ($80/mo)' } },
        { title: 'Step 3 of 3: Confirmation', text: 'Review parameters and provision infrastructure.' },
      ]);
      if (res.isConfirmed) {
        toast.success('Wizard completed successfully!', { theme });
      }
    } else if (feedbackKind === 'sheet') {
      const res = await ui.sheet({
        title,
        message: description,
        theme,
        actions: [
          { label: 'Primary Operation', value: 'primary' },
          { label: 'Secondary Operation', value: 'secondary' },
          { label: 'Destructive Action', value: 'delete', style: 'destructive' },
        ],
        cancelLabel: 'Cancel',
      });
      if (res.value) {
        toast.info(`Selected action: "${res.value}"`, { theme });
      }
    } else if (feedbackKind === 'bottomSheet') {
      ui.bottomSheet({
        title,
        text: description,
        theme,
        backdrop,
        snapPoints: [0.4, 0.85],
        confirmButton: { label: actionLabel || 'Apply Settings' },
      });
    } else if (feedbackKind === 'loading') {
      const handle = ui.loading({
        text: 'Compiling project bundle...',
        progress: 0.25,
      });
      setTimeout(() => handle.update({ progress: 0.75, text: 'Optimizing modules...' }), 1200);
      setTimeout(() => {
        handle.close();
        toast.success('Loading operation finished!', { theme });
      }, 2500);
    }
  };

  // Generate dynamic code for the active tab
  const getGeneratedSnippet = () => {
    if (activeCodeTab === 'react') {
      if (feedbackKind === 'toast') {
        return `import { Toaster, toast } from 'toastory/react';
import 'toastory/themes/${theme}.css';

export default function App() {
  const showFeedback = () => {
    toast.${toastType}('${title}', {
      description: '${description}',
      duration: ${duration},
      richColors: ${richColors},
      invert: ${invert},
      closeButton: ${closeButton},
      position: '${position}',
      ${progress !== 'none' ? `progress: ${progress === 'bar'},` : ''}
      ${actionLabel ? `action: { label: '${actionLabel}', onClick: () => console.log('Action triggered') },` : ''}
      ${cancelLabel ? `cancel: { label: '${cancelLabel}' },` : ''}
    });
  };

  return (
    <>
      <Toaster theme="${theme}" mode="${mode}" position="${position}" />
      <button onClick={showFeedback}>Trigger Notification</button>
    </>
  );
}`;
      }

      if (feedbackKind === 'confirm' || feedbackKind === 'alert') {
        return `import { ui } from 'toastory';
import 'toastory/themes/${theme}.css';

export default function Confirmation() {
  const handleAction = async () => {
    const res = await ui.${feedbackKind === 'confirm' ? 'confirm' : 'alert'}({
      title: '${title}',
      text: '${description}',
      tone: '${dialogTone}',
      backdrop: '${backdrop}',
      draggable: ${draggable},
      reverseButtons: ${reverseButtons},
      confirmButton: { label: '${actionLabel || 'Confirm'}' }
    });
    if (res.isConfirmed) {
      console.log('Confirmed');
    }
  };

  return <button onClick={handleAction}>Open Modal</button>;
}`;
      }

      if (feedbackKind === 'prompt') {
        return `import { ui } from 'toastory';
import 'toastory/themes/${theme}.css';

export default function PromptExample() {
  const askInput = async () => {
    const res = await ui.prompt({
      title: '${title}',
      text: '${description}',
      input: '${promptInputType}',
      backdrop: '${backdrop}',
      validate: (val) => (!val ? 'Input required' : undefined)
    });
    if (res.isConfirmed) {
      console.log('Input value:', res.value);
    }
  };

  return <button onClick={askInput}>Open Prompt</button>;
}`;
      }

      if (feedbackKind === 'bottomSheet') {
        return `import { ui } from 'toastory';
import 'toastory/themes/${theme}.css';

export default function SheetExample() {
  const openSheet = () => {
    ui.bottomSheet({
      title: '${title}',
      text: '${description}',
      backdrop: '${backdrop}',
      snapPoints: [0.4, 0.85],
      confirmButton: { label: '${actionLabel || 'Done'}' }
    });
  };

  return <button onClick={openSheet}>Open Bottom Sheet</button>;
}`;
      }
    }

    if (activeCodeTab === 'js') {
      if (feedbackKind === 'toast') {
        return `import { toast, ui } from 'toastory';
import 'toastory/themes/${theme}.css';

ui.configure({ theme: '${theme}', mode: '${mode}', position: '${position}' });

toast.${toastType}('${title}', {
  description: '${description}',
  duration: ${duration},
  richColors: ${richColors},
  closeButton: ${closeButton}
});`;
      }
      return `import { ui } from 'toastory';
import 'toastory/themes/${theme}.css';

const res = await ui.${feedbackKind === 'bottomSheet' ? 'bottomSheet' : feedbackKind === 'steps' ? 'steps' : feedbackKind === 'prompt' ? 'prompt' : 'confirm'}({
  title: '${title}',
  text: '${description}',
  theme: '${theme}'
});`;
    }

    if (activeCodeTab === 'nextjs') {
      return `// app/layout.tsx (Server or Client)
import { Toaster } from 'toastory/react';
import 'toastory/themes/${theme}.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Toaster theme="${theme}" mode="${mode}" position="${position}" richColors={${richColors}} />
        {children}
      </body>
    </html>
  );
}`;
    }

    if (activeCodeTab === 'vue') {
      return `<script setup>
import { ui, toast } from 'toastory';
import 'toastory/themes/${theme}.css';

const notify = () => {
  toast.${toastType}('${title}', {
    description: '${description}',
    duration: ${duration},
    richColors: ${richColors}
  });
};
</script>

<template>
  <button @click="notify">Show Toast</button>
</template>`;
    }

    if (activeCodeTab === 'svelte') {
      return `<script>
  import { ui, toast } from 'toastory';
  import 'toastory/themes/${theme}.css';

  const trigger = () => toast.${toastType}('${title}', {
    description: '${description}',
    duration: ${duration}
  });
</script>

<button on:click={trigger}>Notify</button>`;
    }

    return `import { Toaster, toast } from 'toastory/native';

export default function NativeScreen() {
  return (
    <View>
      <Toaster theme="${theme}" />
      <Button
        title="Notify"
        onPress={() => toast.${toastType}('${title}', { description: '${description}' })}
      />
    </View>
  );
}`;
  };

  const canvasBackgrounds = {
    mesh: 'bg-gradient-to-br from-[#0c0d16] via-[#121424] to-[#0a0a12]',
    slate: 'bg-[#18181b]',
    cyber: 'bg-gradient-to-tr from-[#020b14] via-[#0b192e] to-[#002233]',
    light: 'bg-slate-100 text-slate-900',
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20 text-left transition-colors">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 border-b border-[var(--site-border)] pb-6">
        <div>
          <span className="text-xs font-semibold text-blue-500 uppercase tracking-wider">Interactive Studio</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--site-fg)] tracking-tight mt-1">
            Live Playground & Studio
          </h1>
          <p className="text-sm text-[var(--site-muted)] mt-1">
            Configure every parameter live, dogfood the real package, and generate copyable multi-framework snippets.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleShareUrl}
            className="px-3.5 py-2 rounded-xl bg-[var(--site-surface-raised)] border border-[var(--site-border)] hover:bg-[var(--site-surface)] text-[var(--site-fg)] font-medium text-xs transition-colors flex items-center gap-1.5"
          >
            <span>{shareFeedback ? '✓ Copied URL' : 'Share State'}</span>
          </button>
          <button
            type="button"
            onClick={handleExportJson}
            className="px-3.5 py-2 rounded-xl bg-[var(--site-surface-raised)] border border-[var(--site-border)] hover:bg-[var(--site-surface)] text-[var(--site-fg)] font-medium text-xs transition-colors"
          >
            Export JSON
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="px-3.5 py-2 rounded-xl text-[var(--site-muted)] hover:text-[var(--site-fg)] hover:bg-[var(--site-surface-raised)] text-xs transition-colors"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Quick Scenario Presets */}
      <div className="mb-8 p-4 rounded-2xl border border-[var(--site-border)] bg-[var(--site-surface-raised)]">
        <span className="text-xs font-semibold uppercase tracking-wider text-[var(--site-muted)] block mb-3">
          Quick Scenario Presets:
        </span>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => applyPreset('deployment')}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors"
          >
            ✓ Success Notification
          </button>
          <button
            type="button"
            onClick={() => applyPreset('promise')}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-500/10 text-blue-500 border border-blue-500/20 hover:bg-blue-500/20 transition-colors"
          >
            ↻ Async Promise Flow
          </button>
          <button
            type="button"
            onClick={() => applyPreset('danger')}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20 transition-colors"
          >
            ⚠ Destructive Confirm
          </button>
          <button
            type="button"
            onClick={() => applyPreset('otp')}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-purple-500/10 text-purple-500 border border-purple-500/20 hover:bg-purple-500/20 transition-colors"
          >
            # 2FA OTP Prompt
          </button>
          <button
            type="button"
            onClick={() => applyPreset('wizard')}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-amber-500/10 text-amber-500 border border-amber-500/20 hover:bg-amber-500/20 transition-colors"
          >
            ⤹ 3-Step Wizard
          </button>
          <button
            type="button"
            onClick={() => applyPreset('sheet')}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-cyan-500/10 text-cyan-500 border border-cyan-500/20 hover:bg-cyan-500/20 transition-colors"
          >
            ☰ Action Sheet
          </button>
          <button
            type="button"
            onClick={() => applyPreset('bottomSheet')}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 hover:bg-indigo-500/20 transition-colors"
          >
            ⌃ Bottom Sheet
          </button>
          <button
            type="button"
            onClick={() => applyPreset('loading')}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-teal-500/10 text-teal-500 border border-teal-500/20 hover:bg-teal-500/20 transition-colors"
          >
            ⚙ Loading Overlay
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Controls Panel (5 cols) */}
        <div className="lg:col-span-5 p-6 rounded-2xl border border-[var(--site-border)] bg-[var(--site-card-bg)] space-y-6">
          <div className="text-sm font-bold text-[var(--site-fg)] border-b border-[var(--site-border)] pb-3 flex items-center justify-between">
            <span>Feedback Configuration</span>
            <span className="text-xs font-normal text-blue-500 font-mono">21 themes loaded</span>
          </div>

          {/* Feedback Kind */}
          <div>
            <label className="block text-xs font-semibold text-[var(--site-muted)] mb-2">Component Kind (9 Available)</label>
            <div className="grid grid-cols-3 gap-1.5 bg-[var(--site-surface-raised)] p-1.5 rounded-xl border border-[var(--site-border)] text-xs">
              {(['toast', 'promise', 'confirm', 'prompt', 'alert', 'steps', 'sheet', 'bottomSheet', 'loading'] as const).map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => setFeedbackKind(k)}
                  className={`py-1.5 rounded-lg capitalize transition-colors font-medium text-[11px] ${
                    feedbackKind === k ? 'bg-blue-600 text-white font-semibold shadow-sm' : 'text-[var(--site-muted)] hover:text-[var(--site-fg)]'
                  }`}
                >
                  {k === 'bottomSheet' ? 'Bottom Sheet' : k}
                </button>
              ))}
            </div>
          </div>

          {/* Theme Selector */}
          <div>
            <label className="block text-xs font-semibold text-[var(--site-muted)] mb-1.5">Theme Preset (21)</label>
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="w-full bg-[var(--site-input-bg)] border border-[var(--site-border)] rounded-xl px-3 py-2 text-sm text-[var(--site-fg)] focus:outline-none"
            >
              {THEME_REGISTRY.map((t) => (
                <option key={t.name} value={t.name}>
                  {t.name} ({t.category})
                </option>
              ))}
            </select>
          </div>

          {/* Mode & Stacking */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--site-muted)] mb-1.5">Color Mode</label>
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value as 'dark' | 'light')}
                className="w-full bg-[var(--site-input-bg)] border border-[var(--site-border)] rounded-xl px-3 py-2 text-sm text-[var(--site-fg)] focus:outline-none"
              >
                <option value="dark">Dark</option>
                <option value="light">Light</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--site-muted)] mb-1.5">Stack Mode</label>
              <select
                value={stack}
                onChange={(e) => setStack(e.target.value as 'stacked' | 'expanded')}
                className="w-full bg-[var(--site-input-bg)] border border-[var(--site-border)] rounded-xl px-3 py-2 text-sm text-[var(--site-fg)] focus:outline-none"
              >
                <option value="stacked">Stacked Deck</option>
                <option value="expanded">Expanded List</option>
              </select>
            </div>
          </div>

          {/* Position */}
          <div>
            <label className="block text-xs font-semibold text-[var(--site-muted)] mb-1.5">Screen Placement (6 Positions)</label>
            <select
              value={position}
              onChange={(e) => setPosition(e.target.value as ToastPosition)}
              className="w-full bg-[var(--site-input-bg)] border border-[var(--site-border)] rounded-xl px-3 py-2 text-sm text-[var(--site-fg)] focus:outline-none font-mono text-xs"
            >
              <option value="top-right">top-right</option>
              <option value="top-center">top-center</option>
              <option value="top-left">top-left</option>
              <option value="bottom-right">bottom-right</option>
              <option value="bottom-center">bottom-center</option>
              <option value="bottom-left">bottom-left</option>
            </select>
          </div>

          {/* Dialog Specific Options */}
          {(feedbackKind === 'confirm' || feedbackKind === 'alert' || feedbackKind === 'prompt' || feedbackKind === 'bottomSheet') && (
            <div className="space-y-4 pt-2 border-t border-[var(--site-border-subtle)]">
              {(feedbackKind === 'confirm' || feedbackKind === 'alert') && (
                <div>
                  <label className="block text-xs font-semibold text-[var(--site-muted)] mb-1.5">Dialog Tone</label>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    {(['danger', 'warning', 'info'] as const).map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setDialogTone(t)}
                        className={`py-1.5 rounded-lg capitalize transition-colors font-medium ${
                          dialogTone === t ? 'bg-blue-600 text-white font-semibold' : 'bg-[var(--site-surface-raised)] text-[var(--site-muted)]'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {feedbackKind === 'prompt' && (
                <div>
                  <label className="block text-xs font-semibold text-[var(--site-muted)] mb-1.5">Prompt Input Type</label>
                  <select
                    value={promptInputType}
                    onChange={(e) => setPromptInputType(e.target.value as typeof promptInputType)}
                    className="w-full bg-[var(--site-input-bg)] border border-[var(--site-border)] rounded-xl px-3 py-2 text-sm text-[var(--site-fg)]"
                  >
                    <option value="text">Text Input</option>
                    <option value="email">Email Address</option>
                    <option value="password">Password (Masked)</option>
                    <option value="number">Numeric Input</option>
                    <option value="range">Range Slider</option>
                    <option value="select">Dropdown Select</option>
                    <option value="date">Date Picker</option>
                    <option value="otp">6-Cell Discrete OTP</option>
                  </select>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[var(--site-muted)] mb-1.5">Backdrop Style</label>
                  <select
                    value={backdrop}
                    onChange={(e) => setBackdrop(e.target.value as 'blur' | 'dim' | 'none')}
                    className="w-full bg-[var(--site-input-bg)] border border-[var(--site-border)] rounded-xl px-3 py-2 text-xs text-[var(--site-fg)]"
                  >
                    <option value="blur">Blur Backdrop</option>
                    <option value="dim">Dim Overlay</option>
                    <option value="none">No Backdrop</option>
                  </select>
                </div>

                <div className="flex flex-col gap-2 pt-1 text-xs">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={allowOutsideClick}
                      onChange={(e) => setAllowOutsideClick(e.target.checked)}
                      className="rounded accent-blue-500"
                    />
                    <span>Outside Click</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={draggable}
                      onChange={(e) => setDraggable(e.target.checked)}
                      className="rounded accent-blue-500"
                    />
                    <span>Draggable Modal</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Toast Specific Options */}
          {(feedbackKind === 'toast' || feedbackKind === 'promise') && (
            <div className="space-y-4 pt-2 border-t border-[var(--site-border-subtle)]">
              <div>
                <label className="block text-xs font-semibold text-[var(--site-muted)] mb-1.5">Toast Semantic Variant</label>
                <div className="grid grid-cols-5 gap-1 text-xs">
                  {(['success', 'error', 'warning', 'info', 'loading'] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setToastType(t)}
                      className={`py-1.5 rounded-lg capitalize transition-colors font-medium text-[11px] ${
                        toastType === t ? 'bg-blue-600 text-white font-semibold' : 'bg-[var(--site-surface-raised)] text-[var(--site-muted)] hover:text-[var(--site-fg)]'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs text-[var(--site-muted)] mb-1">
                  <span>Auto-dismiss Duration</span>
                  <span className="font-mono">{duration ? `${duration} ms` : 'Persistent (0)'}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10000"
                  step="500"
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="w-full accent-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[var(--site-muted)] mb-1.5">Progress Track</label>
                  <select
                    value={progress}
                    onChange={(e) => setProgress(e.target.value as 'none' | 'bar' | 'ring')}
                    className="w-full bg-[var(--site-input-bg)] border border-[var(--site-border)] rounded-xl px-3 py-2 text-xs text-[var(--site-fg)]"
                  >
                    <option value="none">none</option>
                    <option value="bar">linear bar</option>
                    <option value="ring">radial ring</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--site-muted)] mb-1.5">Text Direction</label>
                  <select
                    value={dir}
                    onChange={(e) => setDir(e.target.value as 'ltr' | 'rtl')}
                    className="w-full bg-[var(--site-input-bg)] border border-[var(--site-border)] rounded-xl px-3 py-2 text-xs text-[var(--site-fg)]"
                  >
                    <option value="ltr">LTR (Left to Right)</option>
                    <option value="rtl">RTL (Right to Left)</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-1 text-xs">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={richColors}
                    onChange={(e) => setRichColors(e.target.checked)}
                    className="rounded accent-blue-500"
                  />
                  <span>Rich Colors</span>
                </label>

                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={invert}
                    onChange={(e) => setInvert(e.target.checked)}
                    className="rounded accent-blue-500"
                  />
                  <span>Invert Colors</span>
                </label>

                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={closeButton}
                    onChange={(e) => setCloseButton(e.target.checked)}
                    className="rounded accent-blue-500"
                  />
                  <span>Close &apos;X&apos;</span>
                </label>

                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={swipeEnabled}
                    onChange={(e) => setSwipeEnabled(e.target.checked)}
                    className="rounded accent-blue-500"
                  />
                  <span>Swipe Physics</span>
                </label>
              </div>
            </div>
          )}

          {/* Title & Description text */}
          <div className="space-y-3 pt-2 border-t border-[var(--site-border-subtle)]">
            <div>
              <label className="block text-xs font-semibold text-[var(--site-muted)] mb-1">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-[var(--site-input-bg)] border border-[var(--site-border)] rounded-xl px-3 py-2 text-sm text-[var(--site-fg)]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--site-muted)] mb-1">Description / Body Text</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-[var(--site-input-bg)] border border-[var(--site-border)] rounded-xl px-3 py-2 text-sm text-[var(--site-fg)]"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[var(--site-muted)] mb-1">Action Button</label>
                <input
                  type="text"
                  value={actionLabel}
                  onChange={(e) => setActionLabel(e.target.value)}
                  placeholder="e.g. Confirm, Undo"
                  className="w-full bg-[var(--site-input-bg)] border border-[var(--site-border)] rounded-xl px-3 py-2 text-sm text-[var(--site-fg)]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[var(--site-muted)] mb-1">Cancel Button</label>
                <input
                  type="text"
                  value={cancelLabel}
                  onChange={(e) => setCancelLabel(e.target.value)}
                  placeholder="e.g. Dismiss, Cancel"
                  className="w-full bg-[var(--site-input-bg)] border border-[var(--site-border)] rounded-xl px-3 py-2 text-sm text-[var(--site-fg)]"
                />
              </div>
            </div>
          </div>

          {/* Fire Feedback Button */}
          <button
            type="button"
            onClick={handleFire}
            className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all shadow-lg shadow-blue-500/25 active:scale-[0.99] flex items-center justify-center gap-2"
          >
            <span>Trigger Feedback in Browser</span>
            <span>↵</span>
          </button>
        </div>

        {/* RIGHT COLUMN: Live In-Canvas Render & Code Preview (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Live In-Canvas Preview */}
          <div className="rounded-2xl border border-[var(--site-border)] overflow-hidden shadow-2xl bg-[var(--site-card-bg)]">
            <div className="px-4 py-3 bg-[var(--site-surface-raised)] border-b border-[var(--site-border)] flex items-center justify-between text-xs text-[var(--site-muted)]">
              <span className="font-semibold text-[var(--site-fg)]">Live In-Canvas Simulation</span>
              <div className="flex items-center gap-1.5">
                <span>Backdrop:</span>
                {(['mesh', 'slate', 'cyber', 'light'] as const).map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => setCanvasBg(b)}
                    className={`px-2 py-0.5 rounded text-[11px] capitalize transition-colors ${
                      canvasBg === b ? 'bg-blue-600 text-white font-medium' : 'text-[var(--site-muted)] hover:text-[var(--site-fg)]'
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>

            {/* Canvas Surface with Real Theme Container */}
            <div
              className={`p-8 sm:p-12 min-h-[360px] flex items-center justify-center relative overflow-hidden transition-colors ${canvasBackgrounds[canvasBg]}`}
              data-gk-theme={theme}
            >
              {/* Simulated Live Toast Card */}
              {feedbackKind === 'toast' && (
                <div
                  className="gk-toast relative w-full max-w-md pointer-events-auto shadow-2xl transition-all"
                  data-type={toastType}
                  data-rich={richColors ? 'true' : undefined}
                  data-wrap={(description || (actionLabel && cancelLabel)) ? '' : undefined}
                  data-has-close={closeButton ? '' : undefined}
                >
                  <div className="gk-icon text-lg">
                    {toastType === 'success' && '✓'}
                    {toastType === 'error' && '✕'}
                    {toastType === 'warning' && '⚠'}
                    {toastType === 'info' && 'ℹ'}
                    {toastType === 'loading' && '↻'}
                  </div>
                  <div className="gk-content">
                    <div className="gk-title font-semibold">{title}</div>
                    {description && <div className="gk-desc text-xs mt-0.5">{description}</div>}
                  </div>
                  {(actionLabel || cancelLabel) && (
                    <div className="gk-actions">
                      {cancelLabel && (
                        <button
                          type="button"
                          className="gk-btn gk-cancel text-xs font-medium px-2.5 py-1 rounded"
                        >
                          {cancelLabel}
                        </button>
                      )}
                      {actionLabel && (
                        <button
                          type="button"
                          onClick={handleFire}
                          className="gk-btn gk-action text-xs font-medium px-2.5 py-1 rounded"
                        >
                          {actionLabel}
                        </button>
                      )}
                    </div>
                  )}
                  {closeButton && (
                    <button type="button" className="gk-close text-xs" aria-label="Close">
                      ✕
                    </button>
                  )}
                  {progress === 'bar' && (
                    <div className="gk-progress">
                      <i style={{ animationDuration: `${duration}ms` }} />
                    </div>
                  )}
                </div>
              )}

              {/* Simulated Live Promise Card */}
              {feedbackKind === 'promise' && (
                <div
                  className="gk-toast relative w-full max-w-md shadow-2xl"
                  data-type={isPromiseLoading ? 'loading' : 'success'}
                  data-wrap={description ? '' : undefined}
                >
                  <div className="gk-icon text-lg">{isPromiseLoading ? '↻' : '✓'}</div>
                  <div className="gk-content">
                    <div className="gk-title font-semibold">{isPromiseLoading ? 'Executing async operation...' : title}</div>
                    {description && <div className="gk-desc text-xs mt-0.5">{description}</div>}
                  </div>
                </div>
              )}

              {/* Simulated Live Dialog (Confirm / Alert / Prompt) */}
              {(feedbackKind === 'confirm' || feedbackKind === 'alert' || feedbackKind === 'prompt') && (
                <div className="gk-dialog relative w-full max-w-md p-6 shadow-2xl rounded-2xl" data-tone={dialogTone}>
                  <div className="gk-dialog-icon text-center text-3xl mb-3">
                    {dialogTone === 'danger' ? '⚠' : dialogTone === 'warning' ? '⚡' : 'ℹ'}
                  </div>
                  <h3 className="gk-dialog-title font-bold text-center text-base mb-1">{title}</h3>
                  <p className="gk-dialog-text text-xs text-center mb-4">{description}</p>

                  {feedbackKind === 'prompt' && (
                    <div className="mb-4">
                      {promptInputType === 'range' ? (
                        <div className="space-y-1">
                          <input type="range" className="w-full accent-blue-500" defaultValue="50" />
                          <div className="flex justify-between text-[10px] text-[var(--site-muted)]">
                            <span>0</span>
                            <span>50</span>
                            <span>100</span>
                          </div>
                        </div>
                      ) : promptInputType === 'select' ? (
                        <select className="w-full px-3 py-2 rounded-lg border border-[var(--site-border)] bg-[var(--site-surface-raised)] text-xs text-[var(--site-fg)]">
                          <option>Standard Tier</option>
                          <option>Pro ($29/mo)</option>
                          <option>Enterprise</option>
                        </select>
                      ) : promptInputType === 'otp' ? (
                        <div className="flex justify-center gap-2">
                          {[1, 2, 3, 4, 5, 6].map((i) => (
                            <input
                              key={i}
                              type="text"
                              maxLength={1}
                              defaultValue={i <= 2 ? `${i}` : ''}
                              className="w-8 h-9 text-center font-mono font-bold text-sm rounded-lg border border-[var(--site-border)] bg-[var(--site-surface-raised)] text-[var(--site-fg)]"
                            />
                          ))}
                        </div>
                      ) : (
                        <input
                          type={promptInputType === 'password' ? 'password' : promptInputType === 'number' ? 'number' : promptInputType === 'date' ? 'date' : 'text'}
                          placeholder="Type value here..."
                          defaultValue={promptInputType === 'email' ? 'user@toastory.dev' : ''}
                          className="w-full px-3 py-2 rounded-lg border border-[var(--site-border)] bg-[var(--site-surface-raised)] text-xs text-[var(--site-fg)]"
                          readOnly
                        />
                      )}
                    </div>
                  )}

                  <div className="gk-dialog-actions flex gap-2 justify-center">
                    {feedbackKind === 'confirm' && (
                      <button type="button" className="gk-btn gk-cancel flex-1 text-xs py-2 rounded-lg font-medium">
                        {cancelLabel || 'Dismiss'}
                      </button>
                    )}
                    <button type="button" onClick={handleFire} className="gk-btn gk-confirm flex-1 text-xs py-2 rounded-lg font-semibold bg-blue-600 text-white">
                      {actionLabel || (feedbackKind === 'alert' ? 'Acknowledge' : 'Confirm')}
                    </button>
                  </div>
                </div>
              )}

              {/* Simulated Multi-Step Wizard */}
              {feedbackKind === 'steps' && (
                <div className="gk-dialog relative w-full max-w-md p-6 shadow-2xl rounded-2xl">
                  <div className="flex justify-between items-center mb-4 text-xs font-semibold text-blue-500">
                    <span>Step 1 of 3</span>
                    <div className="flex gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-blue-600" />
                      <span className="w-2 h-2 rounded-full bg-white/20" />
                      <span className="w-2 h-2 rounded-full bg-white/20" />
                    </div>
                  </div>
                  <h3 className="font-bold text-base mb-1">Workspace Setup</h3>
                  <p className="text-xs text-[var(--site-muted)] mb-4">Enter team workspace name:</p>
                  <input
                    type="text"
                    value="Acme Design Corp"
                    readOnly
                    className="w-full px-3 py-2 rounded-lg border border-[var(--site-border)] bg-[var(--site-surface-raised)] text-xs mb-4"
                  />
                  <div className="flex gap-2">
                    <button type="button" className="gk-btn flex-1 text-xs py-2 rounded-lg" disabled>
                      Back
                    </button>
                    <button type="button" onClick={handleFire} className="gk-btn gk-confirm flex-1 text-xs py-2 rounded-lg bg-blue-600 text-white font-semibold">
                      Next Step →
                    </button>
                  </div>
                </div>
              )}

              {/* Simulated Action Sheet */}
              {feedbackKind === 'sheet' && (
                <div className="gk-sheet relative w-full max-w-sm p-4 shadow-2xl rounded-2xl flex flex-col gap-2">
                  <div className="text-center font-semibold text-xs text-[var(--site-muted)]">{title}</div>
                  <div className="gk-sheet-group flex flex-col rounded-xl overflow-hidden border border-[var(--site-border)]">
                    <button type="button" className="gk-sheet-action py-2.5 text-xs text-blue-500 text-center border-b border-[var(--site-border)]">
                      Primary Operation
                    </button>
                    <button type="button" className="gk-sheet-action py-2.5 text-xs text-blue-500 text-center border-b border-[var(--site-border)]">
                      Secondary Operation
                    </button>
                    <button type="button" className="gk-sheet-action py-2.5 text-xs text-red-500 text-center font-medium">
                      Destructive Action
                    </button>
                  </div>
                  <button type="button" className="gk-sheet-cancel py-2 text-xs font-semibold text-center rounded-xl bg-[var(--site-surface-raised)]">
                    Cancel
                  </button>
                </div>
              )}

              {/* Simulated Mobile Bottom Sheet */}
              {feedbackKind === 'bottomSheet' && (
                <div className="gk-sheet relative w-full max-w-md p-5 shadow-2xl rounded-t-3xl border-t border-[var(--site-border)] bg-[var(--site-surface)] flex flex-col gap-3">
                  {/* Top Grab Handle */}
                  <div className="w-10 h-1 bg-[var(--site-muted)] rounded-full mx-auto opacity-50 mb-1" />
                  <div className="font-bold text-sm text-[var(--site-fg)]">{title}</div>
                  <p className="text-xs text-[var(--site-muted)]">{description}</p>
                  <div className="p-3 rounded-xl border border-[var(--site-border)] bg-[var(--site-surface-raised)] text-xs flex justify-between items-center">
                    <span>Region: <strong>US East</strong></span>
                    <span className="text-blue-500 font-medium">Change</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleFire}
                    className="w-full py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-xs shadow-md"
                  >
                    {actionLabel || 'Apply Settings'}
                  </button>
                </div>
              )}

              {/* Simulated Loading Overlay */}
              {feedbackKind === 'loading' && (
                <div className="gk-loading relative p-6 shadow-2xl rounded-2xl flex flex-col items-center gap-3">
                  <div className="text-2xl animate-spin">↻</div>
                  <div className="text-xs font-medium">{title}</div>
                  <div className="text-[11px] text-[var(--site-muted)]">{description}</div>
                  <div className="gk-loading-bar w-48 h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full w-2/3" />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Generated Code Section */}
          <div className="rounded-2xl border border-[var(--site-border)] bg-[var(--site-code-bg)] p-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--site-border)] pb-3 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--site-muted)]">
                Generated Code Snippet
              </span>

              {/* Framework tabs */}
              <div className="flex items-center gap-1 text-xs">
                {(['react', 'js', 'nextjs', 'vue', 'svelte', 'native'] as const).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveCodeTab(tab)}
                    className={`px-2.5 py-1 rounded-lg capitalize transition-colors ${
                      activeCodeTab === tab ? 'bg-blue-600 text-white font-medium' : 'text-[var(--site-muted)] hover:text-[var(--site-fg)]'
                    }`}
                  >
                    {tab === 'nextjs' ? 'Next.js' : tab === 'native' ? 'React Native' : tab}
                  </button>
                ))}
              </div>
            </div>

            <CodeSnippet code={getGeneratedSnippet()} language={activeCodeTab === 'vue' || activeCodeTab === 'svelte' ? 'html' : 'typescript'} />
          </div>
        </div>
      </div>
    </div>
  );
}
