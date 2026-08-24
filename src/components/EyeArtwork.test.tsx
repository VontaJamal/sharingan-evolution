import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SASUKE_STAGES } from '../stages';
import { EyeArtwork } from './EyeArtwork';

describe('cinematic eye canvas', () => {
  it('uses an organic aperture with layered corneal and lid depth', () => {
    const { container } = render(<EyeArtwork stage={SASUKE_STAGES[0]} />);

    expect(container.querySelector('[data-shape="eye-aperture"]')).toBeInTheDocument();
    expect(container.querySelector('.corneal-sheen')).toBeInTheDocument();
    expect(container.querySelectorAll('.lid-crease')).toHaveLength(2);
  });

  it('keeps layered iris surfaces mounted while their color state changes', () => {
    const { container, rerender } = render(<EyeArtwork stage={SASUKE_STAGES[0]} />);
    const surfaces = [...container.querySelectorAll('.iris-disc')];

    expect(surfaces).toHaveLength(3);
    expect(container.querySelector('.iris-disc--dormant')).toHaveClass('is-active');

    rerender(<EyeArtwork stage={SASUKE_STAGES[1]} />);

    expect([...container.querySelectorAll('.iris-disc')]).toEqual(surfaces);
    expect(container.querySelector('.iris-disc--crimson')).toHaveClass('is-active');
  });
});

describe('base Sharingan artwork structure', () => {
  it('places two tomoe opposite each other instead of inheriting three-tomoe spacing', () => {
    const { container } = render(<EyeArtwork stage={SASUKE_STAGES[2]} />);

    const angles = [
      ...container.querySelectorAll('.ocular-pattern-layer--tomoe .tomoe-mark.is-visible'),
    ].map((mark) => mark.getAttribute('data-angle'));
    expect(angles).toEqual(['0', '180']);
  });

  it('keeps earned tomoe mounted while they move into the three-tomoe arrangement', () => {
    const { container, rerender } = render(<EyeArtwork stage={SASUKE_STAGES[2]} />);
    const slots = [...container.querySelectorAll('.ocular-pattern-layer--tomoe .tomoe-mark')];
    const movingTomoe = container.querySelector('[data-tomoe-slot="1"]');

    expect(slots).toHaveLength(3);
    expect(movingTomoe).toHaveClass('is-visible');
    expect(movingTomoe).toHaveAttribute('data-angle', '180');

    rerender(<EyeArtwork stage={SASUKE_STAGES[3]} />);

    expect([...container.querySelectorAll('.ocular-pattern-layer--tomoe .tomoe-mark')]).toEqual(slots);
    expect(container.querySelector('[data-tomoe-slot="1"]')).toBe(movingTomoe);
    expect(movingTomoe).toHaveClass('is-visible');
    expect(movingTomoe).toHaveAttribute('data-angle', '120');
    expect(container.querySelector('[data-tomoe-slot="2"]')).toHaveClass('is-visible');
  });
});

describe('Sasuke Mangekyō artwork structure', () => {
  it('renders the Mangekyō as six outer petals held by three overlapping lenses', () => {
    const { container } = render(<EyeArtwork stage={SASUKE_STAGES[4]} />);

    expect(container.querySelectorAll('[data-shape="sasuke-mangekyo-petal"]')).toHaveLength(6);
    expect(container.querySelectorAll('[data-shape="sasuke-mangekyo-lens"]')).toHaveLength(3);
    expect(container.querySelectorAll('[data-shape="itachi-inherited-blade"]')).toHaveLength(3);
    expect(container.querySelector('.ocular-pattern-layer--eternal')).not.toHaveClass('is-active');
  });

  it('adds Itachi’s three-blade overlay only for the Eternal Mangekyō', () => {
    const { container } = render(<EyeArtwork stage={SASUKE_STAGES[5]} />);

    expect(container.querySelectorAll('[data-shape="sasuke-mangekyo-petal"]')).toHaveLength(6);
    expect(container.querySelectorAll('[data-shape="sasuke-mangekyo-lens"]')).toHaveLength(3);
    expect(container.querySelectorAll('[data-shape="itachi-inherited-blade"]')).toHaveLength(3);
    expect(container.querySelector('.eternal-core')).toBeInTheDocument();
    expect(container.querySelector('.pupil')).toHaveClass('pupil--hidden');
  });

  it('keeps Sasuke’s Mangekyō framework mounted when Eternal Mangekyō is activated', () => {
    const { container, rerender } = render(<EyeArtwork stage={SASUKE_STAGES[4]} />);
    const sasukeFramework = container.querySelector('.sasuke-mangekyo-framework');

    rerender(<EyeArtwork stage={SASUKE_STAGES[5]} />);

    expect(container.querySelector('.sasuke-mangekyo-framework')).toBe(sasukeFramework);
  });
});
