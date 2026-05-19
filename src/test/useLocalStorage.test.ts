import { describe, it, expect, beforeEach } from 'vitest';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { renderHook, act } from '@testing-library/react';

describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should return initial value when localStorage is empty', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'default'));
    expect(result.current[0]).toBe('default');
  });

  it('should save value to localStorage', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'default'));
    act(() => {
      result.current[1]('updated');
    });
    expect(result.current[0]).toBe('updated');
    expect(localStorage.getItem('test-key')).toBe('"updated"');
  });

  it('should read existing value from localStorage', () => {
    localStorage.setItem('test-key', '"existing"');
    const { result } = renderHook(() => useLocalStorage('test-key', 'default'));
    expect(result.current[0]).toBe('existing');
  });

  it('should handle objects', () => {
    const { result } = renderHook(() => useLocalStorage('obj-key', { count: 0 }));
    act(() => {
      result.current[1]({ count: 5 });
    });
    expect(result.current[0]).toEqual({ count: 5 });
  });
});
