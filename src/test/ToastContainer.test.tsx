import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ToastContainer from '../components/ToastContainer';
import type { Toast } from '../hooks/useToast';

describe('ToastContainer', () => {
  it('renders nothing when empty', () => {
    const { container } = render(<ToastContainer toasts={[]} onRemove={vi.fn()} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders toasts', () => {
    const toasts: Toast[] = [
      { id: '1', message: 'Hello', type: 'info' },
      { id: '2', message: 'Oops', type: 'error' },
    ];
    render(<ToastContainer toasts={toasts} onRemove={vi.fn()} />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
    expect(screen.getByText('Oops')).toBeInTheDocument();
  });

  it('calls onRemove when clicked', () => {
    const onRemove = vi.fn();
    const toasts: Toast[] = [{ id: '1', message: 'Bye', type: 'success' }];
    render(<ToastContainer toasts={toasts} onRemove={onRemove} />);
    const btn = screen.getByRole('button');
    fireEvent.click(btn);
    expect(onRemove).toHaveBeenCalledWith('1');
  });
});
