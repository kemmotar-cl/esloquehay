import { useState, useCallback } from 'react';

const STORAGE_KEY = 'esloquehay-consent';

export type ConsentStatus = 'pending' | 'granted' | 'denied';

interface ConsentState {
  status: ConsentStatus;
  timestamp: number;
}

function readConsent(): ConsentStatus {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as ConsentState;
      return parsed.status;
    }
  } catch {
    // ignore parse errors
  }
  return 'pending';
}

export function useConsent() {
  const [consent, setConsent] = useState<ConsentStatus>(readConsent);

  const saveConsent = useCallback((status: ConsentStatus) => {
    const state: ConsentState = { status, timestamp: Date.now() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    setConsent(status);
  }, []);

  return { consent, saveConsent };
}
