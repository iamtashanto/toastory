export { defaultClock } from './clock';
export type { Clock } from './clock';

export { nextId, normalizeId, resetIdCounter } from './ids';

export { createStore } from './store';
export type { Store } from './types';

export { createTimer } from './timer';
export type { PausableTimer } from './timer';

export { createTypeRegistry } from './types-registry';
export type { TypeRegistry } from './types-registry';

export {
  decideAriaLive,
  decideDialogLabels,
  decideDialogRole,
  decideFocusTarget,
  decideToastRole,
} from './a11y-rules';

export { createConfigStore, DEFAULT_CONFIG, resolvePrecedence } from './config';
export type { ConfigStore } from './config';

export { createToastManager, createToastStore, MANUAL_PAUSE } from './toast-manager';
export type { AddToastInput, ToastManager, ToastManagerOptions, ToastStore } from './toast-manager';

export { runPromiseToast } from './promise';

export { createDialogManager } from './dialog-manager';
export type { DialogManager, DialogQueueItem, HeadlessDialogController } from './dialog-manager';

export { createDialogController, runSteps } from './dialog';
export type { DialogController, DialogPromise, StepsResult } from './dialog';

export { createToastApi } from './toast-api';
export type {
  PromiseHandle,
  PromiseMessage,
  PromiseMessages,
  PromiseOutcome,
  ToastApi,
  ToastFn,
} from './toast-api';

export type * from './types';

import type { Clock } from './clock';
import { defaultClock } from './clock';
import type { ConfigStore } from './config';
import { createConfigStore } from './config';
import { runSteps } from './dialog';
import type { StepsResult } from './dialog';
import { createDialogManager } from './dialog-manager';
import type { DialogManager } from './dialog-manager';
import { createToastManager } from './toast-manager';
import type { ToastStore } from './toast-manager';
import { createToastApi } from './toast-api';
import type { ToastApi } from './toast-api';
import type {
  BottomSheetHandle,
  BottomSheetOptions,
  DialogHandle,
  DialogOptions,
  DialogResult,
  GlazeConfig,
  LoadingHandle,
  LoadingOptions,
  SheetOptions,
  ToastRecord,
} from './types';

/**
 * Renderer interface for bridging the framework-agnostic core to UI adapters.
 * If a call happens before a renderer is registered, it queues and replays upon registration.
 */
export interface Renderer {
  openDialog?(options: DialogOptions, handle: DialogHandle): Promise<DialogResult> | undefined;
  openSheet?(options: SheetOptions): Promise<DialogResult>;
  openBottomSheet?(options: BottomSheetOptions): BottomSheetHandle;
  openLoading?(options: LoadingOptions): LoadingHandle;
  mountToast?(record: ToastRecord): void;
}

/** Complete framework-agnostic UI feedback toolkit. */
export interface CoreUI {
  /** Toast notifications API. */
  readonly toast: ToastApi;
  /** Global configuration store. */
  readonly config: ConfigStore;
  /** Toast state manager. */
  readonly toastStore: ToastStore;
  /** Headless dialog manager. */
  readonly dialogManager: DialogManager;

  /** Opens a confirm dialog. */
  confirm(options: DialogOptions | string): Promise<DialogResult>;
  /** Opens an informational alert dialog. */
  alert(options: DialogOptions | string): Promise<DialogResult>;
  /** Opens a prompt dialog for user text/value input. */
  prompt(options: DialogOptions | string): Promise<DialogResult>;
  /** Runs a multi-step dialog sequence. */
  steps(steps: readonly DialogOptions[], backLabel?: string): Promise<StepsResult>;
  /** Opens an action sheet. */
  sheet(options: SheetOptions): Promise<DialogResult>;
  /** Opens a bottom sheet. */
  bottomSheet(options: BottomSheetOptions): BottomSheetHandle;
  /** Opens a loading overlay. */
  loading(options?: LoadingOptions | string): LoadingHandle;

  /** Merges global configuration. */
  configure(patch: Partial<GlazeConfig>): Readonly<GlazeConfig>;
  /** Returns the current configuration snapshot. */
  getConfig(): Readonly<GlazeConfig>;
  /** Clears all active toasts and dialogs. */
  clear(): void;

  /** Registers a concrete UI renderer, replaying any calls queued during hydration. */
  registerRenderer(renderer: Renderer): void;
  /** Returns the active renderer if registered. */
  getRenderer(): Renderer | undefined;
}

export interface CreateUIOptions {
  config?: ConfigStore;
  clock?: Clock;
}

/**
 * Creates an isolated, framework-agnostic CoreUI instance.
 * Useful for multi-tenant applications, microfrontends, and isolated tests.
 */
