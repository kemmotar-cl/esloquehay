import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import IngredientInput from '../components/IngredientInput';

const t = (path: string, fallback?: string) => fallback ?? path;
const ta = (path: string) => {
  if (path === 'loadingPhrases') return ['Loading...'];
  if (path === 'buttonPhrases') return ['Generate'];
  return [];
};

describe('IngredientInput', () => {
  const defaultProps = {
    ingredients: [],
    country: 'chile' as const,
    onCountryChange: vi.fn(),
    onAdd: vi.fn(),
    onRemove: vi.fn(),
    onGenerate: vi.fn(),
    isLoading: false,
    t,
    ta,
  };

  it('renders input and add button', () => {
    render(<IngredientInput {...defaultProps} />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByLabelText(/Agregar/)).toBeInTheDocument();
  });

  it('calls onAdd when Enter is pressed with value', () => {
    const onAdd = vi.fn();
    render(<IngredientInput {...defaultProps} onAdd={onAdd} />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'Pollo' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(onAdd).toHaveBeenCalledWith('pollo');
  });

  it('calls onAdd when add button is clicked', () => {
    const onAdd = vi.fn();
    render(<IngredientInput {...defaultProps} onAdd={onAdd} />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'Arroz' } });
    fireEvent.click(screen.getByLabelText(/Agregar/));
    expect(onAdd).toHaveBeenCalledWith('arroz');
  });

  it('does not call onAdd when input is empty', () => {
    const onAdd = vi.fn();
    render(<IngredientInput {...defaultProps} onAdd={onAdd} />);
    fireEvent.click(screen.getByLabelText(/Agregar/));
    expect(onAdd).not.toHaveBeenCalled();
  });

  it('renders ingredient tags and calls onRemove when clicked', () => {
    const onRemove = vi.fn();
    render(
      <IngredientInput {...defaultProps} ingredients={['pollo', 'arroz']} onRemove={onRemove} />
    );
    expect(screen.getByText('pollo')).toBeInTheDocument();
    expect(screen.getByText('arroz')).toBeInTheDocument();
    const removeButtons = screen.getAllByLabelText(/Quitar/);
    fireEvent.click(removeButtons[0]);
    expect(onRemove).toHaveBeenCalledWith(0);
  });

  it('calls onGenerate when generate button is clicked', () => {
    const onGenerate = vi.fn();
    render(<IngredientInput {...defaultProps} ingredients={['pollo']} onGenerate={onGenerate} />);
    const generateBtn = screen.getByRole('button', { name: /Generate/i });
    fireEvent.click(generateBtn);
    expect(onGenerate).toHaveBeenCalled();
  });

  it('disables generate button when no ingredients', () => {
    render(<IngredientInput {...defaultProps} ingredients={[]} />);
    const generateBtn = screen.getByRole('button', { name: /Generate/i });
    expect(generateBtn).toBeDisabled();
  });

  it('shows loading state when isLoading is true', () => {
    render(<IngredientInput {...defaultProps} ingredients={['pollo']} isLoading={true} />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
});
