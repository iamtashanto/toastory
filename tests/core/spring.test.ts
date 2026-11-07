import { describe, expect, it } from 'vitest';
import { Spring, springEasing, springPosition } from '../../src/core/spring';

describe('spring physics and closed-form easing', () => {
  it('generates a CSS linear() easing curve and settle duration', () => {
    const res = springEasing({ stiffness: 200, damping: 20, mass: 1 });
    expect(res.easing).toMatch(/^linear\(/);
    expect(res.easing).toContain('1');
    expect(res.duration).toBeGreaterThan(0);
  });

  it('handles default config parameters', () => {
    const res = springEasing();
    expect(res.easing.startsWith('linear(')).toBe(true);
    expect(res.duration).toBeGreaterThan(100);
  });

  it('evaluates closed-form damped spring position accurately', () => {
    expect(springPosition(0, 170, 18, 1)).toBeCloseTo(0, 2);
    expect(springPosition(2, 170, 18, 1)).toBeCloseTo(1, 2);
  });

  it('simulates real-time spring motion step by step and settles at target', () => {
    const spring = new Spring(0, { stiffness: 170, damping: 18, mass: 1 });
    spring.to = 100;
    let moving = true;
    let count = 0;
    while (moving && count < 200) {
      moving = spring.step(1 / 60);
      count++;
    }
    expect(moving).toBe(false);
    expect(spring.x).toBe(100);
    expect(spring.v).toBe(0);
  });

  it('retains momentum when retargeted mid-motion', () => {
    const spring = new Spring(0, { stiffness: 170, damping: 18, mass: 1 });
    spring.to = 100;
    spring.step(1 / 60);
    expect(spring.v).toBeGreaterThan(0);
    spring.to = 50;
    expect(spring.to).toBe(50);
  });
});
