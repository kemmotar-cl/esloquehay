import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

import { useFocusTrap } from '../hooks/useFocusTrap';

function TestComponent({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const ref = useFocusTrap(isOpen, onClose);
  return (
    <div ref={ref}>
      <button>First</button>
      <button>Second</button>
      <button>Last</button>
    </div>
  );
}

describe('useFocusTrap', () => {
  it('focuses first focusable element when open', () => {
    render(<TestComponent isOpen={true} onClose={vi.fn()} />);
    const buttons = screen.getAllByRole('button');
    expect(document.activeElement).toBe(buttons[0]);
  });

  it('calls onClose on Escape key', () => {
    const onClose = vi.fn();
    render(<TestComponent isOpen={true} onClose={onClose} />);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalled();
  });

  it('does not call onClose on other keys', () => {
    const onClose = vi.fn();
    render(<TestComponent isOpen={true} onClose={onClose} />);
    fireEvent.keyDown(document, { key: 'Enter' });
    expect(onClose).not.toHaveBeenCalled();
  });
});
