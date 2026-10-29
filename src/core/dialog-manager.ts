import type { Clock } from './clock';
import { defaultClock } from './clock';
import { createStore } from './store';
import { createTimer } from './timer';
import type { PausableTimer } from './timer';
import type {
  DialogHandle,
  DialogOptions,
  DialogResult,
  DialogState,
  DismissReason,
  Listener,
  Store,
  Unsubscribe,
  ValidateResult,
} from './types';

export interface DialogQueueItem {
  id: number;
  options: DialogOptions;
  priority: number;
  resolve: (result: DialogResult) => void;
  controller: HeadlessDialogController;
}

export interface HeadlessDialogController {
  readonly handle: DialogHandle;
  getState(): Readonly<DialogState>;
  subscribe(listener: Listener): Unsubscribe;
  setValueReader(reader: () => unknown): void;
  opened(): void;
  submit(action: 'confirm' | 'deny'): Promise<void>;
  dismiss(reason: DismissReason): Promise<void>;
}

export interface DialogManager {
  readonly clock: Clock;
  open<T = unknown>(options: DialogOptions): DialogHandle<T>;
  getActive(): HeadlessDialogController | undefined;
  getQueue(): readonly DialogOptions[];
  clear(): void;
  subscribe(listener: Listener): Unsubscribe;
}

function errorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  return typeof err === 'string' ? err : String(err);
}

