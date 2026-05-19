import { useCallback, useState } from 'react';
import type { Recipe } from '../types/recipe';

const STORAGE_KEY = 'esloquehay-history';
const MAX_ITEMS = 50;

interface HistoryEntry {
  recipe: Recipe;
  timestamp: number;
}

function loadHistory(): HistoryEntry[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? (JSON.parse(stored) as HistoryEntry[]) : [];
  } catch {
    return [];
  }
}

function saveHistory(entries: HistoryEntry[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch {
    // ignore quota exceeded
  }
}

export function useHistory() {
  const [history, setHistory] = useState<HistoryEntry[]>(loadHistory);

  const addToHistory = useCallback((recipe: Recipe) => {
    setHistory((prev) => {
      const next = [{ recipe, timestamp: Date.now() }, ...prev].slice(0, MAX_ITEMS);
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

  return { history, addToHistory, clearHistory, removeFromHistory };
}
