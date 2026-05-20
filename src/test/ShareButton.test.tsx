import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ShareButton from '../components/ShareButton';

const mockRecipe = {
  id: '1',
  title: 'Test Recipe',
  description: 'Delicious test',
  experience: 'Comfort food',
  ingredients: ['pollo'],
  steps: ['cocinar'],
  prepTime: 10,
  cookTime: 20,
  difficulty: 'easy' as const,
  servings: 2,
  gourmetTips: [],
  variations: [],
};

describe('ShareButton', () => {
  it('renders share button', () => {
    render(<ShareButton recipe={mockRecipe} />);
    expect(screen.getByRole('button', { name: /compartir/i })).toBeInTheDocument();
  });

  it('calls navigator.share when available', () => {
    const shareMock = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { share: shareMock });

    render(<ShareButton recipe={mockRecipe} />);
    fireEvent.click(screen.getByRole('button'));

    expect(shareMock).toHaveBeenCalledTimes(1);
    const call = shareMock.mock.calls[0] as [{ title: string; text: string; url: string }];
    expect(call[0].title).toBe('Test Recipe');
    expect(call[0].url).toBe('https://esloquehay.app');
  });

  it('falls back to window.open when share is unavailable', () => {
    Object.assign(navigator, { share: undefined });
    const openMock = vi.fn<() => void>();
    Object.assign(window, { open: openMock });

    render(<ShareButton recipe={mockRecipe} />);
    fireEvent.click(screen.getByRole('button'));

    expect(openMock).toHaveBeenCalled();
  });
});
