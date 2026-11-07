'use client';

import React, { useState, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { ui, toast } from 'toastory';
import type { ToastPosition } from 'toastory';

function subscribeToTheme(callback: () => void) {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener('storage', callback);
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  return () => {
    window.removeEventListener('storage', callback);
    observer.disconnect();
  };
}

function getThemeSnapshot(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'dark';
  const saved = localStorage.getItem('toastory-theme');
  const docMode = document.documentElement.getAttribute('data-theme') as 'light' | 'dark' | null;
  return (saved === 'light' || saved === 'dark' ? saved : docMode) || 'dark';
}

function getThemeServerSnapshot(): 'light' | 'dark' {
  return 'dark';
}

type FrameworkTab = 'React' | 'Next.js' | 'Svelte' | 'Vue' | 'Angular' | 'Vanilla' | 'Native';

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
  { id: 'aurora', name: 'Aurora' },
  { id: 'essentials', name: 'Essentials' },
  { id: 'showcase', name: 'Showcase' },
  { id: 'sweet', name: 'Sweet Candy' },
  { id: 'neon', name: 'Cyber Neon' },
  { id: 'brutal', name: 'Neo-Brutal' },
];

export function HeroDemo() {
  const [activeFw, setActiveFw] = useState<FrameworkTab>('React');
  const [activePosition, setActivePosition] = useState<ToastPosition>('top-center');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [soundVolume, setSoundVolume] = useState(0.5);
  const themeMode = useSyncExternalStore(subscribeToTheme, getThemeSnapshot, getThemeServerSnapshot);
  const [activeTheme, setActiveTheme] = useState('ios-glass');
  const [isStacked, setIsStacked] = useState(true);
  const [cmdCopied, setCmdCopied] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);
  const [selectedDemoCode, setSelectedDemoCode] = useState<string>('Save');
  const [lastClickedDemo, setLastClickedDemo] = useState<string>('');

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
    if (typeof window !== 'undefined') {
      localStorage.setItem('toastory-theme', mode);
      document.documentElement.setAttribute('data-theme', mode);
      if (mode === 'light') {
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('light');
      } else {
        document.documentElement.classList.remove('light');
        document.documentElement.classList.add('dark');
      }
    }
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

  const triggerAnimation = (name: string) => {
    setLastClickedDemo(name);
    setTimeout(() => setLastClickedDemo(''), 400);
  };

  // Helper avatar
  const avatarInitials = (initials: string, color: string) => ({ initials, color });

  // --- DEMO ACTIONS ---
  const fireSave = () => {
    triggerAnimation('Save');
    setSelectedDemoCode('Save');
    toast.success('Changes saved', {
      position: activePosition,
      theme: activeTheme,
    });
  };

  const fireError = () => {
    triggerAnimation('Error');
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
    triggerAnimation('Warning');
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
    triggerAnimation('Info');
    setSelectedDemoCode('Info');
    toast.info('New version available', {
      position: activePosition,
      theme: activeTheme,
    });
  };

  const fireDescription = () => {
    triggerAnimation('Description');
    setSelectedDemoCode('Description');
    toast.success('Deployment ready', {
      description: 'my-app is live at my-app.vercel.app',
      position: activePosition,
      theme: activeTheme,
    });
  };

  const firePromise = () => {
    triggerAnimation('Promise');
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
    triggerAnimation('Sync');
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
    triggerAnimation('Upload');
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
    triggerAnimation('Download');
    setSelectedDemoCode('Download');
    let percent = 0;
    const id = toast.info('design-system.zip', {
      description: 'Downloading · 0%',
      position: activePosition,
      theme: activeTheme,
      avatar: avatarInitials('ZIP', '#3b82f6'),
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
    triggerAnimation('Order');
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
    triggerAnimation('Sequence');
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
    triggerAnimation('Message');
    setSelectedDemoCode('Message');
    toast.info('Sarah Chen', {
      description: 'Can you review the PR before standup?',
      position: activePosition,
      theme: activeTheme,
      avatar: avatarInitials('SC', '#6366f1'),
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
    triggerAnimation('Meeting');
    setSelectedDemoCode('Meeting');
    toast.info('Design sync in 5 min', {
      description: 'Room 4 · 6 attendees',
      position: activePosition,
      theme: activeTheme,
      avatar: avatarInitials('DS', '#10b981'),
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
    triggerAnimation('Invite');
    setSelectedDemoCode('Invite');
    toast.info('Alex invited you to Atlas', {
      description: 'Product design workspace · 12 members',
      position: activePosition,
      theme: activeTheme,
      avatar: avatarInitials('AL', '#f43f5e'),
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
    triggerAnimation('Music');
    setSelectedDemoCode('Music');
    toast.info('Midnight City', {
      description: 'M83 · Hurry Up, We’re Dreaming',
      position: activePosition,
      theme: activeTheme,
      avatar: avatarInitials('♫', '#8b5cf6'),
      action: {
        label: 'Next Track',
        onClick: () => {
          toast.info('Intro — The xx', {
            description: 'Playing next in queue',
            position: activePosition,
            avatar: avatarInitials('♪', '#3b82f6'),
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
    triggerAnimation('Copy');
    setSelectedDemoCode('Copy');
    toast.success('Link copied', {
      description: 'URL added to your system clipboard (⌘V)',
      position: activePosition,
      theme: activeTheme,
      duration: 2500,
    });
  };

  const fireUndo = () => {
    triggerAnimation('Undo');
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
    triggerAnimation('Confirm');
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
    triggerAnimation('Update');
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
    triggerAnimation('Offline');
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
  const fireSoundCue = (
    cue:
      | 'success'
      | 'error'
      | 'warning'
      | 'info'
      | 'chime'
      | 'ding'
      | 'pop'
      | 'bell'
      | 'message'
      | 'bubble'
      | 'marimba'
      | 'crystal'
      | 'subtle'
      | 'harp',
  ) => {
    triggerAnimation(`Sound:${cue}`);
    setSelectedDemoCode(`Sound:${cue}`);
    ui.sound(cue);
    toast.message(`Audio Cue: ${cue}`, {
      description: 'Zero-dependency Web Audio acoustic mallet synthesizer',
      duration: 1800,
      position: activePosition,
      theme: activeTheme,
    });
  };

  // v0.3.0 Showcase triggers (Dynamic Island, Robot Mascots, Rich Banner, Custom Discard, Toggle)
  const fireDynamicIsland = () => {
    triggerAnimation('Dynamic Island');
    setSelectedDemoCode('Dynamic Island');
    if (soundEnabled) ui.sound('marimba');
    toast.info('Incoming FaceTime Audio', {
      description: 'Elena Rostova · iPhone 16 Pro',
      island: true,
      position: 'top-center',
      theme: activeTheme,
      avatar: avatarInitials('ER', '#10b981'),
      duration: 6000,
      action: {
        label: 'Accept',
        onClick: () => toast.success('Call connected · 00:01', { island: true, position: 'top-center' }),
      },
      cancel: {
        label: 'Decline',
        onClick: () => toast.message('Call declined', { island: true, position: 'top-center' }),
      },
    });
  };

  const fireRobotWave = () => {
    triggerAnimation('Robot Wave');
    setSelectedDemoCode('Robot Wave');
    if (soundEnabled) ui.sound('crystal');
    toast.success('Welcome aboard, Commander!', {
      description: 'Animated SVG robot mascot with zero external image assets.',
      character: 'wave',
      position: activePosition,
      theme: activeTheme,
    });
  };

  const fireRobotThink = () => {
    triggerAnimation('Robot Think');
    setSelectedDemoCode('Robot Think');
    if (soundEnabled) ui.sound('bubble');
    toast.info('Analyzing repository graph…', {
      description: 'Evaluating 24workspace dependencies for tree-shaking.',
      character: 'think',
      position: activePosition,
      theme: activeTheme,
    });
  };

  const fireRobotShock = () => {
    triggerAnimation('Robot Shock');
    setSelectedDemoCode('Robot Shock');
    if (soundEnabled) ui.sound('error');
    toast.error('Rate limit threshold reached!', {
      description: ' Edge gateway throttled at 10,000 req/min.',
      character: 'shock',
      shake: true,
      position: activePosition,
      theme: activeTheme,
    });
  };

  const fireRichBanner = () => {
    triggerAnimation('Rich Banner');
    setSelectedDemoCode('Rich Banner');
    if (soundEnabled) ui.sound('harp');
    const bannerSvg = `data:image/svg+xml,${encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 180"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#2563eb"/><stop offset="50%" stop-color="#7c3aed"/><stop offset="100%" stop-color="#ec4899"/></linearGradient></defs><rect width="600" height="180" fill="url(#g)"/><circle cx="510" cy="40" r="90" fill="rgba(255,255,255,0.12)"/><text x="32" y="98" font-family="-apple-system,system-ui,sans-serif" font-size="28" font-weight="800" fill="#fff">toastory v0.3.1 Engine</text><text x="32" y="132" font-family="monospace" font-size="15" fill="rgba(255,255,255,0.85)">Real Spring Physics · 14 Sound Cues · Dynamic Island</text></svg>`
    )}`;
    toast.success('Release v0.3.1 Published', {
      description: 'Full spring physics + velocity fling dismissal is now live.',
      image: bannerSvg,
      kbd: '⌘B',
      timestamp: new Date(),
      position: activePosition,
      theme: activeTheme,
    });
  };

  const fireCustomDiscard = () => {
    triggerAnimation('Custom Discard');
    setSelectedDemoCode('Custom Discard');
    if (soundEnabled) ui.sound('subtle');
    toast.warning('Unsaved schema migration', {
      description: 'Click the custom discard pill or swipe in any direction to dismiss.',
      closeButton: true,
      discardText: 'Discard',
      position: activePosition,
      theme: activeTheme,
    });
  };

  const fireInlineSwitch = () => {
    triggerAnimation('Inline Switch');
    setSelectedDemoCode('Inline Switch');
    if (soundEnabled) ui.sound('pop');
    toast.info('Edge Cache Turbo Mode', {
      description: 'Automatically purge stale CDN nodes on git push.',
      kbd: '⌘E',
      toggle: {
        label: 'Turbo CDN',
        checked: true,
        onChange: (next: boolean) => {
          toast.message(`Turbo CDN ${next ? 'enabled' : 'disabled'}`, {
            duration: 1800,
            position: activePosition,
          });
        },
      },
      position: activePosition,
      theme: activeTheme,
    });
  };

  // Dialog triggers
  const fireConfirmModal = async () => {
    triggerAnimation('Dialog:Confirm');
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
    triggerAnimation('Dialog:Prompt');
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
    triggerAnimation('Dialog:BottomSheet');
    setSelectedDemoCode('Dialog:BottomSheet');
    ui.bottomSheet({
      title: 'Select Deployment Region',
      text: 'Choose an edge cluster nearest to your application users:',
      theme: activeTheme,
      confirmButton: { label: 'Deploy to us-east' },
      cancelButton: { label: 'Cancel' },
    });
  };

  const fireStepsModal = async () => {
    triggerAnimation('Dialog:Steps');
    setSelectedDemoCode('Dialog:Steps');
    const res = await ui.steps([
      {
        title: 'Step 1: Project Name',
        text: 'Choose a workspace identifier for your deployment:',
        input: 'text',
        placeholder: 'acme-cloud-prod',
      },
      {
        title: 'Step 2: Select Region',
        text: 'Pick your primary low-latency edge cluster:',
        input: 'select',
        options: [
          { value: 'us-east-1', label: 'US East (N. Virginia)' },
          { value: 'eu-central-1', label: 'EU Central (Frankfurt)' },
          { value: 'ap-southeast-1', label: 'Asia Pacific (Singapore)' },
        ],
      },
    ]);
    if (res.isConfirmed) {
      toast.success('Workspace provisioned!', {
        description: `Configured ${ JSON.stringify(res.values) }`,
        position: activePosition,
        theme: activeTheme,
      });
    }
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
    'Dynamic Island': `import { toast } from 'toastory';

toast.info('Incoming FaceTime Audio', {
  description: 'Elena Rostova · iPhone 16 Pro',
  island: true,
  position: 'top-center',
  action: { label: 'Accept', onClick: () => connectCall() },
  cancel: { label: 'Decline', onClick: () => endCall() }
});`,
    'Robot Wave': `import { toast } from 'toastory';

toast.success('Welcome aboard, Commander!', {
  description: 'Animated SVG robot mascot with zero external image assets.',
  character: 'wave',
  position: '${activePosition}',
  theme: '${activeTheme}'
});`,
    'Robot Think': `import { toast } from 'toastory';

toast.info('Analyzing repository graph…', {
  description: 'Evaluating 24 workspace dependencies for tree-shaking.',
  character: 'think',
  position: '${activePosition}'
});`,
    'Robot Shock': `import { toast } from 'toastory';

toast.error('Rate limit threshold reached!', {
  description: 'Edge gateway throttled at 10,000 req/min.',
  character: 'shock',
  shake: true,
  position: '${activePosition}'
});`,
    'Rich Banner': `import { toast } from 'toastory';

toast.success('Release v0.3.1 Published', {
  description: 'Full spring physics + velocity fling dismissal is now live.',
  image: '/assets/release-banner.png',
  kbd: '⌘B',
  timestamp: new Date()
});`,
    'Custom Discard': `import { toast } from 'toastory';

toast.warning('Unsaved schema migration', {
  description: 'Click the custom discard pill or swipe in any direction.',
  closeButton: true,
  discardText: 'Discard'
});`,
    'Inline Switch': `import { toast } from 'toastory';

toast.info('Edge Cache Turbo Mode', {
  description: 'Automatically purge stale CDN nodes on git push.',
  kbd: '⌘E',
  toggle: {
    label: 'Turbo CDN',
    checked: true,
    onChange: (enabled) => setTurboCdn(enabled)
  }
});`,
    'Dialog:Steps': `import { ui } from 'toastory';

const res = await ui.steps([
  { title: 'Step 1: Project Name', input: 'text', placeholder: 'acme-cloud-prod' },
  { title: 'Step 2: Select Region', input: 'select', options: [
    { value: 'us-east-1', label: 'US East (N. Virginia)' },
    { value: 'eu-central-1', label: 'EU Central (Frankfurt)' }
  ]}
]);`,
  };

  const handleCopySnippet = async () => {
    try {
      const code = codeSnippets[selectedDemoCode] || codeSnippets.Save;
      await navigator.clipboard.writeText(code);
      setCodeCopied(true);
      setTimeout(() => setCodeCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* 1. TOP INTERACTION ROW (Framework Tabs + Clean Command Pill + llms.txt) */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-2.5 sm:p-3 rounded-2xl bg-[var(--site-surface-raised)] border border-[var(--site-border)] shadow-sm backdrop-blur-xl">
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
                    ? 'bg-[var(--site-fg)] text-[var(--site-bg)] font-semibold shadow-sm scale-102'
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
          <div className="flex items-center gap-2.5 px-3.5 py-1 rounded-full bg-[var(--site-surface)] border border-[var(--site-border)] text-xs font-mono text-[var(--site-fg)] shadow-inner">
            <span className="select-all">{FRAMEWORK_INSTALL[activeFw]}</span>
            <button
              type="button"
              onClick={handleCopyCmd}
              className="px-2.5 py-0.5 rounded-full bg-[var(--site-fg)] text-[var(--site-bg)] font-sans text-[11px] font-semibold transition-all hover:opacity-90 active:scale-95"
            >
              {cmdCopied ? 'Copied ✓' : 'Copy'}
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

      {/* 2. UNIFIED SETTINGS BAR (Position 3x3 Matrix, Sound, Theme, Stack, Dismiss All) */}
      <div className="flex flex-wrap items-center justify-between gap-4 sm:gap-6 px-5 py-3 rounded-2xl bg-[var(--site-surface)]/70 dark:bg-[#12131d]/80 border border-[var(--site-border)] shadow-sm backdrop-blur-xl">
        {/* 7 Placements 3x3 Picker */}
        <div className="flex items-center gap-2.5">
          <span className="text-xs font-semibold text-[var(--site-muted)] uppercase tracking-wider">Position</span>
          <div
            className="grid grid-cols-3 gap-1 p-1 rounded-lg bg-[var(--site-surface-raised)] border border-[var(--site-border)] shadow-inner w-[76px] h-[76px]"
            role="group"
            aria-label="7 screen placement selector"
          >
            {/* Row 1 */}
            <button
              type="button"
              onClick={() => setPosition('top-left')}
              title="Top Left"
              aria-label="Top Left"
              className={`w-[20px] h-[20px] rounded-[4px] transition-all ${
                activePosition === 'top-left'
                  ? 'bg-[var(--site-fg)] shadow-sm scale-105'
                  : 'bg-[var(--site-surface)] hover:bg-blue-500/20'
              }`}
            />
            <button
              type="button"
              onClick={() => setPosition('top-center')}
              title="Top Center"
              aria-label="Top Center"
              className={`w-[20px] h-[20px] rounded-[4px] transition-all ${
                activePosition === 'top-center'
                  ? 'bg-[var(--site-fg)] shadow-sm scale-105'
                  : 'bg-[var(--site-surface)] hover:bg-blue-500/20'
              }`}
            />
            <button
              type="button"
              onClick={() => setPosition('top-right')}
              title="Top Right"
              aria-label="Top Right"
              className={`w-[20px] h-[20px] rounded-[4px] transition-all ${
                activePosition === 'top-right'
                  ? 'bg-[var(--site-fg)] shadow-sm scale-105'
                  : 'bg-[var(--site-surface)] hover:bg-blue-500/20'
              }`}
            />

            {/* Row 2 (Spacer, Center, Spacer) */}
            <div className="w-[20px] h-[20px] opacity-0 pointer-events-none" />
            <button
              type="button"
              onClick={() => setPosition('center')}
              title="Center (Middle Screen)"
              aria-label="Center (Middle Screen)"
              className={`w-[20px] h-[20px] rounded-[4px] transition-all flex items-center justify-center ${
                activePosition === 'center'
                  ? 'bg-[var(--site-fg)] shadow-sm scale-105'
                  : 'bg-[var(--site-surface)] hover:bg-blue-500/20'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${activePosition === 'center' ? 'bg-[var(--site-bg)]' : 'bg-[var(--site-muted)]'}`} />
            </button>
            <div className="w-[20px] h-[20px] opacity-0 pointer-events-none" />

            {/* Row 3 */}
            <button
              type="button"
              onClick={() => setPosition('bottom-left')}
              title="Bottom Left"
              aria-label="Bottom Left"
              className={`w-[20px] h-[20px] rounded-[4px] transition-all ${
                activePosition === 'bottom-left'
                  ? 'bg-[var(--site-fg)] shadow-sm scale-105'
                  : 'bg-[var(--site-surface)] hover:bg-blue-500/20'
              }`}
            />
            <button
              type="button"
              onClick={() => setPosition('bottom-center')}
              title="Bottom Center"
              aria-label="Bottom Center"
              className={`w-[20px] h-[20px] rounded-[4px] transition-all ${
                activePosition === 'bottom-center'
                  ? 'bg-[var(--site-fg)] shadow-sm scale-105'
                  : 'bg-[var(--site-surface)] hover:bg-blue-500/20'
              }`}
            />
            <button
              type="button"
              onClick={() => setPosition('bottom-right')}
              title="Bottom Right"
              aria-label="Bottom Right"
              className={`w-[20px] h-[20px] rounded-[4px] transition-all ${
                activePosition === 'bottom-right'
                  ? 'bg-[var(--site-fg)] shadow-sm scale-105'
                  : 'bg-[var(--site-surface)] hover:bg-blue-500/20'
              }`}
            />
          </div>
        </div>

        {/* Sound Toggle */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-[var(--site-muted)] uppercase tracking-wider">Sound</span>
          <div className="flex items-center p-0.5 rounded-full bg-[var(--site-surface-raised)] border border-[var(--site-border)] shadow-inner">
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
          {soundEnabled && (
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={soundVolume}
              onChange={(e) => {
                const vol = parseFloat(e.target.value);
                setSoundVolume(vol);
                ui.configure({ soundVolume: vol });
              }}
              title={`Volume: ${Math.round(soundVolume * 100)}%`}
              aria-label="Sound volume"
              className="w-16 h-1.5 accent-blue-500 bg-[var(--site-border)] rounded-lg cursor-pointer"
            />
          )}
        </div>

        {/* Theme Mode Toggle */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-[var(--site-muted)] uppercase tracking-wider">Theme</span>
          <div className="flex items-center p-0.5 rounded-full bg-[var(--site-surface-raised)] border border-[var(--site-border)] shadow-inner">
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
            className="text-xs px-3 py-1 rounded-full border border-[var(--site-border)] bg-[var(--site-surface-raised)] text-[var(--site-muted)] hover:text-[var(--site-fg)] transition-colors"
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
      <div className="glass-panel rounded-3xl p-5 sm:p-7 space-y-4 text-left">
        {/* ROW 0: v0.3.0 SHOWCASE (Dynamic Island, Robot Mascots, Rich Banner, Custom Discard, Switch) */}
        <div className="grid grid-cols-1 sm:grid-cols-[96px_1fr] items-center gap-3 pb-3.5 border-b border-[var(--site-border)]">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-purple-500 animate-pulse" aria-hidden="true" />
            <span className="text-xs font-bold text-purple-500 uppercase tracking-wider">v0.3.1 New</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {[
              { label: 'Dynamic Island', fn: fireDynamicIsland, badge: 'Morph' },
              { label: 'Robot Wave', fn: fireRobotWave, badge: 'SVG' },
              { label: 'Robot Think', fn: fireRobotThink },
              { label: 'Robot Shock', fn: fireRobotShock },
              { label: 'Rich Banner', fn: fireRichBanner },
              { label: 'Custom Discard', fn: fireCustomDiscard },
              { label: 'Inline Switch', fn: fireInlineSwitch },
            ].map(({ label, fn, badge }) => (
              <button
                key={label}
                type="button"
                onClick={fn}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-purple-500/10 border border-purple-500/30 text-[var(--site-fg)] hover:bg-purple-500/20 hover:border-purple-500/50 active:scale-95 transition-all shadow-sm ${
                  lastClickedDemo === label ? 'ring-2 ring-purple-500/60 scale-95' : ''
                }`}
              >
                <span>{label}</span>
                {badge && (
                  <span className="px-1.5 py-0.2 rounded-full text-[9px] font-mono uppercase bg-purple-500/25 text-purple-400">
                    {badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* ROW 1: STATUS */}
        <div className="grid grid-cols-1 sm:grid-cols-[96px_1fr] items-center gap-3">
          <span className="text-xs font-semibold text-[var(--site-muted)] uppercase tracking-wider">Status</span>
          <div className="flex flex-wrap items-center gap-2">
            {[
              { label: 'Save', fn: fireSave },
              { label: 'Error', fn: fireError },
              { label: 'Warning', fn: fireWarning },
              { label: 'Info', fn: fireInfo },
              { label: 'Description', fn: fireDescription },
            ].map(({ label, fn }) => (
              <button
                key={label}
                type="button"
                onClick={fn}
                className={`px-4 py-1.5 rounded-full text-xs font-medium bg-[var(--site-surface-raised)] border border-[var(--site-border)] text-[var(--site-fg)] hover:border-blue-500/40 hover:bg-[var(--site-surface)] active:scale-95 transition-all shadow-sm ${
                  lastClickedDemo === label ? 'ring-2 ring-blue-500/50 scale-95' : ''
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* ROW 2: PROGRESS */}
        <div className="grid grid-cols-1 sm:grid-cols-[96px_1fr] items-center gap-3">
          <span className="text-xs font-semibold text-[var(--site-muted)] uppercase tracking-wider">Progress</span>
          <div className="flex flex-wrap items-center gap-2">
            {[
              { label: 'Promise', fn: firePromise },
              { label: 'Sync', fn: fireSync },
              { label: 'Upload', fn: fireUpload },
              { label: 'Download', fn: fireDownload },
              { label: 'Order', fn: fireOrder },
              { label: 'Sequence', fn: fireSequence },
            ].map(({ label, fn }) => (
              <button
                key={label}
                type="button"
                onClick={fn}
                className={`px-4 py-1.5 rounded-full text-xs font-medium bg-[var(--site-surface-raised)] border border-[var(--site-border)] text-[var(--site-fg)] hover:border-blue-500/40 hover:bg-[var(--site-surface)] active:scale-95 transition-all shadow-sm ${
                  lastClickedDemo === label ? 'ring-2 ring-blue-500/50 scale-95' : ''
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* ROW 3: CONTENT */}
        <div className="grid grid-cols-1 sm:grid-cols-[96px_1fr] items-center gap-3">
          <span className="text-xs font-semibold text-[var(--site-muted)] uppercase tracking-wider">Content</span>
          <div className="flex flex-wrap items-center gap-2">
            {[
              { label: 'Message', fn: fireMessage },
              { label: 'Meeting', fn: fireMeeting },
              { label: 'Invite', fn: fireInvite },
              { label: 'Music', fn: fireMusic },
              { label: 'Copy', fn: fireCopy },
            ].map(({ label, fn }) => (
              <button
                key={label}
                type="button"
                onClick={fn}
                className={`px-4 py-1.5 rounded-full text-xs font-medium bg-[var(--site-surface-raised)] border border-[var(--site-border)] text-[var(--site-fg)] hover:border-purple-500/40 hover:bg-[var(--site-surface)] active:scale-95 transition-all shadow-sm ${
                  lastClickedDemo === label ? 'ring-2 ring-purple-500/50 scale-95' : ''
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* ROW 4: ACTIONS */}
        <div className="grid grid-cols-1 sm:grid-cols-[96px_1fr] items-center gap-3">
          <span className="text-xs font-semibold text-[var(--site-muted)] uppercase tracking-wider">Actions</span>
          <div className="flex flex-wrap items-center gap-2">
            {[
              { label: 'Undo', fn: fireUndo },
              { label: 'Confirm', fn: fireConfirmAction },
              { label: 'Update', fn: fireUpdate },
              { label: 'Offline', fn: fireOffline },
            ].map(({ label, fn }) => (
              <button
                key={label}
                type="button"
                onClick={fn}
                className={`px-4 py-1.5 rounded-full text-xs font-medium bg-[var(--site-surface-raised)] border border-[var(--site-border)] text-[var(--site-fg)] hover:border-emerald-500/40 hover:bg-[var(--site-surface)] active:scale-95 transition-all shadow-sm ${
                  lastClickedDemo === label ? 'ring-2 ring-emerald-500/50 scale-95' : ''
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* ROW 5: SOUND (14 Web Audio Synth Cues) */}
        <div className="grid grid-cols-1 sm:grid-cols-[96px_1fr] items-center gap-3">
          <span className="text-xs font-semibold text-[var(--site-muted)] uppercase tracking-wider">14 Sounds</span>
          <div className="flex flex-wrap items-center gap-2">
            {(
              [
                'success',
                'error',
                'warning',
                'info',
                'chime',
                'ding',
                'pop',
                'bell',
                'message',
                'bubble',
                'marimba',
                'crystal',
                'subtle',
                'harp',
              ] as const
            ).map((cue) => (
              <button
                key={cue}
                type="button"
                onClick={() => fireSoundCue(cue)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium bg-[var(--site-surface-raised)] border border-[var(--site-border)] text-[var(--site-fg)] hover:bg-blue-500/10 hover:border-blue-500/40 active:scale-95 transition-all shadow-sm capitalize ${
                  lastClickedDemo === `Sound:${cue}` ? 'ring-2 ring-blue-500/50 scale-95' : ''
                }`}
              >
                {cue} ♫
              </button>
            ))}
          </div>
        </div>

        {/* ROW 6: DIALOGS & SHEETS */}
        <div className="grid grid-cols-1 sm:grid-cols-[96px_1fr] items-center gap-3 pt-3 border-t border-[var(--site-border)]">
          <span className="text-xs font-semibold text-blue-500 uppercase tracking-wider">Dialogs</span>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={fireConfirmModal}
              className="px-4 py-1.5 rounded-full text-xs font-medium bg-purple-500/10 border border-purple-500/30 text-purple-700 dark:text-purple-300 hover:bg-purple-500/20 active:scale-95 transition-all shadow-sm"
            >
              Confirm Modal ↵
            </button>
            <button
              type="button"
              onClick={firePromptModal}
              className="px-4 py-1.5 rounded-full text-xs font-medium bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 hover:bg-amber-500/20 active:scale-95 transition-all shadow-sm"
            >
              Prompt Input ✎
            </button>
            <button
              type="button"
              onClick={fireBottomSheet}
              className="px-4 py-1.5 rounded-full text-xs font-medium bg-cyan-500/10 border border-cyan-500/30 text-cyan-700 dark:text-cyan-300 hover:bg-cyan-500/20 active:scale-95 transition-all shadow-sm"
            >
              Bottom Sheet ⇡
            </button>
            <button
              type="button"
              onClick={fireStepsModal}
              className="px-4 py-1.5 rounded-full text-xs font-medium bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/20 active:scale-95 transition-all shadow-sm"
            >
              Multi-Step Wizard ❖
            </button>
          </div>
        </div>

        {/* 4. THEME PRESETS & CODE SNIPPET TOOLBAR */}
        <div className="pt-3.5 border-t border-[var(--site-border)] space-y-3">
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
              {showCode ? 'Hide Code Snippet ▲' : 'Inspect Live Code ▼'}
            </button>
          </div>

          {showCode && (
            <div className="rounded-xl border border-[var(--site-border)] bg-[var(--site-card-bg)] overflow-hidden shadow-inner text-left">
              <div className="flex items-center justify-between px-4 py-2 border-b border-[var(--site-border)] bg-[var(--site-surface)] text-xs text-[var(--site-muted)]">
                <span>Code Snippet ({selectedDemoCode})</span>
                <button
                  type="button"
                  onClick={handleCopySnippet}
                  className="hover:text-[var(--site-fg)] transition-colors font-medium"
                >
                  {codeCopied ? 'Copied ✓' : 'Copy'}
                </button>
              </div>
              <pre className="p-4 text-xs font-mono overflow-x-auto text-[var(--site-fg)] leading-relaxed">
                <code>{codeSnippets[selectedDemoCode] || codeSnippets.Save}</code>
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
