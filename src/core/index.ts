export { createConfigStore, DEFAULT_CONFIG } from './config';
export type { ConfigStore } from './config';
export { createTimer } from './timer';
export type { PausableTimer } from './timer';
export { createTypeRegistry } from './types-registry';
export type { TypeRegistry } from './types-registry';
export { createToastStore, MANUAL_PAUSE } from './store';
export type { AddToastInput, ToastStore, ToastStoreOptions } from './store';
export { createToastApi } from './toast-api';
export type {
  PromiseHandle,
  PromiseMessage,
  PromiseMessages,
  PromiseOutcome,
  ToastApi,
  ToastFn,
} from './toast-api';
export { createDialogController, runSteps } from './dialog';
export type {
  DialogBackdrop,
  DialogButton,
  DialogChoice,
  DialogColumn,
  DialogController,
  DialogHandle,
  DialogIcon,
  DialogInputType,
  DialogOptions,
  DialogPosition,
  DialogPromise,
  DialogResult,
  DialogRow,
  DialogState,
  DialogTone,
  DismissReason,
  StepsResult,
  ValidateResult,
} from './dialog';
export type {
  BottomSheetHandle,
  BottomSheetOptions,
  LoadingHandle,
  LoadingOptions,
  SheetAction,
  SheetActionStyle,
  SheetOptions,
} from './overlay';
export type * from './types';

import { createConfigStore } from './config';
import { createToastStore } from './store';
import type { ToastStore, ToastStoreOptions } from './store';
import { createToastApi } from './toast-api';
import type { ToastApi } from './toast-api';

/** A ready-to-use toast engine: store plus the public `toast` API. */
export interface ToastEngine {
  /** State container. */
  store: ToastStore;
  /** The `ui.toast` API bound to the store. */
  toast: ToastApi;
}

/** Creates an isolated toast engine. Useful for tests, multiple apps on one page, and SSR requests. */
export function createToastEngine(options: ToastStoreOptions = {}): ToastEngine {
  const store = createToastStore({ config: options.config ?? createConfigStore(), ...options });
  return { store, toast: createToastApi(store) };
}
