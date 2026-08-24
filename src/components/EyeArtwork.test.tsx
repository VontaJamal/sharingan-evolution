import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SASUKE_STAGES } from '../stages';
import { EyeArtwork } from './EyeArtwork';

describe('base Sharingan artwork structure', () => {
  it('places two tomoe opposite each other instead of inheriting three-tomoe spacing', () => {
    const { container } = render(<EyeArtwork stage={SASUKE_STAGES[2]} />);

    const angles = [
      ...container.querySelectorAll('.ocular-pattern-layer--tomoe .tomoe-mark'),
    ].map((mark) => mark.getAttribute('data-angle'));
    expect(angles).toEqual(['0', '180']);
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
