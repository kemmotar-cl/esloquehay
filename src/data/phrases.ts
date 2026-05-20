import type { Country } from '../types/preferences';

export function getRandomPhrase(phrases: string[]): string | undefined {
  if (phrases.length === 0) return undefined;
  return phrases[Math.floor(Math.random() * phrases.length)];
}

// Ingredientes base con emojis (orden fijo)
const INGREDIENT_KEYS = [
  { key: 'tomate', emoji: '🍅' },
  { key: 'cebolla', emoji: '🧅' },
  { key: 'ajo', emoji: '🧄' },
  { key: 'pollo', emoji: '🍗' },
  { key: 'carne', emoji: '🥩' },
  { key: 'arroz', emoji: '🍚' },
  { key: 'huevo', emoji: '🥚' },
  { key: 'grasa', emoji: '🧈' },
  { key: 'queso', emoji: '🧀' },
  { key: 'leche', emoji: '🥛' },
  { key: 'limon', emoji: '🍋' },
  { key: 'zanahoria', emoji: '🥕' },
  { key: 'papa', emoji: '🥔' },
  { key: 'pimiento', emoji: '🫑' },
  { key: 'picante', emoji: '🌶️' },
  { key: 'aguacate', emoji: '🥑' },
  { key: 'hierbas', emoji: '🌿' },
  { key: 'hongos', emoji: '🍄' },
  { key: 'mariscos', emoji: '🦐' },
  { key: 'pescado', emoji: '🐟' },
  { key: 'pasta', emoji: '🍝' },
  { key: 'legumbres', emoji: '🫘' },
  { key: 'maiz', emoji: '🌽' },
  { key: 'brocoli', emoji: '🥦' },
];

export function getIngredientsForCountry(_country: Country): { emoji: string; key: string }[] {
  return INGREDIENT_KEYS.map(({ key, emoji }) => ({
    emoji,
    key,
  }));
}
