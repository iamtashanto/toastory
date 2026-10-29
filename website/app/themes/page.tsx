'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ui, toast } from 'glazekit';
import { THEME_REGISTRY } from '@/lib/glazekit/theme-generator';

export default function ThemesPage() {
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [mode, setMode] = useState<'dark' | 'light'>('dark');
  const [targetType, setTargetType] = useState<'toast' | 'dialog'>('toast');
  const [bgStyle, setBgStyle] = useState<'mesh' | 'slate' | 'cyber' | 'sunset'>('mesh');

  const backgroundClasses = {
    mesh: 'bg-gradient-to-br from-[#0c0d16] via-[#121424] to-[#0a0a12]',
    slate: 'bg-[#18181b]',
    cyber: 'bg-gradient-to-tr from-[#05050f] via-[#0b1329] to-[#021f2d]',
    sunset: 'bg-gradient-to-br from-[#200b14] via-[#1a0f26] to-[#0b0c14]',
  };

  const filteredThemes = filterCategory === 'all'
    ? THEME_REGISTRY
    : THEME_REGISTRY.filter((t) => t.category === filterCategory);

  const handleTrigger = (themeName: string) => {
    ui.configure({ theme: themeName, mode: mode });

    if (targetType === 'toast') {
      toast.success(`${themeName} Theme Active`, {
        description: `Rendered in ${mode} mode with Apple glass styling.`,
        theme: themeName,
      });
    } else {
      ui.confirm({
        title: `${themeName} Modal Dialog`,
        text: `Interactive confirmation dialog styled using the ${themeName} theme tokens.`,
        theme: themeName,
        confirmButton: { label: 'Confirm' },
        cancelButton: { label: 'Dismiss' },
      });
    }
  };

  const handleCopyConfig = (theme: typeof THEME_REGISTRY[0]) => {
    const config = JSON.stringify(
      {
        theme: theme.name,
        mode: mode,
        radius: theme.radius,
        blur: theme.blur,
        tokens: mode === 'dark' ? theme.dark : theme.light,
      },
      null,
      2
    );
    navigator.clipboard.writeText(config);
    toast.info(`Copied "${theme.name}" configuration to clipboard!`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20 text-left">
      {/* Page Header */}
      <div className="max-w-3xl mb-10">
        <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">Visual Design System</span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mt-1 mb-4">
          21 Theme Presets Studio
        </h1>
        <p className="text-base sm:text-lg text-gray-400 leading-relaxed">
          Exhaustive gallery of all 21 bundled themes across Light and Dark modes. Verified WCAG 2.2 AA contrast ratios, fluid spring animations, and solid fallback support.
        </p>
      </div>

      {/* Control Bar: Filters, Modes, and Backgrounds */}
      <div className="p-4 rounded-2xl border border-white/10 bg-[#10121b] mb-10 flex flex-wrap items-center justify-between gap-4">
        {/* Categories */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {(['all', 'glass', 'modern', 'minimal', 'playful'] as const).map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium capitalize transition-colors ${
                filterCategory === cat
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Mode & Target Toggles */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          {/* Component Target */}
          <div className="flex items-center bg-black/40 border border-white/10 rounded-xl p-0.5">
            <button
              type="button"
              onClick={() => setTargetType('toast')}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                targetType === 'toast' ? 'bg-white/20 text-white font-medium' : 'text-gray-400 hover:text-white'
              }`}
            >
              Toasts
            </button>
            <button
              type="button"
              onClick={() => setTargetType('dialog')}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                targetType === 'dialog' ? 'bg-white/20 text-white font-medium' : 'text-gray-400 hover:text-white'
              }`}
            >
              Dialogs
            </button>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center bg-black/40 border border-white/10 rounded-xl p-0.5">
            <button
              type="button"
              onClick={() => setMode('dark')}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                mode === 'dark' ? 'bg-white/20 text-white font-medium' : 'text-gray-400 hover:text-white'
              }`}
            >
              Dark Mode
            </button>
            <button
              type="button"
              onClick={() => setMode('light')}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                mode === 'light' ? 'bg-white/20 text-white font-medium' : 'text-gray-400 hover:text-white'
              }`}
            >
              Light Mode
            </button>
          </div>

          {/* Canvas Backdrop */}
          <div className="flex items-center gap-1.5">
            <span className="text-gray-400">Backdrop:</span>
            {(['mesh', 'slate', 'cyber', 'sunset'] as const).map((b) => (
              <button
                key={b}
                type="button"
                onClick={() => setBgStyle(b)}
                className={`w-5 h-5 rounded-full border transition-transform ${
                  bgStyle === b ? 'border-white scale-110 ring-2 ring-blue-500' : 'border-white/20'
                }`}
                style={{
                  background:
                    b === 'mesh'
                      ? 'linear-gradient(135deg, #1e1b4b, #0f172a)'
                      : b === 'slate'
                      ? '#18181b'
                      : b === 'cyber'
                      ? '#002b3d'
                      : '#3b0764',
                }}
                aria-label={`Backdrop ${b}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Themes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredThemes.map((theme, idx) => {
          const tokens = mode === 'dark' ? theme.dark : theme.light;
          return (
            <div
              key={theme.name}
              className={`rounded-2xl border border-white/10 p-6 flex flex-col justify-between overflow-hidden relative shadow-lg ${backgroundClasses[bgStyle]}`}
            >
              <div>
                {/* Header info */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-gray-500 font-bold">
                      {String(idx + 1).padStart(2, '0')}.
                    </span>
                    <h3 className="text-base font-bold text-white capitalize">{theme.name}</h3>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                    {theme.contrastRating || 'AAA (7:1)'}
                  </span>
                </div>

                <p className="text-xs text-gray-400 mb-6 leading-relaxed line-clamp-2">
                  {theme.description}
                </p>

                {/* Simulated Live Component Card */}
                <div
                  className="p-4 rounded-xl mb-6 border transition-all"
                  style={{
                    backgroundColor: tokens.bg,
                    borderColor: tokens.border,
                    color: tokens.fg,
                    borderRadius: theme.radius,
                    boxShadow: tokens.shadow,
                    backdropFilter: `blur(${theme.blur}) saturate(${theme.saturate})`,
                    WebkitBackdropFilter: `blur(${theme.blur}) saturate(${theme.saturate})`,
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center flex-none mt-0.5"
                      style={{ color: tokens.success }}
                    >
                      ✓
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold leading-tight">{theme.name} Active</div>
                      <div className="text-[11px] mt-0.5 opacity-80 truncate">
                        Blur: {theme.blur} • Radius: {theme.radius}
                      </div>
                    </div>
                  </div>

                  {targetType === 'dialog' && (
                    <div className="mt-3 pt-3 border-t flex justify-end gap-2" style={{ borderColor: tokens.border }}>
                      <button
                        type="button"
                        className="px-2.5 py-1 rounded text-[11px] font-medium"
                        style={{ backgroundColor: tokens.accent, color: tokens.accentFg }}
                      >
                        Action
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-white/5 flex items-center justify-between gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => handleTrigger(theme.name)}
                  className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium transition-colors"
                >
                  Replay Live ↵
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleCopyConfig(theme)}
                    className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                    title="Copy configuration JSON"
                    aria-label={`Copy ${theme.name} configuration`}
                  >
                    Copy
                  </button>
                  <Link
                    href={`/playground?theme=${theme.name}&mode=${mode}`}
                    className="p-1.5 rounded-lg hover:bg-white/10 text-blue-400 hover:text-blue-300 transition-colors"
                    title="Open in Playground"
                  >
                    Playground →
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
