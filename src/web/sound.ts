import type { BuiltInSoundCue, SoundCue, ToastType } from '../core';

/** A single frequency note in a sound cue: [frequency in Hz, start offset in seconds, gain level 0..1]. */
export type SoundNote = [frequency: number, offset: number, level: number];

let audioCtx: AudioContext | undefined;

/** Built-in melodic sound cues synthesized with Web Audio partials. */
const CUES: Record<string, SoundNote[]> = {
  success: [
    [392, 0, 1],
    [523, 0.1, 1],
  ],
  error: [
    [233, 0, 1],
    [185, 0.13, 1],
  ],
  warning: [
    [349, 0, 0.8],
    [349, 0.16, 0.6],
  ],
  info: [[466, 0, 0.9]],
  ding: [
    [659, 0, 0.9],
    [880, 0.08, 1],
  ],
  pop: [
    [440, 0, 0.7],
    [880, 0.03, 0.9],
  ],
  chime: [
    [523, 0, 0.8],
    [659, 0.09, 0.85],
    [784, 0.18, 1],
  ],
  bell: [
    [587, 0, 1],
    [1175, 0.04, 0.5],
  ],
  message: [
    [440, 0, 0.8],
    [659, 0.12, 0.9],
  ],
  bubble: [
    [330, 0, 0.6],
    [494, 0.06, 0.8],
  ],
  marimba: [
    [523, 0, 1],
    [659, 0.06, 0.9],
    [784, 0.12, 1],
    [1047, 0.18, 0.8],
  ],
  crystal: [
    [880, 0, 0.8],
    [1319, 0.08, 0.9],
    [1760, 0.16, 0.7],
  ],
  subtle: [[440, 0, 0.6]],
  harp: [
    [392, 0, 0.7],
    [494, 0.05, 0.8],
    [587, 0.1, 0.9],
    [784, 0.15, 1],
  ],
};

const getAudioCtxClass = () =>
  typeof window !== 'undefined'
    ? window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    : undefined;

/** Returns whether Web Audio is available in the current environment. */
export const isAudioSupported = (): boolean => Boolean(getAudioCtxClass());

/** Returns the list of registered sound cue names. */
export const getSoundCues = (): readonly string[] => Object.keys(CUES);

/** Registers or overrides a sound cue with custom frequency partials. */
export const registerSoundCue = (name: string, notes: SoundNote[]): void => {
  CUES[name] = notes;
};

const MALLET_PARTIALS = [
  [1, 0.6, 0.5],
  [2, 0.06, 0.15],
] as const;

/**
 * Synthesizes an acoustic mallet tone: a warm fundamental with faint octave partial,
 * subtle micro-detuning for physical authenticity, and smooth exponential decay.
 */
function playTone(c: AudioContext, out: AudioNode, freq: number, at: number, level: number): void {
  const t = c.currentTime + at;
  const f = freq * (1 + (Math.random() - 0.5) * 0.008);
  for (const [mult, gain, decay] of MALLET_PARTIALS) {
    const osc = c.createOscillator();
    const g = c.createGain();
    osc.frequency.value = f * mult;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(gain * level, t + 0.015);
    g.gain.exponentialRampToValueAtTime(0.0001, t + decay);
    osc.connect(g).connect(out);
    osc.start(t);
    osc.stop(t + decay + 0.05);
  }
}

/**
 * Plays an audio feedback sound cue, synthesizer tone, or custom audio URL.
 * Completely safe in SSR, Node, or when browser autoplay is locked.
 */
export function playSound(cueOrType?: SoundCue | ToastType | boolean | string, volume = 0.5): void {
  if (!cueOrType || typeof window === 'undefined') return;

  const target = cueOrType === true ? 'info' : String(cueOrType);

  if (/^(https?:|data:audio|blob:)/.test(target)) {
    try {
      const audio = new Audio(target);
      audio.volume = Math.min(1, Math.max(0, volume));
      void audio.play().catch(() => undefined);
    } catch {
      // Audio playback is an enhancement; never fail
    }
    return;
  }

  const notes = CUES[target];
  if (!notes) return;

  try {
    const Ctx = getAudioCtxClass();
    if (!Ctx) return;

    audioCtx ??= new Ctx();
    if (audioCtx.state === 'suspended') void audioCtx.resume();
    if (audioCtx.state === 'closed') return;

    const master = audioCtx.createGain();
    master.gain.value = Math.min(1, Math.max(0, volume)) * 0.45;

    const soften = audioCtx.createBiquadFilter();
    soften.frequency.value = 1300;
    master.connect(soften).connect(audioCtx.destination);

    for (const [freq, offset, level] of notes) {
      playTone(audioCtx, master, freq, offset, level);
    }
  } catch {
    // Graceful degradation when audio is restricted
  }
}

/** Alias for playSound for backward compatibility with chime references. */
export const chime = playSound;

/** Helper to resolve which sound to play for a toast record. */
export function resolveToastSound(
  recordSound: boolean | SoundCue | string | ((type: ToastType) => void) | undefined,
  globalSound: boolean | SoundCue | undefined,
  toastType: ToastType,
): SoundCue | string | undefined {
  if (recordSound === false) return undefined;
  if (typeof recordSound === 'string') return recordSound;
  if (typeof recordSound === 'function') {
    try {
      recordSound(toastType);
    } catch {
      // Ignore errors in custom generator
    }
    return undefined;
  }
  if (recordSound === true || globalSound === true) {
    return CUES[toastType]
      ? (toastType as BuiltInSoundCue)
      : toastType === 'loading'
        ? 'bubble'
        : 'info';
  }
  return typeof globalSound === 'string' ? globalSound : undefined;
}
