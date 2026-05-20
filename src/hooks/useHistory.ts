import { useCallback, useState } from 'react';
import type { Recipe } from '../types/recipe';
import type { UserPreferences } from '../types/preferences';
import { logger } from '../services/logger';
import { historyEntrySchema } from '../types/schemas';

const STORAGE_KEY = 'esloquehay-history';
const MAX_ITEMS = 50;

export interface HistoryEntry {
  recipe: Recipe;
  timestamp: number;
  ingredients?: string[];
  preferencesSnapshot?: UserPreferences;
  source?: 'ia' | 'mock' | 'variation';
  sessionId?: string;
}

function loadHistory(): HistoryEntry[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored) as unknown;
    if (!Array.isArray(parsed)) return [];
    const valid = parsed
      .map((item) => historyEntrySchema.safeParse(item))
      .filter((r) => r.success)
      .map((r) => r.data);
    return valid;
  } catch (e) {
    logger.error('useHistory', 'parse error', e);
    return [];
  }
}

function saveHistory(entries: HistoryEntry[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch (e) {
    logger.error('useHistory', 'save failed (quota exceeded?)', e);
  }
}

export function useHistory() {
  const [history, setHistory] = useState<HistoryEntry[]>(loadHistory);

  const addToHistory = useCallback((entry: HistoryEntry) => {
    setHistory((prev) => {
      const next = [entry, ...prev].slice(0, MAX_ITEMS);
      saveHistory(next);
      return next;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    saveHistory([]);
  }, []);

  const removeFromHistory = useCallback((index: number) => {
    setHistory((prev) => {
      const next = prev.filter((_, i) => i !== index);
      saveHistory(next);
      return next;
    });
  }, []);

  const exportToJSON = useCallback((): string => {
    return JSON.stringify(history, null, 2);
  }, [history]);

  const exportToCSV = useCallback((): string => {
    const headers = [
      'timestamp',
      'title',
      'source',
      'sessionId',
      'ingredients',
      'country',
      'flavorProfile',
      'skillLevel',
      'servings',
      'budget',
    ];
    const rows = history.map((h) => [
      new Date(h.timestamp).toISOString(),
      `"${h.recipe.title.replace(/"/g, '""')}"`,
      h.source ?? '',
      h.sessionId ?? '',
      `"${(h.ingredients ?? []).join(', ').replace(/"/g, '""')}"`,
      h.preferencesSnapshot?.language ?? '',
      h.preferencesSnapshot?.flavorProfile ?? '',
      h.preferencesSnapshot?.skillLevel ?? '',
      String(h.preferencesSnapshot?.servings ?? ''),
      h.preferencesSnapshot?.budget ?? '',
    ]);
    return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  }, [history]);

  return { history, addToHistory, clearHistory, removeFromHistory, exportToJSON, exportToCSV };
}
