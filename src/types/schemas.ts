import { z } from 'zod';
import type { UserPreferences } from './preferences';

// Sub-esquemas de Receta
export const gourmetTipSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  technique: z.string().optional(),
});

export const recipeVariationSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  extraIngredients: z.array(z.string()),
  twist: z.string().min(1),
});

export const recipeSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  experience: z.string().min(1),
  ingredients: z.array(z.string()),
  steps: z.array(z.string()),
  prepTime: z.number().int().nonnegative(),
  cookTime: z.number().int().nonnegative(),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  servings: z.number().int().positive(),
  gourmetTips: z.array(gourmetTipSchema),
  variations: z.array(recipeVariationSchema),
  winePairing: z.string().optional(),
  platingTip: z.string().optional(),
  source: z.enum(['ia', 'mock', 'variation']).optional(),
});

export const recipeRequestSchema = z.object({
  ingredients: z.array(z.string().min(1)).min(1),
  dietaryRestrictions: z.array(z.string()).optional(),
  skillLevel: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
  servings: z.number().int().positive().optional(),
  flavorProfile: z.string().optional(),
  country: z.string().optional(),
  experienceMode: z.boolean().optional(),
  maxPrepTime: z.number().int().nonnegative().optional(),
  additionalIngredient: z.string().optional(),
  budget: z.enum(['low', 'medium', 'high']).optional(),
  language: z.string().optional(),
});

// Preferencias de usuario
export const userPreferencesSchema: z.ZodType<UserPreferences> = z.object({
  flavorProfile: z.enum([
    'traditional',
    'spicy',
    'sweet',
    'sour',
    'umami',
    'mild',
    'herbal',
    'smoky',
    'citrus',
  ]),
  additionalIngredient: z.string(),
  skillLevel: z.enum(['beginner', 'intermediate', 'advanced']),
  dietaryRestriction: z.enum([
    'none',
    'vegetarian',
    'vegan',
    'gluten_free',
    'dairy_free',
    'keto',
    'low_sodium',
    'diabetic',
  ]),
  servings: z.number().int().min(1).max(10),
  maxPrepTime: z.number().int().min(5).max(2880),
  language: z.string().min(1),
  particleSpeed: z.number().min(0.2).max(3.0),
  budget: z.enum(['low', 'medium', 'high']),
}) as z.ZodType<UserPreferences>;

// Historial
export const historyEntrySchema = z.object({
  recipe: recipeSchema,
  timestamp: z.number().int().positive(),
  ingredients: z.array(z.string()).optional(),
  preferencesSnapshot: userPreferencesSchema.optional(),
  source: z.enum(['ia', 'mock', 'variation']).optional(),
  sessionId: z.string().optional(),
});

// Respuesta de API
export const apiRecipeResponseSchema = z.object({
  success: z.boolean(),
  data: recipeSchema.optional(),
  error: z.string().optional(),
});

export const apiHealthResponseSchema = z.object({
  keyConfigured: z.boolean(),
});
