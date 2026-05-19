export interface RecipeVariation {
  name: string;
  description: string;
  extraIngredients: string[];
  twist: string;
}

export interface GourmetTip {
  title: string;
  description: string;
  technique?: string;
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  experience: string;
  ingredients: string[];
  steps: string[];
  prepTime: number;
  cookTime: number;
  difficulty: 'Fácil' | 'Medio' | 'Difícil';
  servings: number;
  gourmetTips: GourmetTip[];
  variations: RecipeVariation[];
  winePairing?: string;
  platingTip?: string;
}

export interface RecipeRequest {
  ingredients: string[];
  dietaryRestrictions?: string[];
  skillLevel?: 'principiante' | 'intermedio' | 'avanzado';
  servings?: number;
  flavorProfile?: string;
  country?: string;
  experienceMode?: boolean;
}
