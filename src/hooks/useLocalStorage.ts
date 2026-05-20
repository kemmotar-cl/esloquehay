import { useState, useEffect, useCallback } from 'react';
import type { z } from 'zod';
import { logger } from '../services/logger';

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  schema?: z.ZodType<T>
): [T, (value: T | ((prev: T) => T)) => void] {
  const validate = useCallback(
    (raw: unknown): T | null => {
      if (!schema) return raw as T;
      const result = schema.safeParse(raw);
      if (!result.success) {
        logger.error('useLocalStorage', `Schema validation failed for key "${key}"`, result.error);
        return null;
      }
      return result.data;
    },
    [schema, key]
  );

  const [stored, setStored] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (!item) return initialValue;
      const parsed = JSON.parse(item) as unknown;
      const valid = validate(parsed);
      return valid ?? initialValue;
    } catch (e) {
      logger.error('useLocalStorage', 'parse error', e);
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setStored((prev) => {
        const next = value instanceof Function ? value(prev) : value;
        try {
          window.localStorage.setItem(key, JSON.stringify(next));
        } catch (e) {
          logger.error('useLocalStorage', 'setItem failed (quota exceeded?)', e);
        }
        return next;
      });
    },
    [key]
  );

  // Sync across tabs
  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          const parsed = JSON.parse(e.newValue) as unknown;
          const valid = validate(parsed);
          if (valid !== null) {
            setStored(valid);
          }
        } catch (e) {
          logger.error('useLocalStorage', 'storage sync parse error', e);
        }
      }
    };
    window.addEventListener('storage', handler);
    return () => {
      window.removeEventListener('storage', handler);
    };
  }, [key, validate]);

  return [stored, setValue];
}