export function createDialogManager(clock: Clock = defaultClock): DialogManager {
  let counter = 0;
  let activeItem: DialogQueueItem | undefined;
  const queue: DialogQueueItem[] = [];
  const observable: Store<number> = createStore(0);

  const notifyChange = (): void => {
    observable.setState((prev) => prev + 1, true);
  };

  const processQueue = (): void => {
    if (activeItem !== null && activeItem !== undefined) return;
    if (queue.length === 0) return;

    // Highest priority first, then FIFO by insertion id
    queue.sort((a, b) => {
      if (b.priority !== a.priority) return b.priority - a.priority;
      return a.id - b.id;
    });

    activeItem = queue.shift();
    if (activeItem) {
      notifyChange();
      activeItem.controller.opened();
    }
  };

  const openDialog = <T = unknown>(options: DialogOptions): DialogHandle<T> => {
    counter += 1;
    const itemId = counter;
    const priority = options.priority ?? 0;

    let resolveResult!: (result: DialogResult<T>) => void;
    const resultPromise = new Promise<DialogResult<T>>((resolve) => {
      resolveResult = resolve;
    });

    let state: DialogState = {
      options: { ...options },
      loading: null,
      error: undefined,
      open: true,
      revision: 0,
    };

    const stateListeners = new Set<Listener>();
    const emitState = (): void => {
      for (const listener of [...stateListeners]) {
        try {
          listener();
        } catch (err) {
          console.error(err);
        }
      }
    };

    let timer: PausableTimer | undefined;
    let readValue: () => unknown = () => state.options.inputValue;
    let settled = false;

    const cleanup = (): void => {
      timer?.cancel();
      state = { ...state, open: false, revision: state.revision + 1 };
      emitState();
      if (activeItem?.id === itemId) {
        activeItem = undefined;
        notifyChange();
        processQueue();
      }
    };

    const handle: DialogHandle<T> = {
      close(override) {
        if (settled) return;
        settled = true;
        const res: DialogResult<T> = {
          isConfirmed: override?.isConfirmed ?? false,
          isDenied: override?.isDenied ?? false,
          isDismissed: override?.isDismissed ?? true,
          value: override?.value,
          dismiss: override?.dismiss ?? 'close',
        };
        try {
          state.options.willClose?.(handle as unknown as DialogHandle, res as DialogResult);
        } catch (err) {
          console.error(err);
        }
        cleanup();
        resolveResult(res);
      },

      update(patch) {
        if (settled) return;
        state = {
          ...state,
          options: { ...state.options, ...patch },
          revision: state.revision + 1,
        };
        emitState();
      },

      setLoading(loading) {
        const next = loading === true ? 'confirm' : loading === false ? null : loading;
        state = { ...state, loading: next, revision: state.revision + 1 };
        emitState();
      },

      showError(msg) {
        state = { ...state, error: msg ?? undefined, revision: state.revision + 1 };
        emitState();
      },

      timer: {
        pause: () => timer?.pause('manual'),
        resume: () => timer?.resume('manual'),
        add: (ms) => timer?.add(ms),
        remaining: () => timer?.remaining() ?? 0,
        paused: () => timer?.isPaused() ?? false,
      },

      result: resultPromise,
    };

    const controller: HeadlessDialogController = {
      handle: handle as unknown as DialogHandle,
      getState: () => state,
      subscribe(listener) {
        stateListeners.add(listener);
        return () => {
          stateListeners.delete(listener);
        };
      },
      setValueReader(reader) {
        readValue = reader;
      },
      opened() {
        if (state.options.timer && state.options.timer > 0) {
          timer = createTimer(
            state.options.timer,
            () => {
              void controller.dismiss('timer');
            },
            clock,
          );
          timer.start();
        }
        try {
          state.options.didOpen?.(handle as unknown as DialogHandle);
        } catch (err) {
          console.error(err);
        }
        emitState();
      },
      async submit(action) {
        if (settled || state.loading !== null) return;
        const isConfirm = action === 'confirm';
        let val = readValue();

        if (isConfirm && state.options.validate) {
          try {
            const check: ValidateResult = await state.options.validate(
              val,
              handle as unknown as DialogHandle,
            );
            if (typeof check === 'string' && check.trim() !== '') {
              handle.showError(check);
              return;
            }
          } catch (err) {
            handle.showError(errorMessage(err));
            return;
          }
        }

        handle.showError(undefined);

        const hook = isConfirm ? state.options.preConfirm : state.options.preDeny;
        if (hook) {
          handle.setLoading(action);
          try {
            const outcome = await hook(val, handle as unknown as DialogHandle);
            if (outcome === false) {
              handle.setLoading(false);
              return;
            }
            if (outcome !== undefined) val = outcome;
          } catch (err) {
            handle.showError(errorMessage(err));
            handle.setLoading(false);
            return;
          }
          handle.setLoading(false);
        }

        settled = true;
        const res: DialogResult<T> = {
          isConfirmed: isConfirm,
          isDenied: !isConfirm,
          isDismissed: false,
          value: val as T,
          dismiss: undefined,
        };

        try {
          state.options.willClose?.(handle as unknown as DialogHandle, res as DialogResult);
        } catch (err) {
          console.error(err);
        }

        cleanup();
        resolveResult(res);
      },
      async dismiss(reason) {
        if (settled) return;
        settled = true;
        const res: DialogResult<T> = {
          isConfirmed: false,
          isDenied: false,
          isDismissed: true,
          value: undefined,
          dismiss: reason,
        };

        try {
          state.options.willClose?.(handle as unknown as DialogHandle, res as DialogResult);
        } catch (err) {
          console.error(err);
        }

        cleanup();
        resolveResult(res);
      },
    };

    const item: DialogQueueItem = {
      id: itemId,
      options,
      priority,
      resolve: resolveResult as (result: DialogResult) => void,
      controller,
    };

    if (activeItem === undefined) {
      activeItem = item;
      controller.opened();
    } else {
      queue.push(item);
    }

    notifyChange();
    return handle;
  };

  return {
    clock,
    open: openDialog,
    getActive: () => activeItem?.controller,
    getQueue: () => queue.map((q) => q.options),
    clear() {
      const itemsToResolve = [...queue];
      queue.length = 0;
      for (const item of itemsToResolve) {
        item.resolve({
          isConfirmed: false,
          isDenied: false,
          isDismissed: true,
          value: undefined,
          dismiss: 'close',
        });
      }
      if (activeItem) {
        const current = activeItem;
        activeItem = undefined;
        current.controller.handle.close({ dismiss: 'close' });
      }
      notifyChange();
    },
    subscribe: observable.subscribe,
  };
}

/**
 * Executes a sequence of dialog steps until completion or dismissal.
 */
export async function runSteps(
  steps: readonly DialogOptions[],
  manager: DialogManager,
): Promise<DialogResult<unknown[]>> {
  const values: unknown[] = [];
  for (let i = 0; i < steps.length; i++) {
    const step = steps[i];
    if (!step) continue;
    const handle = manager.open({
      ...step,
      reverseButtons: step.reverseButtons ?? (i > 0),
      confirmButton: {
        label: i === steps.length - 1 ? 'Finish' : 'Next',
        ...step.confirmButton,
      },
      cancelButton: {
        label: 'Cancel',
        ...step.cancelButton,
      },
    });

    const result = await handle.result;
    if (!result.isConfirmed) {
      return {
        isConfirmed: false,
        isDenied: result.isDenied,
        isDismissed: result.isDismissed,
        value: values,
        dismiss: result.dismiss,
      };
    }
    values.push(result.value);
  }

  return {
    isConfirmed: true,
    isDenied: false,
    isDismissed: false,
    value: values,
    dismiss: undefined,
  };
}
