import type { Recipe, RecipeRequest } from '../types/recipe';
import { logger } from './logger';
import { apiRecipeResponseSchema, apiHealthResponseSchema } from '../types/schemas';

const API_URL =
  (import.meta.env.VITE_API_URL as string | undefined) ??
  'https://esloquehay-backend.jorge-labbe-a.workers.dev';

const FETCH_TIMEOUT = 8000;
const MAX_RETRIES = 3;
const BACKOFF_BASE_MS = 300;

async function fetchWithTimeout(input: RequestInfo, init?: RequestInit): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    controller.abort();
  }, FETCH_TIMEOUT);
  try {
    const response = await fetch(input, { ...init, signal: controller.signal });
    return response;
  } finally {
    clearTimeout(timeoutId);
  }
}

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchWithRetry(input: RequestInfo, init?: RequestInit): Promise<Response> {
  let lastError: Error | undefined;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await fetchWithTimeout(input, init);
      if (response.ok || response.status >= 400) {
        // Retornamos incluso 4xx/5xx para que el caller decida retry
        return response;
      }
    } catch (e) {
      lastError = e instanceof Error ? e : new Error(String(e));
      const url = typeof input === 'string' ? input : input.url;
      logger.warn('api', `Attempt ${String(attempt)} failed for ${url}`, lastError.message);
    }

    if (attempt < MAX_RETRIES) {
      const delay = BACKOFF_BASE_MS * Math.pow(2, attempt - 1);
      await sleep(delay);
    }
  }

  throw lastError ?? new Error(`Failed after ${String(MAX_RETRIES)} attempts`);
}

export async function generateRecipe(request: RecipeRequest, sessionId?: string): Promise<Recipe> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (sessionId) headers['X-Session-ID'] = sessionId;
  const response = await fetchWithRetry(`${API_URL}/api/recipe`, {
    method: 'POST',
    headers,
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error(`HTTP ${String(response.status)}: ${response.statusText}`);
  }

  let raw: unknown;
  try {
    raw = await response.json();
  } catch (e) {
    logger.error('api', 'generateRecipe JSON parse error', e);
    throw new Error('Respuesta inválida del servidor', { cause: e });
  }

  const parsed = apiRecipeResponseSchema.safeParse(raw);
  if (!parsed.success) {
    logger.error('api', 'generateRecipe schema validation failed', parsed.error);
    throw new Error('Formato de respuesta inesperado');
  }

  const result = parsed.data;
  if (!result.success || !result.data) {
    throw new Error(result.error ?? 'Error generando la receta');
  }

  return result.data;
}

export async function checkHealth(sessionId?: string): Promise<{ keyConfigured: boolean }> {
  try {
    const headers: Record<string, string> = {};
    if (sessionId) headers['X-Session-ID'] = sessionId;
    const response = await fetchWithRetry(`${API_URL}/api/health`, { headers });
    const raw: unknown = await response.json();
    const parsed = apiHealthResponseSchema.safeParse(raw);
    if (!parsed.success) {
      logger.warn('api', 'checkHealth schema validation failed', parsed.error);
      return { keyConfigured: false };
    }
    return parsed.data;
  } catch (e) {
    logger.error('api', 'checkHealth failed', e);
    return { keyConfigured: false };
  }
}
