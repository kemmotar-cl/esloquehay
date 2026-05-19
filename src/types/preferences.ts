export type Country =
  | 'chile'
  | 'argentina'
  | 'mexico'
  | 'colombia'
  | 'peru'
  | 'espana'
  | 'venezuela'
  | 'ecuador'
  | 'bolivia'
  | 'uruguay'
  | 'paraguay'
  | 'costa_rica'
  | 'panama'
  | 'guatemala';

export type FlavorProfile =
  | 'traditional'
  | 'spicy'
  | 'sweet'
  | 'sour'
  | 'umami'
  | 'mild'
  | 'herbal'
  | 'smoky'
  | 'citrus';

export type SkillLevel = 'beginner' | 'intermediate' | 'advanced';

export type DietaryRestriction =
  | 'none'
  | 'vegetarian'
  | 'vegan'
  | 'gluten_free'
  | 'dairy_free'
  | 'keto'
  | 'low_sodium'
  | 'diabetic';

export interface UserPreferences {
  country: Country;
  flavorProfile: FlavorProfile;
  additionalIngredient: string;
  skillLevel: SkillLevel;
  dietaryRestriction: DietaryRestriction;
  servings: number;
  maxPrepTime: number;
  language: 'es' | 'es_mx' | 'es_ar';
  particleSpeed: number;
}

export const DEFAULT_PREFERENCES: UserPreferences = {
  country: 'chile',
  flavorProfile: 'traditional',
  additionalIngredient: '',
  skillLevel: 'intermediate',
  dietaryRestriction: 'none',
  servings: 2,
  maxPrepTime: 45,
  language: 'es',
  particleSpeed: 1.0,
};

export const COUNTRY_LABELS: Record<Country, string> = {
  chile: 'Chile',
  argentina: 'Argentina',
  mexico: 'México',
  colombia: 'Colombia',
  peru: 'Perú',
  espana: 'España',
  venezuela: 'Venezuela',
  ecuador: 'Ecuador',
  bolivia: 'Bolivia',
  uruguay: 'Uruguay',
  paraguay: 'Paraguay',
  costa_rica: 'Costa Rica',
  panama: 'Panamá',
  guatemala: 'Guatemala',
};

export const FLAVOR_LABELS: Record<FlavorProfile, string> = {
  traditional: 'Tradicional',
  spicy: 'Picante',
  sweet: 'Dulce',
  sour: 'Ácido',
  umami: 'Umami',
  mild: 'Suave',
  herbal: 'Herbal',
  smoky: 'Ahumado',
  citrus: 'Cítrico',
};
