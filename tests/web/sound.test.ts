// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  getSoundCues,
  isAudioSupported,
  playSound,
  registerSoundCue,
  resolveToastSound,
} from '../../src/web/sound';

describe('toastory Web Audio Sound System', () => {
  let createdOscillators: unknown[] = [];
  let createdGains: unknown[] = [];

  beforeEach(() => {
    createdOscillators = [];
    createdGains = [];

    // Mock AudioContext for jsdom
    class MockGainNode {
      gain = {
        value: 1,
        setValueAtTime: vi.fn(),
        linearRampToValueAtTime: vi.fn(),
        exponentialRampToValueAtTime: vi.fn(),
      };
      connect = vi.fn().mockReturnThis();
    }

    class MockOscillatorNode {
      frequency = { value: 440 };
      connect = vi.fn().mockReturnThis();
      start = vi.fn();
      stop = vi.fn();
    }

    class MockFilterNode {
      type = 'lowpass';
      frequency = { value: 1300 };
      connect = vi.fn().mockReturnThis();
    }

    class MockDelayNode {
      delayTime = { value: 0.1 };
      connect = vi.fn().mockReturnThis();
    }

    class MockAudioContext {
      currentTime = 0;
      state = 'running';
      destination = {};
      createOscillator() {
        const osc = new MockOscillatorNode();
        createdOscillators.push(osc);
        return osc;
      }
      createGain() {
        const g = new MockGainNode();
        createdGains.push(g);
        return g;
      }
      createBiquadFilter() {
        return new MockFilterNode();
      }
      createDelay() {
        return new MockDelayNode();
      }
      resume = vi.fn().mockResolvedValue(undefined);
    }

    // @ts-expect-error Mock AudioContext assignment
    window.AudioContext = MockAudioContext;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('lists all 10 built-in sound cues', () => {
    const cues = getSoundCues();
    expect(cues).toContain('success');
    expect(cues).toContain('error');
    expect(cues).toContain('warning');
    expect(cues).toContain('info');
    expect(cues).toContain('ding');
    expect(cues).toContain('pop');
    expect(cues).toContain('chime');
    expect(cues).toContain('bell');
    expect(cues).toContain('message');
    expect(cues).toContain('bubble');
    expect(cues.length).toBeGreaterThanOrEqual(10);
  });

  it('detects audio support in window environment', () => {
    expect(isAudioSupported()).toBe(true);
  });

  it('plays built-in sound cues using synthesized Web Audio oscillators', () => {
    playSound('success', 0.8);
    expect(createdOscillators.length).toBeGreaterThan(0);
    expect(createdGains.length).toBeGreaterThan(0);
  });

  it('registers custom sound cues and plays them', () => {
    registerSoundCue('laser', [
      [800, 0, 1],
      [400, 0.05, 0.8],
    ]);
    expect(getSoundCues()).toContain('laser');

    const prevCount = createdOscillators.length;
    playSound('laser');
    expect(createdOscillators.length).toBeGreaterThan(prevCount);
  });

  it('handles external audio URL gracefully', () => {
    const playMock = vi.fn().mockResolvedValue(undefined);
    window.Audio = vi.fn().mockImplementation(() => ({
      play: playMock,
      volume: 1,
    })) as unknown as typeof Audio;

    playSound('https://example.com/sound.mp3', 0.7);
    expect(window.Audio).toHaveBeenCalledWith('https://example.com/sound.mp3');
  });

  it('resolves toast sound correctly with precedence', () => {
    // 1. Explicit sound: false overrides everything
    expect(resolveToastSound(false, true, 'success')).toBeUndefined();

    // 2. Explicit sound cue name
    expect(resolveToastSound('ding', false, 'success')).toBe('ding');

    // 3. sound: true uses toast type
    expect(resolveToastSound(true, false, 'success')).toBe('success');
    expect(resolveToastSound(true, false, 'error')).toBe('error');
    expect(resolveToastSound(true, false, 'warning')).toBe('warning');
    expect(resolveToastSound(true, false, 'default')).toBe('info');

    // 4. global sound: true
    expect(resolveToastSound(undefined, true, 'info')).toBe('info');
    expect(resolveToastSound(undefined, 'chime', 'info')).toBe('chime');

    // 5. custom generator function
    const fn = vi.fn();
    expect(resolveToastSound(fn, false, 'success')).toBeUndefined();
    expect(fn).toHaveBeenCalledWith('success');
  });

  it('safely handles missing AudioContext without throwing', () => {
    // @ts-expect-error Clear AudioContext
    window.AudioContext = undefined;
    // @ts-expect-error Clear webkitAudioContext
    window.webkitAudioContext = undefined;

    expect(() => playSound('ding')).not.toThrow();
  });
});
