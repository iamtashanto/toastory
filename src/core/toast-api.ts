import { runPromiseToast } from './promise';
import type { ToastStore } from './toast-manager';
import type {
  PromiseHandle,
  PromiseMessage,
  PromiseMessages,
  PromiseOutcome,
  Renderable,
  ToastCustomRenderer,
  ToastId,
  ToastOptions,
  ToastPatch,
  ToastRecord,
} from './types';
import type { TypeRegistry } from './types-registry';

export type { PromiseHandle, PromiseMessage, PromiseMessages, PromiseOutcome };

/** Callable toast function shape shared by all entry points. */
export type ToastFn = (message?: Renderable, options?: ToastOptions) => ToastId;

/** The `ui.toast` API. */
export interface ToastApi extends ToastFn {
  /** Success toast. */
  success: ToastFn;
  /** Error toast. Uses an assertive live region. */
  error: ToastFn;
  /** Informational toast. */
  info: ToastFn;
  /** Warning toast. */
  warning: ToastFn;
  /** Loading toast with indefinite duration. */
  loading: ToastFn;
  /** Neutral message toast. */
  message: ToastFn;
  /** Custom renderer. */
  custom: (renderer: ToastCustomRenderer, options?: ToastOptions) => ToastId;
  /** Updates an existing toast. */
  update: (id: ToastId, patch: ToastPatch) => boolean;
  /** Dismisses one toast, or all when id is omitted. */
  dismiss: (id?: ToastId) => void;
  /** Dismisses every toast in every region. */
  dismissAll: () => void;
  /** Tracks a promise with loading, success and error states. */
  promise: <T>(
    input: Promise<T> | (() => Promise<T>),
    messages: PromiseMessages<T>,
    options?: ToastOptions,
  ) => PromiseHandle<T>;
  /** Returns a snapshot of active and queued toasts. */
  getToasts: () => readonly ToastRecord[];
  /** Returns closed toasts up to `config.historyLimit`. */
  getHistory: () => readonly ToastRecord[];
  /** Registry of custom toast types. */
  readonly types: TypeRegistry;
}

/** Builds the `ui.toast` API on top of a store/manager. */
export function createToastApi(store: ToastStore): ToastApi {
  const make =
    (type: ToastOptions['type']): ToastFn =>
    (message, options = {}) => {
      const input: ToastOptions = { ...options };
      if (type !== undefined && options.type === undefined) input.type = type;
      if (message !== undefined) {
        if (options.title === undefined) {
          input.title = message;
        } else if (options.description === undefined) {
          input.description = message;
        }
      }
      return store.add(input);
    };

  const api = make(undefined) as ToastApi;
  api.success = make('success');
  api.error = make('error');
  api.info = make('info');
  api.warning = make('warning');
  api.loading = make('loading');
  api.message = make('message');

  api.custom = (renderer, options = {}) => store.add({ ...options, custom: renderer });
  api.update = (id, patch) => store.update(id, patch);
  api.dismiss = (id) => store.dismiss(id);
  api.dismissAll = () => store.dismissAll();
  api.getToasts = () => store.getToasts();
  api.getHistory = () => store.getHistory();
  Object.defineProperty(api, 'types', { value: store.types, enumerable: true });

  api.promise = <T>(
    input: Promise<T> | (() => Promise<T>),
    messages: PromiseMessages<T>,
    options: ToastOptions = {},
  ): PromiseHandle<T> => {
    return runPromiseToast(store, input, messages, options);
  };

  return api;
}
