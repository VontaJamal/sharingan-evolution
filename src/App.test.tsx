import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import App from './App';

describe('Sharingan Evolution', () => {
  it('uses an original fan crest as the static background anchor', () => {
    const { container } = render(<App />);

    expect(container.querySelector('svg.clan-fan-backdrop')).toBeInTheDocument();
    expect(container.querySelector('[data-shape="clan-fan-canopy"]')).toBeInTheDocument();
    expect(container.querySelector('[data-shape="clan-fan-handle"]')).toBeInTheDocument();
    expect(container.querySelectorAll('.clan-fan-backdrop__rib')).toHaveLength(9);
    expect(container.querySelector('.pressure-ring')).not.toBeInTheDocument();
  });

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

  it('moves the first tomoe from twelve to ten while the second appears at two', async () => {
    const user = userEvent.setup();
    const { container } = render(<App />);

    await user.click(screen.getByRole('button', { name: /awaken the eye/i }));
    const firstTomoe = container.querySelector('[data-tomoe-slot="0"]');

    expect(firstTomoe).toHaveAttribute('data-angle', '0');
    expect(firstTomoe).toHaveClass('is-visible');

    await user.click(screen.getByRole('button', { name: /draw out the second tomoe/i }));

    expect(container.querySelector('[data-tomoe-slot="0"]')).toBe(firstTomoe);
    expect(firstTomoe).toHaveAttribute('data-angle', '-60');
    expect(container.querySelector('[data-tomoe-slot="1"]')).toHaveAttribute('data-angle', '60');
    expect(container.querySelector('[data-tomoe-slot="1"]')).toHaveClass('is-visible');
  });

  it('morphs the persistent Mangekyo pupil outward into the Eternal triangular core', async () => {
    const user = userEvent.setup();
    const { container } = render(<App />);

    for (let step = 0; step < 4; step += 1) {
      await user.click(screen.getByRole('button', { name: /current form/i }));
    }

    const pupil = container.querySelector('[data-shape="pupil"]');
    expect(pupil?.tagName.toLowerCase()).toBe('path');

    await user.click(screen.getByRole('button', { name: /seek the eternal light/i }));

    expect(container.querySelector('[data-shape="eternal-pupil-triangle"]')).toBe(pupil);
    expect(container.querySelector('.eternal-core')).not.toBeInTheDocument();
  });

  it('casts Amaterasu from an explicit control and keeps the burning field mounted across advanced forms', async () => {
    const user = userEvent.setup();
    const { container } = render(<App />);
    const flameField = container.querySelector('.amaterasu-field');

    expect(flameField).toBeInTheDocument();
    expect(flameField).not.toHaveClass('is-active');
    expect(container.querySelector('canvas.amaterasu-field')).toBe(flameField);
    expect(screen.queryByRole('button', { name: 'Cast Amaterasu' })).not.toBeInTheDocument();

    for (let step = 0; step < 4; step += 1) {
      await user.click(screen.getByRole('button', { name: /current form/i }));
    }

    const castButton = screen.getByRole('button', { name: 'Cast Amaterasu' });
    expect(castButton).toHaveAttribute('aria-pressed', 'false');
    expect(flameField).not.toHaveClass('is-active');

    await user.click(castButton);

    expect(container.querySelector('.amaterasu-field')).toBe(flameField);
    expect(flameField).toHaveClass('is-active');
    expect(flameField).toHaveAttribute('data-animation', 'active');
    expect(screen.getByRole('button', { name: 'End Amaterasu' })).toHaveAttribute('aria-pressed', 'true');

    await user.click(screen.getByRole('button', { name: /current form/i }));
    await user.click(screen.getByRole('button', { name: /current form/i }));

    expect(container.querySelector('.amaterasu-field')).toBe(flameField);
    expect(flameField).toHaveClass('is-active');

    await user.click(screen.getByRole('button', { name: 'End Amaterasu' }));
    expect(flameField).not.toHaveClass('is-active');
    expect(flameField).toHaveAttribute('data-animation', 'idle');
  });

  it('awakens when Enter is pressed directly from the opening screen', async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(document.body).toHaveFocus();
    await user.keyboard('{Enter}');

    expect(screen.getByRole('heading', { name: 'One Tomoe Sharingan' })).toBeInTheDocument();
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

  it('names future forms while keeping their direct navigation locked', () => {
    render(<App />);

    expect(screen.getByRole('button', { name: 'View Dormant Eye' })).toHaveAttribute('aria-current', 'step');
    expect(screen.getByRole('button', { name: 'One Tomoe Sharingan (locked)' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Mangekyō Sharingan (locked)' })).toBeDisabled();
    expect(screen.getByRole('button', { name: "Sasuke's Six Paths Rinnegan (locked)" })).toBeDisabled();
    expect(screen.queryByText('Unknown')).not.toBeInTheDocument();
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
    expect(container.querySelector('.cinematic-field')).toHaveAttribute('data-webgl', 'fallback');
  });
});
