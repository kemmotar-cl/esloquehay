import { useState, useEffect } from 'react';
import { checkHealth } from '../services/api';
import { analytics } from '../services/analytics';
import { loadTranslations } from '../i18n';
import type { LanguageCode } from '../i18n';

export function useAppInit(preferencesLanguage: LanguageCode) {
  const [sessionId] = useState(() => {
    try {
      return crypto.randomUUID();
    } catch {
      return Math.random().toString(36).slice(2) + Date.now().toString(36);
    }
  });

  const [backendReady, setBackendReady] = useState<boolean | null>(null);

  // Check backend health
  useEffect(() => {
    void checkHealth(sessionId).then((h) => {
      setBackendReady(h.keyConfigured);
    });
  }, [sessionId]);

  // Initialize language from saved preferences
  useEffect(() => {
    void loadTranslations(preferencesLanguage).then(() => {
      // switchLanguage is handled by the useI18n hook in App.tsx
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Track page view on mount
  useEffect(() => {
    analytics.pageView('/');
  }, []);

  return { sessionId, backendReady };
}
