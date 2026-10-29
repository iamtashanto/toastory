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
  const [dir, setDir] = useState<'ltr' | 'rtl'>('ltr');
  const [feedbackKind, setFeedbackKind] = useState<'toast' | 'confirm' | 'prompt' | 'sheet'>('toast');
  const [toastType, setToastType] = useState<'success' | 'error' | 'info' | 'warning' | 'loading'>('success');
  const [title, setTitle] = useState('Deployment Finished');
  const [description, setDescription] = useState('All 24 microservices updated in us-east-1.');
  const [progress, setProgress] = useState<'none' | 'bar' | 'ring'>('none');
  const [canvasBg, setCanvasBg] = useState<'mesh' | 'slate' | 'cyber' | 'light'>('mesh');
  const [activeCodeTab, setActiveCodeTab] = useState<'react' | 'js' | 'nextjs' | 'vue' | 'svelte' | 'native'>('react');
  const [shareFeedback, setShareFeedback] = useState(false);

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
    };
    const hash = '#' + encodeURIComponent(JSON.stringify(stateObj));
    window.location.hash = hash;
    navigator.clipboard.writeText(window.location.href);
    setShareFeedback(true);
    toast.success('Configuration link copied to clipboard!');
    setTimeout(() => setShareFeedback(false), 2500);
  };

  const handleReset = () => {
    setTheme('ios-glass');
    setMode('dark');
    setPosition('top-right');
    setStack('stacked');
    setDuration(4000);
    setRichColors(false);
    setDir('ltr');
    setFeedbackKind('toast');
    setToastType('success');
    setTitle('Deployment Finished');
    setDescription('All 24 microservices updated in us-east-1.');
    setProgress('none');
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
        dir,
        title,
        description,
        feedbackKind,
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
    });

    if (feedbackKind === 'toast') {
      const opts: ToastOptions = {
        title,
        description,
        theme,
        position,
        duration,
        richColors,
        dir,
      };
      if (progress !== 'none') opts.progress = progress;

      if (toastType === 'success') toast.success(title, opts);
      else if (toastType === 'error') toast.error(title, opts);
      else if (toastType === 'warning') toast.warning(title, opts);
      else if (toastType === 'info') toast.info(title, opts);
      else toast.loading(title, opts);
    } else if (feedbackKind === 'confirm') {
      await ui.confirm({
        title,
        text: description,
        theme,
        tone: 'danger',
        confirmButton: { label: 'Confirm Action' },
        cancelButton: { label: 'Dismiss' },
      });
    } else if (feedbackKind === 'prompt') {
      await ui.prompt({
        title,
        text: description,
        input: 'text',
        placeholder: 'Enter response...',
        theme,
      });
    } else {
      ui.bottomSheet({
        title,
        text: description,
        theme,
        confirmButton: { label: 'Save Changes' },
      });
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
      ${progress !== 'none' ? `progress: '${progress}',\n      ` : ''}position: '${position}',
    });
  };

  return (
    <>
      <Toaster theme="${theme}" mode="${mode}" position="${position}" />
      <button onClick={showFeedback}>Trigger Notification</button>
    </>
  );
}`;
      } else {
        return `import { ui } from 'toastory/react';
import 'toastory/themes/${theme}.css';

const handleAction = async () => {
  const res = await ui.${feedbackKind === 'sheet' ? 'bottomSheet' : feedbackKind}({
    title: '${title}',
    text: '${description}',
    theme: '${theme}'
  });
};`;
      }
    }

    if (activeCodeTab === 'js') {
      return `import { ui, toast } from 'toastory';
import 'toastory/themes/${theme}.css';

// Configure once:
ui.configure({ theme: '${theme}', mode: '${mode}', position: '${position}' });

// Fire feedback:
toast.${toastType}('${title}', {
  description: '${description}',
  duration: ${duration}
});`;
    }

    if (activeCodeTab === 'nextjs') {
      return `// app/layout.tsx
