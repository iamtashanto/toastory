'use client';

import React, { useState } from 'react';
import { CodeSnippet } from './CodeSnippet';

interface FrameworkData {
  id: string;
  name: string;
  install: string;
  code: string;
  filename: string;
}

export const FRAMEWORKS: FrameworkData[] = [
  {
    id: 'javascript',
    name: 'JavaScript',
    install: 'npm install glazekit',
    filename: 'main.js',
    code: `import { ui, toast } from 'glazekit';
import 'glazekit/themes/ios-glass.css';

// 1. Toast Notification
toast.success('Project deployed!', { description: 'Live on production edge.' });

// 2. Confirmation Dialog
const result = await ui.confirm({
  title: 'Delete branch?',
  tone: 'danger',
  confirmButton: { label: 'Delete' }
});`,
  },
  {
    id: 'react',
    name: 'React',
    install: 'npm install glazekit',
    filename: 'App.tsx',
    code: `import { Toaster, toast, ui } from 'glazekit/react';
import 'glazekit/themes/ios-glass.css';

export default function App() {
  return (
    <>
      <Toaster position="top-right" theme="ios-glass" />
      <button onClick={() => toast.success('Saved to cloud!')}>Notify</button>
      <button onClick={() => ui.confirm({ title: 'Logout?' })}>Sign Out</button>
    </>
  );
}`,
  },
  {
    id: 'nextjs',
    name: 'Next.js',
    install: 'npm install glazekit',
    filename: 'app/layout.tsx',
    code: `import { Toaster } from 'glazekit/react';
import 'glazekit/themes/ios-glass.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Toaster position="top-right" theme="ios-glass" />
        {children}
      </body>
    </html>
  );
}`,
  },
  {
    id: 'vue',
    name: 'Vue',
    install: 'npm install glazekit',
    filename: 'App.vue',
    code: `<script setup>
import { ui, toast } from 'glazekit';
import 'glazekit/themes/ios-glass.css';

const onSave = () => toast.success('Changes saved in Vue!');
const onDelete = () => ui.confirm({ title: 'Delete resource?', tone: 'danger' });
</script>

<template>
  <button @click="onSave">Save</button>
  <button @click="onDelete">Delete</button>
</template>`,
  },
  {
    id: 'nuxt',
    name: 'Nuxt',
    install: 'npm install glazekit',
    filename: 'app.vue',
    code: `<script setup>
import { ui, toast } from 'glazekit';
import 'glazekit/themes/ios-glass.css';

function showToast() {
  toast.success('Welcome to Nuxt 3 with glazekit!');
}
</script>

<template>
  <button @click="showToast">Show Toast</button>
</template>`,
  },
  {
    id: 'angular',
    name: 'Angular',
    install: 'npm install glazekit',
    filename: 'app.component.ts',
    code: `import { Component } from '@angular/core';
import { ui, toast } from 'glazekit';
import 'glazekit/themes/ios-glass.css';

@Component({
  selector: 'app-root',
  template: '<button (click)="notify()">Trigger Alert</button>'
})
export class AppComponent {
  notify() {
    toast.success('Angular standalone component connected!');
  }
}`,
  },
  {
    id: 'svelte',
    name: 'Svelte',
    install: 'npm install glazekit',
    filename: 'App.svelte',
    code: `<script>
  import { ui, toast } from 'glazekit';
  import 'glazekit/themes/ios-glass.css';

  const notify = () => toast.success('Svelte 5 runes & reactivity!');
  const confirm = () => ui.confirm({ title: 'Proceed?' });
</script>

<button on:click={notify}>Notify</button>
<button on:click={confirm}>Confirm</button>`,
  },
  {
    id: 'electron',
    name: 'Electron',
    install: 'npm install glazekit',
    filename: 'renderer.js',
    code: `import { ui, toast } from 'glazekit';
import 'glazekit/themes/ios-glass.css';

// Native desktop window feedback with full keyboard access
window.api.onDownloadComplete((file) => {
  toast.success(\`Downloaded \${file.name}\`, {
    action: { label: 'Open in Finder', onClick: () => window.api.reveal(file) }
  });
});`,
  },
  {
    id: 'react-native',
    name: 'React Native',
    install: 'npm install glazekit react-native-reanimated expo-blur expo-haptics',
    filename: 'App.tsx',
    code: `import { Toaster, toast, ui } from 'glazekit/native';

export default function App() {
  return (
    <>
      <Toaster theme="ios-glass" />
      <Button title="Trigger Native Haptic Toast" onPress={() => toast.success('Saved with haptics!')} />
      <Button title="Bottom Sheet" onPress={() => ui.bottomSheet({ title: 'Actions' })} />
    </>
  );
}`,
  },
];

export function FrameworkQuickstart() {
  const [activeTab, setActiveTab] = useState(FRAMEWORKS[1].id); // default React
  const current = FRAMEWORKS.find((f) => f.id === activeTab) || FRAMEWORKS[0];

  return (
    <div className="w-full my-12 text-left">
      <div className="text-center max-w-3xl mx-auto mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-3">
          Every platform. One identical API.
        </h2>
        <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
          Switch from React to Svelte, Next.js to React Native, or Vanilla JS to Vue without rewriting options, parameters, or themes.
        </p>
      </div>

      {/* Framework Tabs Pill List */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none justify-start sm:justify-center">
        {FRAMEWORKS.map((f) => {
          const isSelected = activeTab === f.id;
          return (
            <button
              key={f.id}
              type="button"
              onClick={() => setActiveTab(f.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                  : 'bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {f.name}
            </button>
          );
        })}
      </div>

      {/* Code box */}
      <div className="max-w-3xl mx-auto mt-4">
        <div className="p-3 bg-black/40 border border-white/10 rounded-xl mb-2 flex items-center justify-between text-xs text-gray-400 font-mono">
          <span>{current.install}</span>
          <span className="text-emerald-400 text-[11px]">0 dependencies</span>
        </div>
        <CodeSnippet code={current.code} filename={current.filename} />
      </div>
    </div>
  );
}

