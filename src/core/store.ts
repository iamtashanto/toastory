import { createConfigStore } from './config';
import type { ConfigStore } from './config';
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

/** Options for creating a store. */
export interface ToastStoreOptions {
  /** Existing config store to share. A private one is created otherwise. */
  config?: ConfigStore;
  /** Clock returning epoch milliseconds. Defaults to `Date.now`. */
  now?: () => number;
}

/** Input for `store.add`. */
export interface AddToastInput extends ToastOptions {
  /** Custom renderer, set by `ui.toast.custom`. */
  custom?: ToastCustomRenderer;
}

/** State container for toasts. Pure logic: no DOM, no framework. */
export interface ToastStore {
  /** Creates a toast, or updates / collapses into an existing one. Returns its id. */
  add(input: AddToastInput): ToastId;
  /** Patches an active toast. Returns `false` when the toast is unknown or already dismissed. */
  update(id: ToastId, patch: ToastPatch): boolean;
  /** Dismisses one toast, or all when `id` is omitted. */
  dismiss(id?: ToastId, reason?: CloseReason): void;
  /** Dismisses every toast, including queued ones. */
  dismissAll(reason?: CloseReason): void;
  /** Pauses the timer of a toast (or all) for a named reason. */
  pause(id: ToastId | undefined, reason: string): void;
  /** Releases a pause reason. The timer restarts when no reason remains. */
  resume(id: ToastId | undefined, reason: string): void;
  /** Adds milliseconds to a running timer. */
  extend(id: ToastId, ms: number): void;
  /** Live remaining time in milliseconds, `Infinity` when persistent, `0` when unknown. */
  getRemaining(id: ToastId): number;
  /** Active toasts (visible, queued and exiting), oldest first. */
  getToasts(): readonly ToastRecord[];
  /** Closed toasts, newest first, capped by `historyLimit`. */
  getHistory(): readonly ToastRecord[];
  /** Empties active toasts and queue immediately. */
  clear(): void;
  /** Empties the history. */
  clearHistory(): void;
  /** Subscribes to any change. */
  subscribe(listener: Listener): Unsubscribe;
  /** Shared configuration. */
  readonly config: ConfigStore;
  /** Registry of custom toast types. */
  readonly types: TypeRegistry;
}

interface Entry {
  opts: ToastOptions;
  custom: ToastCustomRenderer | undefined;
  record: ToastRecord;
  timer: PausableTimer;
  dedupeKey: string | undefined;
  exitHandle: ReturnType<typeof setTimeout> | undefined;
  reason: CloseReason | undefined;
}

const BUILTIN_DEFAULTS: Readonly<Record<string, ToastOptions>> = {
  loading: { duration: 0 },
};

