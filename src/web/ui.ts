import { runSteps } from '../core';
import type {
  BottomSheetHandle,
  BottomSheetOptions,
  DialogButton,
  DialogOptions,
  DialogPromise,
  GlazeConfig,
  LoadingHandle,
  LoadingOptions,
  SheetOptions,
  StepsResult,
  ToastApi,
  ToastStore,
} from '../core';
import { openDialog } from './dialog';
import { configure, getEngine } from './engine';
import { openBottomSheet, openLoading, openSheet } from './sheets';
import { defineTheme, type CustomThemeDefinition } from './theme-engine';

/** The unified glazekit API. */
export interface Ui {
  /** Toast notifications. */
  toast: ToastApi;
  /** Confirmation dialog with confirm and cancel buttons. */
  confirm(options?: DialogOptions): DialogPromise;
  /** Informational dialog with a single button. */
  alert(options?: DialogOptions): DialogPromise;
  /** Dialog with an input. Defaults to a text input. */
  prompt(options?: DialogOptions): DialogPromise;
  /** Multi-step dialog flow with back navigation. */
  steps(steps: readonly DialogOptions[], backLabel?: string): Promise<StepsResult>;
  /** Action sheet. */
  sheet(options: SheetOptions): DialogPromise;
  /** Bottom sheet with snap points. */
  bottomSheet(options?: BottomSheetOptions): BottomSheetHandle;
  /** Blocking loading overlay. */
  loading(options?: LoadingOptions): LoadingHandle;
  /** Sets global configuration. Returns the resulting configuration. */
  configure(patch: Partial<GlazeConfig>): Readonly<GlazeConfig>;
  /** Defines a custom theme with tokens and optional CSS rules. */
  defineTheme(name: string, definition: CustomThemeDefinition): string;
  /** The underlying toast store. */
  readonly toastStore: ToastStore;
}

/** Builds the `ui` object. Called once at module load; touches no DOM. */
export function createUi(): Ui {
  const wb = (opts: DialogOptions, cancel: boolean, extra: Partial<DialogOptions> = {}) =>
    openDialog({ ...opts, ...extra, cancelButton: { show: cancel, ...opts.cancelButton } });
  return {
    toast: getEngine().toast,
    confirm: (options = {}) => wb(options, true),
    alert: (options = {}) => wb(options, false),
    prompt: (options = {}) => wb(options, true, { input: options.input ?? 'text' }),
    steps: (steps, backLabel) => runSteps(steps, (options) => wb(options, true), backLabel),
    sheet: openSheet,
    bottomSheet: openBottomSheet,
    loading: openLoading,
    configure,
    defineTheme,
    get toastStore() {
      return getEngine().store;
    },
  };
}

/** The unified API: `ui.toast`, `ui.confirm`, `ui.sheet` and friends. */
export const ui: Ui = /* @__PURE__ */ createUi();

/** Toast API on its own. Importing only this keeps dialog code out of your bundle. */
export const toast: ToastApi = /* @__PURE__ */ getEngine().toast;
