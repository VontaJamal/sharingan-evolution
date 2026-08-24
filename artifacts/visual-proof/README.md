# Visual proof

Captured from the feature branch in Chromium on August 24, 2026.

## Artifacts

- `desktop-dormant.png` — 1440×1000 initial poster and awakening control.
- `desktop-two-tomoe.png` — corrected 180° two-tomoe spacing.
- `desktop-mangekyo.png` — corrected six-petal, three-lens Sasuke Mangekyō.
- `desktop-eternal-mangekyo.png` — corrected Eternal form with the inherited three-blade overlay.
- `desktop-rinnegan.png` — 1440×1000 complete sequence, unlocked navigation, and explicit Rinnegan distinction.
- `mobile-mangekyo.png` — 390×844 corrected Mangekyō after touch progression.
- `before-mangekyo.png` and `before-eternal-mangekyo.png` — the inaccurate generic-blade patterns preserved as regression evidence.

## Verification checklist

- [x] The eye is the dominant full-canvas visual at desktop and phone sizes.
- [x] Two tomoe sit opposite each other at 180°.
- [x] Sasuke's Mangekyō uses six outer petals and three overlapping lens lines.
- [x] Eternal Mangekyō preserves Sasuke's frame and adds Itachi's three-blade overlay.
- [x] One eye canvas remains mounted while each ocular pattern transforms in place without a full-eye crossfade.
- [x] Sasuke's Mangekyō framework remains mounted as the Eternal inherited-blade layer transforms over it.
- [x] Mouse click and touch tap advance exactly one stage.
- [x] `Enter` awakens the untouched opening scene; focused controls still support native `Enter` and `Space` operation.
- [x] Restart returns to the dormant eye while discovered-stage navigation remains available.
- [x] The final state is labeled as a distinct left-eye dōjutsu, not a Sharingan form.
- [x] Focus rings are visible on the primary eye, restart action, and discovered-stage controls.
- [x] Reduced-motion mode removes continuous particles, depth transforms, and transition travel.
- [x] The disclaimer remains visible without competing with the awakening interaction.

A short WebM was attempted, but the local capture backend did not finalize a bounded recording. These responsive screenshots, the written checklist, and the browser persistence assertions are the review proof for this version.
