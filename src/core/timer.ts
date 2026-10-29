/**
 * A countdown that can be paused and resumed without losing the elapsed time.
 * Uses the global timer functions, which exist in Node and every browser.
 */
export interface PausableTimer {
  /** Starts or resumes the countdown. No effect when already running or finished. */
  start(): void;
  /** Pauses the countdown and records the remaining time. */
  pause(): void;
  /** Adds (or with a negative value removes) milliseconds. Restarts the pending timeout if running. */
  add(ms: number): void;
  /** Sets the remaining time and restarts when running. */
  reset(ms: number): void;
  /** Cancels the timer permanently. */
  cancel(): void;
  /** Milliseconds left right now. */
  remaining(): number;
  /** Whether the countdown is currently ticking. */
  isRunning(): boolean;
}

/**
 * Creates a pausable timer.
 * @param duration Total time in milliseconds. Non-finite or non-positive values never fire.
 * @param onDone Called once when the timer elapses.
 * @param now Clock returning epoch milliseconds. Defaults to `Date.now`.
 */
export function createTimer(
  duration: number,
  onDone: () => void,
  now: () => number = Date.now,
): PausableTimer {
  let left = duration;
  let startedAt = 0;
  let handle: ReturnType<typeof setTimeout> | undefined;
  let running = false;
  let done = false;
  const live = (): boolean => Number.isFinite(left) && left > 0;

  const arm = (): void => {
    if (handle !== undefined) clearTimeout(handle);
    handle = setTimeout(() => {
      handle = undefined;
      running = false;
      done = true;
      left = 0;
      onDone();
    }, left);
  };

  return {
    start() {
      if (running || done || !live()) return;
      running = true;
      startedAt = now();
      arm();
    },
    pause() {
      if (!running) return;
      running = false;
      left = Math.max(0, left - (now() - startedAt));
      if (handle !== undefined) clearTimeout(handle);
      handle = undefined;
    },
    add(ms) {
      if (done || !Number.isFinite(left)) return;
      if (running) {
        left = Math.max(0, left - (now() - startedAt)) + ms;
        startedAt = now();
        if (left <= 0) left = 1;
        arm();
      } else {
        left = Math.max(1, left + ms);
      }
    },
    reset(ms) {
      done = false;
      left = ms;
      if (running) {
        startedAt = now();
        if (live()) arm();
        else {
          if (handle !== undefined) clearTimeout(handle);
          handle = undefined;
          running = false;
        }
      }
    },
    cancel() {
      if (handle !== undefined) clearTimeout(handle);
      handle = undefined;
      running = false;
      done = true;
    },
    remaining() {
      if (running) return Math.max(0, left - (now() - startedAt));
      return left;
    },
    isRunning: () => running,
  };
}
