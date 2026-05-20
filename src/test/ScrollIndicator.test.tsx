import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ScrollIndicator from '../components/ScrollIndicator';

describe('ScrollIndicator', () => {
  it('renders when visible', () => {
    render(<ScrollIndicator visible />);
    expect(screen.getByText(/Tu experiencia está lista/i)).toBeInTheDocument();
  });

  it('does not render when not visible', () => {
    render(<ScrollIndicator visible={false} />);
    expect(screen.queryByText(/Tu experiencia está lista/i)).not.toBeInTheDocument();
  });

  it('dismisses on click', () => {
    render(<ScrollIndicator visible />);
    const btn = screen.getByText(/Tu experiencia está lista/i);
    fireEvent.click(btn);
    expect(screen.queryByText(/Tu experiencia está lista/i)).not.toBeInTheDocument();
  });
});
