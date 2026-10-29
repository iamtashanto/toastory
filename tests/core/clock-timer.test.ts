import { describe, expect, it, vi } from 'vitest';
import { defaultClock } from '../../src/core/clock';
import type { Clock } from '../../src/core/clock';
import { createTimer } from '../../src/core/timer';

describe('clock and timer', () => {
  it('defaultClock wraps global timer functions', async () => {
    expect(typeof defaultClock.now()).toBe('number');

    const cb = vi.fn();
    const cancel = defaultClock.setTimeout(cb, 10);
    expect(typeof cancel).toBe('function');
    cancel();

    const intervalCb = vi.fn();
    const cancelInterval = defaultClock.setInterval(intervalCb, 10);
    expect(typeof cancelInterval).toBe('function');
    cancelInterval();
  });

  it('timer tracks reference-counted pause reasons and accurately counts remaining time', () => {
    let nowTime = 1000;
    const fakeClock: Clock = {
      now: () => nowTime,
      setTimeout: (fn, ms) => {
        const timeout = setTimeout(fn, ms);
        return () => clearTimeout(timeout);
      },
      setInterval: (fn, ms) => {
        const interval = setInterval(fn, ms);
        return () => clearInterval(interval);
      },
    };

    const done = vi.fn();
    const timer = createTimer(4000, done, fakeClock);
    timer.start();

    expect(timer.isRunning()).toBe(true);
    expect(timer.isPaused()).toBe(false);

    // Advance 1000ms
    nowTime += 1000;
    expect(timer.remaining()).toBe(3000);
    expect(timer.elapsed()).toBe(1000);

    // Pause with hover
    timer.pause('hover');
    expect(timer.isPaused()).toBe(true);
    expect(timer.pausedReasons()).toEqual(['hover']);
    expect(timer.remaining()).toBe(3000);

    // Add another reason: focus
    timer.pause('focus');
    expect(timer.pausedReasons()).toContain('hover');
    expect(timer.pausedReasons()).toContain('focus');

    // Time passes while paused
    nowTime += 5000;
    expect(timer.remaining()).toBe(3000);

    // Resume hover, focus still holds
    timer.resume('hover');
    expect(timer.isPaused()).toBe(true);
    expect(timer.pausedReasons()).toEqual(['focus']);

    // Resume focus, timer resumes
    timer.resume('focus');
    expect(timer.isPaused()).toBe(false);
    expect(timer.isRunning()).toBe(true);

    // Add time
    timer.add(1000);
    expect(timer.remaining()).toBe(4000);

    // Negative add while running drops remaining to floor of 1
    timer.add(-10000);
    expect(timer.remaining()).toBe(1);

    // Clear reasons while running and live
    timer.pause('manual');
    timer.clearReasons();
    expect(timer.isRunning()).toBe(true);

    // Clear reasons and cancel
    timer.cancel();
    expect(timer.isRunning()).toBe(false);
    expect(timer.remaining()).toBe(0);
  });

  it('notifies tick listeners on progress', () => {
    const done = vi.fn();
    const ticks: number[] = [];
    const timer = createTimer(100, done);
    const unbind = timer.onTick((remaining, fraction) => {
      ticks.push(fraction);
    });

    timer.start();
    timer.reset(200);
    expect(typeof unbind).toBe('function');
    unbind();
    timer.cancel();
  });

  it('handles multiple pauses of the same reason, reset without args, and reset(0)', () => {
    let nowTime = 0;
    const fakeClock: Clock = {
      now: () => nowTime,
      setTimeout: (fn, ms) => {
        const timeout = setTimeout(fn, ms);
        return () => clearTimeout(timeout);
      },
      setInterval: (fn, ms) => {
        const interval = setInterval(fn, ms);
        return () => clearInterval(interval);
      },
    };

    const done = vi.fn();
    const timer = createTimer(2000, done, fakeClock);
    timer.start();

    // Pause hover twice
    timer.pause('hover');
    timer.pause('hover');
    expect(timer.isPaused()).toBe(true);

    // Resume once - should still be paused because count was 2
    timer.resume('hover');
    expect(timer.isPaused()).toBe(true);

    // Resume again - now unpaused
    timer.resume('hover');
    expect(timer.isPaused()).toBe(false);

    // Resuming unknown reason is a no-op
    timer.resume('unknown-reason');

    // reset() without args resets to original duration
    nowTime += 500;
    expect(timer.remaining()).toBe(1500);
    timer.reset();
    expect(timer.remaining()).toBe(2000);

    // reset(0) while running
    timer.reset(0);
    expect(timer.remaining()).toBe(0);
    expect(timer.isRunning()).toBe(false);

    // add when done is a no-op
    timer.cancel();
    timer.add(500);
    expect(timer.remaining()).toBe(0);

    // onTick while running attaches interval
    const timer2 = createTimer(3000, done, fakeClock);
    timer2.start();
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const tickUnsub1 = timer2.onTick(() => {
      throw new Error('tick boom');
    });
    const tickUnsub2 = timer2.onTick(() => {});
    expect(typeof tickUnsub1).toBe('function');
    timer2.reset();
    expect(errSpy).toHaveBeenCalled();
    errSpy.mockRestore();
    tickUnsub1();
    tickUnsub2();
    timer2.cancel();
  });
});
