import type { DocArticle } from './docs-data';

export const API_ARTICLES: Record<string, DocArticle> = {
  // 1. API: CORE
  'api/core': {
    slug: 'api/core',
    title: 'API Reference: toastory/core',
    description: 'Zero-DOM, Node-safe state machines, managers, timers, clock, and accessibility decision engines.',
    category: 'API Reference',
    lastUpdated: 'October 2026',
    headings: [
      { id: 'overview', title: 'Subpath Overview' },
      { id: 'store-controller', title: 'createToastStore() & createToastEngine()' },
      { id: 'config-store', title: 'createConfigStore() & DEFAULT_CONFIG' },
      { id: 'dialog-manager', title: 'createDialogManager()' },
    ],
    content: `
# API Reference: toastory/core

The \`toastory/core\` subpath contains the pure Node-safe, zero-DOM state machines and store controllers that power all platform adapters.

\`\`\`typescript
import {
  createToastStore,
  createToastManager,
  createConfigStore,
  createDialogManager,
  DEFAULT_CONFIG,
  createTimer,
} from 'toastory/core';

// Create an isolated headless notification store:
const config = createConfigStore(DEFAULT_CONFIG);
const store = createToastStore(config);

store.subscribe(() => {
  console.log('Active toasts:', store.getToasts());
});

store.add({
  type: 'success',
  title: 'Headless event dispatched',
  duration: 3000,
});
\`\`\`
`,
  },

  // 2. API: WEB
  'api/web': {
    slug: 'api/web',
    title: 'API Reference: toastory (Web)',
    description: 'Default browser export providing ui toolkit, toast method helpers, and DOM toaster mounting engine.',
    category: 'API Reference',
    lastUpdated: 'October 2026',
    headings: [
      { id: 'web-exports', title: 'Default Web Exports' },
      { id: 'ui-toolkit', title: 'ui Object API' },
      { id: 'toast-api', title: 'toast Helper Functions' },
      { id: 'configuration', title: 'ui.configure() Reference' },
    ],
    content: `
# API Reference: toastory (Web)

The root \`toastory\` import provides the browser runtime with automated DOM mounting, gesture detection, and dialog controllers.

\`\`\`typescript
import { ui, toast, configure, defineTheme } from 'toastory';

// Global configuration:
ui.configure({
  theme: 'ios-glass',
  mode: 'auto',
  position: 'top-right',
  duration: 4000,
  richColors: false,
  closeButton: true,
});

// Toast methods:
toast(message, opts);
toast.success(message, opts);
toast.error(message, opts);
toast.warning(message, opts);
toast.info(message, opts);
toast.loading(message, opts);
toast.promise(promise, messages);
toast.custom(renderer, opts);
toast.update(id, patch);
toast.dismiss(id?);
toast.dismissAll();

// Dialog methods:
ui.confirm(opts);
ui.alert(opts);
ui.prompt(opts);
ui.steps(stepsArray);
ui.sheet(opts);
ui.bottomSheet(opts);
ui.loading(opts);
\`\`\`
`,
  },

  // 3. API: REACT
  'api/react': {
    slug: 'api/react',
    title: 'API Reference: toastory/react',
    description: 'React Toaster component, useToast() hook, useToastory() composable, and SSR hydration safety.',
    category: 'API Reference',
    lastUpdated: 'October 2026',
    headings: [
      { id: 'toaster-component', title: '<Toaster /> Provider Component' },
      { id: 'use-toast-hook', title: 'useToast() Hook' },
      { id: 'use-toastory-hook', title: 'useToastory() Hook' },
    ],
    content: `
# API Reference: toastory/react

The \`toastory/react\` subpath exports first-class React components and reactive state hooks using \`useSyncExternalStore\`.

\`\`\`tsx
import { Toaster, useToast, useToastory } from 'toastory/react';
import 'toastory/themes/ios-glass.css';

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Toaster theme="ios-glass" mode="auto" position="top-right" richColors />
      {children}
    </>
  );
}

export function NotificationWidget() {
  const { toast, toasts } = useToast();
  return (
    <div>Active notifications: {toasts.length}</div>
  );
}
\`\`\`
`,
  },

  // 4. API: FRAMEWORK ADAPTERS
  'api/frameworks': {
    slug: 'api/frameworks',
    title: 'API Reference: Framework Adapters',
    description: 'Unified API contracts for Vue 3, Nuxt, Angular 16+, Svelte 4/5, and React Native (Expo + bare).',
    category: 'API Reference',
    lastUpdated: 'October 2026',
    headings: [
      { id: 'vue-adapter', title: 'Vue & Nuxt (toastory/vue)' },
      { id: 'svelte-adapter', title: 'Svelte 4 & 5 (toastory/svelte)' },
      { id: 'angular-adapter', title: 'Angular (toastory/angular)' },
      { id: 'native-adapter', title: 'React Native & Expo (toastory/native)' },
    ],
    content: `
# API Reference: Framework Adapters

toastory maintains 100% parity across all major frameworks:

### Vue 3 & Nuxt (\`toastory/vue\`)
\`\`\`typescript
import { createApp } from 'vue';
import { toastoryPlugin, ToastoryToaster } from 'toastory/vue';
import 'toastory/themes/ios-glass.css';

const app = createApp(App);
app.use(toastoryPlugin, { theme: 'ios-glass' });
\`\`\`

### Svelte 4 & 5 (\`toastory/svelte\`)
\`\`\`svelte
<script>
  import { Toaster, toast } from 'toastory/svelte';
  import 'toastory/themes/ios-glass.css';
</script>

<Toaster position="top-right" />
<button on:click={() => toast.success('Svelte notified!')}>Notify</button>
\`\`\`

### Angular 16+ (\`toastory/angular\`)
\`\`\`typescript
import { Component } from '@angular/core';
import { ToastoryToasterComponent, toast } from 'toastory/angular';

@Component({
  standalone: true,
  imports: [ToastoryToasterComponent],
  template: \`<toastory-toaster position="top-right"></toastory-toaster>\`
})
export class AppComponent {}
\`\`\`

### React Native & Expo (\`toastory/native\`)
\`\`\`tsx
import { Toaster, toast } from 'toastory/native';

export function Screen() {
  return (
    <View>
      <Toaster theme="ios-glass" />
      <Button title="Notify" onPress={() => toast.success('Native haptics triggered!')} />
    </View>
  );
}
\`\`\`
`,
  },
};
