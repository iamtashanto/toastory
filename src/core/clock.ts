/**
 * Injectable clock and scheduler interface.
 * Abstracts time and timers so tests and headless engines can run deterministically.
 */
export interface Clock {
  /** Returns the current timestamp in milliseconds. */
  now(): number;
  /**
   * Schedules a callback after `ms` milliseconds.
   * @returns A cancellation function.
   */
  setTimeout(fn: () => void, ms: number): () => void;
  /**
   * Schedules a recurring callback every `ms` milliseconds.
   * @returns A cancellation function.
   */
  setInterval(fn: () => void, ms: number): () => void;
}

/** Default system clock using standard global timer functions. */
export const defaultClock: Clock = {
  now: () => Date.now(),
  setTimeout: (fn, ms) => {
    const t = setTimeout(fn, ms);
    return () => clearTimeout(t);
  },
  setInterval: (fn, ms) => {
    const t = setInterval(fn, ms);
    return () => clearInterval(t);
  },
};
