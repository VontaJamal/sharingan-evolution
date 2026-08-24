# Visual proof

Captured from the feature branch in Chromium on August 24, 2026.

## Artifacts

- `advanced-morph.webm` — 12-second browser capture of the fan-backed three-tomoe awakening, shared-node Mangekyō morph, black-flame Amaterasu entrance, inherited Eternal overlay, and two-band Rinnegan reveal.
- `desktop-dormant.png` — 1440×1000 initial poster, awakening control, and code-drawn fan backdrop.
- `desktop-two-tomoe.png` — corrected 180° two-tomoe spacing.
- `desktop-mangekyo.png` — corrected six-petal, three-lens Sasuke Mangekyō with the distressed sclera and newly awakened black flames.
- `desktop-eternal-mangekyo.png` — corrected Eternal form with the inherited three-blade overlay and persistent flame field.
- `desktop-rinnegan.png` — 1440×1000 corrected two-band six-tomoe Rinnegan, unlocked navigation, and explicit dōjutsu distinction.
- `mobile-mangekyo.png` — 390×844 corrected Mangekyō, sclera strain, original flames, and responsive fan backdrop after touch progression.
- `mobile-rinnegan.png` — 390×844 two-band Rinnegan and flame framing after touch progression.
- `before-amaterasu.png` — the previous advanced eye without the original black-flame field.
- `before-single-orbit-rinnegan.png` — the previous inaccurate six-tomoe single-orbit Rinnegan.
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
- [x] Eight original near-black SVG flame tongues awaken once behind the eyelid at Mangekyō and remain mounted through Eternal and Rinnegan.
- [x] The flames use a restrained deep-crimson edge for legibility against obsidian black without changing into purple during the Rinnegan state.
- [x] Sasuke's Rinnegan places three small comma marks on each of two inner ripple bands rather than distributing all six on one orbit.
- [x] The Rinnegan draws its four concentric ripples into the existing iris while suppressing the prior dotted texture.
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
- [x] Reduced-motion mode settles the Amaterasu entrance immediately instead of playing its staggered rise.
- [x] The disclaimer remains visible without competing with the awakening interaction.

The WebM, responsive screenshots, written checklist, and browser persistence assertions are the review proof for this version.
