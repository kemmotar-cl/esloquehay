import { describe, it, expect } from 'vitest';
import {
  recipeSchema,
  userPreferencesSchema,
  historyEntrySchema,
  apiRecipeResponseSchema,
  apiHealthResponseSchema,
} from '../types/schemas';

const validRecipe = {
  id: 'r1',
  title: 'T',
  description: 'D',
  experience: 'E',
  ingredients: ['a'],
  steps: ['s'],
  prepTime: 0,
  cookTime: 0,
  difficulty: 'easy',
  servings: 1,
  gourmetTips: [{ title: 'T', description: 'D' }],
  variations: [{ name: 'V', description: 'D', extraIngredients: [], twist: 'T' }],
};

describe('recipeSchema', () => {
  it('accepts a valid recipe', () => {
    expect(recipeSchema.safeParse(validRecipe).success).toBe(true);
  });

  it('rejects missing fields', () => {
    expect(recipeSchema.safeParse({}).success).toBe(false);
  });

  it('rejects invalid difficulty', () => {
    expect(recipeSchema.safeParse({ ...validRecipe, difficulty: 'Extreme' }).success).toBe(false);
  });

  it('rejects negative prepTime', () => {
    expect(recipeSchema.safeParse({ ...validRecipe, prepTime: -1 }).success).toBe(false);
  });
});

describe('userPreferencesSchema', () => {
  it('accepts valid preferences', () => {
    expect(
      userPreferencesSchema.safeParse({
        flavorProfile: 'spicy',
        additionalIngredient: '',
        skillLevel: 'intermediate',
        dietaryRestriction: 'vegan',
        servings: 4,
        maxPrepTime: 60,
        language: 'es',
        particleSpeed: 1.5,
        budget: 'high',
      }).success
    ).toBe(true);
  });

  it('rejects invalid flavorProfile', () => {
    expect(
      userPreferencesSchema.safeParse({
        flavorProfile: 'bitter',
        additionalIngredient: '',
        skillLevel: 'intermediate',
        dietaryRestriction: 'none',
        servings: 2,
        maxPrepTime: 30,
        language: 'es',
        particleSpeed: 1.0,
        budget: 'medium',
      }).success
    ).toBe(false);
  });

  it('rejects servings out of range', () => {
    expect(
      userPreferencesSchema.safeParse({
        flavorProfile: 'traditional',
        additionalIngredient: '',
        skillLevel: 'beginner',
        dietaryRestriction: 'none',
        servings: 99,
        maxPrepTime: 30,
        language: 'es',
        particleSpeed: 1.0,
        budget: 'medium',
      }).success
    ).toBe(false);
  });
});

describe('historyEntrySchema', () => {
  it('accepts valid entry', () => {
    expect(
      historyEntrySchema.safeParse({
        recipe: validRecipe,
        timestamp: Date.now(),
        source: 'ia',
      }).success
    ).toBe(true);
  });

  it('rejects invalid source', () => {
    expect(
      historyEntrySchema.safeParse({
        recipe: validRecipe,
        timestamp: Date.now(),
        source: 'unknown',
      }).success
    ).toBe(false);
  });
});

describe('apiRecipeResponseSchema', () => {
  it('accepts success with data', () => {
    expect(apiRecipeResponseSchema.safeParse({ success: true, data: validRecipe }).success).toBe(
      true
    );
  });

  it('accepts error without data', () => {
    expect(apiRecipeResponseSchema.safeParse({ success: false, error: 'fail' }).success).toBe(true);
  });
});

describe('apiHealthResponseSchema', () => {
  it('accepts valid health', () => {
    expect(apiHealthResponseSchema.safeParse({ keyConfigured: true }).success).toBe(true);
  });

  it('rejects missing field', () => {
    expect(apiHealthResponseSchema.safeParse({}).success).toBe(false);
  });
});
