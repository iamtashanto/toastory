import type { Clock } from './clock';
import { defaultClock } from './clock';
import type { ConfigStore } from './config';
import { createConfigStore } from './config';
import { normalizeId } from './ids';
import { createTimer } from './timer';
import type { PausableTimer } from './timer';
import { createTypeRegistry } from './types-registry';
import type { TypeRegistry } from './types-registry';
import type {
  CloseReason,
  Listener,
  ToastCustomRenderer,
  ToastId,
  ToastOptions,
  ToastPatch,
  ToastRecord,
  Unsubscribe,
} from './types';

/** Reasons that originate from a person and are blocked on non-dismissible toasts. */
const USER_REASONS: ReadonlySet<CloseReason> = new Set<CloseReason>(['user', 'swipe', 'click']);

/** Pause reason used by `startPaused`. */
export const MANUAL_PAUSE = 'manual';

/** Options for creating a toast manager / store. */
export interface ToastManagerOptions {
  config?: ConfigStore;
  clock?: Clock;
  now?: () => number;
  types?: TypeRegistry;
}

export type ToastStoreOptions = ToastManagerOptions;

/** Input for adding a toast. */
export interface AddToastInput extends ToastOptions {
  custom?: ToastCustomRenderer;
}

interface Entry {
  opts: ToastOptions;
  custom: ToastCustomRenderer | undefined;
  record: ToastRecord;
  timer: PausableTimer;
  dedupeKey: string | undefined;
  exitHandle: (() => void) | undefined;
  reason: CloseReason | undefined;
  openedFired: boolean;
  closedFired: boolean;
  dismissFired: boolean;
  autoCloseFired: boolean;
}

const BUILTIN_DEFAULTS: Readonly<Record<string, ToastOptions>> = {
  loading: { duration: 0 },
};

/** State container for toasts. Pure logic: no DOM, no framework. */
export interface ToastManager {
  add(input: AddToastInput): ToastId;
  update(id: ToastId, patch: ToastPatch): boolean;
  dismiss(id?: ToastId, reason?: CloseReason): void;
  dismissAll(reason?: CloseReason): void;
  pause(id: ToastId | undefined, reason: string): void;
  resume(id: ToastId | undefined, reason: string): void;
  extend(id: ToastId, ms: number): void;
  getRemaining(id: ToastId): number;
  getToasts(): readonly ToastRecord[];
  getHistory(): readonly ToastRecord[];
  clear(): void;
  clearHistory(): void;
  subscribe(listener: Listener): Unsubscribe;
  readonly config: ConfigStore;
  readonly types: TypeRegistry;
}

export type ToastStore = ToastManager;

