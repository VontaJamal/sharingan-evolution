# Visual proof

Captured from the feature branch in Chromium on August 24, 2026.

## Artifacts

- `advanced-morph.webm` — 11-second browser capture of the fan-backed three-tomoe awakening, shared-node Mangekyō morph, and inherited Eternal overlay.
- `desktop-dormant.png` — 1440×1000 initial poster, awakening control, and code-drawn fan backdrop.
- `desktop-two-tomoe.png` — corrected 180° two-tomoe spacing.
- `desktop-mangekyo.png` — corrected six-petal, three-lens Sasuke Mangekyō with the distressed sclera and fan backdrop.
- `desktop-eternal-mangekyo.png` — corrected Eternal form with the inherited three-blade overlay.
- `desktop-rinnegan.png` — 1440×1000 complete sequence, unlocked navigation, and explicit Rinnegan distinction.
- `mobile-mangekyo.png` — 390×844 corrected Mangekyō, sclera strain, and responsive fan backdrop after touch progression.
- `before-generic-halo.png` — the previous rotating ring and breathing circular aura preserved as regression evidence.
- `before-sclera-strain.png` — the previous four clean sclera strokes preserved as regression evidence.
- `before-mangekyo.png` and `before-eternal-mangekyo.png` — the inaccurate generic-blade patterns preserved as regression evidence.

## Verification checklist

- [x] The eye is the dominant full-canvas visual at desktop and phone sizes.
- [x] The eye uses an asymmetric vector aperture, softened lid contours, and a restrained corneal sheen rather than a blocky geometric mask.
- [x] Sixteen asymmetrical vessels fork across a diffuse, progressively deepened sclera flush instead of using four mirrored decorative lines.
- [x] Primary vessels draw first and fine capillaries follow on a restrained 400ms delay, finishing with the main eye transition.
- [x] An oversized code-drawn uchiwa fan replaces the generic rotating halo and breathing circular aura at desktop and phone sizes.
- [x] The fan has no looping animation; it receives only restrained pointer depth while Three.js owns the sparse particles.
- [x] Two tomoe sit opposite each other at 180°.
- [x] Existing tomoe remain visible and move into place while only the newly earned mark materializes over 1.2–1.7 seconds.
- [x] The same three SVG path nodes interpolate from tomoe silhouettes into Mangekyō lens curves as the ring expands and petals grow behind them.
- [x] The advanced morph preserves solid tomoe through the first beat, delays their conversion into linework, and sustains visible transformation through the middle of the 2.05-second motion.
- [x] Sasuke's Mangekyō uses six outer petals and three overlapping lens lines.
- [x] Eternal Mangekyō preserves Sasuke's frame and adds Itachi's three-blade overlay.
- [x] One eye canvas remains mounted while layered iris color and ocular patterns dissolve and settle over 1.65–2.15 seconds without a full-eye crossfade.
- [x] Sasuke's Mangekyō framework remains mounted as the Eternal inherited-blade layer transforms over it.
- [x] Eternal's inherited blades extend from the center without an opacity crossfade or complete replacement layer.
- [x] Mouse click and touch tap advance exactly one stage.
- [x] `Enter` awakens the untouched opening scene; focused controls still support native `Enter` and `Space` operation.
- [x] Restart returns to the dormant eye while discovered-stage navigation remains available.
- [x] All seven canonical stage names remain visible even while future navigation is locked.
- [x] The final state is labeled as a distinct left-eye dōjutsu, not a Sharingan form.
- [x] Focus rings are visible on the primary eye, restart action, and discovered-stage controls.
- [x] Reduced-motion mode removes continuous particles, depth transforms, transition travel, and delayed intermediate morph states.
- [x] The disclaimer remains visible without competing with the awakening interaction.

The WebM, responsive screenshots, written checklist, and browser persistence assertions are the review proof for this version.
