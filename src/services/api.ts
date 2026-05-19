import type { Recipe, RecipeRequest } from '../types/recipe';

const API_URL = (import.meta.env.VITE_API_URL as string | undefined) ?? 'http://localhost:3000';

export async function generateRecipe(request: RecipeRequest): Promise<Recipe> {
  const response = await fetch(`${API_URL}/api/recipe`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });

  const result = (await response.json()) as {
    success: boolean;
    data?: Recipe;
    error?: string;
  };

  if (!result.success || !result.data) {
    throw new Error(result.error ?? 'Error generando la receta');
  }

  return result.data;
}

export async function checkHealth(): Promise<{ keyConfigured: boolean }> {
  try {
    const response = await fetch(`${API_URL}/api/health`);
    const data = (await response.json()) as { keyConfigured: boolean };
    return data;
  } catch {
    return { keyConfigured: false };
  }
}