export function createUI(options: CreateUIOptions = {}): CoreUI {
  const clock = options.clock ?? defaultClock;
  const config = options.config ?? createConfigStore();
  const toastStore = createToastManager({ config, clock });
  const toast = createToastApi(toastStore);
  const dialogManager = createDialogManager(clock);

  let activeRenderer: Renderer | undefined;
  const replayQueue: (() => void)[] = [];

  const toDialogOptions = (opts: DialogOptions | string): DialogOptions =>
    typeof opts === 'string' ? { title: opts } : { ...opts };

  const ui: CoreUI = {
    toast,
    config,
    toastStore,
    dialogManager,

    confirm(opts) {
      const merged: DialogOptions = {
        confirmButton: { show: true },
        cancelButton: { show: true },
        ...toDialogOptions(opts),
      };
      const handle = dialogManager.open(merged);
      if (activeRenderer?.openDialog) {
        void activeRenderer.openDialog(merged, handle);
      } else {
        replayQueue.push(() => {
          void activeRenderer?.openDialog?.(merged, handle);
        });
      }
      return handle.result;
    },

    alert(opts) {
      const merged: DialogOptions = {
        confirmButton: { show: true },
        cancelButton: { show: false },
        denyButton: { show: false },
        ...toDialogOptions(opts),
      };
      const handle = dialogManager.open(merged);
      if (activeRenderer?.openDialog) {
        void activeRenderer.openDialog(merged, handle);
      } else {
        replayQueue.push(() => {
          void activeRenderer?.openDialog?.(merged, handle);
        });
      }
      return handle.result;
    },

    prompt(opts) {
      const merged: DialogOptions = {
        input: 'text',
        confirmButton: { show: true },
        cancelButton: { show: true },
        ...toDialogOptions(opts),
      };
      const handle = dialogManager.open(merged);
      if (activeRenderer?.openDialog) {
        void activeRenderer.openDialog(merged, handle);
      } else {
        replayQueue.push(() => {
          void activeRenderer?.openDialog?.(merged, handle);
        });
      }
      return handle.result;
    },

    steps(stepList, backLabel = 'Back') {
      return runSteps(stepList, (s) => ui.confirm(s), backLabel);
    },

    sheet(sheetOpts) {
      if (activeRenderer?.openSheet) {
        return activeRenderer.openSheet(sheetOpts);
      }
      return new Promise<DialogResult>((resolve) => {
        replayQueue.push(() => {
          if (activeRenderer?.openSheet) {
            void activeRenderer.openSheet(sheetOpts).then(resolve);
          } else {
            resolve({
              isConfirmed: false,
              isDenied: false,
              isDismissed: true,
              value: undefined,
              dismiss: 'close',
            });
          }
        });
      });
    },

    bottomSheet(bottomOpts) {
      if (activeRenderer?.openBottomSheet) {
        return activeRenderer.openBottomSheet(bottomOpts);
      }
      const resultPromise = new Promise<DialogResult>((resolve) => {
        replayQueue.push(() => {
          if (activeRenderer?.openBottomSheet) {
            const live = activeRenderer.openBottomSheet(bottomOpts);
            void live.result.then(resolve);
          } else {
            resolve({
              isConfirmed: false,
              isDenied: false,
              isDismissed: true,
              value: undefined,
              dismiss: 'close',
            });
          }
        });
      });

      const handleStub: BottomSheetHandle = {
        body: undefined,
        close: () => undefined,
        snapTo: () => undefined,
        update: () => undefined,
        result: resultPromise,
      };
      return handleStub;
    },

    loading(loadingOpts = {}) {
      const opts = typeof loadingOpts === 'string' ? { text: loadingOpts } : loadingOpts;
      if (activeRenderer?.openLoading) {
        return activeRenderer.openLoading(opts);
      }
      let closedResolve: () => void = () => undefined;
      const closedPromise = new Promise<void>((resolve) => {
        closedResolve = resolve;
      });

      let liveHandle: LoadingHandle | undefined;
      replayQueue.push(() => {
        if (activeRenderer?.openLoading) {
          liveHandle = activeRenderer.openLoading(opts);
          void liveHandle.closed.then(closedResolve);
        } else {
          closedResolve();
        }
      });

      return {
        update: (patch) => liveHandle?.update(patch),
        close: () => {
          liveHandle?.close();
          closedResolve();
        },
        closed: closedPromise,
      };
    },

    configure: (patch) => config.set(patch),
    getConfig: () => config.get(),

    clear() {
      toastStore.clear();
      dialogManager.clear();
      replayQueue.length = 0;
    },

    registerRenderer(renderer) {
      activeRenderer = renderer;
      while (replayQueue.length > 0) {
        const replay = replayQueue.shift();
        replay?.();
      }
    },

    getRenderer: () => activeRenderer,
  };

  return ui;
}

let defaultUI: CoreUI | undefined;
function getDefaultUI(): CoreUI {
  if (!defaultUI) defaultUI = createUI();
  return defaultUI;
}

/** Default singleton instance of the CoreUI toolkit. */
export const ui: CoreUI = {
  get toast() {
    return getDefaultUI().toast;
  },
  get config() {
    return getDefaultUI().config;
  },
  get toastStore() {
    return getDefaultUI().toastStore;
  },
  get dialogManager() {
    return getDefaultUI().dialogManager;
  },
  confirm: (options) => getDefaultUI().confirm(options),
  alert: (options) => getDefaultUI().alert(options),
  prompt: (options) => getDefaultUI().prompt(options),
  steps: (stepList, backLabel) => getDefaultUI().steps(stepList, backLabel),
  sheet: (options) => getDefaultUI().sheet(options),
  bottomSheet: (options) => getDefaultUI().bottomSheet(options),
  loading: (options) => getDefaultUI().loading(options),
  configure: (patch) => getDefaultUI().configure(patch),
  getConfig: () => getDefaultUI().getConfig(),
  clear: () => getDefaultUI().clear(),
  registerRenderer: (renderer) => getDefaultUI().registerRenderer(renderer),
  getRenderer: () => getDefaultUI().getRenderer(),
};

/** Registers the renderer with the default UI instance. */
export function registerRenderer(renderer: Renderer): void {
  getDefaultUI().registerRenderer(renderer);
}

/** Backward-compatible ToastEngine interface. */
export interface ToastEngine {
  store: ToastStore;
  toast: ToastApi;
}

/** Backward-compatible factory for ToastEngine. */
export function createToastEngine(options: { config?: ConfigStore } = {}): ToastEngine {
  const store = createToastManager({ config: options.config });
  return { store, toast: createToastApi(store) };
}
