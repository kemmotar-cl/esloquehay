import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import RecipeCard from '../components/RecipeCard';
import type { Recipe } from '../types/recipe';

const mockRecipe: Recipe = {
  id: '1',
  title: 'Arroz con Pollo',
  description: 'Un clásico reconfortante de la cocina latina',
  experience: 'Comfort food que abraza el alma',
  ingredients: ['2 pechugas de pollo', '1 taza de arroz', '1 cebolla', '2 dientes de ajo'],
  steps: [
    'Sofríe la cebolla y el ajo',
    'Agrega el pollo y dóralo',
    'Incorpora el arroz y el agua',
    'Cocina a fuego lento por 20 min',
  ],
  prepTime: 10,
  cookTime: 30,
  difficulty: 'easy',
  servings: 4,
  gourmetTips: [
    { title: 'Dorado perfecto', description: 'No muevas el pollo', technique: 'Maillard' },
  ],
  variations: [
    {
      name: 'Versión al horno',
      description: 'Más crujiente',
      extraIngredients: ['queso'],
      twist: 'Al horno',
    },
  ],
  winePairing: 'Chardonnay',
  platingTip: 'Servir en plato hondo',
};

const t = (path: string, fallback?: string) => fallback ?? path;

describe('RecipeCard', () => {
  it('renders recipe title and description', () => {
    render(<RecipeCard recipe={mockRecipe} t={t} />);
    expect(screen.getByText('Arroz con Pollo')).toBeInTheDocument();
    expect(screen.getByText('Un clásico reconfortante de la cocina latina')).toBeInTheDocument();
  });

  it('renders all ingredients', () => {
    render(<RecipeCard recipe={mockRecipe} t={t} />);
    mockRecipe.ingredients.forEach((ing) => {
      expect(screen.getByText(ing)).toBeInTheDocument();
    });
  });

  it('renders all steps with numbers', () => {
    render(<RecipeCard recipe={mockRecipe} t={t} />);
    expect(screen.getByText('Sofríe la cebolla y el ajo')).toBeInTheDocument();
    expect(screen.getByText('Cocina a fuego lento por 20 min')).toBeInTheDocument();
  });

  it('shows mock disclaimer when source is mock', () => {
    const mockRecipeWithSource = { ...mockRecipe, source: 'mock' as const };
    render(<RecipeCard recipe={mockRecipeWithSource} t={t} />);
    expect(screen.getByText(/Esta es una receta de demostración/)).toBeInTheDocument();
  });

  it('does not show disclaimer when source is ia', () => {
    const iaRecipe = { ...mockRecipe, source: 'ia' as const };
    render(<RecipeCard recipe={iaRecipe} t={t} />);
    expect(screen.queryByText(/Esta es una receta de demostración/)).not.toBeInTheDocument();
  });

  it('calls onGenerateVariation when variation is clicked', () => {
    const onGenerate = vi.fn();
    render(<RecipeCard recipe={mockRecipe} onGenerateVariation={onGenerate} t={t} />);
    const variationButton = screen.getByText('Versión al horno');
    fireEvent.click(variationButton);
    expect(onGenerate).toHaveBeenCalledWith('Versión al horno', ['queso']);
  });

  it('renders servings count', () => {
    render(<RecipeCard recipe={mockRecipe} t={t} />);
    expect(screen.getByText(/4 personas/)).toBeInTheDocument();
  });
});
