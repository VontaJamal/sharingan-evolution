import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import App from './App';

describe('Sharingan Evolution', () => {
  beforeEach(() => {
    vi.mocked(window.matchMedia).mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
  });

  it('advances through the Sasuke sequence with the primary pointer action', async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(screen.getByRole('heading', { name: 'Dormant Eye' })).toBeInTheDocument();

    const trigger = screen.getByRole('button', { name: /awaken the eye/i });
    await user.click(trigger);
    expect(screen.getByRole('heading', { name: 'One Tomoe Sharingan' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /draw out the second tomoe/i }));
    expect(screen.getByRole('heading', { name: 'Two Tomoe Sharingan' })).toBeInTheDocument();
  });

  it('keeps one eye canvas mounted while the ocular pattern transforms in place', async () => {
    const user = userEvent.setup();
    const { container } = render(<App />);
    const eyeScene = container.querySelector('.eye-scene');
    const eyeArtwork = container.querySelector('.eye-artwork');

    await user.click(screen.getByRole('button', { name: /awaken the eye/i }));

    expect(container.querySelector('.eye-scene')).toBe(eyeScene);
    expect(container.querySelector('.eye-artwork')).toBe(eyeArtwork);
  });

  it('uses native keyboard activation and supports arrow-key progression', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.tab();
    await user.tab();
    expect(screen.getByRole('button', { name: /awaken the eye/i })).toHaveFocus();

    await user.keyboard('{Enter}');
    expect(screen.getByRole('heading', { name: 'One Tomoe Sharingan' })).toBeInTheDocument();

    const oneTomoeTrigger = screen.getByRole('button', { name: /draw out the second tomoe/i });
    oneTomoeTrigger.focus();
    await user.keyboard(' ');
    expect(screen.getByRole('heading', { name: 'Two Tomoe Sharingan' })).toBeInTheDocument();

    fireEvent.keyDown(window, { key: 'ArrowRight' });
    expect(screen.getByRole('heading', { name: 'Three Tomoe Sharingan' })).toBeInTheDocument();

    fireEvent.keyDown(window, { key: 'ArrowLeft' });
    expect(screen.getByRole('heading', { name: 'Two Tomoe Sharingan' })).toBeInTheDocument();
  });

  it('keeps discovered forms available after restart', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: /awaken the eye/i }));
    await user.click(screen.getByRole('button', { name: /draw out the second tomoe/i }));
    await user.click(screen.getByRole('button', { name: /complete the pattern/i }));

    await user.click(screen.getByRole('button', { name: /^restart/i }));
    expect(screen.getByRole('heading', { name: 'Dormant Eye' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'View Two Tomoe Sharingan' }));
    expect(screen.getByRole('heading', { name: 'Two Tomoe Sharingan' })).toBeInTheDocument();
  });

  it('labels the Rinnegan as a distinct left-eye dōjutsu', async () => {
    const user = userEvent.setup();
    render(<App />);

    for (let step = 0; step < 6; step += 1) {
      await user.click(screen.getByRole('button', { name: /current form/i }));
    }

    expect(screen.getByRole('heading', { name: "Sasuke's Six Paths Rinnegan" })).toBeInTheDocument();
    expect(screen.getByText('Distinct dōjutsu · Left eye only')).toBeInTheDocument();
    expect(document.getElementById('stage-lore')).toHaveTextContent(/six-tomoe Rinnegan/i);
  });

  it('exposes inaccessible future forms as disabled until they are discovered', () => {
    render(<App />);

    expect(screen.getByRole('button', { name: 'View Dormant Eye' })).toHaveAttribute('aria-current', 'step');
    expect(screen.getByRole('button', { name: 'Undiscovered form 2' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Undiscovered form 7' })).toBeDisabled();
  });

  it('reports and honors the reduced-motion preference', () => {
    vi.mocked(window.matchMedia).mockImplementation((query: string) => ({
      matches: query === '(prefers-reduced-motion: reduce)',
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    const { container } = render(<App />);
    expect(container.querySelector('main')).toHaveAttribute('data-motion', 'reduced');
  });
});
