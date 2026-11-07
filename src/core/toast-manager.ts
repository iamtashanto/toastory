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
const isUser = (r: CloseReason): boolean => r === 'user' || r === 'swipe' || r === 'click';

const safeCall = <A, B>(fn?: (a: A, b: B) => void, a?: A, b?: B): void => {
  try {
    fn?.(a as A, b as B);
  } catch (err) {
    console.error(err);
  }
};

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
  flags: number;
}

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
  const now = options.now ?? clock.now;
  const types = options.types ?? createTypeRegistry();

  const entries = new Map<ToastId, Entry>();
  let order: ToastId[] = [];
  let snapshot: readonly ToastRecord[] = [];
  let history: readonly ToastRecord[] = [];
  const listeners = new Set<Listener>();

  const emit = (): void => {
    snapshot = order.map((id) => entries.get(id)?.record).filter(Boolean) as ToastRecord[];
    listeners.forEach((listener) => listener());
  };

  const build = (
    id: ToastId,
    opts: ToastOptions,
    previous: ToastRecord | undefined,
    custom: ToastCustomRenderer | undefined,
  ): ToastRecord => {
    const cfg = config.get();
    const type = opts.type ?? 'default';
    const merged: ToastOptions = {
      ...types.get(type)?.defaults,
      ...opts,
    };
    merged.title ??= merged.text1;
    merged.description ??= merged.text2;
    merged.onOpen ??= merged.onShow;
    merged.onClose ??= merged.onHide;
    if (!merged.actions && merged.buttons) {
      merged.actions = merged.buttons.map((b) => ({
        label: b.label,
        onClick: (e: MouseEvent) =>
          (b.onClick ?? b.onPress)?.({
            preventDefault: () => e.preventDefault(),
            defaultPrevented: e.defaultPrevented,
          }),
        autoDismiss: b.autoDismiss,
        kind: b.kind,
      }));
    }
    const rawDuration =
      merged.autoHide === false ? 0 : (merged.duration ?? merged.visibilityTime ?? cfg.duration);
    const duration = Number.isFinite(rawDuration) && rawDuration > 0 ? rawDuration : 0;
    const urgent = merged.important || type === 'error';
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
      revision: (previous?.revision ?? -1) + 1,
      timerEpoch: previous?.timerEpoch ?? 0,
      count: previous?.count ?? 1,
      visible: previous?.visible ?? false,
      dismissed: false,
      pausedBy: previous?.pausedBy ?? (cfg.startPaused ? [MANUAL_PAUSE] : []),
      remaining: previous?.remaining ?? (duration || Infinity),
      custom,
    };
    return record;
  };

  const remainingOf = (entry: Entry): number => {
    return entry.record.duration === 0 ? Infinity : entry.timer.remaining();
  };

  const dedupeKeyOf = (o: ToastOptions): string | undefined => {
    if (o.dedupe === false) return;
    if (typeof o.dedupe === 'string') return o.dedupe;
    const t = o.title ?? o.text1;
    const d = o.description ?? o.text2;
    const ts = typeof t === 'string' ? t : '';
    const ds = typeof d === 'string' ? d : '';
    return ts || ds ? `${o.type ?? 'default'}|${ts}|${ds}` : undefined;
  };

  const promote = (): void => {
    const { maxVisible } = config.get();
    const counts = new Map<string, number>();
    for (const id of order) {
      const entry = entries.get(id);
      if (!entry || entry.record.dismissed) continue;
      const key = `${entry.record.container ?? ''}|${entry.record.position}`;
      const used = counts.get(key) ?? 0;
      const imp = !!entry.record.important;
      if (used < maxVisible || imp) {
        if (!entry.record.visible) {
          entry.record = { ...entry.record, visible: true };
          if (!entry.record.pausedBy.length && entry.record.duration > 0) entry.timer.start();
        }
        if (!imp) counts.set(key, used + 1);
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
    if (!(entry.flags & 2)) {
      entry.flags |= 2;
      safeCall(entry.record.onClose, entry.record, entry.reason ?? 'api');
    }
  };

  const dismissEntry = (entry: Entry, reason: CloseReason): void => {
    if (entry.record.dismissed) return;
    if (entry.record.dismissible === false && isUser(reason)) return;
    entry.reason = reason;
    entry.record = {
      ...entry.record,
      dismissed: true,
      remaining: 0,
      revision: entry.record.revision + 1,
    };
    entry.timer.cancel();

    if (!(entry.flags & 4) && reason !== 'auto') {
      entry.flags |= 4;
      safeCall(entry.record.onDismiss, entry.record, reason);
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
    const entry: Entry = {
      opts,
      custom,
      record,
      timer: undefined as unknown as PausableTimer,
      dedupeKey: dedupeKeyOf(opts),
      exitHandle: undefined,
      reason: undefined,
      flags: 0,
    };
    entry.timer = createTimer(
      record.duration,
      () => {
        if (!(entry.flags & 8)) {
          entry.flags |= 8;
          safeCall(entry.record.onAutoClose, entry.record);
        }
        dismissEntry(entry, 'auto');
      },
      clock,
    );
    if (record.pausedBy.length) entry.timer.pause();
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
      if (entry && entry.record.visible && !(entry.flags & 1) && !entry.record.dismissed) {
        entry.flags |= 1;
        safeCall(entry.record.onOpen, entry.record);
      }
    }
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
      for (const key in rest) {
        const value = (rest as Record<string, unknown>)[key];
        if (value !== undefined) {
          if ((entry.opts as Record<string, unknown>)[key] !== value) changed = true;
          (next as Record<string, unknown>)[key] = value;
        }
      }
      if (!changed && rest.type === undefined && rest.position === undefined) return true;
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
      if (id === undefined) return store.dismissAll(reason);
      const entry = entries.get(id);
      if (entry) dismissEntry(entry, reason);
    },

    dismissAll(reason = 'api') {
      for (const entry of entries.values()) dismissEntry(entry, reason);
    },

    pause(id, reason) {
      for (const e of id !== undefined ? [entries.get(id)] : entries.values()) {
        if (!e || e.record.pausedBy.includes(reason)) continue;
        e.timer.pause(reason);
        e.record = {
          ...e.record,
          pausedBy: [...e.record.pausedBy, reason],
          remaining: remainingOf(e),
        };
      }
      emit();
    },

    resume(id, reason) {
      for (const e of id !== undefined ? [entries.get(id)] : entries.values()) {
        if (!e || !e.record.pausedBy.includes(reason)) continue;
        e.timer.resume(reason);
        const pausedBy = e.record.pausedBy.filter((v) => v !== reason);
        e.record = { ...e.record, pausedBy, remaining: remainingOf(e) };
        if (!pausedBy.length && e.record.visible && e.record.duration > 0) e.timer.start();
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
