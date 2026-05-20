import { describe, it, expect } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

describe('useOnlineStatus', () => {
  it('returns true when navigator.onLine is true', () => {
    Object.defineProperty(navigator, 'onLine', { value: true, writable: true, configurable: true });
    const { result } = renderHook(() => useOnlineStatus());
    expect(result.current).toBe(true);
  });

  it('updates to false on offline event', async () => {
    Object.defineProperty(navigator, 'onLine', { value: true, writable: true, configurable: true });
    const { result } = renderHook(() => useOnlineStatus());
    window.dispatchEvent(new Event('offline'));
    await waitFor(() => {
      expect(result.current).toBe(false);
    });
  });

  it('updates to true on online event', async () => {
    Object.defineProperty(navigator, 'onLine', {
      value: false,
      writable: true,
      configurable: true,
    });
    const { result } = renderHook(() => useOnlineStatus());
    window.dispatchEvent(new Event('online'));
    await waitFor(() => {
      expect(result.current).toBe(true);
    });
  });
});
