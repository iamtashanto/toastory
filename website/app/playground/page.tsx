'use client';

import React, { useState, useEffect } from 'react';
import { ui, toast } from 'toastory';
import type { ToastPosition, RobotCharacter } from 'toastory';
import { THEME_REGISTRY } from '@/lib/theme-generator';
import { CodeSnippet } from '@/components/CodeSnippet';

const SAMPLE_BANNER_SVG = `data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 160"><defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#2563eb"/><stop offset="50%" stop-color="#7c3aed"/><stop offset="100%" stop-color="#ec4899"/></linearGradient></defs><rect width="600" height="160" fill="url(#bg)"/><circle cx="520" cy="30" r="80" fill="rgba(255,255,255,0.14)"/><text x="28" y="88" font-family="-apple-system,system-ui,sans-serif" font-size="24" font-weight="800" fill="#fff">toastory v0.3.1 Studio</text><text x="28" y="120" font-family="monospace" font-size="13" fill="rgba(255,255,255,0.85)">Spring Physics · Dynamic Island · 10 SVG Robots</text></svg>`
)}`;

type FrameworkTab = 'react' | 'nextjs' | 'js' | 'vue' | 'nuxt' | 'angular' | 'svelte' | 'electron' | 'native';

export default function PlaygroundPage() {
  const [theme, setTheme] = useState('ios-glass');
  const [mode, setMode] = useState<'dark' | 'light'>('dark');
  const [position, setPosition] = useState<ToastPosition>('top-center');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [soundCue, setSoundCue] = useState<string>('crystal');
  const [soundVolume, setSoundVolume] = useState(0.5);
  const [duration, setDuration] = useState(4000);
  const [richColors, setRichColors] = useState(false);
  const [invert, setInvert] = useState(false);
  const [closeButton, setCloseButton] = useState(true);
  const [feedbackKind, setFeedbackKind] = useState<
    'toast' | 'promise' | 'confirm' | 'prompt' | 'alert' | 'steps' | 'sheet' | 'bottomSheet' | 'loading'
  >('toast');
  const [toastType, setToastType] = useState<'success' | 'error' | 'info' | 'warning' | 'loading'>('success');
  const [character, setCharacter] = useState<'none' | RobotCharacter>('none');
  const [island, setIsland] = useState(false);
  const [hud, setHud] = useState(false);
  const [shake, setShake] = useState(false);
  const [glow, setGlow] = useState(false);
  const [gradientBorder, setGradientBorder] = useState(false);
  const [showBannerImage, setShowBannerImage] = useState(false);
  const [discardText, setDiscardText] = useState('');
  const [kbdBadge, setKbdBadge] = useState('');
  const [showTimestamp, setShowTimestamp] = useState(false);
  const [showToggle, setShowToggle] = useState(false);
  const [dialogTone, setDialogTone] = useState<'info' | 'warning' | 'danger'>('danger');
  const [promptInputType, setPromptInputType] = useState<
    'text' | 'email' | 'password' | 'number' | 'range' | 'select' | 'date' | 'otp'
  >('text');
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
  const [activeCodeTab, setActiveCodeTab] = useState<FrameworkTab>('react');
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
    toast.success('Playground configuration URL copied to clipboard!', { theme });
    setTimeout(() => setShareFeedback(false), 2500);
  };

  const applyPreset = (
    preset:
      | 'deployment'
      | 'robot'
      | 'island'
      | 'banner'
      | 'promise'
      | 'danger'
      | 'otp'
      | 'wizard'
      | 'sheet'
      | 'bottomSheet'
      | 'loading',
  ) => {
    setCharacter('none');
    setIsland(false);
    setHud(false);
    setShake(false);
    setGlow(false);
    setGradientBorder(false);
    setShowBannerImage(false);
    setDiscardText('');
    setKbdBadge('');
    setShowTimestamp(false);
    setShowToggle(false);

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
      setSoundCue('success');
    } else if (preset === 'robot') {
      setFeedbackKind('toast');
      setToastType('success');
      setCharacter('wave');
      setTitle('AI Build Agent Ready');
      setDescription('Animated SVG robot mascot with spring entrance physics.');
      setActionLabel('Inspect');
      setCancelLabel('Later');
      setTheme('ios-glass');
      setSoundCue('crystal');
      setGlow(true);
    } else if (preset === 'island') {
      setFeedbackKind('toast');
      setToastType('info');
      setIsland(true);
      setTitle('FaceTime Audio Connected');
      setDescription('Elena Rostova · 02:45 duration');
      setActionLabel('End Call');
      setCancelLabel('Mute');
      setTheme('ios-glass');
      setSoundCue('chime');
    } else if (preset === 'banner') {
      setFeedbackKind('toast');
      setToastType('success');
      setShowBannerImage(true);
      setKbdBadge('⌘B');
      setDiscardText('Discard');
      setShowTimestamp(true);
      setShowToggle(true);
      setTitle('toastory v0.3.4 Engine');
      setDescription('Full-bleed header banner, custom discard label, and inline switch.');
      setActionLabel('Explore');
      setCancelLabel('');
      setTheme('ios-glass');
      setSoundCue('mallet');
    } else if (preset === 'promise') {
      setFeedbackKind('promise');
      setTitle('Syncing cloud database...');
      setDescription('Streaming latest database snapshot to edge clusters.');
      setTheme('ios-glass');
      setSoundCue('pop');
    } else if (preset === 'danger') {
      setFeedbackKind('confirm');
      setDialogTone('danger');
      setTitle('Delete Production Cluster?');
      setDescription('This operation permanently terminates 48 database instances and cannot be undone.');
      setActionLabel('Delete Cluster');
      setCancelLabel('Cancel');
      setBackdrop('blur');
      setTheme('ios-glass');
    } else if (preset === 'otp') {
      setFeedbackKind('prompt');
      setPromptInputType('otp');
      setTitle('Two-Factor Authentication');
      setDescription('Enter the 6-digit security code sent to your registered authenticator app:');
      setActionLabel('Verify Code');
      setCancelLabel('Cancel');
      setTheme('ios-glass');
    } else if (preset === 'wizard') {
      setFeedbackKind('steps');
      setTitle('Project Setup Wizard');
      setDescription('Configure environment and initialize cloud workspace:');
      setActionLabel('Next Step');
      setCancelLabel('Back');
      setTheme('ios-glass');
    } else if (preset === 'sheet') {
      setFeedbackKind('sheet');
      setTitle('Export Format Options');
      setDescription('Choose artifact output compression:');
      setActionLabel('Export');
      setCancelLabel('Cancel');
      setTheme('ios-glass');
    } else if (preset === 'bottomSheet') {
      setFeedbackKind('bottomSheet');
      setTitle('Deployment Region Settings');
      setDescription('Select primary routing data center and failover policy:');
      setActionLabel('Save Region');
      setCancelLabel('Close');
      setTheme('ios-glass');
    } else if (preset === 'loading') {
      setFeedbackKind('loading');
      setTitle('Compiling Next.js static pages...');
      setDescription('Analyzing production bundle traces and assets:');
      setTheme('ios-glass');
    }
  };

  const handleReset = () => {
    applyPreset('deployment');
    setPosition('top-center');
    setMode('dark');
    setSoundEnabled(true);
    setSoundVolume(0.5);
    setDuration(4000);
    toast.info('Playground reset to default configuration.');
  };

  const playSynthesizerSound = (cue: string) => {
    if (!soundEnabled) return;
    try {
      ui.sound(cue as Parameters<typeof ui.sound>[0], soundVolume);
    } catch {
      // AudioContext unavailable in non-interactive state
    }
  };

  const handleFire = async () => {
    ui.configure({
      theme,
      mode,
      position,
      duration,
      richColors,
      invert,
      closeButton,
    });

    if (feedbackKind === 'toast') {
      playSynthesizerSound(soundCue);

      const toastOptions: Record<string, unknown> = {
        description: description || undefined,
        duration,
        position,
        theme,
        richColors,
        invert,
        closeButton,
        progress: progress === 'bar' ? true : progress === 'ring' ? 'ring' : false,
        swipe: swipeEnabled,
      };

      if (character !== 'none') toastOptions.character = character;
      if (island) toastOptions.island = true;
      if (hud) toastOptions.hud = true;
      if (shake) toastOptions.shake = true;
      if (glow) toastOptions.glow = true;
      if (gradientBorder) toastOptions.gradientBorder = true;
      if (showBannerImage) toastOptions.image = SAMPLE_BANNER_SVG;
      if (discardText.trim()) toastOptions.discardText = discardText.trim();
      if (kbdBadge.trim()) toastOptions.kbd = kbdBadge.trim();
      if (showTimestamp) toastOptions.timestamp = new Date();
      if (showToggle) {
        toastOptions.toggle = {
          label: 'Live Sync',
          checked: true,
          onChange: (v: boolean) => {
            toast.info(`Live Sync toggled: ${v ? 'ON' : 'OFF'}`, { theme });
          },
        };
      }
      if (actionLabel.trim()) {
        toastOptions.action = {
          label: actionLabel.trim(),
          onClick: () => {
            toast.success(`Action "${actionLabel.trim()}" completed!`, { theme });
          },
        };
      }
      if (cancelLabel.trim()) {
        toastOptions.cancel = {
          label: cancelLabel.trim(),
          onClick: () => {
            toast.info(`Dismissed via "${cancelLabel.trim()}"`, { theme });
          },
        };
      }

      toast[toastType](title, toastOptions);
    } else if (feedbackKind === 'promise') {
      const asyncTask = new Promise<{ items: number }>((resolve, reject) => {
        setTimeout(() => {
          if (Math.random() > 0.15) {
            resolve({ items: 24 });
          } else {
            reject(new Error('Network gateway timeout after 2000ms'));
          }
        }, 2000);
      });

      toast.promise(
        asyncTask,
        {
          loading: 'Syncing cloud database...',
          success: (data) => `Synchronized ${data.items} database records successfully!`,
          error: (err) => `Sync failed: ${err instanceof Error ? err.message : String(err)}`,
        },
        { theme, position },
      );
    } else if (feedbackKind === 'confirm') {
      const res = await ui.confirm({
        title,
        text: description,
        tone: dialogTone,
        backdrop,
        draggable,
        reverseButtons,
        allowOutsideClick,
        allowEscape,
        theme,
        confirmButton: { label: actionLabel || 'Confirm Action' },
        cancelButton: { label: cancelLabel || 'Cancel' },
      });
      if (res.isConfirmed) {
        toast.success('Confirmed by user!', { theme });
      } else {
        toast.info(`Dismissed via: ${res.dismiss || 'cancel'}`, { theme });
      }
    } else if (feedbackKind === 'alert') {
      await ui.alert({
        title,
        text: description,
        tone: dialogTone,
        backdrop,
        theme,
        confirmButton: { label: actionLabel || 'Acknowledge' },
      });
      toast.info('Alert acknowledged', { theme });
    } else if (feedbackKind === 'prompt') {
      const res = await ui.prompt({
        title,
        text: description,
        input: promptInputType,
        backdrop,
        theme,
        inputValue: promptInputType === 'email' ? 'dev@toastory.dev' : '',
        placeholder: 'Enter requested value...',
        validate: (v) => (!v ? 'This field cannot be left blank' : undefined),
        confirmButton: { label: actionLabel || 'Submit Value' },
        cancelButton: { label: cancelLabel || 'Cancel' },
      });
      if (res.isConfirmed) {
        toast.success(`Prompt submitted: "${res.value}"`, { theme });
      }
    } else if (feedbackKind === 'steps') {
      const steps = [
        {
          title: 'Step 1: Workspace Identifier',
          text: 'Name your development team workspace:',
          input: 'text' as const,
          placeholder: 'e.g. acme-corp',
          validate: (v: unknown) => (!v ? 'Identifier required' : undefined),
        },
        {
          title: 'Step 2: Region Selection',
          text: 'Choose primary datacenter region:',
          input: 'select' as const,
          options: ['us-east-1 (N. Virginia)', 'eu-central-1 (Frankfurt)', 'ap-southeast-1 (Singapore)'],
        },
        {
          title: 'Step 3: Access Level',
          text: 'Select your team authorization tier:',
          input: 'radio' as const,
          options: ['Standard Developer', 'Security Lead', 'Organization Admin'],
        },
      ];
      const res = await ui.steps(steps);
      if (res.isConfirmed) {
        toast.success(`Completed 3-step wizard! Workspace: "${res.value}"`, { theme });
      }
    } else if (feedbackKind === 'sheet') {
      const res = await ui.sheet({
        title,
        theme,
        backdrop,
        actions: [
          { label: 'Download JSON Artifact', value: 'json' },
          { label: 'Export Compressed TAR.GZ', value: 'tar' },
          { label: 'Delete Cached Bundle', value: 'delete', tone: 'danger' },
        ],
        cancel: { label: cancelLabel || 'Cancel' },
      });
      if (res.isConfirmed) {
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

  // Keyboard shortcut: Press Enter or Cmd+Enter to fire feedback
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault();
        document.getElementById('playground-fire-btn')?.click();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Generate dynamic, idiomatic code for all 9 frameworks
  const getGeneratedSnippet = (): string => {
    const extraOpts: string[] = [];
    if (duration !== 4000) extraOpts.push(`      duration: ${duration},`);
    if (richColors) extraOpts.push(`      richColors: true,`);
    if (invert) extraOpts.push(`      invert: true,`);
    if (!closeButton) extraOpts.push(`      closeButton: false,`);
    if (character !== 'none') extraOpts.push(`      character: '${character}',`);
    if (island) extraOpts.push(`      island: true,`);
    if (hud) extraOpts.push(`      hud: true,`);
    if (shake) extraOpts.push(`      shake: true,`);
    if (glow) extraOpts.push(`      glow: true,`);
    if (gradientBorder) extraOpts.push(`      gradientBorder: true,`);
    if (showBannerImage) extraOpts.push(`      image: '/assets/banner.png',`);
    if (discardText.trim()) extraOpts.push(`      discardText: '${discardText.trim()}',`);
    if (kbdBadge.trim()) extraOpts.push(`      kbd: '${kbdBadge.trim()}',`);
    if (showTimestamp) extraOpts.push(`      timestamp: new Date(),`);
    if (showToggle) extraOpts.push(`      toggle: { label: 'Live Sync', checked: true, onChange: (v) => console.log(v) },`);
    if (progress !== 'none') extraOpts.push(`      progress: ${progress === 'bar'},`);
    if (actionLabel.trim()) extraOpts.push(`      action: { label: '${actionLabel.trim()}', onClick: () => console.log('Action triggered') },`);
    if (cancelLabel.trim()) extraOpts.push(`      cancel: { label: '${cancelLabel.trim()}' },`);

    const optionsBody = extraOpts.length > 0 ? `,\n${extraOpts.join('\n')}` : '';

    // 1. REACT
    if (activeCodeTab === 'react') {
      if (feedbackKind === 'toast') {
        return `import { Toaster, toast } from 'toastory/react';
