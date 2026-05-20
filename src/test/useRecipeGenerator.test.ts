import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useRecipeGenerator } from '../hooks/useRecipeGenerator';

const mockT = (key: string, fallback?: string) => fallback ?? key;

const mockAddToast = vi.fn();
const mockAddToHistory = vi.fn();

const defaultDeps = {
  ingredients: ['pollo', 'papas'],
  recipeCountry: 'chile' as const,
  preferences: {
    flavorProfile: 'traditional' as const,
    skillLevel: 'beginner' as const,
    servings: 2,
    maxPrepTime: 60,
    additionalIngredient: '',
    budget: 'medium' as const,
    language: 'es' as const,
    dietaryRestriction: 'none' as const,
    particleSpeed: 1,
    experienceMode: false,
  },
  sessionId: 'test-session',
  backendReady: true,
  isOnline: true,
  addToast: mockAddToast,
  t: mockT,
  addToHistory: mockAddToHistory,
};

describe('useRecipeGenerator', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('initializes with null recipe and not loading', () => {
    const { result } = renderHook(() => useRecipeGenerator(defaultDeps));
    expect(result.current.recipe).toBeNull();
    expect(result.current.isLoading).toBe(false);
  });

  it('shows offline toast when not online', async () => {
    const { result } = renderHook(() => useRecipeGenerator({ ...defaultDeps, isOnline: false }));
    await act(async () => {
      await result.current.handleGenerate();
    });
    expect(mockAddToast).toHaveBeenCalledWith(expect.objectContaining({ type: 'warning' }));
    expect(result.current.isLoading).toBe(false);
  });

  it('sets loading state during generation', () => {
    const { result } = renderHook(() => useRecipeGenerator(defaultDeps));
    act(() => {
      void result.current.handleGenerate();
    });
    expect(result.current.isLoading).toBe(true);
  });

  it('allows setting recipe directly', () => {
    const { result } = renderHook(() => useRecipeGenerator(defaultDeps));
    const mockRecipe = { id: '1', title: 'Test' } as unknown as Parameters<
      typeof result.current.setRecipe
    >[0];
    act(() => {
      result.current.setRecipe(mockRecipe);
    });
    expect(result.current.recipe).toEqual(mockRecipe);
  });
});
