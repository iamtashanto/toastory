'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ui, toast } from 'toastory';
import type { ToastPosition } from 'toastory';

type FrameworkTab = 'React' | 'Svelte' | 'Vanilla' | 'Vue' | 'Angular' | 'Next.js' | 'Native';

const FRAMEWORK_INSTALL: Record<FrameworkTab, string> = {
  React: 'npm i toastory',
  'Next.js': 'npm i toastory',
  Svelte: 'npm i toastory',
  Vue: 'npm i toastory',
  Angular: 'npm i toastory',
  Vanilla: 'npm i toastory',
  Native: 'npm i toastory react-native-reanimated',
};

const THEMES = [
  { id: 'ios-glass', name: 'iOS Glass' },
  { id: 'liquid-glass', name: 'Liquid Glass' },
  { id: 'essentials', name: 'Essentials' },
  { id: 'showcase', name: 'Showcase' },
  { id: 'neon', name: 'Cyber Neon' },
  { id: 'aurora', name: 'Aurora' },
  { id: 'sweet', name: 'Sweet Candy' },
  { id: 'brutal', name: 'Neo-Brutal' },
];

export function HeroDemo() {
  const [activeFw, setActiveFw] = useState<FrameworkTab>('React');
  const [activePosition, setActivePosition] = useState<ToastPosition>('top-center');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>('dark');
  const [activeTheme, setActiveTheme] = useState('ios-glass');
  const [isStacked, setIsStacked] = useState(true);
  const [cmdCopied, setCmdCopied] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [selectedDemoCode, setSelectedDemoCode] = useState<string>('Save');

  const handleCopyCmd = async () => {
    try {
      await navigator.clipboard.writeText(FRAMEWORK_INSTALL[activeFw]);
      setCmdCopied(true);
      if (soundEnabled) ui.sound('pop');
      toast.success('Copied to clipboard', {
        id: 'cmd-copy',
        description: FRAMEWORK_INSTALL[activeFw],
        duration: 2000,
        position: activePosition,
      });
      setTimeout(() => setCmdCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const setPosition = (pos: ToastPosition) => {
    setActivePosition(pos);
    ui.configure({ position: pos });
    if (soundEnabled) ui.sound('ding');
    toast.info(`Position: ${pos}`, {
      id: 'pos-change',
      duration: 1800,
      position: pos,
    });
  };

  const toggleSound = (enabled: boolean) => {
    setSoundEnabled(enabled);
    ui.configure({ sound: enabled });
    if (enabled) {
      ui.sound('chime');
      toast.success('Sound enabled', { id: 'sound-toggle', duration: 1800, position: activePosition });
    } else {
      toast.info('Sound muted', { id: 'sound-toggle', duration: 1800, position: activePosition });
    }
  };

  const toggleMode = (mode: 'light' | 'dark') => {
    setThemeMode(mode);
    ui.configure({ mode });
    if (soundEnabled) ui.sound('pop');
    toast.message(`Theme: ${mode} mode`, { id: 'theme-mode', duration: 1800, position: activePosition });
  };

  const handleThemePreset = (themeId: string) => {
    setActiveTheme(themeId);
    ui.configure({ theme: themeId });
    if (soundEnabled) ui.sound('chime');
    toast.message(`Theme preset: ${themeId}`, {
      id: 'theme-preset',
      description: 'Styling tokens updated across all feedback components.',
      duration: 2000,
      position: activePosition,
      theme: themeId,
    });
  };

  // Helper avatar SVG
  const avatarSvg = (initials: string, bg: string) =>
    `data:image/svg+xml,${encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 56 56"><rect width="56" height="56" rx="28" fill="${bg}"/><text x="28" y="35" font-family="-apple-system,system-ui,sans-serif" font-size="20" font-weight="700" text-anchor="middle" fill="#fff">${initials}</text></svg>`
    )}`;

  // --- DEMO ACTIONS ---
  const fireSave = () => {
    setSelectedDemoCode('Save');
    toast.success('Changes saved', {
      position: activePosition,
      theme: activeTheme,
    });
  };

  const fireError = () => {
    setSelectedDemoCode('Error');
    toast.error('Payment failed', {
      description: 'Your card was declined. Try another card.',
      position: activePosition,
      theme: activeTheme,
      action: {
        label: 'Retry',
        onClick: () => fireSave(),
      },
    });
  };

  const fireWarning = () => {
    setSelectedDemoCode('Warning');
    toast.warning('Storage almost full', {
      description: 'Free up space or upgrade your plan.',
      position: activePosition,
      theme: activeTheme,
      action: {
        label: 'Upgrade',
        onClick: () => toast.info('Navigating to billing...'),
      },
    });
  };

  const fireInfo = () => {
    setSelectedDemoCode('Info');
    toast.info('New version available', {
      position: activePosition,
      theme: activeTheme,
    });
  };

  const fireDescription = () => {
    setSelectedDemoCode('Description');
    toast.success('Deployment ready', {
      description: 'my-app is live at my-app.vercel.app',
      position: activePosition,
      theme: activeTheme,
    });
  };

  const firePromise = () => {
    setSelectedDemoCode('Promise');
    const fakeAsyncAction = new Promise<{ id: string }>((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() > 0.1) {
          resolve({ id: 'bundle-892' });
        } else {
          reject(new Error('Network handshake failed'));
        }
      }, 2000);
    });

    toast.promise(
      fakeAsyncAction,
      {
        loading: 'Uploading photo…',
        success: 'Photo uploaded successfully',
        error: 'Upload failed. Try again.',
        description: 'Compiling ESM + CJS subpaths with zero dependencies.',
      },
      { position: activePosition, theme: activeTheme }
    );
  };

  const fireSync = () => {
    setSelectedDemoCode('Sync');
    const id = toast.loading('Syncing 3 files…', { position: activePosition, theme: activeTheme });
    setTimeout(() => {
      toast.update(id, {
        type: 'success',
        title: 'All files synced',
        description: 'Last sync just now',
      });
    }, 2000);
  };

  const fireUpload = () => {
    setSelectedDemoCode('Upload');
    let percent = 0;
    const id = toast.loading('Uploading 0%', { position: activePosition, theme: activeTheme });
    const timer = setInterval(() => {
      percent = Math.min(100, percent + 12 + Math.floor(Math.random() * 10));
      if (percent < 100) {
        toast.update(id, {
          title: `Uploading ${percent}%`,
          description: 'photo-2026.raw · 24.1 MB',
        });
      } else {
        clearInterval(timer);
        toast.update(id, {
          type: 'success',
          title: 'Upload complete',
          description: 'photo-2026.raw · 24.1 MB',
        });
      }
    }, 150);
  };

  const fireDownload = () => {
    setSelectedDemoCode('Download');
    let percent = 0;
    const id = toast.info('design-system.zip', {
      description: 'Downloading · 0%',
      position: activePosition,
      theme: activeTheme,
      avatar: avatarSvg('ZIP', '#3b82f6'),
      cancel: {
        label: 'Cancel',
        onClick: () => {
          clearInterval(timer);
          toast.update(id, {
            type: 'error',
            title: 'Download canceled',
            description: '',
            avatar: undefined,
          });
        },
      },
    });

    const timer = setInterval(() => {
      percent = Math.min(100, percent + 15 + Math.floor(Math.random() * 8));
      if (percent < 100) {
        toast.update(id, { description: `Downloading · ${percent}%` });
      } else {
        clearInterval(timer);
        toast.update(id, {
          type: 'success',
          title: 'Download complete',
          description: '84 MB · saved to Downloads',
          avatar: undefined,
          cancel: undefined,
        });
      }
    }, 160);
  };

  const fireOrder = () => {
    setSelectedDemoCode('Order');
    const id = toast.loading('Order confirmed', {
      description: 'The kitchen received your order',
      position: activePosition,
      theme: activeTheme,
    });
    setTimeout(() => {
      toast.update(id, {
        type: 'info',
        title: 'Preparing food',
        description: 'Chef is baking your sourdough pizza',
      });
    }, 1800);
    setTimeout(() => {
      toast.update(id, {
        type: 'info',
        title: 'Courier on the way',
        description: 'Courier arrives in 6 minutes',
      });
    }, 3600);
    setTimeout(() => {
      toast.update(id, {
        type: 'success',
        title: 'Delivered',
        description: 'Enjoy your warm meal!',
      });
    }, 5400);
  };

  const fireSequence = () => {
    setSelectedDemoCode('Sequence');
    const steps = [
      () => toast.loading('Uploading photo…', { position: activePosition }),
      () => toast.success('Photo uploaded', { position: activePosition }),
      () => toast.error('Sync failed', { description: 'Check your connection', position: activePosition }),
      () => toast.info('Retrying in 3s', { position: activePosition }),
    ];
    steps.forEach((step, idx) => setTimeout(step, idx * 1200));
  };

  const fireMessage = () => {
    setSelectedDemoCode('Message');
    toast.info('Sarah Chen', {
      description: 'Can you review the PR before standup?',
      position: activePosition,
      theme: activeTheme,
      avatar: avatarSvg('SC', '#6366f1'),
      action: {
        label: 'Reply',
        onClick: () => {
          toast.success('Reply sent', {
            description: 'Sarah will be notified.',
            position: activePosition,
          });
        },
      },
      cancel: {
        label: 'Later',
        onClick: () => {
          toast.message('Marked as unread', { position: activePosition });
        },
      },
    });
  };

  const fireMeeting = () => {
    setSelectedDemoCode('Meeting');
    toast.info('Design sync in 5 min', {
      description: 'Room 4 · 6 attendees',
      position: activePosition,
      theme: activeTheme,
      avatar: avatarSvg('DS', '#10b981'),
      action: {
        label: 'Join',
        onClick: () => {
          toast.success('Joining Zoom conference...', { position: activePosition });
        },
      },
      cancel: {
        label: 'Snooze',
        onClick: () => {
          toast.info('Snoozed for 10 min', { position: activePosition });
        },
      },
    });
  };

  const fireInvite = () => {
    setSelectedDemoCode('Invite');
    toast.info('Alex invited you to Atlas', {
      description: 'Product design workspace · 12 members',
      position: activePosition,
      theme: activeTheme,
      avatar: avatarSvg('AL', '#f43f5e'),
      action: {
        label: 'Accept',
        onClick: () => {
          toast.success('Joined Atlas', {
            description: 'You now have access to 12 shared boards.',
            position: activePosition,
          });
        },
      },
      cancel: {
        label: 'Decline',
        onClick: () => {
          toast.message('Invitation declined', { position: activePosition });
        },
      },
    });
  };

  const fireMusic = () => {
    setSelectedDemoCode('Music');
    toast.info('Midnight City', {
      description: 'M83 · Hurry Up, We’re Dreaming',
      position: activePosition,
      theme: activeTheme,
      avatar: avatarSvg('♫', '#8b5cf6'),
      action: {
        label: 'Next Track',
        onClick: () => {
          toast.info('Intro — The xx', {
            description: 'Playing next in queue',
            position: activePosition,
            avatar: avatarSvg('♪', '#3b82f6'),
          });
        },
      },
      cancel: {
        label: 'Pause',
        onClick: () => {
          toast.message('Playback paused', { position: activePosition });
        },
      },
    });
  };

  const fireCopy = () => {
    setSelectedDemoCode('Copy');
    toast.success('Link copied', {
      description: 'URL added to your system clipboard (⌘V)',
      position: activePosition,
      theme: activeTheme,
      duration: 2500,
    });
  };

  const fireUndo = () => {
    setSelectedDemoCode('Undo');
    toast.success('Message deleted', {
      position: activePosition,
      theme: activeTheme,
      duration: 8000,
      action: {
        label: 'Undo',
        onClick: () => {
          toast.success('Message restored', { position: activePosition });
        },
      },
    });
  };

  const fireConfirmAction = () => {
    setSelectedDemoCode('Confirm');
    toast.warning('Discard unsaved changes?', {
      position: activePosition,
      theme: activeTheme,
      action: {
        label: 'Discard',
        onClick: () => {
          toast.error('Changes discarded', { position: activePosition });
        },
      },
      cancel: {
        label: 'Keep',
        onClick: () => {
          toast.message('Saved draft retained', { position: activePosition });
        },
      },
    });
  };

  const fireUpdate = () => {
    setSelectedDemoCode('Update');
    const id = 'upd-app';
    toast.info('Update available', {
      id,
      description: 'Version 2.4 is ready to install.',
      position: activePosition,
      theme: activeTheme,
      action: {
        label: 'Restart Now',
        onClick: () => {
          toast.update(id, {
            type: 'loading',
            title: 'Restarting…',
            description: 'Applying bundle updates',
            action: undefined,
            cancel: undefined,
          });
          setTimeout(() => {
            toast.update(id, {
              type: 'success',
              title: 'You’re up to date',
              description: 'Version 2.4 installed successfully',
            });
          }, 2000);
        },
      },
      cancel: {
        label: 'Later',
        onClick: () => {},
      },
    });
  };

  const fireOffline = () => {
    setSelectedDemoCode('Offline');
    const id = 'offline-toast';
    toast.error('You’re offline', {
      id,
      description: 'Changes will sync when you reconnect.',
      position: activePosition,
      theme: activeTheme,
      action: {
        label: 'Retry Connection',
        onClick: () => {
          toast.update(id, {
            type: 'loading',
            title: 'Reconnecting…',
            description: 'Pinging cloud cluster',
            action: undefined,
          });
          setTimeout(() => {
            toast.update(id, {
              type: 'success',
              title: 'Back online',
              description: 'All local changes synced',
            });
          }, 2000);
        },
      },
    });
  };

  // Sound triggers
  const fireSoundCue = (cue: 'success' | 'error' | 'warning' | 'info' | 'chime' | 'ding' | 'pop' | 'bubble') => {
    setSelectedDemoCode(`Sound:${cue}`);
    ui.sound(cue);
    toast.message(`Audio Cue: ${cue}`, {
      description: 'Zero-dependency Web Audio synthesizer',
      duration: 1800,
      position: activePosition,
    });
  };

  // Dialog triggers
  const fireConfirmModal = async () => {
    setSelectedDemoCode('Dialog:Confirm');
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

  const firePromptModal = async () => {
    setSelectedDemoCode('Dialog:Prompt');
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
    setSelectedDemoCode('Dialog:BottomSheet');
    ui.bottomSheet({
      title: 'Select Deployment Region',
      text: 'Choose an edge cluster nearest to your application users:',
      theme: activeTheme,
      confirmButton: { label: 'Deploy to us-east' },
      cancelButton: { label: 'Cancel' },
    });
  };

  const codeSnippets: Record<string, string> = {
    Save: `import { toast } from 'toastory';

toast.success('Changes saved', {
  position: '${activePosition}',
  theme: '${activeTheme}'
});`,
    Error: `import { toast } from 'toastory';

toast.error('Payment failed', {
  description: 'Your card was declined. Try another card.',
  position: '${activePosition}',
  action: {
    label: 'Retry',
    onClick: () => retryPayment()
  }
});`,
    Promise: `import { toast } from 'toastory';

toast.promise(uploadPhoto(), {
  loading: 'Uploading photo…',
  success: 'Photo uploaded successfully',
  error: 'Upload failed. Try again.',
  description: 'Compiling ESM + CJS with zero dependencies.'
}, { position: '${activePosition}' });`,
    Message: `import { toast } from 'toastory';

toast.info('Sarah Chen', {
  description: 'Can you review the PR before standup?',
  avatar: 'https://example.com/sarah.jpg',
  action: { label: 'Reply', onClick: () => sendReply() },
  cancel: { label: 'Later', onClick: () => snooze() }
});`,
    Undo: `import { toast } from 'toastory';

toast.success('Message deleted', {
  duration: 8000,
  action: {
    label: 'Undo',
    onClick: () => restoreMessage()
  }
});`,
    'Dialog:Confirm': `import { ui } from 'toastory';

const res = await ui.confirm({
  title: 'Destroy Production Cluster?',
  text: 'This operation will terminate 12 edge worker pods.',
  tone: 'danger',
  confirmButton: { label: 'Destroy Pods', color: '#dc2626' },
  cancelButton: { label: 'Keep Running' }
});`,
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* 1. TOP HERO INTERACTION ROW (Framework Tabs + Install Command + llms.txt) */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-2 sm:p-3 rounded-2xl bg-[var(--site-surface-raised)] border border-[var(--site-border)] shadow-sm">
        {/* Framework toggle tabs */}
        <div className="flex flex-wrap items-center gap-1">
          {(['React', 'Next.js', 'Svelte', 'Vue', 'Angular', 'Vanilla', 'Native'] as FrameworkTab[]).map((fw) => {
            const isSelected = activeFw === fw;
            return (
              <button
                key={fw}
                type="button"
                onClick={() => setActiveFw(fw)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-[var(--site-fg)] text-[var(--site-bg)] font-semibold shadow-sm'
                    : 'text-[var(--site-muted)] hover:text-[var(--site-fg)] hover:bg-[var(--site-surface)]'
                }`}
                aria-pressed={isSelected}
              >
                {fw}
              </button>
            );
          })}
        </div>

        {/* Command Pill & Copy */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--site-surface)] border border-[var(--site-border)] text-xs font-mono text-[var(--site-fg)] shadow-inner">
            <span>{FRAMEWORK_INSTALL[activeFw]}</span>
            <button
              type="button"
              onClick={handleCopyCmd}
              className="px-2.5 py-0.5 rounded-full bg-[var(--site-fg)] text-[var(--site-bg)] font-sans text-[11px] font-semibold transition-all hover:opacity-90 active:scale-95"
            >
              {cmdCopied ? 'Copied' : 'Copy'}
            </button>
          </div>

          <Link
            href="/llms.txt"
            target="_blank"
            className="text-xs text-[var(--site-muted)] hover:text-[var(--site-fg)] underline underline-offset-4 decoration-[var(--site-border)]"
          >
            llms.txt
          </Link>
        </div>
      </div>

      {/* 2. UNIFIED SETTINGS CARD (Position 3x3 Matrix, Sound, Theme, Dismiss All) */}
      <div className="flex flex-wrap items-center justify-between gap-6 px-6 py-4 rounded-2xl bg-[var(--site-surface-raised)] border border-[var(--site-border)] shadow-md backdrop-blur-xl">
        {/* 7 Placements 3x3 Picker */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-[var(--site-muted)] uppercase tracking-wider">Position</span>
          <div
            className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-[var(--site-surface)] border border-[var(--site-border)] shadow-inner"
            role="group"
            aria-label="7 screen placement selector"
          >
            {/* Row 1 */}
            <button
              type="button"
              onClick={() => setPosition('top-left')}
              title="Top Left"
              aria-label="Top Left"
              className={`w-6 h-6 rounded-md transition-all ${
                activePosition === 'top-left'
                  ? 'bg-[var(--site-fg)] shadow-sm scale-105'
                  : 'bg-[var(--site-surface-raised)] hover:bg-blue-500/20'
              }`}
            />
            <button
              type="button"
              onClick={() => setPosition('top-center')}
              title="Top Center"
              aria-label="Top Center"
              className={`w-6 h-6 rounded-md transition-all ${
                activePosition === 'top-center'
                  ? 'bg-[var(--site-fg)] shadow-sm scale-105'
                  : 'bg-[var(--site-surface-raised)] hover:bg-blue-500/20'
              }`}
            />
            <button
              type="button"
              onClick={() => setPosition('top-right')}
              title="Top Right"
              aria-label="Top Right"
              className={`w-6 h-6 rounded-md transition-all ${
                activePosition === 'top-right'
                  ? 'bg-[var(--site-fg)] shadow-sm scale-105'
                  : 'bg-[var(--site-surface-raised)] hover:bg-blue-500/20'
              }`}
            />

            {/* Row 2 (Spacer, Middle Center, Spacer) */}
            <div className="w-6 h-6 opacity-0 pointer-events-none" />
            <button
              type="button"
              onClick={() => setPosition('center')}
              title="Center (Middle Screen)"
              aria-label="Center (Middle Screen)"
              className={`w-6 h-6 rounded-md transition-all flex items-center justify-center ${
                activePosition === 'center'
                  ? 'bg-[var(--site-fg)] shadow-sm scale-105'
                  : 'bg-[var(--site-surface-raised)] hover:bg-blue-500/20'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${activePosition === 'center' ? 'bg-[var(--site-bg)]' : 'bg-[var(--site-muted)]'}`} />
            </button>
            <div className="w-6 h-6 opacity-0 pointer-events-none" />

            {/* Row 3 */}
            <button
              type="button"
              onClick={() => setPosition('bottom-left')}
              title="Bottom Left"
              aria-label="Bottom Left"
              className={`w-6 h-6 rounded-md transition-all ${
                activePosition === 'bottom-left'
                  ? 'bg-[var(--site-fg)] shadow-sm scale-105'
                  : 'bg-[var(--site-surface-raised)] hover:bg-blue-500/20'
              }`}
            />
            <button
              type="button"
              onClick={() => setPosition('bottom-center')}
              title="Bottom Center"
              aria-label="Bottom Center"
              className={`w-6 h-6 rounded-md transition-all ${
                activePosition === 'bottom-center'
                  ? 'bg-[var(--site-fg)] shadow-sm scale-105'
                  : 'bg-[var(--site-surface-raised)] hover:bg-blue-500/20'
              }`}
            />
            <button
              type="button"
              onClick={() => setPosition('bottom-right')}
              title="Bottom Right"
              aria-label="Bottom Right"
              className={`w-6 h-6 rounded-md transition-all ${
                activePosition === 'bottom-right'
                  ? 'bg-[var(--site-fg)] shadow-sm scale-105'
                  : 'bg-[var(--site-surface-raised)] hover:bg-blue-500/20'
              }`}
            />
          </div>
        </div>

        {/* Sound Toggle */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-[var(--site-muted)] uppercase tracking-wider">Sound</span>
          <div className="flex items-center p-0.5 rounded-full bg-[var(--site-surface)] border border-[var(--site-border)] shadow-inner">
            <button
              type="button"
              onClick={() => toggleSound(false)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                !soundEnabled
                  ? 'bg-[var(--site-fg)] text-[var(--site-bg)] font-semibold shadow-sm'
                  : 'text-[var(--site-muted)] hover:text-[var(--site-fg)]'
              }`}
            >
              Off
            </button>
            <button
              type="button"
              onClick={() => toggleSound(true)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                soundEnabled
                  ? 'bg-[var(--site-fg)] text-[var(--site-bg)] font-semibold shadow-sm'
                  : 'text-[var(--site-muted)] hover:text-[var(--site-fg)]'
              }`}
            >
              On
            </button>
          </div>
        </div>

        {/* Theme Mode Toggle */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-[var(--site-muted)] uppercase tracking-wider">Theme</span>
          <div className="flex items-center p-0.5 rounded-full bg-[var(--site-surface)] border border-[var(--site-border)] shadow-inner">
            <button
              type="button"
              onClick={() => toggleMode('light')}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                themeMode === 'light'
                  ? 'bg-[var(--site-fg)] text-[var(--site-bg)] font-semibold shadow-sm'
                  : 'text-[var(--site-muted)] hover:text-[var(--site-fg)]'
              }`}
            >
              Light
            </button>
            <button
              type="button"
              onClick={() => toggleMode('dark')}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                themeMode === 'dark'
                  ? 'bg-[var(--site-fg)] text-[var(--site-bg)] font-semibold shadow-sm'
                  : 'text-[var(--site-muted)] hover:text-[var(--site-fg)]'
              }`}
            >
              Dark
            </button>
          </div>
        </div>

        {/* Stack Deck / Expanded toggle */}
        <div className="hidden sm:flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              const next = !isStacked;
              setIsStacked(next);
              ui.configure({ stack: next ? 'stacked' : 'expanded' });
            }}
            className="text-xs px-2.5 py-1 rounded-full border border-[var(--site-border)] bg-[var(--site-surface)] text-[var(--site-muted)] hover:text-[var(--site-fg)] transition-colors"
          >
            {isStacked ? 'Deck Stacked' : 'List Expanded'}
          </button>
        </div>

        {/* Dismiss All */}
        <button
          type="button"
          onClick={() => {
            toast.dismissAll();
            if (soundEnabled) ui.sound('pop');
          }}
          className="text-xs font-medium text-[var(--site-muted)] hover:text-[var(--site-fg)] transition-colors underline underline-offset-4 decoration-[var(--site-border)]"
        >
          Dismiss all
        </button>
      </div>

      {/* 3. CATEGORIZED INTERACTIVE DEMO ROWS */}
      <div className="space-y-4 pt-2 text-left">
        {/* ROW 1: STATUS */}
        <div className="grid grid-cols-1 sm:grid-cols-[100px_1fr] items-center gap-3">
          <span className="text-xs font-semibold text-[var(--site-muted)]">Status</span>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={fireSave}
              className="px-4 py-2 rounded-full text-xs font-medium bg-[var(--site-surface-raised)] border border-[var(--site-border)] text-[var(--site-fg)] hover:bg-[var(--site-surface)] hover:border-blue-500/40 active:scale-95 transition-all shadow-sm"
            >
              Save
            </button>
            <button
              type="button"
              onClick={fireError}
              className="px-4 py-2 rounded-full text-xs font-medium bg-[var(--site-surface-raised)] border border-[var(--site-border)] text-[var(--site-fg)] hover:bg-[var(--site-surface)] hover:border-rose-500/40 active:scale-95 transition-all shadow-sm"
            >
              Error
            </button>
            <button
              type="button"
              onClick={fireWarning}
              className="px-4 py-2 rounded-full text-xs font-medium bg-[var(--site-surface-raised)] border border-[var(--site-border)] text-[var(--site-fg)] hover:bg-[var(--site-surface)] hover:border-amber-500/40 active:scale-95 transition-all shadow-sm"
            >
              Warning
            </button>
            <button
              type="button"
              onClick={fireInfo}
              className="px-4 py-2 rounded-full text-xs font-medium bg-[var(--site-surface-raised)] border border-[var(--site-border)] text-[var(--site-fg)] hover:bg-[var(--site-surface)] hover:border-blue-500/40 active:scale-95 transition-all shadow-sm"
            >
              Info
            </button>
            <button
              type="button"
              onClick={fireDescription}
              className="px-4 py-2 rounded-full text-xs font-medium bg-[var(--site-surface-raised)] border border-[var(--site-border)] text-[var(--site-fg)] hover:bg-[var(--site-surface)] hover:border-emerald-500/40 active:scale-95 transition-all shadow-sm"
            >
              Description
            </button>
          </div>
        </div>

        {/* ROW 2: PROGRESS */}
        <div className="grid grid-cols-1 sm:grid-cols-[100px_1fr] items-center gap-3">
          <span className="text-xs font-semibold text-[var(--site-muted)]">Progress</span>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={firePromise}
              className="px-4 py-2 rounded-full text-xs font-medium bg-[var(--site-surface-raised)] border border-[var(--site-border)] text-[var(--site-fg)] hover:bg-[var(--site-surface)] hover:border-blue-500/40 active:scale-95 transition-all shadow-sm"
            >
              Promise
            </button>
            <button
              type="button"
              onClick={fireSync}
              className="px-4 py-2 rounded-full text-xs font-medium bg-[var(--site-surface-raised)] border border-[var(--site-border)] text-[var(--site-fg)] hover:bg-[var(--site-surface)] hover:border-blue-500/40 active:scale-95 transition-all shadow-sm"
            >
              Sync
            </button>
            <button
              type="button"
              onClick={fireUpload}
              className="px-4 py-2 rounded-full text-xs font-medium bg-[var(--site-surface-raised)] border border-[var(--site-border)] text-[var(--site-fg)] hover:bg-[var(--site-surface)] hover:border-blue-500/40 active:scale-95 transition-all shadow-sm"
            >
              Upload
            </button>
            <button
              type="button"
              onClick={fireDownload}
              className="px-4 py-2 rounded-full text-xs font-medium bg-[var(--site-surface-raised)] border border-[var(--site-border)] text-[var(--site-fg)] hover:bg-[var(--site-surface)] hover:border-blue-500/40 active:scale-95 transition-all shadow-sm"
            >
              Download
            </button>
            <button
              type="button"
              onClick={fireOrder}
              className="px-4 py-2 rounded-full text-xs font-medium bg-[var(--site-surface-raised)] border border-[var(--site-border)] text-[var(--site-fg)] hover:bg-[var(--site-surface)] hover:border-blue-500/40 active:scale-95 transition-all shadow-sm"
            >
              Order
            </button>
            <button
              type="button"
              onClick={fireSequence}
              className="px-4 py-2 rounded-full text-xs font-medium bg-[var(--site-surface-raised)] border border-[var(--site-border)] text-[var(--site-fg)] hover:bg-[var(--site-surface)] hover:border-blue-500/40 active:scale-95 transition-all shadow-sm"
            >
              Sequence
            </button>
          </div>
        </div>

        {/* ROW 3: CONTENT */}
        <div className="grid grid-cols-1 sm:grid-cols-[100px_1fr] items-center gap-3">
          <span className="text-xs font-semibold text-[var(--site-muted)]">Content</span>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={fireMessage}
              className="px-4 py-2 rounded-full text-xs font-medium bg-[var(--site-surface-raised)] border border-[var(--site-border)] text-[var(--site-fg)] hover:bg-[var(--site-surface)] hover:border-purple-500/40 active:scale-95 transition-all shadow-sm"
            >
              Message
            </button>
            <button
              type="button"
              onClick={fireMeeting}
              className="px-4 py-2 rounded-full text-xs font-medium bg-[var(--site-surface-raised)] border border-[var(--site-border)] text-[var(--site-fg)] hover:bg-[var(--site-surface)] hover:border-emerald-500/40 active:scale-95 transition-all shadow-sm"
            >
              Meeting
            </button>
            <button
              type="button"
              onClick={fireInvite}
              className="px-4 py-2 rounded-full text-xs font-medium bg-[var(--site-surface-raised)] border border-[var(--site-border)] text-[var(--site-fg)] hover:bg-[var(--site-surface)] hover:border-rose-500/40 active:scale-95 transition-all shadow-sm"
            >
              Invite
            </button>
            <button
              type="button"
              onClick={fireMusic}
              className="px-4 py-2 rounded-full text-xs font-medium bg-[var(--site-surface-raised)] border border-[var(--site-border)] text-[var(--site-fg)] hover:bg-[var(--site-surface)] hover:border-indigo-500/40 active:scale-95 transition-all shadow-sm"
            >
              Music
            </button>
            <button
              type="button"
              onClick={fireCopy}
              className="px-4 py-2 rounded-full text-xs font-medium bg-[var(--site-surface-raised)] border border-[var(--site-border)] text-[var(--site-fg)] hover:bg-[var(--site-surface)] hover:border-blue-500/40 active:scale-95 transition-all shadow-sm"
            >
              Copy
            </button>
          </div>
        </div>

        {/* ROW 4: ACTIONS */}
        <div className="grid grid-cols-1 sm:grid-cols-[100px_1fr] items-center gap-3">
          <span className="text-xs font-semibold text-[var(--site-muted)]">Actions</span>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={fireUndo}
              className="px-4 py-2 rounded-full text-xs font-medium bg-[var(--site-surface-raised)] border border-[var(--site-border)] text-[var(--site-fg)] hover:bg-[var(--site-surface)] hover:border-emerald-500/40 active:scale-95 transition-all shadow-sm"
            >
              Undo
            </button>
            <button
              type="button"
              onClick={fireConfirmAction}
              className="px-4 py-2 rounded-full text-xs font-medium bg-[var(--site-surface-raised)] border border-[var(--site-border)] text-[var(--site-fg)] hover:bg-[var(--site-surface)] hover:border-amber-500/40 active:scale-95 transition-all shadow-sm"
            >
              Confirm
            </button>
            <button
              type="button"
              onClick={fireUpdate}
              className="px-4 py-2 rounded-full text-xs font-medium bg-[var(--site-surface-raised)] border border-[var(--site-border)] text-[var(--site-fg)] hover:bg-[var(--site-surface)] hover:border-blue-500/40 active:scale-95 transition-all shadow-sm"
            >
              Update
            </button>
            <button
              type="button"
              onClick={fireOffline}
              className="px-4 py-2 rounded-full text-xs font-medium bg-[var(--site-surface-raised)] border border-[var(--site-border)] text-[var(--site-fg)] hover:bg-[var(--site-surface)] hover:border-rose-500/40 active:scale-95 transition-all shadow-sm"
            >
              Offline
            </button>
          </div>
        </div>

        {/* ROW 5: SOUND */}
        <div className="grid grid-cols-1 sm:grid-cols-[100px_1fr] items-center gap-3">
          <span className="text-xs font-semibold text-[var(--site-muted)]">Sound</span>
          <div className="flex flex-wrap items-center gap-2">
            {(['success', 'error', 'warning', 'info', 'chime', 'ding', 'pop', 'bubble'] as const).map((cue) => (
              <button
                key={cue}
                type="button"
                onClick={() => fireSoundCue(cue)}
                className="px-4 py-2 rounded-full text-xs font-medium bg-[var(--site-surface-raised)] border border-[var(--site-border)] text-[var(--site-fg)] hover:bg-blue-500/10 hover:border-blue-500/40 active:scale-95 transition-all shadow-sm capitalize"
              >
                {cue} ♫
              </button>
            ))}
          </div>
        </div>

        {/* ROW 6: DIALOGS & SHEETS (Unique toastory superpower) */}
        <div className="grid grid-cols-1 sm:grid-cols-[100px_1fr] items-center gap-3 pt-2 border-t border-[var(--site-border)]">
          <span className="text-xs font-semibold text-blue-500">Dialogs</span>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={fireConfirmModal}
              className="px-4 py-2 rounded-full text-xs font-medium bg-purple-500/10 border border-purple-500/30 text-purple-700 dark:text-purple-300 hover:bg-purple-500/20 active:scale-95 transition-all shadow-sm"
            >
              Confirm Modal ↵
            </button>
            <button
              type="button"
              onClick={firePromptModal}
              className="px-4 py-2 rounded-full text-xs font-medium bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 hover:bg-amber-500/20 active:scale-95 transition-all shadow-sm"
            >
              Prompt Input ✎
            </button>
            <button
              type="button"
              onClick={fireBottomSheet}
              className="px-4 py-2 rounded-full text-xs font-medium bg-cyan-500/10 border border-cyan-500/30 text-cyan-700 dark:text-cyan-300 hover:bg-cyan-500/20 active:scale-95 transition-all shadow-sm"
            >
              Bottom Sheet ⇡
            </button>
          </div>
        </div>
      </div>

      {/* 4. THEME TOKENS & CODE SNIPPET TOOLBAR */}
      <div className="pt-3 border-t border-[var(--site-border)] space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Glass themes */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[var(--site-muted)] font-semibold mr-1">Glass Presets:</span>
            {THEMES.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => handleThemePreset(t.id)}
                className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all ${
                  activeTheme === t.id
                    ? 'bg-blue-600 text-white shadow-sm font-semibold'
                    : 'bg-[var(--site-surface)] text-[var(--site-muted)] hover:text-[var(--site-fg)] border border-[var(--site-border)]'
                }`}
              >
                {t.name}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setShowCode(!showCode)}
            className="text-blue-500 hover:underline font-semibold"
          >
            {showCode ? 'Hide Code Snippet ▲' : 'View Code Snippet ▼'}
          </button>
        </div>

        {showCode && (
          <div className="rounded-xl border border-[var(--site-border)] bg-[var(--site-card-bg)] overflow-hidden shadow-inner text-left">
            <pre className="p-4 text-xs font-mono overflow-x-auto text-[var(--site-fg)] leading-relaxed">
              <code>{codeSnippets[selectedDemoCode] || codeSnippets.Save}</code>
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
