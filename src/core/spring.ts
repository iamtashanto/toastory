export interface SpringConfig {
  stiffness?: number;
  damping?: number;
  mass?: number;
}

/** Closed-form damped harmonic oscillator, 0 to 1, zero initial velocity. t in seconds. */
export function springPosition(t: number, k: number, c: number, m: number): number {
  const w0 = Math.sqrt(k / m);
  const z = c / (2 * Math.sqrt(k * m));
  if (z < 1) {
    const wd = w0 * Math.sqrt(1 - z * z);
    return 1 - Math.exp(-z * w0 * t) * (Math.cos(wd * t) + ((z * w0) / wd) * Math.sin(wd * t));
  }
  if (z === 1) return 1 - Math.exp(-w0 * t) * (1 + w0 * t);
  const s = w0 * Math.sqrt(z * z - 1);
  const r1 = -z * w0 + s;
  const r2 = -z * w0 - s;
  return 1 - (r2 * Math.exp(r1 * t) - r1 * Math.exp(r2 * t)) / (r2 - r1);
}

/**
 * Bakes a physics-accurate spring curve into a CSS linear() easing function.
 * Enables 100% native GPU-accelerated spring animations without per-frame JS.
 */
export function springEasing(config: SpringConfig = {}): { easing: string; duration: number } {
  const { stiffness = 170, damping = 18, mass = 1 } = config;
  const f = (t: number) => springPosition(t, stiffness, damping, mass);
  const dt = 1 / 120;
  const maxT = 5;
  let settle = 0;
  for (let t = 0; t <= maxT; t += dt) {
    if (Math.abs(1 - f(t)) > 0.001) settle = t;
  }
  settle = Math.max(settle + dt, 0.05);
  const steps = Math.max(2, Math.ceil(settle * 60));
  const pts: string[] = [];
  for (let i = 0; i <= steps; i++) pts.push(String(+f((i / steps) * settle).toFixed(4)));
  pts[steps] = '1';
  return { easing: `linear(${pts.join(',')})`, duration: Math.round(settle * 1000) };
}

/**
 * Numerical Mass-spring-damper on a scalar value.
 * Retains instantaneous velocity when the target changes, ensuring fluid uninterrupted retargeting.
 */
export class Spring {
  v = 0;
  to: number;
  cfg: Required<SpringConfig>;

  constructor(
    public x: number,
    cfg: SpringConfig = {},
  ) {
    this.to = x;
    this.cfg = { stiffness: 170, damping: 18, mass: 1, ...cfg };
  }

  tune(c: SpringConfig): void {
    Object.assign(this.cfg, c);
  }

  /**
   * Advance dt seconds using numerical sub-stepping (h = 1/240) for high stability.
   * Returns true while the spring is still in motion, false when settled at rest.
   */
  step(dt: number): boolean {
    const { stiffness: k, damping: c, mass: m } = this.cfg;
    const h = 1 / 240;
    for (let t = 0; t < dt; t += h) {
      this.v += ((-k * (this.x - this.to) - c * this.v) / m) * h;
      this.x += this.v * h;
    }
    if (Math.abs(this.v) < 0.05 && Math.abs(this.x - this.to) < 0.05) {
      this.x = this.to;
      this.v = 0;
      return false;
    }
    return true;
  }
}

let tasks: Set<(dt: number) => boolean> | undefined;
let raf = 0;
let last = 0;

function getRaf(): ((cb: (time: number) => void) => number) | undefined {
  return typeof globalThis !== 'undefined'
    ? (globalThis as { requestAnimationFrame?: (cb: (time: number) => void) => number })
        .requestAnimationFrame
    : undefined;
}

function tick(now: number): void {
  const dt = Math.min(0.1, (now - last) / 1000);
  last = now;
  if (tasks) {
    for (const t of tasks) if (!t(dt)) tasks.delete(t);
    const r = getRaf();
    raf = tasks.size && r ? r(tick) : 0;
  } else raf = 0;
}

/** Runs a spring task every frame until it returns false. Fully safe in Node and SSR environments. */
export function runSpringTask(task: (dt: number) => boolean): void {
  const r = getRaf();
  if (!r) return;
  (tasks ??= new Set()).add(task);
  if (!raf) {
    last = typeof performance !== 'undefined' ? performance.now() : Date.now();
    raf = r(tick);
  }
}
