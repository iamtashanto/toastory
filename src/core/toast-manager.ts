import { decideAriaLive, decideToastRole } from './a11y-rules';
import type { Clock } from './clock';
import { defaultClock } from './clock';
import type { ConfigStore } from './config';
import { createConfigStore, resolvePrecedence } from './config';
import { nextId, normalizeId } from './ids';
import { createStore } from './store';
import { createTimer } from './timer';
import type { PausableTimer } from './timer';
import { createTypeRegistry } from './types-registry';
import type { TypeRegistry } from './types-registry';
import type {
  CloseReason,
  GlazeConfig,
  Listener,
  ToastCustomRenderer,
  ToastId,
  ToastOptions,
  ToastPatch,
  ToastPosition,
  ToastRecord,
  Unsubscribe,
} from './types';

const USER_REASONS: ReadonlySet<CloseReason> = new Set<CloseReason>(['user', 'swipe', 'click']);
export const MANUAL_PAUSE = 'manual';

export interface ToastManagerOptions {
  config?: ConfigStore;
  types?: TypeRegistry;
  clock?: Clock;
}

export interface AddToastInput extends ToastOptions {
  custom?: ToastCustomRenderer;
}

interface ToastEntry {
  record: ToastRecord;
  timer?: PausableTimer;
  cleanups: (() => void)[];
  openedFired: boolean;
  closedFired: boolean;
  dismissFired: boolean;
  autoCloseFired: boolean;
}

export interface ToastManager {
  readonly config: ConfigStore;
  readonly types: TypeRegistry;
  readonly clock: Clock;

  add(input: AddToastInput): ToastId;
  update(id: ToastId, patch: ToastPatch): boolean;
  dismiss(id?: ToastId, reason?: CloseReason): void;
  dismissAll(reason?: CloseReason): void;
  pause(id: ToastId | undefined, reason?: string): void;
  resume(id: ToastId | undefined, reason?: string): void;
  getRemaining(id: ToastId): number;
  getToasts(): ToastRecord[];
  getHistory(): ToastRecord[];
  clearHistory(): void;
  extend(id: ToastId, ms: number): boolean;
  clear(): void;
  subscribe(listener: Listener): Unsubscribe;
  getSnapshot(): ToastRecord[];
}

/** Alias for ToastManager for seamless backward compatibility. */
export type ToastStore = ToastManager;

