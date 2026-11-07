import type { Clock } from './clock';
import { defaultClock } from './clock';
import { createDialogController } from './dialog';
import { createStore } from './store';
import type {
  DialogHandle,
  DialogOptions,
  DialogResult,
  DialogState,
  DismissReason,
  Listener,
  Store,
  Unsubscribe,
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

export function createDialogManager(clock: Clock = defaultClock): DialogManager {
  let counter = 0;
  let activeItem: DialogQueueItem | undefined;
  const queue: DialogQueueItem[] = [];
  const observable: Store<number> = createStore(0);

  const notifyChange = (): void => {
    observable.setState((prev) => prev + 1, true);
  };

  const processQueue = (): void => {
    if (activeItem || !queue.length) return;
    queue.sort((a, b) => (b.priority !== a.priority ? b.priority - a.priority : a.id - b.id));
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

    const base = createDialogController(options);
    const controller: HeadlessDialogController = {
      handle: base.handle,
      getState: base.getState,
      subscribe: base.subscribe,
      setValueReader: base.setValueReader,
      opened: base.opened,
      submit: base.submit,
      dismiss: async (reason: DismissReason) => {
        base.dismiss(reason);
      },
    };

    const cleanup = (): void => {
      if (activeItem?.id === itemId) {
        activeItem = undefined;
        notifyChange();
        processQueue();
      }
    };
    base.subscribe(() => {
      if (!base.getState().open) cleanup();
    });

    const item: DialogQueueItem = {
      id: itemId,
      options,
      priority,
      resolve: () => undefined,
      controller,
    };

    if (!activeItem) {
      activeItem = item;
      controller.opened();
    } else {
      queue.push(item);
    }

    return base.handle as DialogHandle<T>;
  };

  return {
    clock,
    open: openDialog,
    getActive: () => activeItem?.controller,
    getQueue: () => queue.map((i) => i.options),
    clear() {
      if (activeItem) {
        const current = activeItem;
        activeItem = undefined;
        current.controller.handle.close({ isDismissed: true, dismiss: 'close' });
      }
      for (const item of queue) {
        item.controller.handle.close({ isDismissed: true, dismiss: 'close' });
      }
      queue.length = 0;
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
    const res = await manager.open({
      ...step,
      reverseButtons: step.reverseButtons ?? i > 0,
      confirmButton: { label: i === steps.length - 1 ? 'Finish' : 'Next', ...step.confirmButton },
      cancelButton: { label: 'Cancel', ...step.cancelButton },
    }).result;
    if (!res.isConfirmed) return { ...res, isConfirmed: false, value: values };
    values.push(res.value);
  }
  return {
    isConfirmed: true,
    isDenied: false,
    isDismissed: false,
    value: values,
    dismiss: undefined,
  };
}
