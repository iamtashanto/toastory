import { describe, expect, it } from 'vitest';
import { springEasing } from '../../src/core/spring';

describe('springEasing', () => {
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
});
