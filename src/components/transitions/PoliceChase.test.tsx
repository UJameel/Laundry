import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import PoliceChase from './PoliceChase';

describe('PoliceChase', () => {
  it('renders nothing when isActive is false', () => {
    const { container } = render(<PoliceChase isActive={false} onDismiss={() => {}} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders the overlay when isActive is true', () => {
    render(<PoliceChase isActive={true} onDismiss={() => {}} />);
    expect(screen.getByText('STOP RIGHT THERE!')).toBeInTheDocument();
  });

  it('shows subtitle text', () => {
    render(<PoliceChase isActive={true} onDismiss={() => {}} />);
    expect(screen.getByText('Your funds are being escorted to the destination...')).toBeInTheDocument();
  });

  it('shows dismiss hint', () => {
    render(<PoliceChase isActive={true} onDismiss={() => {}} />);
    expect(screen.getByText('Click anywhere to dismiss')).toBeInTheDocument();
  });

  it('calls onDismiss when clicked', () => {
    const onDismiss = vi.fn();
    render(<PoliceChase isActive={true} onDismiss={onDismiss} />);
    fireEvent.click(screen.getByText('STOP RIGHT THERE!'));
    expect(onDismiss).toHaveBeenCalledOnce();
  });

  it('calls onDismiss on Escape key', () => {
    const onDismiss = vi.fn();
    render(<PoliceChase isActive={true} onDismiss={onDismiss} />);
    fireEvent.keyDown(screen.getByRole('button'), { key: 'Escape' });
    expect(onDismiss).toHaveBeenCalledOnce();
  });

  it('shows runner, police car, and cash emojis', () => {
    render(<PoliceChase isActive={true} onDismiss={() => {}} />);
    expect(screen.getByLabelText('runner')).toBeInTheDocument();
    expect(screen.getByLabelText('police car')).toBeInTheDocument();
    const cashItems = screen.getAllByLabelText('cash');
    expect(cashItems.length).toBe(5);
  });

  it('shows dust cloud emojis', () => {
    render(<PoliceChase isActive={true} onDismiss={() => {}} />);
    const dust = screen.getAllByLabelText('dust');
    expect(dust.length).toBe(3);
  });
});
