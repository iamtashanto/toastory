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
  let totalDuration = duration;
  let remainingMs = duration;
  let startedAt = 0;
  let cancelTimeout: (() => void) | undefined;
  let cancelInterval: (() => void) | undefined;
  let started = false;
  let done = false;

  // Reference-counted pause reasons: reason -> count
  const pauseReasons = new Map<string, number>();
  const tickListeners = new Set<(remaining: number, fraction: number) => void>();

  const isLive = (): boolean => Number.isFinite(remainingMs) && remainingMs > 0;

  const notifyTick = (): void => {
    if (tickListeners.size === 0) return;
    const rem = getRemaining();
    const frac = totalDuration > 0 ? Math.max(0, Math.min(1, rem / totalDuration)) : 0;
    for (const listener of tickListeners) {
      try {
        listener(rem, frac);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const getRemaining = (): number => {
    if (done) return 0;
    if (started && pauseReasons.size === 0) {
      return Math.max(0, remainingMs - (clock.now() - startedAt));
    }
    return remainingMs;
  };

  const stopTimers = (): void => {
    cancelTimeout = cancelTimeout?.();
    cancelInterval = cancelInterval?.();
  };

  const arm = (): void => {
    stopTimers();
    if (!isLive() || pauseReasons.size > 0 || done) return;

    startedAt = clock.now();
    cancelTimeout = clock.setTimeout(() => {
      stopTimers();
      remainingMs = 0;
      done = true;
      started = false;
      notifyTick();
      onDone();
    }, remainingMs);

    if (tickListeners.size > 0) {
      cancelInterval = clock.setInterval(() => {
        notifyTick();
      }, 50);
    }
  };

  const pauseTimer = (reason = 'manual'): void => {
    if (done) return;
    pauseReasons.set(reason, (pauseReasons.get(reason) ?? 0) + 1);

    if (started && pauseReasons.size === 1) {
      remainingMs = Math.max(0, remainingMs - (clock.now() - startedAt));
      stopTimers();
      notifyTick();
    }
  };

  const resumeTimer = (reason = 'manual'): void => {
    if (done) return;
    const count = pauseReasons.get(reason);
    if (!count) return;

    if (count <= 1) pauseReasons.delete(reason);
    else pauseReasons.set(reason, count - 1);

    if (started && pauseReasons.size === 0 && isLive()) {
      arm();
      notifyTick();
    }
  };

  return {
    start() {
      if (done || !isLive()) return;
      started = true;
      pauseReasons.clear();
      arm();
      notifyTick();
    },
    pause: pauseTimer,
    resume: resumeTimer,
    clearReasons() {
      pauseReasons.clear();
      if (started && isLive()) arm();
    },
    add(ms: number) {
      if (done || !Number.isFinite(remainingMs)) return;
      const live = started && pauseReasons.size === 0;
      remainingMs = Math.max(1, (live ? remainingMs - (clock.now() - startedAt) : remainingMs) + ms);
      totalDuration = Math.max(totalDuration, remainingMs);
      if (live) arm();
      notifyTick();
    },
    reset(ms?: number) {
      done = false;
      remainingMs = totalDuration = ms !== undefined ? ms : totalDuration;
      if (started && pauseReasons.size === 0) {
        if (isLive()) arm();
        else stopTimers();
      }
      notifyTick();
    },
    cancel() {
      stopTimers();
      started = false;
      done = true;
      remainingMs = 0;
    },
    remaining: getRemaining,
    elapsed() {
      return Math.max(0, totalDuration - getRemaining());
    },
    isRunning: () => started && !done && !pauseReasons.size && isLive(),
    isPaused: () => pauseReasons.size > 0,
    pausedReasons: () => [...pauseReasons.keys()],
    onTick(callback) {
      tickListeners.add(callback);
      if (started && pauseReasons.size === 0 && !cancelInterval) {
        cancelInterval = clock.setInterval(notifyTick, 50);
      }
      return () => {
        tickListeners.delete(callback);
        if (tickListeners.size === 0 && cancelInterval) {
          cancelInterval();
          cancelInterval = undefined;
        }
      };
    },
  };
}
