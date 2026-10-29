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
} from '../core';
import { openDialog } from './dialog';
import { configure, getEngine } from './engine';
import { openBottomSheet, openLoading, openSheet } from './sheets';

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
}

function withButtons(
  options: DialogOptions,
  defaults: { confirm?: DialogButton; cancel?: DialogButton },
): DialogOptions {
  return {
    ...options,
    confirmButton: { ...defaults.confirm, ...options.confirmButton },
    cancelButton: { ...defaults.cancel, ...options.cancelButton },
  };
}

/** Builds the `ui` object. Called once at module load; touches no DOM. */
export function createUi(): Ui {
  return {
    toast: getEngine().toast,
    confirm: (options = {}) => openDialog(withButtons(options, { cancel: { show: true } })),
    alert: (options = {}) => openDialog(withButtons(options, { cancel: { show: false } })),
    prompt: (options = {}) =>
      openDialog(withButtons({ input: 'text', ...options }, { cancel: { show: true } })),
    steps: (steps, backLabel) =>
      runSteps(
        steps,
        (options) => openDialog(withButtons(options, { cancel: { show: true } })),
        backLabel,
      ),
    sheet: (options) => openSheet(options),
    bottomSheet: (options = {}) => openBottomSheet(options),
    loading: (options = {}) => openLoading(options),
    configure,
  };
}

/** The unified API: `ui.toast`, `ui.confirm`, `ui.sheet` and friends. */
export const ui: Ui = /* @__PURE__ */ createUi();

/** Toast API on its own. Importing only this keeps dialog code out of your bundle. */
export const toast: ToastApi = /* @__PURE__ */ getEngine().toast;