export function createToastManager(options: ToastManagerOptions = {}): ToastManager {
  const clock = options.clock ?? defaultClock;
  const config = options.config ?? createConfigStore();
  const types = options.types ?? createTypeRegistry();

  const entries = new Map<ToastId, ToastEntry>();
  const history: ToastRecord[] = [];
  const observable = createStore<ToastRecord[]>([]);

  const cfg = (): Readonly<GlazeConfig> => config.get();

  const syncState = (): void => {
    const list = Array.from(entries.values()).map((e) => e.record);
    observable.setState(list, true);
  };

  const getDedupeKey = (input: ToastOptions): string | null => {
    if (input.dedupe === false) return null;
    if (typeof input.dedupe === 'string') return input.dedupe;
    const type = input.type ?? 'message';
    const title = typeof input.title === 'string' ? input.title : '';
    const desc = typeof input.description === 'string' ? input.description : '';
    if (!title && !desc) return null;
    return `${type}:${title}:${desc}`;
  };

  const findDedupeMatch = (key: string): ToastEntry | undefined => {
    const now = clock.now();
    const windowMs = cfg().dedupeWindow;
    for (const entry of entries.values()) {
      if (entry.record.dismissed) continue;
      const entryKey = getDedupeKey(entry.record);
      if (entryKey === key && now - entry.record.createdAt <= windowMs) {
        return entry;
      }
    }
    return undefined;
  };

  const countVisible = (pos: ToastPosition): number => {
    let count = 0;
    for (const entry of entries.values()) {
      if (entry.record.position === pos && entry.record.visible && !entry.record.dismissed) {
        count += 1;
      }
    }
    return count;
  };

  const promoteQueue = (pos: ToastPosition): void => {
    const max = cfg().maxVisible;
    for (const entry of entries.values()) {
      if (entry.record.position === pos && !entry.record.visible && !entry.record.dismissed) {
        if (countVisible(pos) >= max) break;
        entry.record = { ...entry.record, visible: true };
        if (!entry.openedFired) {
          entry.openedFired = true;
          try {
            entry.record.onOpen?.(entry.record);
          } catch (err) {
            console.error(err);
          }
        }
        entry.timer?.start();
      }
    }
  };

  const scheduleRemoval = (id: ToastId, reason: CloseReason): void => {
    const entry = entries.get(id);
    if (!entry) return;

    entry.timer?.cancel();
    entry.record = {
      ...entry.record,
      dismissed: true,
      remaining: 0,
      revision: entry.record.revision + 1,
    };
    syncState();

    promoteQueue(entry.record.position);

    const cleanup = clock.setTimeout(() => {
      const finalEntry = entries.get(id);
      if (finalEntry) {
        for (const cl of finalEntry.cleanups) cl();
        entries.delete(id);
        if (!finalEntry.closedFired) {
          finalEntry.closedFired = true;
          try {
            finalEntry.record.onClose?.(finalEntry.record, reason);
          } catch (err) {
            console.error(err);
          }
        }
        history.push({ ...finalEntry.record });
        if (history.length > cfg().historyLimit) {
          history.shift();
        }
        syncState();
      }
    }, cfg().exitDuration);

    entry.cleanups.push(cleanup);
  };

  const manager: ToastManager = {
    config,
    types,
    clock,

    add(input: AddToastInput): ToastId {
      const c = cfg();
      const rawId = input.id;
      const typeDef = types.get(input.type ?? 'message');
      const defOpts = typeDef?.defaults ?? {};

      // In-place update if existing active toast has same id
      if (rawId !== undefined && entries.has(rawId)) {
        const existing = entries.get(rawId)!;
        if (!existing.record.dismissed) {
          manager.update(rawId, input);
          return rawId;
        }
      }

      // Deduplication by content key
      const dedupeKey = getDedupeKey(input);
      if (dedupeKey) {
        const match = findDedupeMatch(dedupeKey);
        if (match) {
          const nextCount = match.record.count + 1;
          match.record = {
            ...match.record,
            count: nextCount,
            revision: match.record.revision + 1,
            timerEpoch: match.record.timerEpoch + 1,
            updatedAt: clock.now(),
          };
          match.timer?.reset();
          syncState();
          return match.record.id;
        }
      }

      const id = normalizeId(rawId);
      const position = resolvePrecedence(
        input.position,
        defOpts.position,
        c.position,
        'top-right' as ToastPosition,
      );
      const duration = resolvePrecedence(
        input.duration,
        typeDef?.duration ?? defOpts.duration,
        c.duration,
        4000,
      );
      const important = input.important === true;
      const ariaLive = decideAriaLive(input.type, important, input.ariaLive ?? defOpts.ariaLive);
      const role = decideToastRole(input.type, important, input.role ?? defOpts.role);

      const isUnderMax = countVisible(position) < c.maxVisible;
      const visible = important || isUnderMax;

      const record: ToastRecord = {
        ...defOpts,
        ...input,
        id,
        type: input.type ?? 'message',
        duration,
        position,
        ariaLive,
        role,
        createdAt: clock.now(),
        updatedAt: clock.now(),
        revision: 0,
        timerEpoch: 0,
        count: 1,
        visible,
        dismissed: false,
        pausedBy: c.startPaused ? [MANUAL_PAUSE] : [],
        remaining: duration,
        custom: input.custom,
      };

      const entry: ToastEntry = {
        record,
        cleanups: [],
        openedFired: false,
        closedFired: false,
        dismissFired: false,
        autoCloseFired: false,
      };

      if (duration > 0 && duration !== Infinity) {
        entry.timer = createTimer(
          duration,
          () => {
            if (!entry.autoCloseFired) {
              entry.autoCloseFired = true;
              try {
                entry.record.onAutoClose?.(entry.record);
              } catch (err) {
                console.error(err);
              }
            }
            scheduleRemoval(id, 'auto');
          },
          clock,
        );

        if (c.startPaused) {
          entry.timer.pause(MANUAL_PAUSE);
        }
        if (visible && !c.startPaused) {
          entry.timer.start();
        }
      }

      entries.set(id, entry);

      if (visible && !entry.openedFired) {
        entry.openedFired = true;
        try {
          entry.record.onOpen?.(entry.record);
        } catch (err) {
          console.error(err);
        }
      }

      syncState();
      return id;
    },

    update(id: ToastId, patch: ToastPatch): boolean {
      const entry = entries.get(id);
      if (!entry || entry.record.dismissed) return false;

      const prev = entry.record;
      const reset = patch.resetTimer !== false;
      const nextDuration = patch.duration !== undefined ? patch.duration : prev.duration;

      entry.record = {
        ...prev,
        ...patch,
        id: prev.id, // ID must remain invariant
        position: prev.position, // position invariant
        duration: nextDuration,
        updatedAt: clock.now(),
        revision: prev.revision + 1,
        timerEpoch: reset ? prev.timerEpoch + 1 : prev.timerEpoch,
      };

      if (entry.timer && reset && nextDuration > 0 && nextDuration !== Infinity) {
        entry.timer.reset(nextDuration);
      }

      syncState();
      return true;
    },

    dismiss(id?: ToastId, reason: CloseReason = 'api'): void {
      if (id === undefined) {
        for (const entryId of Array.from(entries.keys())) {
          manager.dismiss(entryId, reason);
        }
        return;
      }

      const entry = entries.get(id);
      if (!entry || entry.record.dismissed) return;

      if (entry.record.dismissible === false && USER_REASONS.has(reason)) {
        return;
      }

      if (!entry.dismissFired && reason !== 'auto') {
        entry.dismissFired = true;
        try {
          entry.record.onDismiss?.(entry.record, reason);
        } catch (err) {
          console.error(err);
        }
      }

      scheduleRemoval(id, reason);
    },

    dismissAll(reason: CloseReason = 'api'): void {
      manager.dismiss(undefined, reason);
    },

    pause(id: ToastId | undefined, reason = 'manual'): void {
      if (id === undefined) {
        for (const entry of entries.values()) {
          manager.pause(entry.record.id, reason);
        }
        return;
      }

      const entry = entries.get(id);
      if (!entry || entry.record.dismissed) return;

      entry.timer?.pause(reason);
      const pausedReasons = entry.timer?.pausedReasons() ?? [reason];
      entry.record = {
        ...entry.record,
        pausedBy: pausedReasons,
        remaining: manager.getRemaining(id),
      };
      syncState();
    },

    resume(id: ToastId | undefined, reason = 'manual'): void {
      if (id === undefined) {
        for (const entry of entries.values()) {
          manager.resume(entry.record.id, reason);
        }
        return;
      }

      const entry = entries.get(id);
      if (!entry || entry.record.dismissed) return;

      entry.timer?.resume(reason);
      const pausedReasons = entry.timer?.pausedReasons() ?? [];
      entry.record = {
        ...entry.record,
        pausedBy: pausedReasons,
        remaining: manager.getRemaining(id),
      };
      syncState();
    },

    getRemaining(id: ToastId): number {
      const entry = entries.get(id);
      if (!entry || entry.record.dismissed) return 0;
      if (entry.record.duration === 0 || entry.record.duration === Infinity) return Infinity;
      return entry.timer?.remaining() ?? entry.record.duration;
    },

    getToasts(): ToastRecord[] {
      return Array.from(entries.values()).map((e) => e.record);
    },

    getHistory(): ToastRecord[] {
      return [...history];
    },

    clearHistory(): void {
      history.length = 0;
    },

    extend(id: ToastId, ms: number): boolean {
      const entry = entries.get(id);
      if (!entry || entry.record.dismissed) return false;
      entry.timer?.add(ms);
      entry.record = {
        ...entry.record,
        duration: entry.record.duration + ms,
        remaining: manager.getRemaining(id),
        revision: entry.record.revision + 1,
      };
      syncState();
      return true;
    },

    clear(): void {
      for (const entry of entries.values()) {
        entry.timer?.cancel();
        for (const cl of entry.cleanups) cl();
      }
      entries.clear();
      history.length = 0;
      syncState();
    },

    subscribe: observable.subscribe,
    getSnapshot: observable.getSnapshot,
  };

  return manager;
}

/** Factory for backward compatibility with tests and callers expecting createToastStore. */
export const createToastStore = createToastManager;
