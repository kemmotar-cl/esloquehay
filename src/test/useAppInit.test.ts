import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useAppInit } from '../hooks/useAppInit';

describe('useAppInit', () => {
  it('returns a sessionId', () => {
    const { result } = renderHook(() => useAppInit('es'));
    expect(typeof result.current.sessionId).toBe('string');
    expect(result.current.sessionId.length).toBeGreaterThan(0);
  });

  it('initializes backendReady as null', () => {
    const { result } = renderHook(() => useAppInit('es'));
    expect(result.current.backendReady).toBeNull();
  });
});
