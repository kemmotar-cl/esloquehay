import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ConsentBanner } from '../components/ConsentBanner';

const mockT = (key: string, fallback?: string) => fallback ?? key;

describe('ConsentBanner', () => {
  it('does not render when consent is granted', () => {
    const { container } = render(<ConsentBanner consent="granted" onConsent={vi.fn()} t={mockT} />);
    expect(container.firstChild).toBeNull();
  });

  it('does not render when consent is denied', () => {
    const { container } = render(<ConsentBanner consent="denied" onConsent={vi.fn()} t={mockT} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders when consent is pending', () => {
    render(<ConsentBanner consent="pending" onConsent={vi.fn()} t={mockT} />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('calls onConsent with granted when clicking Accept all', () => {
    const onConsent = vi.fn();
    render(<ConsentBanner consent="pending" onConsent={onConsent} t={mockT} />);
    fireEvent.click(screen.getByRole('button', { name: /aceptar todo/i }));
    expect(onConsent).toHaveBeenCalledWith('granted');
  });

  it('calls onConsent with denied when clicking Essentials only', () => {
    const onConsent = vi.fn();
    render(<ConsentBanner consent="pending" onConsent={onConsent} t={mockT} />);
    fireEvent.click(screen.getByRole('button', { name: /solo esenciales/i }));
    expect(onConsent).toHaveBeenCalledWith('denied');
  });

  it('prevents body scroll while open', () => {
    render(<ConsentBanner consent="pending" onConsent={vi.fn()} t={mockT} />);
    expect(document.body.style.overflow).toBe('hidden');
  });

  it('restores body scroll when closed', () => {
    const { rerender } = render(<ConsentBanner consent="pending" onConsent={vi.fn()} t={mockT} />);
    rerender(<ConsentBanner consent="granted" onConsent={vi.fn()} t={mockT} />);
    expect(document.body.style.overflow).toBe('');
  });
});
