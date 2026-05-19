import { describe, it, expect } from 'vitest';
import { getRandomTagline, getRandomLoadingPhrase } from '../data/phrases';

describe('phrases', () => {
  it('getRandomTagline should return a non-empty string', () => {
    const tagline = getRandomTagline();
    expect(typeof tagline).toBe('string');
    expect(tagline.length).toBeGreaterThan(0);
  });

  it('getRandomTagline should return different values on multiple calls', () => {
    const t1 = getRandomTagline();
    const t2 = getRandomTagline();
    const t3 = getRandomTagline();
    // At least one should be different (probabilísticamente casi seguro)
    expect(t1 !== t2 || t2 !== t3).toBe(true);
  });

  it('getRandomLoadingPhrase should return a non-empty string', () => {
    const phrase = getRandomLoadingPhrase();
    expect(typeof phrase).toBe('string');
    expect(phrase.length).toBeGreaterThan(0);
  });
});
