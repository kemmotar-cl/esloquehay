import { useState, useCallback } from 'react';

// Supported language codes (top 20 most spoken + source Spanish)
export type LanguageCode =
  | 'es'
  | 'en'
  | 'zh'
  | 'hi'
  | 'ar'
  | 'fr'
  | 'bn'
  | 'pt'
  | 'ru'
  | 'ur'
  | 'id'
  | 'de'
  | 'ja'
  | 'vi'
  | 'tr'
  | 'yo'
  | 'mr'
  | 'te'
  | 'ta'
  | 'ko';

export const LANGUAGE_NAMES: Record<LanguageCode, string> = {
  es: 'Español',
  en: 'English',
  zh: '中文',
  hi: 'हिन्दी',
  ar: 'العربية',
  fr: 'Français',
  bn: 'বাংলা',
  pt: 'Português',
  ru: 'Русский',
  ur: 'اردو',
  id: 'Bahasa Indonesia',
  de: 'Deutsch',
  ja: '日本語',
  vi: 'Tiếng Việt',
  tr: 'Türkçe',
  yo: 'Yorùbá',
  mr: 'मराठी',
  te: 'తెలుగు',
  ta: 'தமிழ்',
  ko: '한국어',
};

const loaded: Partial<Record<LanguageCode, Record<string, unknown>>> = {};

export function getLanguageName(code: LanguageCode): string {
  return LANGUAGE_NAMES[code];
}

interface JsonModule {
  default?: Record<string, unknown>;
}

export async function loadTranslations(code: LanguageCode): Promise<Record<string, unknown>> {
  const cached = loaded[code];
  if (cached) return cached;

  try {
    const mod = (await import(`./locales/${code}.json`)) as JsonModule;
    const data = mod.default ?? (mod as unknown as Record<string, unknown>);
    loaded[code] = data;
    return loaded[code];
  } catch {
    // Fallback to Spanish if file missing
    const fallback = (await import('./locales/es.json')) as JsonModule;
    const data = fallback.default ?? (fallback as unknown as Record<string, unknown>);
    loaded[code] = data;
    return loaded[code];
  }
}

export function useI18n() {
  const [lang, setLang] = useState<LanguageCode>('es');
  const [dict, setDict] = useState<Record<string, unknown>>({});

  const switchLanguage = useCallback(async (code: LanguageCode) => {
    const translations = await loadTranslations(code);
    setDict(translations);
    setLang(code);
    document.documentElement.lang = code;
  }, []);

  const t = useCallback(
    (path: string, fallback?: string): string => {
      const keys = path.split('.');
      let current: unknown = dict;
      for (const k of keys) {
        if (current && typeof current === 'object' && k in current) {
          current = (current as Record<string, unknown>)[k];
        } else {
          return fallback ?? path;
        }
      }
      return typeof current === 'string' ? current : (fallback ?? path);
    },
    [dict]
  );

  return { lang, switchLanguage, t };
}
