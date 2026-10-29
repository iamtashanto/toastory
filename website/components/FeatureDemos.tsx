'use client';

import React, { useState } from 'react';
import { ui, toast } from 'glazekit';
import { CodeSnippet } from './CodeSnippet';

export function FeatureDemos() {
  const [customAccent, setCustomAccent] = useState('#3b82f6');
  const [customRadius, setCustomRadius] = useState(20);
  const [customBlur, setCustomBlur] = useState(22);
  const [reducedMotionActive, setReducedMotionActive] = useState(false);

  // 1. Toast demos
  const demoSuccess = () => {
    toast.success('Project compiled successfully', {
      description: 'Zero errors detected in 14 modules.',
      duration: 3500,
    });
  };

  const demoActionToast = () => {
    toast('Unsaved changes will be discarded', {
      description: 'Are you sure you want to revert to HEAD?',
      duration: 5000,
      action: {
        label: 'Revert',
        onClick: () => toast.error('Reverted to commit b71a9'),
      },
      cancel: {
        label: 'Keep',
        onClick: () => toast.info('Changes kept.'),
      },
    });
  };

  const demoPromise = () => {
    const task = new Promise((resolve) => setTimeout(resolve, 2500));
    toast.promise(task, {
      loading: 'Uploading 4 assets to S3...',
      success: 'All assets deployed successfully!',
      error: 'Upload aborted',
      description: 'CDN edge cache invalidated.',
    });
  };

  const demoProgressToast = () => {
    toast.info('Downloading system update', {
      description: 'Package 3 of 12 incoming...',
      progress: 'bar',
      progressValue: 0.65,
      duration: 4000,
    });
  };

  // 2. Dialog demos
  const demoConfirmDanger = async () => {
    const res = await ui.confirm({
      title: 'Delete billing method?',
      text: 'You will no longer be able to provision automated database instances.',
      tone: 'danger',
      confirmButton: { label: 'Remove Card', color: '#dc2626' },
      cancelButton: { label: 'Keep Card' },
    });
    if (res.isConfirmed) {
      toast.error('Card removed');
    }
  };

  const demoTypeToConfirm = async () => {
    const res = await ui.prompt({
      title: 'Danger: Drop Database',
      text: 'To confirm permanent deletion, please type "DELETE" below:',
      confirmText: 'DELETE',
      caseSensitive: true,
      tone: 'danger',
      confirmButton: { label: 'Drop DB Now', color: '#b91c1c' },
    });
    if (res.isConfirmed) {
      toast.error('Database dropped');
    }
  };

  const demoOtpDialog = async () => {
    await ui.prompt({
      title: 'Two-Factor Authentication',
      text: 'Enter the 6-digit security code sent to your authenticator app:',
      input: 'otp',
      otpLength: 6,
      resendCooldown: 30,
      confirmButton: { label: 'Verify Code' },
    });
  };

  const demoCountdownDialog = async () => {
    await ui.confirm({
      title: 'Inactivity Warning',
      text: 'Your current session will expire due to 15 minutes of inactivity.',
      countdown: 30,
      timer: 30000,
      timerProgressBar: true,
      confirmButton: { label: 'Stay Signed In' },
      cancelButton: { label: 'Log Out' },
    });
  };

  const demoStepsWizard = async () => {
    await ui.steps([
      {
        title: 'Step 1: Choose Workspace Name',
        input: 'text',
        placeholder: 'e.g. acme-corp',
        confirmButton: { label: 'Next Step' },
      },
      {
        title: 'Step 2: Hosting Region',
        input: 'select',
        options: [
          { value: 'us-east', label: 'US East (N. Virginia)' },
          { value: 'eu-west', label: 'EU West (Frankfurt)' },
          { value: 'ap-south', label: 'AP South (Mumbai)' },
        ],
        confirmButton: { label: 'Finish Setup' },
      },
    ]);
    toast.success('Workspace configured successfully!');
  };

  const demoBottomSheet = () => {
    ui.bottomSheet({
      title: 'Share Project',
      text: 'Anyone with this link can inspect live preview deployments.',
      snapPoints: [0.4, 0.75],
      confirmButton: { label: 'Copy Share Link' },
      cancelButton: { label: 'Done' },
    });
  };

  const demoActionSheet = () => {
    ui.sheet({
      title: 'Manage File',
      message: 'Choose an action for report-2026.pdf:',
      actions: [
        { label: 'Download Copy', value: 'download' },
        { label: 'Share with Team', value: 'share' },
        { label: 'Delete Permanently', value: 'delete', style: 'destructive' },
      ],
    });
  };

  const fireCustomLiveToast = () => {
    ui.defineTheme('live-custom', {
      radius: `${customRadius}px`,
      blur: `${customBlur}px`,
      light: { accent: customAccent },
      dark: { accent: customAccent },
    });

    toast.success('Custom Token Toast', {
      description: `Accent: ${customAccent} | Radius: ${customRadius}px | Blur: ${customBlur}px`,
      theme: 'live-custom',
    });
  };

  const generatedCustomCss = `/* Generated Theme Overrides */
[data-gk-theme="custom"] {
  --gk-accent: ${customAccent};
  --gk-radius: ${customRadius}px;
  --gk-blur: ${customBlur}px;
}`;

  return (
    <div className="w-full my-16 space-y-20 text-left">
      {/* 1. Toasts Feature Section */}
      <section className="space-y-6">
        <div className="border-b border-white/10 pb-4">
          <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">Feature 01</span>
          <h3 className="text-2xl sm:text-3xl font-bold text-white mt-1">
            Toasts: Types, Promises, Actions & Stacking
          </h3>
          <p className="text-gray-400 text-sm sm:text-base mt-2">
            Polite live regions, actionable Undo buttons, 4-direction swipe dismissal, and automatic deduplication windows.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl border border-white/10 bg-white/[0.02] flex flex-col justify-between">
            <div>
              <div className="text-base font-semibold text-white mb-1">Standard Toast</div>
              <p className="text-xs text-gray-400 mb-4">
                Rich icons, titles, secondary descriptions, and auto-dismiss timing.
              </p>
            </div>
            <button
              type="button"
              onClick={demoSuccess}
              className="w-full py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium text-xs transition-colors"
            >
              Trigger Success Toast ↵
            </button>
          </div>

          <div className="p-5 rounded-2xl border border-white/10 bg-white/[0.02] flex flex-col justify-between">
            <div>
              <div className="text-base font-semibold text-white mb-1">Action & Undo Bar</div>
              <p className="text-xs text-gray-400 mb-4">
                Inline actionable buttons with visible keyboard focus rings.
              </p>
            </div>
            <button
              type="button"
              onClick={demoActionToast}
              className="w-full py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium text-xs transition-colors"
            >
              Trigger Action Toast ↵
            </button>
          </div>

          <div className="p-5 rounded-2xl border border-white/10 bg-white/[0.02] flex flex-col justify-between">
            <div>
              <div className="text-base font-semibold text-white mb-1">Async Promise Toast</div>
              <p className="text-xs text-gray-400 mb-4">
                Tracks Promise resolution with loading spinner and automatic unwrapping.
              </p>
            </div>
            <button
              type="button"
              onClick={demoPromise}
              className="w-full py-2.5 px-4 rounded-xl bg-blue-600/20 border border-blue-500/30 hover:bg-blue-600/30 text-blue-300 font-medium text-xs transition-colors"
            >
              Trigger Promise Toast ↵
            </button>
          </div>

          <div className="p-5 rounded-2xl border border-white/10 bg-white/[0.02] flex flex-col justify-between">
            <div>
              <div className="text-base font-semibold text-white mb-1">Determinate Progress</div>
              <p className="text-xs text-gray-400 mb-4">
                Smooth progress tracks and rings with pausable hover/focus states.
              </p>
            </div>
            <button
              type="button"
              onClick={demoProgressToast}
              className="w-full py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium text-xs transition-colors"
            >
              Trigger Progress Toast ↵
            </button>
          </div>
        </div>
      </section>

      {/* 2. Dialogs & Prompts Feature Section */}
      <section className="space-y-6">
        <div className="border-b border-white/10 pb-4">
          <span className="text-xs font-semibold text-purple-400 uppercase tracking-wider">Feature 02</span>
          <h3 className="text-2xl sm:text-3xl font-bold text-white mt-1">
            Dialogs: Confirm, Prompts, OTP & Steps
          </h3>
          <p className="text-gray-400 text-sm sm:text-base mt-2">
            SweetAlert2 replacement with Apple glass styling. Built-in focus trap, 16 input types, type-to-confirm guards, and drawer bottom sheets.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl border border-white/10 bg-white/[0.02] flex flex-col justify-between">
            <div>
              <div className="text-base font-semibold text-white mb-1">Danger Destructive Confirm</div>
              <p className="text-xs text-gray-400 mb-4">
                Modal confirmation with default focus lock on Cancel button to protect accidental deletions.
              </p>
            </div>
            <button
              type="button"
              onClick={demoConfirmDanger}
              className="w-full py-2.5 px-4 rounded-xl bg-rose-500/15 border border-rose-500/30 hover:bg-rose-500/25 text-rose-300 font-medium text-xs transition-colors"
            >
              Confirm Destructive Action ↵
            </button>
          </div>

          <div className="p-5 rounded-2xl border border-white/10 bg-white/[0.02] flex flex-col justify-between">
            <div>
              <div className="text-base font-semibold text-white mb-1">Type-to-Confirm Guard</div>
              <p className="text-xs text-gray-400 mb-4">
                Disables the confirmation button until the user exactly types the specified confirmation string.
              </p>
            </div>
            <button
              type="button"
              onClick={demoTypeToConfirm}
              className="w-full py-2.5 px-4 rounded-xl bg-amber-500/15 border border-amber-500/30 hover:bg-amber-500/25 text-amber-300 font-medium text-xs transition-colors"
            >
              Type-to-Confirm Modal ↵
            </button>
          </div>

          <div className="p-5 rounded-2xl border border-white/10 bg-white/[0.02] flex flex-col justify-between">
            <div>
              <div className="text-base font-semibold text-white mb-1">6-Box Discrete OTP Input</div>
              <p className="text-xs text-gray-400 mb-4">
                Auto-advances between numeric inputs, clipboard paste parsing, and live resend timer countdown.
              </p>
            </div>
            <button
              type="button"
              onClick={demoOtpDialog}
              className="w-full py-2.5 px-4 rounded-xl bg-purple-500/15 border border-purple-500/30 hover:bg-purple-500/25 text-purple-300 font-medium text-xs transition-colors"
            >
              Launch OTP Dialog ↵
            </button>
          </div>

          <div className="p-5 rounded-2xl border border-white/10 bg-white/[0.02] flex flex-col justify-between">
            <div>
              <div className="text-base font-semibold text-white mb-1">Session Inactivity Countdown</div>
              <p className="text-xs text-gray-400 mb-4">
                Real-time ticking seconds display with animated timer track and pause/resume hooks.
              </p>
            </div>
            <button
              type="button"
              onClick={demoCountdownDialog}
              className="w-full py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium text-xs transition-colors"
            >
              Trigger Session Timer ↵
            </button>
          </div>

          <div className="p-5 rounded-2xl border border-white/10 bg-white/[0.02] flex flex-col justify-between">
            <div>
              <div className="text-base font-semibold text-white mb-1">Multi-Step Wizard (`ui.steps`)</div>
              <p className="text-xs text-gray-400 mb-4">
                Sequential wizard dialog with back/forward history and aggregated results.
              </p>
            </div>
            <button
              type="button"
              onClick={demoStepsWizard}
              className="w-full py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium text-xs transition-colors"
            >
              Run 2-Step Wizard ↵
            </button>
          </div>

          <div className="p-5 rounded-2xl border border-white/10 bg-white/[0.02] flex flex-col justify-between">
            <div>
              <div className="text-base font-semibold text-white mb-1">Mobile Bottom Sheet & Action Sheet</div>
              <p className="text-xs text-gray-400 mb-4">
                Swipeable gesture drawer with configurable snap points and drag handles.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={demoBottomSheet}
                className="py-2.5 px-2 rounded-xl bg-cyan-500/15 border border-cyan-500/30 hover:bg-cyan-500/25 text-cyan-300 font-medium text-xs transition-colors text-center"
              >
                Bottom Sheet
              </button>
              <button
                type="button"
                onClick={demoActionSheet}
                className="py-2.5 px-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium text-xs transition-colors text-center"
              >
                Action Sheet
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Live Token Customiser */}
      <section className="space-y-6">
        <div className="border-b border-white/10 pb-4">
          <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Feature 03</span>
          <h3 className="text-2xl sm:text-3xl font-bold text-white mt-1">
            Live Design Token Customiser
          </h3>
          <p className="text-gray-400 text-sm sm:text-base mt-2">
            Adjust CSS variables live. Watch the toast restyle instantly and export the ready CSS token overrides.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div className="p-6 rounded-2xl border border-white/10 bg-[#12141f] space-y-6">
            <div>
              <label className="flex items-center justify-between text-sm font-medium text-gray-300 mb-2">
                <span>Accent Color (`--gk-accent`)</span>
                <span className="font-mono text-xs text-gray-400">{customAccent}</span>
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={customAccent}
                  onChange={(e) => setCustomAccent(e.target.value)}
                  className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0"
                />
                <div className="flex flex-wrap gap-2">
                  {['#3b82f6', '#10b981', '#ec4899', '#8b5cf6', '#f59e0b', '#06b6d4'].map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setCustomAccent(c)}
                      className="w-7 h-7 rounded-full border border-white/20 transition-transform hover:scale-110"
                      style={{ backgroundColor: c }}
                      aria-label={`Select color ${c}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="flex items-center justify-between text-sm font-medium text-gray-300 mb-2">
                <span>Corner Radius (`--gk-radius`)</span>
                <span className="font-mono text-xs text-gray-400">{customRadius}px</span>
              </label>
              <input
                type="range"
                min="0"
                max="36"
                value={customRadius}
                onChange={(e) => setCustomRadius(Number(e.target.value))}
                className="w-full accent-blue-500"
              />
            </div>

            <div>
              <label className="flex items-center justify-between text-sm font-medium text-gray-300 mb-2">
                <span>Backdrop Blur (`--gk-blur`)</span>
                <span className="font-mono text-xs text-gray-400">{customBlur}px</span>
              </label>
              <input
                type="range"
                min="0"
                max="40"
                value={customBlur}
                onChange={(e) => setCustomBlur(Number(e.target.value))}
                className="w-full accent-blue-500"
              />
            </div>

            <button
              type="button"
              onClick={fireCustomLiveToast}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all shadow-lg shadow-blue-500/25"
            >
              Preview Live Customized Toast ↵
            </button>
          </div>

          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
              Generated CSS Token Output
            </div>
            <CodeSnippet code={generatedCustomCss} language="css" filename="theme-override.css" />
          </div>
        </div>
      </section>

      {/* 4. Accessibility & Performance Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-6 rounded-2xl border border-white/10 bg-[#12141f] space-y-4">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              WCAG 2.2 AA
            </span>
            <h4 className="text-lg font-bold text-white">Accessibility & Live Regions</h4>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed">
            Standard toasts announce politely with `role=&quot;status&quot;` and `aria-live=&quot;polite&quot;`. Error notices escalate to `role=&quot;alert&quot;` and `aria-live=&quot;assertive&quot;`. Active dialogs trap keyboard focus and restore focus on dismiss.
          </p>
          <div className="pt-2 flex items-center justify-between text-xs text-gray-400 border-t border-white/5">
            <span>Focus Navigation Hotkey:</span>
            <kbd className="px-2 py-1 rounded bg-white/10 text-white font-mono">Alt + T</kbd>
          </div>
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>Reduced Motion Preference:</span>
            <button
              type="button"
              onClick={() => {
                const next = !reducedMotionActive;
                setReducedMotionActive(next);
                if (next) {
                  document.documentElement.style.setProperty('--gk-duration', '0.01ms');
                  toast.info('Reduced motion simulated: all entrance springs and spins disabled.');
                } else {
                  document.documentElement.style.removeProperty('--gk-duration');
                  toast.success('Full motion animations restored.');
                }
              }}
              className="text-blue-400 hover:underline"
            >
              {reducedMotionActive ? 'Restore Animations' : 'Toggle Simulation'}
            </button>
          </div>
        </div>

        <div className="p-6 rounded-2xl border border-white/10 bg-[#12141f] space-y-4">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-500/20 text-blue-400 border border-blue-500/30">
              Verifiable Benchmarks
            </span>
            <h4 className="text-lg font-bold text-white">Ultra-lightweight Size Budget</h4>
          </div>
          <div className="space-y-3 pt-1">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-300">Core + Toast + 1 Theme</span>
                <span className="font-mono text-emerald-400">5.20 KB (budget &lt; 6.00 KB)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '86%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-300">Full Web Bundle (All Dialogs)</span>
                <span className="font-mono text-blue-400">14.10 KB (budget &lt; 22.00 KB)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: '64%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-300">Runtime Dependencies</span>
                <span className="font-mono text-purple-400">0 Bytes (Zero Dependencies)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                <div className="h-full bg-purple-500 rounded-full" style={{ width: '0%' }} />
              </div>
            </div>
          </div>
          <div className="text-[11px] text-gray-400 pt-2 border-t border-white/5">
            Measured via `esbuild --bundle --minify` with `gzipSync`. Verified 2026.
          </div>
        </div>
      </section>
    </div>
  );
}
