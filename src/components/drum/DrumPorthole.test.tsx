import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import DrumPorthole from './DrumPorthole';

// Framer motion renders fine in jsdom — we just check DOM structure
describe('DrumPorthole (washing machine)', () => {
  it('renders without crashing in idle state', () => {
    const { container } = render(<DrumPorthole size={200} state="idle" />);
    expect(container.firstChild).toBeTruthy();
  });

  it('renders without crashing in analyzing state', () => {
    const { container } = render(<DrumPorthole size={200} state="analyzing" />);
    expect(container.firstChild).toBeTruthy();
  });

  it('renders without crashing in executing state', () => {
    const { container } = render(<DrumPorthole size={200} state="executing" />);
    expect(container.firstChild).toBeTruthy();
  });

  it('renders without crashing in complete state', () => {
    const { container } = render(<DrumPorthole size={200} state="complete" />);
    expect(container.firstChild).toBeTruthy();
  });

  it('applies className prop', () => {
    const { container } = render(<DrumPorthole className="test-class" />);
    expect(container.firstChild).toHaveClass('test-class');
  });

  it('shows dollar signs in idle state', () => {
    const { container } = render(<DrumPorthole size={200} state="idle" />);
    const dollars = container.querySelectorAll('span');
    const dollarTexts = Array.from(dollars).filter((s) => s.textContent === '$');
    expect(dollarTexts.length).toBeGreaterThan(0);
  });

  it('shows target currency text in analyzing state', () => {
    render(<DrumPorthole size={200} state="analyzing" targetCurrency="JPY" />);
    expect(screen.getByText('JPY')).toBeInTheDocument();
  });

  it('shows water-slosh element in analyzing state', () => {
    const { container } = render(<DrumPorthole size={200} state="analyzing" />);
    const slosh = container.querySelector('.machine-water-slosh');
    expect(slosh).toBeInTheDocument();
  });

  it('shows bubbles in analyzing state', () => {
    const { container } = render(<DrumPorthole size={200} state="analyzing" />);
    const bubbles = container.querySelectorAll('.machine-bubble');
    expect(bubbles.length).toBeGreaterThan(0);
  });

  it('shows LED indicator dots', () => {
    const { container } = render(<DrumPorthole size={200} state="idle" />);
    // LEDs are rounded-full divs inside the top panel
    const leds = container.querySelectorAll('.rounded-full');
    expect(leds.length).toBeGreaterThan(0);
  });
});
