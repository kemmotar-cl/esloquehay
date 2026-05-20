import { describe, it, expect } from 'vitest';
import { getRandomPhrase } from '../data/phrases';

describe('phrases', () => {
  it('getRandomPhrase should return a string from the array', () => {
    const phrases = ['one', 'two', 'three'];
    const result = getRandomPhrase(phrases);
    expect(typeof result).toBe('string');
    expect(phrases).toContain(result);
  });

  it('getRandomPhrase should return undefined for empty array', () => {
    expect(getRandomPhrase([])).toBeUndefined();
  });

  it('getRandomPhrase should return different values on multiple calls', () => {
    const phrases = ['a', 'b', 'c', 'd', 'e'];
    const results = Array.from({ length: 20 }, () => getRandomPhrase(phrases));
    const unique = new Set(results);
    // Probabilistically should get more than 1 unique value with 20 draws from 5 options
    expect(unique.size).toBeGreaterThan(1);
  });
});
