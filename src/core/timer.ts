import type { Clock } from './clock';
import { defaultClock } from './clock';

export interface PausableTimer {
  /** Starts or resumes the countdown. No effect when already running or finished. */
  start(): void;
  /**
   * Pauses the timer for a named reason (reference-counted).
   * @param reason The pause trigger identifier, e.g. 'hover', 'focus', 'hidden', 'manual'.
   */
  pause(reason?: string): void;
  /**
   * Resumes the timer for a named reason (decrements reference count).
   * Restarts the countdown when all pause reasons are cleared.
   */
  resume(reason?: string): void;
  /** Adds milliseconds to the remaining countdown (or subtracts if negative). */
  add(ms: number): void;
  /** Resets the countdown duration and restarts if previously active. */
  reset(ms?: number): void;
  /** Permanently cancels and tears down the timer. */
  cancel(): void;
  /** Current milliseconds remaining on the countdown. */
  remaining(): number;
  /** Current milliseconds elapsed on the countdown. */
  elapsed(): number;
  /** Whether the countdown is actively ticking. */
  isRunning(): boolean;
  /** Whether the countdown is held by one or more pause reasons. */
  isPaused(): boolean;
  /** List of all currently active pause reason names. */
  pausedReasons(): string[];
  /** Clears all pause reasons and resumes if started. */
  clearReasons(): void;
  /** Registers a progress tick listener called while ticking. */
  onTick(callback: (remaining: number, fraction: number) => void): () => void;
}

/**
 * Creates a pausable countdown timer with reference-counted pause reasons.
 *
 * @param duration Total countdown duration in milliseconds.
 * @param onDone Callback fired when countdown reaches zero.
 * @param clock Injectable clock/scheduler (defaults to defaultClock).
 */
export function createTimer(
  duration: number,
  onDone: () => void,
  clock: Clock = defaultClock,
): PausableTimer {
  let total = duration;
  let remMs = duration;
  let startedAt = 0;
  let cancelT: (() => void) | undefined;
  let cancelI: (() => void) | undefined;
  let started = false;
  let done = false;

  const reasons = new Map<string, number>();
  const ticks = new Set<(remaining: number, fraction: number) => void>();

  const isLive = (): boolean => Number.isFinite(remMs) && remMs > 0;
  const active = (): boolean => started && !reasons.size;

  const getRem = (): number =>
    done ? 0 : active() ? Math.max(0, remMs - (clock.now() - startedAt)) : remMs;

  const notifyTick = (): void => {
    if (!ticks.size) return;
    const r = getRem();
    const f = total > 0 ? Math.max(0, Math.min(1, r / total)) : 0;
    for (const cb of ticks) {
      try {
        cb(r, f);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const stop = (): void => {
    cancelT?.();
    cancelI?.();
    cancelT = cancelI = undefined;
  };

  const arm = (): void => {
    stop();
    if (!isLive() || reasons.size || done) return;
    startedAt = clock.now();
    cancelT = clock.setTimeout(() => {
      stop();
      remMs = 0;
      done = true;
      started = false;
      notifyTick();
      onDone();
    }, remMs);
    if (ticks.size) cancelI = clock.setInterval(notifyTick, 50);
  };

  return {
    start() {
      if (done || !isLive()) return;
      started = true;
      reasons.clear();
      arm();
      notifyTick();
    },
    pause(reason = 'manual') {
      if (done) return;
      reasons.set(reason, (reasons.get(reason) ?? 0) + 1);
      if (started && reasons.size === 1) {
        remMs = Math.max(0, remMs - (clock.now() - startedAt));
        stop();
        notifyTick();
      }
    },
    resume(reason = 'manual') {
      const c = !done && reasons.get(reason);
      if (!c) return;
      if (c <= 1) reasons.delete(reason);
      else reasons.set(reason, c - 1);
      if (active() && isLive()) {
        arm();
        notifyTick();
      }
    },
    clearReasons() {
      reasons.clear();
      if (started && isLive()) arm();
    },
    add(ms: number) {
      if (done || !Number.isFinite(remMs)) return;
      const live = active();
      remMs = Math.max(1, getRem() + ms);
      total = Math.max(total, remMs);
      if (live) arm();
      notifyTick();
    },
    reset(ms?: number) {
      done = false;
      remMs = total = ms ?? total;
      if (active()) {
        if (isLive()) arm();
        else stop();
      }
      notifyTick();
    },
    cancel() {
      stop();
      ticks.clear();
      started = false;
      done = true;
      remMs = 0;
    },
    remaining: getRem,
    elapsed: () => Math.max(0, total - getRem()),
    isRunning: () => active() && !done && isLive(),
    isPaused: () => reasons.size > 0,
    pausedReasons: () => [...reasons.keys()],
    onTick(cb) {
      ticks.add(cb);
      if (active() && !cancelI) cancelI = clock.setInterval(notifyTick, 50);
      return () => {
        ticks.delete(cb);
        if (!ticks.size && cancelI) {
          cancelI();
          cancelI = undefined;
        }
      };
    },
  };
}
