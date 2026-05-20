import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useHistory } from '../hooks/useHistory';
import type { Recipe } from '../types/recipe';
import type { LanguageCode } from '../i18n';

const mockRecipe: Recipe = {
  id: 'test-1',
  title: 'Test Recipe',
  description: 'A test recipe',
  experience: 'Cocina con alma',
  ingredients: ['pollo', 'arroz'],
  steps: ['Cocinar', 'Servir'],
  prepTime: 10,
  cookTime: 20,
  difficulty: 'easy',
  servings: 2,
  gourmetTips: [{ title: 'Tip', description: 'Un tip' }],
  variations: [{ name: 'V1', description: 'Var 1', extraIngredients: ['ajo'], twist: 'twist' }],
};

const mockEntry = {
  recipe: mockRecipe,
  timestamp: 1700000000000,
  ingredients: ['pollo'],
  preferencesSnapshot: {
    flavorProfile: 'traditional' as const,
    additionalIngredient: '',
    skillLevel: 'beginner' as const,
    dietaryRestriction: 'none' as const,
    servings: 2,
    maxPrepTime: 30,
    language: 'es' as LanguageCode,
    particleSpeed: 1.0,
    budget: 'medium' as const,
  },
  source: 'ia' as const,
  sessionId: 'sess-123',
};

describe('useHistory', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('starts empty when localStorage is empty', () => {
    const { result } = renderHook(() => useHistory());
    expect(result.current.history).toEqual([]);
  });

  it('adds an entry to history', () => {
    const { result } = renderHook(() => useHistory());
    act(() => {
      result.current.addToHistory(mockEntry);
    });
    expect(result.current.history).toHaveLength(1);
    expect(result.current.history[0].recipe.title).toBe('Test Recipe');
  });

  it('limits history to MAX_ITEMS (50)', () => {
    const { result } = renderHook(() => useHistory());
    act(() => {
      for (let i = 0; i < 55; i++) {
        result.current.addToHistory({
          ...mockEntry,
          recipe: { ...mockRecipe, id: `r-${String(i)}`, title: `Recipe ${String(i)}` },
          timestamp: 1700000000000 + i,
        });
      }
    });
    expect(result.current.history).toHaveLength(50);
    expect(result.current.history[0].recipe.title).toBe('Recipe 54');
  });

  it('removes an entry by index', () => {
    const { result } = renderHook(() => useHistory());
    act(() => {
      result.current.addToHistory(mockEntry);
      result.current.addToHistory({
        ...mockEntry,
        recipe: { ...mockRecipe, id: 'test-2', title: 'Second' },
      });
    });
    // History is prepended, so index 0 is 'Second', index 1 is 'Test Recipe'
    act(() => {
      result.current.removeFromHistory(0);
    });
    expect(result.current.history).toHaveLength(1);
    expect(result.current.history[0].recipe.title).toBe('Test Recipe');
  });

  it('clears all history', () => {
    const { result } = renderHook(() => useHistory());
    act(() => {
      result.current.addToHistory(mockEntry);
    });
    act(() => {
      result.current.clearHistory();
    });
    expect(result.current.history).toEqual([]);
  });

  it('exports to JSON', () => {
    const { result } = renderHook(() => useHistory());
    act(() => {
      result.current.addToHistory(mockEntry);
    });
    const json = result.current.exportToJSON();
    const parsed: unknown[] = JSON.parse(json) as unknown[];
    expect(parsed).toHaveLength(1);
  });

  it('exports to CSV with headers', () => {
    const { result } = renderHook(() => useHistory());
    act(() => {
      result.current.addToHistory(mockEntry);
    });
    const csv = result.current.exportToCSV();
    expect(csv).toContain('timestamp,title,source');
    expect(csv).toContain('Test Recipe');
  });

  it('filters corrupt entries from localStorage', () => {
    localStorage.setItem('esloquehay-history', JSON.stringify([{ invalid: true }]));
    const { result } = renderHook(() => useHistory());
    expect(result.current.history).toEqual([]);
  });

  it('persists to localStorage', () => {
    const { result } = renderHook(() => useHistory());
    act(() => {
      result.current.addToHistory(mockEntry);
    });
    const stored = localStorage.getItem('esloquehay-history');
    expect(stored).toBeTruthy();
    if (!stored) throw new Error('expected stored value');
    const parsed: unknown[] = JSON.parse(stored) as unknown[];
    expect(parsed).toHaveLength(1);
  });
});