export function createToastManager(options: ToastManagerOptions = {}): ToastManager {
  const config = options.config ?? createConfigStore();
  const clock = options.clock ?? defaultClock;
  const now = options.now ?? (() => clock.now());
  const types = options.types ?? createTypeRegistry();

  const entries = new Map<ToastId, Entry>();
  let order: ToastId[] = [];
  let snapshot: readonly ToastRecord[] = [];
  let history: readonly ToastRecord[] = [];
  const listeners = new Set<Listener>();

  const emit = (): void => {
    snapshot = order.flatMap((id) => {
      const entry = entries.get(id);
      return entry ? [entry.record] : [];
    });
    for (const listener of [...listeners]) listener();
  };

  const regionOf = (record: ToastRecord): string => `${record.container ?? ''}|${record.position}`;

  const build = (
    id: ToastId,
    opts: ToastOptions,
    previous: ToastRecord | undefined,
    custom: ToastCustomRenderer | undefined,
  ): ToastRecord => {
    const cfg = config.get();
    const type = opts.type ?? 'default';
    const merged: ToastOptions = {
      ...BUILTIN_DEFAULTS[type],
      ...types.get(type)?.defaults,
      ...opts,
    };
    const rawDuration = merged.duration ?? cfg.duration;
    const duration = Number.isFinite(rawDuration) && rawDuration > 0 ? rawDuration : 0;
    const urgent = merged.important === true || type === 'error';
    const stamp = now();

    const record: ToastRecord = {
      ...merged,
      id,
      type,
      duration,
      position: merged.position ?? cfg.position,
      ariaLive: merged.ariaLive ?? (urgent ? 'assertive' : 'polite'),
      role: merged.role ?? (urgent ? 'alert' : 'status'),
      createdAt: previous ? previous.createdAt : stamp,
      updatedAt: stamp,
      revision: previous ? previous.revision + 1 : 0,
      timerEpoch: previous ? previous.timerEpoch : 0,
      count: previous ? previous.count : 1,
      visible: previous ? previous.visible : false,
      dismissed: false,
      pausedBy: previous ? previous.pausedBy : cfg.startPaused ? [MANUAL_PAUSE] : [],
      remaining: previous ? previous.remaining : duration === 0 ? Infinity : duration,
      custom,
    };
    return record;
  };

  const remainingOf = (entry: Entry): number => {
    return entry.record.duration === 0 ? Infinity : entry.timer.remaining();
  };

  const dedupeKeyOf = (opts: ToastOptions): string | undefined => {
    if (opts.dedupe === false) return undefined;
    if (typeof opts.dedupe === 'string') return opts.dedupe;
    const type = opts.type ?? 'default';
    const title = typeof opts.title === 'string' ? opts.title : '';
    const desc = typeof opts.description === 'string' ? opts.description : '';
    if (!title && !desc) return undefined;
    return `${type}|${title}|${desc}`;
  };

  const promote = (): void => {
    const cfg = config.get();
    const counts = new Map<string, number>();
    for (const id of order) {
      const entry = entries.get(id);
      if (!entry || entry.record.dismissed) continue;
      const key = regionOf(entry.record);
      const used = counts.get(key) ?? 0;
      const isImportant = entry.record.important === true;
      if (used < cfg.maxVisible || isImportant) {
        if (!entry.record.visible) {
          entry.record = { ...entry.record, visible: true };
          if (!entry.record.pausedBy.length && entry.record.duration > 0) {
            entry.timer.start();
          }
        }
        if (!isImportant) counts.set(key, used + 1);
      } else if (entry.record.visible) {
        entry.record = { ...entry.record, visible: false };
        entry.timer.pause();
      }
    }
  };

  const finalize = (entry: Entry): void => {
    entry.exitHandle?.();
    entry.timer.cancel();
    entries.delete(entry.record.id);
    order = order.filter((id) => id !== entry.record.id);
    history = [{ ...entry.record, dismissed: true }, ...history].slice(
      0,
      config.get().historyLimit,
    );
    promote();
    flushOpened();
    emit();
    if (!entry.closedFired) {
      entry.closedFired = true;
      try {
        entry.record.onClose?.(entry.record, entry.reason ?? 'api');
      } catch (err) {
        console.error(err);
      }
    }
  };

  const dismissEntry = (entry: Entry, reason: CloseReason): void => {
    if (entry.record.dismissed) return;
    if (entry.record.dismissible === false && USER_REASONS.has(reason)) return;
    entry.reason = reason;
    entry.record = {
      ...entry.record,
      dismissed: true,
      remaining: 0,
      revision: entry.record.revision + 1,
    };
    entry.timer.cancel();

    if (!entry.dismissFired && reason !== 'auto') {
      entry.dismissFired = true;
      try {
        entry.record.onDismiss?.(entry.record, reason);
      } catch (err) {
        console.error(err);
      }
    }

    promote();
    flushOpened();
    emit();

    const exit = config.get().exitDuration;
    if (exit <= 0 || !entry.record.visible) {
      finalize(entry);
    } else {
      entry.exitHandle = clock.setTimeout(() => finalize(entry), exit);
    }
  };

  const makeEntry = (id: ToastId, input: AddToastInput): Entry => {
    const { custom, ...opts } = input;
    const record = build(id, opts, undefined, custom);
    let onTimerDone = (): void => {};
    const timer = createTimer(record.duration, () => onTimerDone(), clock);
    if (record.pausedBy.length) timer.pause();
    const entry: Entry = {
      opts,
      custom,
      record,
      timer,
      dedupeKey: dedupeKeyOf(opts),
      exitHandle: undefined,
      reason: undefined,
      openedFired: false,
      closedFired: false,
      dismissFired: false,
      autoCloseFired: false,
    };
    onTimerDone = () => {
      if (!entry.autoCloseFired) {
        entry.autoCloseFired = true;
        try {
          entry.record.onAutoClose?.(entry.record);
        } catch (err) {
          console.error(err);
        }
      }
      dismissEntry(entry, 'auto');
    };
    return entry;
  };

  const restartTimer = (entry: Entry): void => {
    entry.timer.cancel();
    if (entry.record.duration > 0) {
      entry.timer.reset(entry.record.duration);
      if (entry.record.visible && !entry.record.pausedBy.length) entry.timer.start();
    }
    entry.record = {
      ...entry.record,
      timerEpoch: entry.record.timerEpoch + 1,
      remaining: remainingOf(entry),
    };
  };

  const flushOpened = (): void => {
    for (const id of order) {
      const entry = entries.get(id);
      if (entry && entry.record.visible && !entry.openedFired && !entry.record.dismissed) {
        entry.openedFired = true;
        try {
          entry.record.onOpen?.(entry.record);
        } catch (err) {
          console.error(err);
        }
      }
    }
  };

  const pick = (id: ToastId): Entry[] => {
    const entry = entries.get(id);
    return entry ? [entry] : [];
  };

  const store: ToastManager = {
    config,
    types,

    add(input: AddToastInput): ToastId {
      const id = normalizeId(input.id);
      const existing = entries.get(id);
      if (existing && !existing.record.dismissed) {
        const { custom, ...patch } = input;
        store.update(id, patch);
        if (custom) {
          existing.custom = custom;
          existing.record = { ...existing.record, custom };
          emit();
        }
        return id;
      }
      if (existing) finalize(existing);

      const key = dedupeKeyOf(input);
      if (key !== undefined) {
        for (const other of entries.values()) {
          if (other.dedupeKey === key && !other.record.dismissed) {
            other.record = {
              ...other.record,
              count: other.record.count + 1,
              revision: other.record.revision + 1,
              updatedAt: now(),
            };
            restartTimer(other);
            emit();
            return other.record.id;
          }
        }
      }

      const entry = makeEntry(id, input);
      entries.set(id, entry);
      order = [...order, id];
      promote();
      emit();
      flushOpened();
      return id;
    },

    update(id, patch) {
      const entry = entries.get(id);
      if (!entry || entry.record.dismissed) return false;
      const { resetTimer = true, ...rest } = patch;
      const next: ToastOptions = { ...entry.opts };
      if (rest.type !== undefined && rest.type !== entry.record.type) {
        delete next.duration;
        delete next.ariaLive;
        delete next.role;
        delete next.icon;
      }
      let changed = false;
      for (const [key, value] of Object.entries(rest)) {
        if (value !== undefined) {
          if ((entry.opts as Record<string, unknown>)[key] !== value) changed = true;
          Object.assign(next, { [key]: value });
        }
      }
      if (!changed && rest.type === undefined && rest.position === undefined) {
        return true;
      }
      entry.opts = next;
      entry.dedupeKey = dedupeKeyOf(next);
      const rebuilt = build(id, next, entry.record, entry.custom);
      const positionChanged = rebuilt.position !== entry.record.position;
      entry.record = rebuilt;
      if (positionChanged) {
        entry.record = { ...entry.record, visible: false };
        promote();
      }
      if (resetTimer || positionChanged) restartTimer(entry);
      else {
        entry.record = {
          ...entry.record,
          remaining: remainingOf(entry),
        };
      }
      emit();
      flushOpened();
      return true;
    },

    dismiss(id, reason = 'api') {
      if (id === undefined) {
        store.dismissAll(reason);
        return;
      }
      const entry = entries.get(id);
      if (entry) dismissEntry(entry, reason);
    },

    dismissAll(reason = 'api') {
      for (const entry of [...entries.values()]) dismissEntry(entry, reason);
    },

    pause(id, reason) {
      const targets = id === undefined ? [...entries.values()] : pick(id);
      for (const entry of targets) {
        if (entry.record.pausedBy.includes(reason)) continue;
        entry.timer.pause(reason);
        entry.record = {
          ...entry.record,
          pausedBy: [...entry.record.pausedBy, reason],
          remaining: remainingOf(entry),
        };
      }
      emit();
    },

    resume(id, reason) {
      const targets = id === undefined ? [...entries.values()] : pick(id);
      for (const entry of targets) {
        if (!entry.record.pausedBy.includes(reason)) continue;
        entry.timer.resume(reason);
        const nextPausedBy = entry.record.pausedBy.filter((value) => value !== reason);
        entry.record = {
          ...entry.record,
          pausedBy: nextPausedBy,
          remaining: remainingOf(entry),
        };
        if (!nextPausedBy.length && entry.record.visible && entry.record.duration > 0) {
          entry.timer.start();
        }
      }
      emit();
    },

    extend(id, ms) {
      const entry = entries.get(id);
      if (!entry || entry.record.dismissed) return;
      entry.timer.add(ms);
      entry.record = {
        ...entry.record,
        remaining: remainingOf(entry),
        timerEpoch: entry.record.timerEpoch + 1,
        revision: entry.record.revision + 1,
      };
      emit();
    },

    getRemaining(id) {
      const entry = entries.get(id);
      return entry ? remainingOf(entry) : 0;
    },

    getToasts: () => snapshot,
    getHistory: () => history,

    clear() {
      for (const entry of entries.values()) {
        entry.exitHandle?.();
        entry.timer.cancel();
      }
      entries.clear();
      order = [];
      snapshot = [];
      emit();
    },

    clearHistory() {
      history = [];
      emit();
    },

    subscribe(listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
  };

  return store;
}

export const createToastStore = createToastManager;