import { Toaster } from 'toastory/react';
import 'toastory/themes/${theme}.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Toaster theme="${theme}" mode="${mode}" position="${position}" />
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
    description: '${description}'
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

  const trigger = () => toast.${toastType}('${title}', { description: '${description}' });
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 border-b border-white/10 pb-6">
        <div>
          <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">Interactive Studio</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-1">
            Live Playground
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Configure every parameter live, dogfood the real package, and generate copyable multi-framework snippets.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleShareUrl}
            className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium text-xs transition-colors flex items-center gap-1.5"
          >
            <span>{shareFeedback ? '✓ Copied URL' : 'Share State'}</span>
          </button>
          <button
            type="button"
            onClick={handleExportJson}
            className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium text-xs transition-colors"
          >
            Export JSON
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="px-3.5 py-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 text-xs transition-colors"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Controls Panel (5 cols) */}
        <div className="lg:col-span-5 p-6 rounded-2xl border border-white/10 bg-[#10121b] space-y-6">
          <div className="text-sm font-bold text-white border-b border-white/10 pb-3 flex items-center justify-between">
            <span>Feedback Configuration</span>
            <span className="text-xs font-normal text-blue-400 font-mono">21 themes loaded</span>
          </div>

          {/* Feedback Kind */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-2">Component Mode</label>
            <div className="grid grid-cols-4 gap-1.5 bg-black/40 p-1 rounded-xl border border-white/10 text-xs">
              {(['toast', 'confirm', 'prompt', 'sheet'] as const).map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => setFeedbackKind(k)}
                  className={`py-1.5 rounded-lg capitalize transition-colors font-medium ${
                    feedbackKind === k ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {k}
                </button>
              ))}
            </div>
          </div>

          {/* Theme Selector */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1.5">Theme Preset</label>
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="w-full bg-[#181a26] border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none"
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
              <label className="block text-xs font-semibold text-gray-400 mb-1.5">Mode</label>
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value as 'dark' | 'light')}
                className="w-full bg-[#181a26] border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none"
              >
                <option value="dark">Dark</option>
                <option value="light">Light</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1.5">Stack Mode</label>
              <select
                value={stack}
                onChange={(e) => setStack(e.target.value as 'stacked' | 'expanded')}
                className="w-full bg-[#181a26] border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none"
              >
                <option value="stacked">Stacked Deck</option>
                <option value="expanded">Expanded List</option>
              </select>
            </div>
          </div>

          {/* Position */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1.5">Screen Placement</label>
            <select
              value={position}
              onChange={(e) => setPosition(e.target.value as ToastPosition)}
              className="w-full bg-[#181a26] border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none font-mono text-xs"
            >
              <option value="top-right">top-right</option>
              <option value="top-center">top-center</option>
              <option value="top-left">top-left</option>
              <option value="bottom-right">bottom-right</option>
              <option value="bottom-center">bottom-center</option>
              <option value="bottom-left">bottom-left</option>
            </select>
          </div>

          {/* Toast Specific Options */}
          {feedbackKind === 'toast' && (
            <div className="space-y-4 pt-2 border-t border-white/5">
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5">Toast Type</label>
                <div className="grid grid-cols-5 gap-1 text-xs">
                  {(['success', 'error', 'warning', 'info', 'loading'] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setToastType(t)}
                      className={`py-1.5 rounded-lg capitalize transition-colors font-medium ${
                        toastType === t ? 'bg-white/20 text-white' : 'bg-white/5 text-gray-400 hover:text-white'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>Duration</span>
                  <span className="font-mono">{duration ? `${duration} ms` : 'Persistent'}</span>
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
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5">Progress Track</label>
                  <select
                    value={progress}
                    onChange={(e) => setProgress(e.target.value as 'none' | 'bar' | 'ring')}
                    className="w-full bg-[#181a26] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="none">none</option>
                    <option value="bar">bar</option>
                    <option value="ring">ring</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="rich-colors"
                    checked={richColors}
                    onChange={(e) => setRichColors(e.target.checked)}
                    className="rounded accent-blue-500"
                  />
                  <label htmlFor="rich-colors" className="text-xs text-gray-300 font-medium">
                    Rich Colors
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Title & Description text */}
          <div className="space-y-3 pt-2 border-t border-white/5">
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-[#181a26] border border-white/10 rounded-xl px-3 py-2 text-sm text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1">Description / Text</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-[#181a26] border border-white/10 rounded-xl px-3 py-2 text-sm text-white"
              />
            </div>
          </div>

          {/* Fire Feedback Button */}
          <button
            type="button"
            onClick={handleFire}
            className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all shadow-lg shadow-blue-500/25 active:scale-[0.99]"
          >
            Fire Feedback Component ↵
          </button>
        </div>

        {/* RIGHT COLUMN: Live Canvas & Code Preview (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Live Preview Canvas */}
          <div className="rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
            <div className="px-4 py-3 bg-[#0d0f17] border-b border-white/10 flex items-center justify-between text-xs text-gray-400">
              <span className="font-semibold text-white">Live Render Canvas</span>
              <div className="flex items-center gap-1.5">
                <span>Backdrop:</span>
                {(['mesh', 'slate', 'cyber', 'light'] as const).map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => setCanvasBg(b)}
                    className={`px-2 py-0.5 rounded text-[11px] capitalize transition-colors ${
                      canvasBg === b ? 'bg-white/20 text-white font-medium' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>

            <div className={`p-10 min-h-[280px] flex items-center justify-center relative overflow-hidden transition-colors ${canvasBackgrounds[canvasBg]}`}>
              <div className="text-center space-y-3 max-w-sm">
                <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/15 mx-auto flex items-center justify-center text-xl text-blue-400 backdrop-blur-md shadow-lg">
                  ⚡
                </div>
                <div className="text-sm font-semibold text-white">Interactive Sandbox Canvas</div>
                <p className="text-xs text-gray-400">
                  Click &ldquo;Fire Feedback Component&rdquo; to launch live toasts or dialogs rendered with the built package.
                </p>
                <button
                  type="button"
                  onClick={handleFire}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium text-xs transition-colors"
                >
                  Trigger Now
                </button>
              </div>
            </div>
          </div>

          {/* Generated Code Section */}
          <div className="rounded-2xl border border-white/10 bg-[#0e1017] p-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
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
                      activeCodeTab === tab ? 'bg-blue-600 text-white font-medium' : 'text-gray-400 hover:text-white'
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