/** Creates a toast store. */
export function createToastStore(options: ToastStoreOptions = {}): ToastStore {
  const config = options.config ?? createConfigStore();
  const now = options.now ?? Date.now;
  const types = createTypeRegistry();
  const entries = new Map<ToastId, Entry>();
  let order: ToastId[] = [];
  let snapshot: readonly ToastRecord[] = [];
  let history: readonly ToastRecord[] = [];
  let counter = 0;
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
      createdAt: previous?.createdAt ?? stamp,
      updatedAt: stamp,
      revision: (previous?.revision ?? 0) + 1,
      timerEpoch: previous?.timerEpoch ?? 0,
      count: previous?.count ?? 1,
      visible: previous?.visible ?? false,
      dismissed: previous?.dismissed ?? false,
      pausedBy: previous?.pausedBy ?? [],
      remaining: duration === 0 ? Infinity : duration,
    };
    if (custom) record.custom = custom;
    return record;
  };

  const setRecord = (entry: Entry, record: ToastRecord): void => {
    entry.record = record;
  };

  const syncTimer = (entry: Entry): void => {
    const { record, timer } = entry;
    if (record.dismissed || !record.visible || record.pausedBy.length > 0) {
      timer.pause();
    } else {
      timer.start();
    }
  };

  const finalize = (entry: Entry): void => {
    const id = entry.record.id;
    if (entries.get(id) !== entry) return;
    if (entry.exitHandle !== undefined) clearTimeout(entry.exitHandle);
    entry.timer.cancel();
    entries.delete(id);
    order = order.filter((value) => value !== id);
    const limit = config.get().historyLimit;
    history = [entry.record, ...history].slice(0, Math.max(0, limit));
    promote();
    emit();
    entry.record.onClose?.(entry.record, entry.reason ?? 'api');
  };

  const promoteEntry = (entry: Entry): void => {
    setRecord(entry, { ...entry.record, visible: true, revision: entry.record.revision + 1 });
    syncTimer(entry);
  };

  /** Fills free visible slots per region in creation order. Returns entries that just opened. */
  const openQueued: Entry[] = [];
  const promote = (): void => {
    const max = config.get().maxVisible;
    const used = new Map<string, number>();
    for (const id of order) {
      const entry = entries.get(id);
      if (!entry || entry.record.dismissed) continue;
      const region = regionOf(entry.record);
      if (entry.record.visible) {
        used.set(region, (used.get(region) ?? 0) + 1);
        continue;
      }
      const count = used.get(region) ?? 0;
      if (count < max || entry.record.important === true) {
        used.set(region, count + 1);
        promoteEntry(entry);
        openQueued.push(entry);
      }
    }
  };

  const flushOpened = (): void => {
    const opened = openQueued.splice(0);
    for (const entry of opened) entry.record.onOpen?.(entry.record);
  };

  const dedupeKeyOf = (input: ToastOptions): string | undefined => {
    if (!input.dedupe) return undefined;
    if (typeof input.dedupe === 'string') return input.dedupe;
    return `${input.type ?? 'default'}\u0000${String(input.title)}\u0000${String(input.description)}`;
  };

  const restartTimer = (entry: Entry): void => {
    entry.timer.reset(entry.record.duration === 0 ? Infinity : entry.record.duration);
    setRecord(entry, {
      ...entry.record,
      timerEpoch: entry.record.timerEpoch + 1,
      remaining: entry.record.duration === 0 ? Infinity : entry.record.duration,
    });
    syncTimer(entry);
  };

  const makeEntry = (id: ToastId, input: AddToastInput): Entry => {
    const { custom, ...opts } = input;
    const record = build(id, opts, undefined, custom);
    const entry: Entry = {
      opts,
      custom,
      record,
      timer: createTimer(
        record.duration === 0 ? Infinity : record.duration,
        () => {
          entry.record.onAutoClose?.(entry.record);
          dismissEntry(entry, 'auto');
        },
        now,
      ),
      dedupeKey: dedupeKeyOf(opts),
      exitHandle: undefined,
      reason: undefined,
    };
    if (config.get().startPaused) entry.record.pausedBy = [MANUAL_PAUSE];
    return entry;
  };

  const dismissEntry = (entry: Entry, reason: CloseReason): void => {
    const { record } = entry;
    if (record.dismissed) return;
    if (record.dismissible === false && USER_REASONS.has(reason)) return;
    entry.reason = reason;
    entry.timer.cancel();
    if (!record.visible) {
      setRecord(entry, { ...record, dismissed: true });
      record.onDismiss?.(entry.record, reason);
      finalize(entry);
      flushOpened();
      return;
    }
    setRecord(entry, { ...record, dismissed: true, revision: record.revision + 1 });
    promote();
    emit();
    flushOpened();
    if (reason !== 'auto') entry.record.onDismiss?.(entry.record, reason);
    const wait = config.get().exitDuration;
    if (wait <= 0) finalize(entry);
    else entry.exitHandle = setTimeout(() => finalize(entry), wait);
    flushOpened();
  };

  const store: ToastStore = {
    config,
    types,
    add(input) {
      const id = input.id ?? `gk-${++counter}`;
      const existing = entries.get(id);
      if (existing && !existing.record.dismissed) {
        const { custom, ...patch } = input;
        store.update(id, patch);
        if (custom) {
          existing.custom = custom;
          setRecord(existing, { ...existing.record, custom });
          emit();
        }
        return id;
      }
      if (existing) finalize(existing);

      const key = dedupeKeyOf(input);
      if (key !== undefined) {
        for (const other of entries.values()) {
          if (other.dedupeKey === key && !other.record.dismissed) {
            setRecord(other, {
              ...other.record,
              count: other.record.count + 1,
              revision: other.record.revision + 1,
              updatedAt: now(),
            });
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
      setRecord(entry, rebuilt);
      if (positionChanged) {
        setRecord(entry, { ...entry.record, visible: false });
        promote();
      }
      if (resetTimer || positionChanged) restartTimer(entry);
      else syncTimer(entry);
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
        entry.timer.pause();
        setRecord(entry, {
          ...entry.record,
          pausedBy: [...entry.record.pausedBy, reason],
          remaining: remainingOf(entry),
        });
        syncTimer(entry);
      }
      emit();
    },
    resume(id, reason) {
      const targets = id === undefined ? [...entries.values()] : pick(id);
      for (const entry of targets) {
        if (!entry.record.pausedBy.includes(reason)) continue;
        setRecord(entry, {
          ...entry.record,
          pausedBy: entry.record.pausedBy.filter((value) => value !== reason),
          remaining: remainingOf(entry),
        });
        syncTimer(entry);
      }
      emit();
    },
    extend(id, ms) {
      const entry = entries.get(id);
      if (!entry || entry.record.dismissed) return;
      entry.timer.add(ms);
      setRecord(entry, {
        ...entry.record,
        remaining: remainingOf(entry),
        timerEpoch: entry.record.timerEpoch + 1,
        revision: entry.record.revision + 1,
      });
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
        if (entry.exitHandle !== undefined) clearTimeout(entry.exitHandle);
        entry.timer.cancel();
      }
      entries.clear();
      order = [];
      snapshot = [];
      counter = 0;
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

  function pick(id: ToastId): Entry[] {
    const entry = entries.get(id);
    return entry ? [entry] : [];
  }

  function remainingOf(entry: Entry): number {
    return entry.record.duration === 0 ? Infinity : entry.timer.remaining();
  }

  return store;
}
