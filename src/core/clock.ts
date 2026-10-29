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
    const id = setTimeout(fn, ms);
    return () => clearTimeout(id);
  },
  setInterval: (fn, ms) => {
    const id = setInterval(fn, ms);
    return () => clearInterval(id);
  },
};
