import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useVisitCounter } from '../hooks/useVisitCounter';

describe('useVisitCounter', () => {
  beforeEach(() => {
    localStorage.removeItem('esloquehay-visits');
  });

  it('returns 1 on first visit', () => {
    const { result } = renderHook(() => useVisitCounter());
    expect(result.current).toBe(1);
  });

  it('increments on subsequent visits', () => {
    localStorage.setItem('esloquehay-visits', '5');
    const { result } = renderHook(() => useVisitCounter());
    expect(result.current).toBe(6);
  });
});
