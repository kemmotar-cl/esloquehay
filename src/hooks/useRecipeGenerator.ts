import { useState, useCallback } from 'react';
import { generateRecipe } from '../services/api';
import { logger } from '../services/logger';
import { analytics } from '../services/analytics';
import type { Recipe } from '../types/recipe';
import type { UserPreferences, Country } from '../types/preferences';

interface ToastOptions {
  message: string;
  type: 'success' | 'warning' | 'error';
  duration?: number;
}

interface UseRecipeGeneratorDeps {
  ingredients: string[];
  recipeCountry: Country | null;
  preferences: UserPreferences;
  sessionId: string;
  backendReady: boolean | null;
  isOnline: boolean;
  addToast: (opts: ToastOptions) => void;
  t: (key: string, fallback?: string) => string;
  addToHistory: (entry: {
    recipe: Recipe;
    timestamp: number;
    ingredients: string[];
    preferencesSnapshot: UserPreferences;
    source: 'ia' | 'mock' | 'variation';
    sessionId: string;
  }) => void;
}

export function useRecipeGenerator(deps: UseRecipeGeneratorDeps) {
  const {
    ingredients,
    recipeCountry,
    preferences,
    sessionId,
    backendReady,
    isOnline,
    addToast,
    t,
    addToHistory,
  } = deps;

  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = useCallback(
    async (
      variationName?: string,
      _extraIngredients?: string[],
      budgetOverride?: UserPreferences['budget']
    ) => {
      if (!isOnline) {
        addToast({
          message: t('offline.error', 'Sin conexión. Conectate a internet para generar recetas.'),
          type: 'warning',
        });
        return;
      }
      setIsLoading(true);
      analytics.track('recipe_generate_start', {
        ingredientCount: ingredients.length,
        country: recipeCountry,
        variation: variationName,
      });

      if (variationName !== undefined) {
        const { variationMocks } = await import('../mocks/recipes');
        if (variationName in variationMocks) {
          await new Promise((resolve) => setTimeout(resolve, 800));
          const result = { ...variationMocks[variationName], source: 'variation' as const };
          setRecipe(result);
          addToHistory({
            recipe: result,
            timestamp: Date.now(),
            ingredients: [...ingredients],
            preferencesSnapshot: { ...preferences },
            source: 'variation',
            sessionId,
          });
          analytics.track('recipe_generate_success', { source: 'variation', variationName });
          addToast({ message: t('toast.variation_ready', '¡Variación lista!'), type: 'success' });
          setIsLoading(false);
          return;
        }
      }

      try {
        const result = await generateRecipe(
          {
            ingredients,
            country: recipeCountry ?? undefined,
            flavorProfile: preferences.flavorProfile,
            skillLevel: preferences.skillLevel,
            servings: preferences.servings,
            maxPrepTime: preferences.maxPrepTime,
            additionalIngredient: preferences.additionalIngredient,
            budget: budgetOverride ?? preferences.budget,
            language: preferences.language,
            dietaryRestrictions:
              preferences.dietaryRestriction !== 'none'
                ? [preferences.dietaryRestriction]
                : undefined,
            experienceMode: false,
          },
          sessionId
        );
        setRecipe({ ...result, source: 'ia' as const });
        addToHistory({
          recipe: { ...result, source: 'ia' as const },
          timestamp: Date.now(),
          ingredients: [...ingredients],
          preferencesSnapshot: { ...preferences },
          source: 'ia',
          sessionId,
        });
        analytics.track('recipe_generate_success', { source: 'ia' });
        addToast({ message: t('toast.recipe_ready', '¡Receta generada!'), type: 'success' });
      } catch (e) {
        logger.error('App', 'generateRecipe failed, falling back to mock', e);
        analytics.track('recipe_generate_fallback', {
          reason: backendReady ? 'api_error' : 'backend_unavailable',
        });
        const { mockRecipe } = await import('../mocks/recipes');
        const mocked = { ...mockRecipe, source: 'mock' as const };
        setRecipe(mocked);
        addToHistory({
          recipe: mocked,
          timestamp: Date.now(),
          ingredients: [...ingredients],
          preferencesSnapshot: { ...preferences },
          source: 'mock',
          sessionId,
        });
        addToast({
          message: t('toast.fallback_mode', 'Modo demo activado — la receta es de ejemplo'),
          type: 'warning',
          duration: 6000,
        });
      }
      setIsLoading(false);
    },
    [
      backendReady,
      ingredients,
      recipeCountry,
      preferences,
      addToHistory,
      sessionId,
      isOnline,
      addToast,
      t,
    ]
  );

  const handleGenerateVariation = useCallback(
    (variationName: string, extraIngredients: string[]) => {
      // Note: addIngredient must be called by the consumer before/after
      void handleGenerate(variationName, extraIngredients);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [handleGenerate]
  );

  return { recipe, isLoading, setRecipe, handleGenerate, handleGenerateVariation };
}
