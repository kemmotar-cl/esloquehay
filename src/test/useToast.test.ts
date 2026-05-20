import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useToast } from '../hooks/useToast';

describe('useToast', () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  it('starts with empty toasts', () => {
    const { result } = renderHook(() => useToast());
    expect(result.current.toasts).toEqual([]);
  });

  it('adds a toast', () => {
    const { result } = renderHook(() => useToast());
    act(() => {
      result.current.addToast({ message: 'Hello', type: 'info' });
    });
    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0].message).toBe('Hello');
  });

  it('removes a toast by id', () => {
    const { result } = renderHook(() => useToast());
    let id: string;
    act(() => {
      id = result.current.addToast({ message: 'Bye', type: 'success' });
    });
    act(() => {
      result.current.removeToast(id);
    });
    expect(result.current.toasts).toHaveLength(0);
  });

  it('auto-removes toast after duration', () => {
    const { result } = renderHook(() => useToast());
    act(() => {
      result.current.addToast({ message: 'Temp', type: 'warning', duration: 1000 });
    });
    expect(result.current.toasts).toHaveLength(1);
    act(() => {
      vi.advanceTimersByTime(1100);
    });
    expect(result.current.toasts).toHaveLength(0);
  });
});
