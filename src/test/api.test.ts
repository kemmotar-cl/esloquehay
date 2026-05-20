import { describe, it, expect, beforeEach, vi } from 'vitest';
import { generateRecipe, checkHealth } from '../services/api';

const mockRecipe = {
  id: 'r1',
  title: 'Test',
  description: 'Desc',
  experience: 'Exp',
  ingredients: ['a'],
  steps: ['s1'],
  prepTime: 5,
  cookTime: 5,
  difficulty: 'easy' as const,
  servings: 2,
  gourmetTips: [{ title: 'T', description: 'D' }],
  variations: [{ name: 'V', description: 'D', extraIngredients: [], twist: 'T' }],
};

function createFetchMock(response: unknown, ok = true, status = 200) {
  return vi.fn(() =>
    Promise.resolve({
      ok,
      status,
      statusText: ok ? 'OK' : 'Error',
      json: () => Promise.resolve(response),
    } as Response)
  );
}

describe('generateRecipe', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('returns recipe on success', async () => {
    globalThis.fetch = createFetchMock({ success: true, data: mockRecipe });
    const result = await generateRecipe({ ingredients: ['pollo'] }, 'sess-1');
    expect(result.title).toBe('Test');
    expect(globalThis.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/recipe'),
      expect.objectContaining({
        method: 'POST',
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        headers: expect.objectContaining({ 'X-Session-ID': 'sess-1' }),
      })
    );
  });

  it('throws on HTTP error', async () => {
    globalThis.fetch = createFetchMock({ success: false }, false, 500);
    await expect(generateRecipe({ ingredients: ['pollo'] })).rejects.toThrow('HTTP 500');
  });

  it('throws on schema validation failure', async () => {
    globalThis.fetch = createFetchMock({ success: true, data: { invalid: true } });
    await expect(generateRecipe({ ingredients: ['pollo'] })).rejects.toThrow(
      'Formato de respuesta inesperado'
    );
  });

  it('throws on API error response', async () => {
    globalThis.fetch = createFetchMock({ success: false, error: 'No ingredients' });
    await expect(generateRecipe({ ingredients: ['pollo'] })).rejects.toThrow('No ingredients');
  });

  it('retries on network failure then succeeds', async () => {
    let attempts = 0;
    globalThis.fetch = vi.fn(() => {
      attempts++;
      if (attempts < 2) {
        return Promise.reject(new Error('Network error'));
      }
      return Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ success: true, data: mockRecipe }),
      } as Response);
    });
    const result = await generateRecipe({ ingredients: ['pollo'] });
    expect(result.title).toBe('Test');
    expect(attempts).toBe(2);
  });

  it('throws after max retries exhausted', async () => {
    globalThis.fetch = vi.fn(() => Promise.reject(new Error('Network error')));
    await expect(generateRecipe({ ingredients: ['pollo'] })).rejects.toThrow('Network error');
    expect(globalThis.fetch).toHaveBeenCalledTimes(3);
  });
});

describe('checkHealth', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('returns keyConfigured on success', async () => {
    globalThis.fetch = createFetchMock({ keyConfigured: true });
    const result = await checkHealth();
    expect(result.keyConfigured).toBe(true);
  });

  it('returns false on failure', async () => {
    globalThis.fetch = vi.fn(() => Promise.reject(new Error('fail')));
    const result = await checkHealth();
    expect(result.keyConfigured).toBe(false);
  });

  it('returns false on invalid schema', async () => {
    globalThis.fetch = createFetchMock({ invalid: true });
    const result = await checkHealth();
    expect(result.keyConfigured).toBe(false);
  });
});