import 'toastory/themes/${theme}.css';

export default function App() {
  const triggerNotification = () => {
    toast.${toastType}('${title}', {
      description: '${description}',
      position: '${position}'${optionsBody}
    });
  };

  return (
    <div>
      <Toaster theme="${theme}" mode="${mode}" position="${position}" />
      <button onClick={triggerNotification}>Trigger Notification</button>
    </div>
  );
}`;
      }
      if (feedbackKind === 'promise') {
        return `import { Toaster, toast } from 'toastory/react';
import 'toastory/themes/${theme}.css';

export default function AsyncSync() {
  const syncData = () => {
    toast.promise(
      fetch('/api/sync').then(res => res.json()),
      {
        loading: 'Syncing database snapshot...',
        success: (data) => \`Synced \${data.count} records successfully!\`,
        error: 'Failed to synchronize with edge clusters.'
      },
      { theme: '${theme}', position: '${position}' }
    );
  };

  return (
    <>
      <Toaster theme="${theme}" position="${position}" />
      <button onClick={syncData}>Start Async Operation</button>
    </>
  );
}`;
      }
      if (feedbackKind === 'confirm' || feedbackKind === 'alert') {
        return `import { ui } from 'toastory';
import 'toastory/themes/${theme}.css';

export default function DialogModal() {
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
      console.log('Action confirmed');
    }
  };

  return <button onClick={handleAction}>Open Modal</button>;
}`;
      }
      if (feedbackKind === 'prompt') {
        return `import { ui } from 'toastory';
import 'toastory/themes/${theme}.css';

export default function PromptDialog() {
  const askInput = async () => {
    const res = await ui.prompt({
      title: '${title}',
      text: '${description}',
      input: '${promptInputType}',
      backdrop: '${backdrop}',
      theme: '${theme}',
      validate: (val) => (!val ? 'Input required' : undefined)
    });
    if (res.isConfirmed) {
      console.log('Submitted value:', res.value);
    }
  };

  return <button onClick={askInput}>Open Prompt</button>;
}`;
      }
      if (feedbackKind === 'bottomSheet' || feedbackKind === 'sheet') {
        return `import { ui } from 'toastory';
import 'toastory/themes/${theme}.css';

export default function SheetTrigger() {
  const openSheet = () => {
    ui.${feedbackKind === 'bottomSheet' ? 'bottomSheet' : 'sheet'}({
      title: '${title}',
      text: '${description}',
      backdrop: '${backdrop}',
      theme: '${theme}',
      confirmButton: { label: '${actionLabel || 'Apply'}' }
    });
  };

  return <button onClick={openSheet}>Open Sheet</button>;
}`;
      }
      return `import { ui } from 'toastory';
import 'toastory/themes/${theme}.css';

export default function LoadingDemo() {
  const runTask = () => {
    const handle = ui.loading({ text: 'Processing data bundle...', progress: 0.3 });
    setTimeout(() => handle.update({ progress: 0.8, text: 'Finalizing modules...' }), 1000);
    setTimeout(() => handle.close(), 2000);
  };

  return <button onClick={runTask}>Execute Operation</button>;
}`;
    }

    // 2. NEXT.JS
    if (activeCodeTab === 'nextjs') {
      return `'use client';

import { Toaster, toast } from 'toastory/react';
import 'toastory/themes/${theme}.css';

export default function NotificationButton() {
  const showFeedback = () => {
    toast.${toastType}('${title}', {
      description: '${description}',
      position: '${position}'${optionsBody}
    });
  };

  return (
    <>
      <Toaster theme="${theme}" mode="${mode}" position="${position}" />
      <button onClick={showFeedback} className="px-4 py-2 rounded-lg bg-blue-600 text-white">
        Trigger Feedback
      </button>
    </>
  );
}`;
    }

    // 3. PLAIN JS
    if (activeCodeTab === 'js') {
      if (feedbackKind === 'toast') {
        return `import { toast, ui } from 'toastory';
import 'toastory/themes/${theme}.css';

ui.configure({
  theme: '${theme}',
  mode: '${mode}',
  position: '${position}',
  duration: ${duration}
});

document.getElementById('notify-btn')?.addEventListener('click', () => {
  toast.${toastType}('${title}', {
    description: '${description}'${optionsBody}
  });
});`;
      }
      return `import { ui } from 'toastory';
import 'toastory/themes/${theme}.css';

ui.configure({ theme: '${theme}', mode: '${mode}' });

document.getElementById('modal-btn')?.addEventListener('click', async () => {
  const res = await ui.confirm({
    title: '${title}',
    text: '${description}',
    tone: '${dialogTone}',
    backdrop: '${backdrop}'
  });
  if (res.isConfirmed) {
    console.log('User confirmed');
  }
});`;
    }

    // 4. VUE
    if (activeCodeTab === 'vue') {
      return `<script setup lang="ts">
import { Toaster, toast } from 'toastory/vue';
import 'toastory/themes/${theme}.css';

function triggerNotification() {
  toast.${toastType}('${title}', {
    description: '${description}',
    position: '${position}'${optionsBody}
  });
}
</script>

<template>
  <div>
    <Toaster theme="${theme}" mode="${mode}" position="${position}" />
    <button @click="triggerNotification">Trigger Notification</button>
  </div>
</template>`;
    }

    // 5. NUXT
    if (activeCodeTab === 'nuxt') {
      return `<!-- components/FeedbackTrigger.vue -->
<script setup lang="ts">
import { Toaster, toast } from 'toastory/vue';
import 'toastory/themes/${theme}.css';

const showNotice = () => {
  toast.${toastType}('${title}', {
    description: '${description}',
    position: '${position}'${optionsBody}
  });
};
</script>

<template>
  <div>
    <ClientOnly>
      <Toaster theme="${theme}" mode="${mode}" position="${position}" />
    </ClientOnly>
    <button @click="showNotice">Show Notification</button>
  </div>
</template>`;
    }

    // 6. ANGULAR
    if (activeCodeTab === 'angular') {
      return `import { Component, OnInit } from '@angular/core';
import { toast, ui } from 'toastory';
import 'toastory/themes/${theme}.css';

@Component({
  selector: 'app-feedback-trigger',
  standalone: true,
  template: \`
    <button (click)="triggerFeedback()">Trigger Notification</button>
  \`
})
export class FeedbackTriggerComponent implements OnInit {
  ngOnInit() {
    ui.configure({
      theme: '${theme}',
      mode: '${mode}',
      position: '${position}'
    });
  }

  triggerFeedback() {
    toast.${toastType}('${title}', {
      description: '${description}'${optionsBody}
    });
  }
}`;
    }

    // 7. SVELTE
    if (activeCodeTab === 'svelte') {
      return `<script lang="ts">
  import { Toaster, toast } from 'toastory/svelte';
  import 'toastory/themes/${theme}.css';

  function trigger() {
    toast.${toastType}('${title}', {
      description: '${description}',
      position: '${position}'${optionsBody}
    });
  }
</script>

<Toaster theme="${theme}" mode="${mode}" position="${position}" />
<button on:click={trigger}>Trigger Notification</button>`;
    }

    // 8. ELECTRON
    if (activeCodeTab === 'electron') {
      return `// Renderer process
import { toast, ui } from 'toastory';
import 'toastory/themes/${theme}.css';

ui.configure({
  theme: '${theme}',
  mode: '${mode}',
  position: '${position}'
});

export function notifyNativeWindow() {
  toast.${toastType}('${title}', {
    description: '${description}',
    sound: 'crystal'${optionsBody}
  });
}`;
    }

    // 9. REACT NATIVE
    return `import React from 'react';
import { View, Button } from 'react-native';
import { Toaster, toast } from 'toastory/native';

export default function MobileScreen() {
  const triggerNativeToast = () => {
    toast.${toastType}('${title}', {
      description: '${description}',
      position: 'top'${character !== 'none' ? `,\n      character: '${character}'` : ''}
    });
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
      <Toaster position="top" />
      <Button title="Trigger Native Toast" onPress={triggerNativeToast} />
    </View>
  );
}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8 text-left">
      {/* Studio Header */}
      <div className="border-b border-[var(--site-border)] pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              v0.3.1 Active Engine
            </span>
            <span className="text-xs text-[var(--site-muted)]">Real Spring Physics · 21 Themes · 9 Frameworks</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[var(--site-fg)] tracking-tight">
            toastory Studio Playground
          </h1>
          <p className="text-sm sm:text-base text-[var(--site-muted)] mt-1 max-w-2xl">
            Trigger live spring animations, dynamic island morphing, and glass dialogs directly in your browser, then export copy-ready code.
          </p>
        </div>

        {/* Global Studio Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleShareUrl}
            className="px-3.5 py-2 rounded-xl border border-[var(--site-border)] bg-[var(--site-surface-raised)] hover:bg-[var(--site-surface)] text-xs font-semibold text-[var(--site-fg)] transition-all shadow-sm flex items-center gap-1.5"
            title="Share configuration link"
          >
            <span>{shareFeedback ? 'Copied Link!' : 'Share Preset URL'}</span>
            <span className="text-[10px]">🔗</span>
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="px-3 py-2 rounded-xl border border-[var(--site-border)] bg-[var(--site-surface)] hover:bg-[var(--site-surface-raised)] text-xs font-semibold text-[var(--site-muted)] hover:text-[var(--site-fg)] transition-colors"
          >
            Reset Defaults
          </button>

          <a
            href="https://www.supportkori.com/iamtashanto"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-2 rounded-xl border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-xs font-semibold text-rose-400 transition-colors flex items-center gap-1"
          >
            <span>Support</span> ♥
          </a>
        </div>
      </div>

      {/* Quick Presets Strip */}
      <div className="space-y-2">
        <span className="text-xs font-semibold text-[var(--site-muted)] uppercase tracking-wider">
          Instant Showcase Presets:
        </span>
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: 'deployment', label: 'Deployment', icon: '🚀' },
            { id: 'robot', label: 'Robot Mascot', icon: '🤖' },
            { id: 'island', label: 'Dynamic Island', icon: '🏝' },
            { id: 'banner', label: 'Header Banner', icon: '🎨' },
            { id: 'promise', label: 'Async Promise', icon: '⏳' },
            { id: 'danger', label: 'Danger Dialog', icon: '⚠️' },
            { id: 'otp', label: 'OTP Verification', icon: '🔢' },
            { id: 'wizard', label: 'Wizard Steps', icon: '📋' },
            { id: 'sheet', label: 'Action Sheet', icon: '📱' },
            { id: 'bottomSheet', label: 'Bottom Sheet', icon: '📑' },
            { id: 'loading', label: 'Loading Overlay', icon: '↻' },
          ].map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => applyPreset(p.id as Parameters<typeof applyPreset>[0])}
              className="px-3 py-1.5 rounded-xl border border-[var(--site-border)] bg-[var(--site-surface-raised)] hover:bg-blue-600/10 hover:border-blue-500/40 hover:text-blue-400 text-xs font-medium text-[var(--site-fg)] transition-all shadow-sm flex items-center gap-1.5"
            >
              <span>{p.icon}</span>
              <span>{p.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Studio Two-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Customization Controls (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          {/* Card 1: Feedback Kind & Preset Type */}
          <div className="p-5 rounded-2xl border border-[var(--site-border)] bg-[var(--site-card-bg)] space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-[var(--site-border)] pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--site-fg)]">
                1. Feedback Component Kind
              </span>
              <span className="text-xs text-blue-500 font-mono font-medium">ui.{feedbackKind}</span>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {[
                { id: 'toast', label: 'Toast' },
                { id: 'promise', label: 'Promise' },
                { id: 'confirm', label: 'Confirm' },
                { id: 'prompt', label: 'Prompt' },
                { id: 'alert', label: 'Alert' },
                { id: 'steps', label: 'Steps' },
                { id: 'sheet', label: 'Action Sheet' },
                { id: 'bottomSheet', label: 'Bottom Sheet' },
                { id: 'loading', label: 'Loading' },
              ].map((k) => (
                <button
                  key={k.id}
                  type="button"
                  onClick={() => setFeedbackKind(k.id as typeof feedbackKind)}
                  className={`px-3 py-2 rounded-xl text-xs font-medium transition-all text-center ${
                    feedbackKind === k.id
                      ? 'bg-blue-600 text-white font-semibold shadow-md shadow-blue-500/20'
                      : 'border border-[var(--site-border)] bg-[var(--site-surface-raised)] text-[var(--site-muted)] hover:text-[var(--site-fg)]'
                  }`}
                >
                  {k.label}
                </button>
              ))}
            </div>

            {/* Toast Specific Status Type */}
            {feedbackKind === 'toast' && (
              <div className="pt-2 border-t border-[var(--site-border)]">
                <label className="block text-xs font-semibold text-[var(--site-muted)] mb-2">
                  Notification Status Tone:
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {(['success', 'error', 'info', 'warning', 'loading'] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setToastType(t)}
                      className={`px-2 py-1.5 rounded-lg text-xs capitalize transition-all text-center ${
                        toastType === t
                          ? 'bg-[var(--site-surface)] border border-blue-500 text-blue-400 font-bold'
                          : 'border border-[var(--site-border)] text-[var(--site-muted)] hover:text-[var(--site-fg)]'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Card 2: Content & Copywriting */}
          <div className="p-5 rounded-2xl border border-[var(--site-border)] bg-[var(--site-card-bg)] space-y-4 shadow-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--site-fg)] block border-b border-[var(--site-border)] pb-3">
              2. Notification Content &amp; Actions
            </span>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-[var(--site-muted)] mb-1">Title / Headline</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[var(--site-border)] bg-[var(--site-surface-raised)] text-sm text-[var(--site-fg)] focus:outline-none focus:border-blue-500"
                  placeholder="Notification title..."
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[var(--site-muted)] mb-1">Description / Subtext</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[var(--site-border)] bg-[var(--site-surface-raised)] text-xs text-[var(--site-fg)] focus:outline-none focus:border-blue-500 resize-none"
                  placeholder="Detailed notification description..."
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-xs font-medium text-[var(--site-muted)] mb-1">Primary Action Label</label>
                  <input
                    type="text"
                    value={actionLabel}
                    onChange={(e) => setActionLabel(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl border border-[var(--site-border)] bg-[var(--site-surface-raised)] text-xs text-[var(--site-fg)] focus:outline-none focus:border-blue-500"
                    placeholder="e.g. View Details"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[var(--site-muted)] mb-1">Cancel / Dismiss Label</label>
                  <input
                    type="text"
                    value={cancelLabel}
                    onChange={(e) => setCancelLabel(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl border border-[var(--site-border)] bg-[var(--site-surface-raised)] text-xs text-[var(--site-fg)] focus:outline-none focus:border-blue-500"
                    placeholder="e.g. Dismiss"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Theme, Mode & Glass Surface */}
          <div className="p-5 rounded-2xl border border-[var(--site-border)] bg-[var(--site-card-bg)] space-y-4 shadow-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--site-fg)] block border-b border-[var(--site-border)] pb-3">
              3. Visual Styling &amp; Glass Theme (21 Presets)
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-[var(--site-muted)] mb-1">CSS Theme Preset</label>
                <select
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[var(--site-border)] bg-[var(--site-surface-raised)] text-xs text-[var(--site-fg)] focus:outline-none focus:border-blue-500"
                >
                  {THEME_REGISTRY.map((t) => (
                    <option key={t.name} value={t.name}>
                      {t.name} ({t.category})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-[var(--site-muted)] mb-1">Mode</label>
                <select
                  value={mode}
                  onChange={(e) => setMode(e.target.value as 'dark' | 'light')}
                  className="w-full px-3 py-2 rounded-xl border border-[var(--site-border)] bg-[var(--site-surface-raised)] text-xs text-[var(--site-fg)] focus:outline-none focus:border-blue-500"
                >
                  <option value="dark">Dark Glass</option>
                  <option value="light">Light Glass</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-[var(--site-muted)] mb-1">Screen Position</label>
                <select
                  value={position}
                  onChange={(e) => setPosition(e.target.value as ToastPosition)}
                  className="w-full px-3 py-2 rounded-xl border border-[var(--site-border)] bg-[var(--site-surface-raised)] text-xs text-[var(--site-fg)] focus:outline-none focus:border-blue-500"
                >
                  <option value="top-center">top-center</option>
                  <option value="top-right">top-right</option>
                  <option value="top-left">top-left</option>
                  <option value="bottom-center">bottom-center</option>
                  <option value="bottom-right">bottom-right</option>
                  <option value="bottom-left">bottom-left</option>
                  <option value="center-center">center-center (HUD)</option>
                </select>
              </div>
            </div>

            {/* Visual Flags Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2">
              <label className="flex items-center gap-2 text-xs text-[var(--site-fg)] cursor-pointer">
                <input
                  type="checkbox"
                  checked={richColors}
                  onChange={(e) => setRichColors(e.target.checked)}
                  className="rounded accent-blue-600"
                />
                <span>Rich Colors</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-[var(--site-fg)] cursor-pointer">
                <input
                  type="checkbox"
                  checked={invert}
                  onChange={(e) => setInvert(e.target.checked)}
                  className="rounded accent-blue-600"
                />
                <span>Invert Contrast</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-[var(--site-fg)] cursor-pointer">
                <input
                  type="checkbox"
                  checked={closeButton}
                  onChange={(e) => setCloseButton(e.target.checked)}
                  className="rounded accent-blue-600"
                />
                <span>Close Button</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-[var(--site-fg)] cursor-pointer">
                <input
                  type="checkbox"
                  checked={glow}
                  onChange={(e) => setGlow(e.target.checked)}
                  className="rounded accent-blue-600"
                />
                <span>Ambient Glow</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-[var(--site-fg)] cursor-pointer">
                <input
                  type="checkbox"
                  checked={gradientBorder}
                  onChange={(e) => setGradientBorder(e.target.checked)}
                  className="rounded accent-blue-600"
                />
                <span>Gradient Border</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-[var(--site-fg)] cursor-pointer">
                <input
                  type="checkbox"
                  checked={showBannerImage}
                  onChange={(e) => setShowBannerImage(e.target.checked)}
                  className="rounded accent-blue-600"
                />
                <span>Header Banner</span>
              </label>
            </div>
          </div>

          {/* Card 4: Mascots & Dynamic Island */}
          <div className="p-5 rounded-2xl border border-[var(--site-border)] bg-[var(--site-card-bg)] space-y-4 shadow-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-400 block border-b border-[var(--site-border)] pb-3">
              4. Mascots, Dynamic Island &amp; Micro-Interactions
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-[var(--site-muted)] mb-1">
                  Robot Mascot Character (10 SVG)
                </label>
                <select
                  value={character}
                  onChange={(e) => setCharacter(e.target.value as 'none' | RobotCharacter)}
                  className="w-full px-3 py-2 rounded-xl border border-[var(--site-border)] bg-[var(--site-surface-raised)] text-xs text-[var(--site-fg)] focus:outline-none focus:border-purple-500"
                >
                  <option value="none">No Mascot (Standard Status Icon)</option>
                  <option value="wave">wave (Welcome / Friendly)</option>
                  <option value="wink">wink (Success / Playful)</option>
                  <option value="cheer">cheer (Celebration)</option>
                  <option value="love">love (Heart / Favorited)</option>
                  <option value="curious">curious (Question / Tip)</option>
                  <option value="working">working (Processing Tasks)</option>
                  <option value="surprised">surprised (Alert / Attention)</option>
                  <option value="sleep">sleep (Idle / Paused)</option>
                  <option value="cool">cool (Sunglasses / Done)</option>
                  <option value="alert">alert (Warning / Notice)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-[var(--site-muted)] mb-1">Custom Discard Label</label>
                <input
                  type="text"
                  value={discardText}
                  onChange={(e) => setDiscardText(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[var(--site-border)] bg-[var(--site-surface-raised)] text-xs text-[var(--site-fg)] focus:outline-none focus:border-purple-500"
                  placeholder="e.g. Discard, Snooze"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
              <label className="flex items-center gap-2 text-xs text-[var(--site-fg)] cursor-pointer">
                <input
                  type="checkbox"
                  checked={island}
                  onChange={(e) => setIsland(e.target.checked)}
                  className="rounded accent-purple-600"
                />
                <span>Dynamic Island</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-[var(--site-fg)] cursor-pointer">
                <input
                  type="checkbox"
                  checked={hud}
                  onChange={(e) => setHud(e.target.checked)}
                  className="rounded accent-purple-600"
                />
                <span>Silent HUD</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-[var(--site-fg)] cursor-pointer">
                <input
                  type="checkbox"
                  checked={shake}
                  onChange={(e) => setShake(e.target.checked)}
                  className="rounded accent-purple-600"
                />
                <span>Shake Mount</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-[var(--site-fg)] cursor-pointer">
                <input
                  type="checkbox"
                  checked={showTimestamp}
                  onChange={(e) => setShowTimestamp(e.target.checked)}
                  className="rounded accent-purple-600"
                />
                <span>Timestamp</span>
              </label>
            </div>
          </div>

          {/* Card 5: Spring Physics & Audio Synthesizer */}
          <div className="p-5 rounded-2xl border border-[var(--site-border)] bg-[var(--site-card-bg)] space-y-4 shadow-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400 block border-b border-[var(--site-border)] pb-3">
              5. Real Spring Physics &amp; Web Audio Synth
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-medium text-[var(--site-muted)]">Web Audio Synthesizer</label>
                  <button
                    type="button"
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    className={`text-[11px] font-semibold ${soundEnabled ? 'text-emerald-400' : 'text-gray-500'}`}
                  >
                    {soundEnabled ? 'Active (ON)' : 'Muted (OFF)'}
                  </button>
                </div>
                <div className="flex gap-2">
                  <select
                    value={soundCue}
                    disabled={!soundEnabled}
                    onChange={(e) => {
                      setSoundCue(e.target.value);
                      playSynthesizerSound(e.target.value);
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-[var(--site-border)] bg-[var(--site-surface-raised)] text-xs text-[var(--site-fg)] disabled:opacity-50"
                  >
                    {[
                      'crystal',
                      'ding',
                      'mallet',
                      'bell',
                      'bubble',
                      'chime',
                      'pop',
                      'subtle',
                      'success',
                      'warning',
                      'error',
                      'snap',
                      'whoosh',
                      'ping',
                    ].map((c) => (
                      <option key={c} value={c}>
                        cue: {c}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => playSynthesizerSound(soundCue)}
                    disabled={!soundEnabled}
                    className="px-3 py-1.5 rounded-xl border border-[var(--site-border)] bg-[var(--site-surface)] text-xs font-semibold text-[var(--site-fg)] hover:bg-[var(--site-surface-raised)] disabled:opacity-40"
                    title="Audition synthesized sound cue"
                  >
                    ▶
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[var(--site-muted)] mb-1">
                  Duration (ms): {duration === 0 ? 'Persistent (0ms)' : `${duration}ms`}
                </label>
                <input
                  type="range"
                  min="0"
                  max="10000"
                  step="500"
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="w-full accent-blue-500 mt-2"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
              <label className="flex items-center gap-2 text-xs text-[var(--site-fg)] cursor-pointer">
                <input
                  type="checkbox"
                  checked={swipeEnabled}
                  onChange={(e) => setSwipeEnabled(e.target.checked)}
                  className="rounded accent-blue-600"
                />
                <span>1:1 Spring Gesture Swipe</span>
              </label>

              <div className="flex items-center gap-2 text-xs">
                <span className="text-[var(--site-muted)]">Progress:</span>
                {(['none', 'bar', 'ring'] as const).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setProgress(p)}
                    className={`px-2 py-0.5 rounded text-[11px] capitalize ${
                      progress === p ? 'bg-blue-600 text-white font-medium' : 'text-[var(--site-muted)] hover:text-[var(--site-fg)]'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Card 6: Dialog, Prompt & Sheet Controls */}
          {(feedbackKind === 'confirm' ||
            feedbackKind === 'alert' ||
            feedbackKind === 'prompt' ||
            feedbackKind === 'sheet' ||
            feedbackKind === 'bottomSheet') && (
            <div className="p-5 rounded-2xl border border-[var(--site-border)] bg-[var(--site-card-bg)] space-y-4 shadow-sm">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block border-b border-[var(--site-border)] pb-3">
                6. Dialog, Prompt &amp; Sheet Configuration
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[var(--site-muted)] mb-1">Dialog Tone</label>
                  <select
                    value={dialogTone}
                    onChange={(e) => setDialogTone(e.target.value as 'info' | 'warning' | 'danger')}
                    className="w-full px-3 py-2 rounded-xl border border-[var(--site-border)] bg-[var(--site-surface-raised)] text-xs text-[var(--site-fg)] focus:outline-none focus:border-amber-500"
                  >
                    <option value="info">info (Standard Notice)</option>
                    <option value="warning">warning (Cautionary)</option>
                    <option value="danger">danger (Destructive / Red)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[var(--site-muted)] mb-1">Modal Backdrop</label>
                  <select
                    value={backdrop}
                    onChange={(e) => setBackdrop(e.target.value as 'blur' | 'dim' | 'none')}
                    className="w-full px-3 py-2 rounded-xl border border-[var(--site-border)] bg-[var(--site-surface-raised)] text-xs text-[var(--site-fg)] focus:outline-none focus:border-amber-500"
                  >
                    <option value="blur">blur (Frosted Glass)</option>
                    <option value="dim">dim (Dimmed Solid)</option>
                    <option value="none">none (Transparent)</option>
                  </select>
                </div>

                {feedbackKind === 'prompt' && (
                  <div>
                    <label className="block text-xs font-medium text-[var(--site-muted)] mb-1">Prompt Input Type</label>
                    <select
                      value={promptInputType}
                      onChange={(e) => setPromptInputType(e.target.value as typeof promptInputType)}
                      className="w-full px-3 py-2 rounded-xl border border-[var(--site-border)] bg-[var(--site-surface-raised)] text-xs text-[var(--site-fg)] focus:outline-none focus:border-amber-500"
                    >
                      <option value="text">text</option>
                      <option value="email">email</option>
                      <option value="password">password</option>
                      <option value="number">number</option>
                      <option value="range">range</option>
                      <option value="select">select</option>
                      <option value="date">date</option>
                      <option value="otp">otp (6-digit)</option>
                    </select>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                <label className="flex items-center gap-2 text-xs text-[var(--site-fg)] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={draggable}
                    onChange={(e) => setDraggable(e.target.checked)}
                    className="rounded accent-amber-600"
                  />
                  <span>Draggable</span>
                </label>

                <label className="flex items-center gap-2 text-xs text-[var(--site-fg)] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={allowOutsideClick}
                    onChange={(e) => setAllowOutsideClick(e.target.checked)}
                    className="rounded accent-amber-600"
                  />
                  <span>Outside Click</span>
                </label>

                <label className="flex items-center gap-2 text-xs text-[var(--site-fg)] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={allowEscape}
                    onChange={(e) => setAllowEscape(e.target.checked)}
                    className="rounded accent-amber-600"
                  />
                  <span>ESC Key</span>
                </label>

                <label className="flex items-center gap-2 text-xs text-[var(--site-fg)] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={reverseButtons}
                    onChange={(e) => setReverseButtons(e.target.checked)}
                    className="rounded accent-amber-600"
                  />
                  <span>Reverse Buttons</span>
                </label>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Interactive Trigger Deck, State Inspector & Code Export (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          {/* Card 1: Interactive Browser Action Station */}
          <div className="p-6 rounded-3xl border border-blue-500/30 bg-gradient-to-br from-blue-600/10 via-[var(--site-card-bg)] to-purple-600/10 shadow-xl space-y-5">
            <div className="flex items-center justify-between border-b border-[var(--site-border)] pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                Live Browser Action Station
              </span>
              <span className="text-[11px] text-[var(--site-muted)] font-mono">Real DOM + Audio</span>
            </div>

            {/* Big Hero Trigger Button */}
            <button
              id="playground-fire-btn"
              type="button"
              onClick={handleFire}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 text-white font-bold text-base transition-all shadow-xl shadow-blue-500/25 active:scale-[0.99] flex items-center justify-center gap-3 group"
            >
              <span>Trigger Feedback in Browser</span>
              <span className="px-2 py-0.5 rounded-lg bg-white/20 text-xs font-mono group-hover:bg-white/30 transition-colors">
                ↵ Enter
              </span>
            </button>

            {/* Quick Test Matrix */}
            <div>
              <span className="block text-xs font-semibold text-[var(--site-muted)] mb-2">
                One-Click Live Test Matrix:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    playSynthesizerSound('success');
                    toast.success('Telemetry Synchronized', {
                      description: 'Edge clusters responding in 18ms.',
                      theme,
                    });
                  }}
                  className="px-3 py-2 rounded-xl border border-[var(--site-border)] bg-[var(--site-surface-raised)] hover:bg-[var(--site-surface)] text-xs text-[var(--site-fg)] font-medium text-left"
                >
                  ⚡ Quick Success
                </button>

                <button
                  type="button"
                  onClick={() => {
                    playSynthesizerSound('error');
                    toast.error('Build Verification Failed', {
                      description: '1 syntax error in src/core/stream.ts:42',
                      theme,
                      shake: true,
                    });
                  }}
                  className="px-3 py-2 rounded-xl border border-[var(--site-border)] bg-[var(--site-surface-raised)] hover:bg-[var(--site-surface)] text-xs text-[var(--site-fg)] font-medium text-left"
                >
                  ✕ Shake Error
                </button>

                <button
                  type="button"
                  onClick={() => {
                    playSynthesizerSound('crystal');
                    toast.success('Robot Wave Active', {
                      description: 'Zero-asset animated SVG mascot with spring pop.',
                      character: 'wave',
                      theme,
                    });
                  }}
                  className="px-3 py-2 rounded-xl border border-[var(--site-border)] bg-[var(--site-surface-raised)] hover:bg-[var(--site-surface)] text-xs text-[var(--site-fg)] font-medium text-left"
                >
                  🤖 Mascot Pop
                </button>

                <button
                  type="button"
                  onClick={() => {
                    playSynthesizerSound('chime');
                    toast.info('Dynamic Island Call', {
                      description: 'Incoming Audio from Team Lead',
                      island: true,
                      theme,
                    });
                  }}
                  className="px-3 py-2 rounded-xl border border-[var(--site-border)] bg-[var(--site-surface-raised)] hover:bg-[var(--site-surface)] text-xs text-[var(--site-fg)] font-medium text-left"
                >
                  🏝 Dynamic Island
                </button>

                <button
                  type="button"
                  onClick={() => {
                    ui.confirm({
                      title: 'Delete Production Database?',
                      text: 'Cluster us-east-prod will be terminated.',
                      tone: 'danger',
                      theme,
                    });
                  }}
                  className="px-3 py-2 rounded-xl border border-[var(--site-border)] bg-[var(--site-surface-raised)] hover:bg-[var(--site-surface)] text-xs text-[var(--site-fg)] font-medium text-left"
                >
                  ⚠️ Danger Dialog
                </button>

                <button
                  type="button"
                  onClick={() => {
                    ui.bottomSheet({
                      title: 'Region Failover Policy',
                      text: 'Primary node: us-east-1 (N. Virginia)',
                      theme,
                    });
                  }}
                  className="px-3 py-2 rounded-xl border border-[var(--site-border)] bg-[var(--site-surface-raised)] hover:bg-[var(--site-surface)] text-xs text-[var(--site-fg)] font-medium text-left"
                >
                  📱 Bottom Sheet
                </button>
              </div>
            </div>

            {/* Utility Bar */}
            <div className="pt-2 border-t border-[var(--site-border)] flex items-center justify-between">
              <span className="text-xs text-[var(--site-muted)]">Active toasts rendered with spring damping</span>
              <button
                type="button"
                onClick={() => toast.dismissAll()}
                className="text-xs text-rose-400 hover:text-rose-300 font-semibold transition-colors"
              >
                Dismiss All Active
              </button>
            </div>
          </div>

          {/* Card 2: Active Configuration Inspector */}
          <div className="p-4 rounded-2xl border border-[var(--site-border)] bg-[var(--site-surface-raised)] space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--site-muted)] block">
              Active Inspector Matrix
            </span>
            <div className="flex flex-wrap gap-2 text-xs font-mono">
              <span className="px-2.5 py-1 rounded-lg bg-[var(--site-surface)] border border-[var(--site-border)] text-[var(--site-fg)]">
                kind: <strong>{feedbackKind}</strong>
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-[var(--site-surface)] border border-[var(--site-border)] text-blue-400">
                theme: <strong>{theme}</strong>
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-[var(--site-surface)] border border-[var(--site-border)] text-purple-400">
                pos: <strong>{position}</strong>
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-[var(--site-surface)] border border-[var(--site-border)] text-emerald-400">
                sound: <strong>{soundEnabled ? soundCue : 'off'}</strong>
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-[var(--site-surface)] border border-[var(--site-border)] text-amber-400">
                physics: <strong>{swipeEnabled ? '1:1 Spring (2D Fling)' : 'Static'}</strong>
              </span>
              {character !== 'none' && (
                <span className="px-2.5 py-1 rounded-lg bg-[var(--site-surface)] border border-purple-500/40 text-purple-400">
                  robot: <strong>{character}</strong>
                </span>
              )}
              {island && (
                <span className="px-2.5 py-1 rounded-lg bg-[var(--site-surface)] border border-blue-500/40 text-blue-400">
                  island: <strong>active</strong>
                </span>
              )}
            </div>
          </div>

          {/* Card 3: Multi-Framework Code Generator (9 Frameworks) */}
          <div className="rounded-3xl border border-[var(--site-border)] bg-[var(--site-card-bg)] p-5 space-y-4 shadow-xl">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--site-border)] pb-3">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--site-fg)]">
                  Copy-Ready Code Generator
                </span>
                <span className="block text-[11px] text-[var(--site-muted)]">
                  Instant integration snippet for your application
                </span>
              </div>

              {/* 9 Framework Select Tabs */}
              <div className="flex flex-wrap items-center gap-1">
                {[
                  { id: 'react', label: 'React' },
                  { id: 'nextjs', label: 'Next.js' },
                  { id: 'js', label: 'Plain JS' },
                  { id: 'vue', label: 'Vue' },
                  { id: 'nuxt', label: 'Nuxt' },
                  { id: 'angular', label: 'Angular' },
                  { id: 'svelte', label: 'Svelte' },
                  { id: 'electron', label: 'Electron' },
                  { id: 'native', label: 'Native' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveCodeTab(tab.id as FrameworkTab)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                      activeCodeTab === tab.id
                        ? 'bg-blue-600 text-white font-semibold shadow-sm'
                        : 'text-[var(--site-muted)] hover:text-[var(--site-fg)] hover:bg-[var(--site-surface-raised)]'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <CodeSnippet
              code={getGeneratedSnippet()}
              language={
                activeCodeTab === 'vue' || activeCodeTab === 'nuxt' || activeCodeTab === 'svelte'
                  ? 'html'
                  : 'typescript'
              }
              filename={
                activeCodeTab === 'react'
                  ? 'App.tsx'
                  : activeCodeTab === 'nextjs'
                    ? 'app/components/Notice.tsx'
                    : activeCodeTab === 'vue'
                      ? 'Notification.vue'
                      : activeCodeTab === 'nuxt'
                        ? 'components/Notice.vue'
                        : activeCodeTab === 'angular'
                          ? 'feedback.component.ts'
                          : activeCodeTab === 'svelte'
                            ? 'App.svelte'
                            : activeCodeTab === 'native'
                              ? 'Screen.tsx'
                              : 'main.ts'
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}
