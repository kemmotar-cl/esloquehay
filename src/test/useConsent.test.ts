import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useConsent } from '../hooks/useConsent';

interface ConsentState {
  status: 'pending' | 'granted' | 'denied';
  timestamp: number;
}

describe('useConsent', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns pending when no consent is stored', () => {
    const { result } = renderHook(() => useConsent());
    expect(result.current.consent).toBe('pending');
  });

  it('reads stored consent from localStorage', () => {
    const state: ConsentState = { status: 'granted', timestamp: Date.now() };
    localStorage.setItem('esloquehay-consent', JSON.stringify(state));
    const { result } = renderHook(() => useConsent());
    expect(result.current.consent).toBe('granted');
  });

  it('saves consent to localStorage and updates state', () => {
    const { result } = renderHook(() => useConsent());
    act(() => {
      result.current.saveConsent('denied');
    });
    expect(result.current.consent).toBe('denied');
    const raw = localStorage.getItem('esloquehay-consent');
    if (raw === null) throw new Error('expected raw to not be null');
    const stored = JSON.parse(raw) as ConsentState;
    expect(stored.status).toBe('denied');
    expect(typeof stored.timestamp).toBe('number');
  });

  it('handles corrupted localStorage gracefully', () => {
    localStorage.setItem('esloquehay-consent', 'not-json');
    const { result } = renderHook(() => useConsent());
    expect(result.current.consent).toBe('pending');
  });
});
