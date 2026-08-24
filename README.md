# Sharingan Evolution

A cinematic, full-screen fan experience tracing Sasuke Uchiha's eye progression from a dormant eye to his Six Paths Rinnegan.

![Sasuke's Six Paths Rinnegan experience](artifacts/visual-proof/desktop-rinnegan.png)

The experience uses original SVG eye drawing, an oversized code-drawn uchiwa fan backdrop, an original black-flame Amaterasu field, a progressively enhanced Three.js particle field, CSS fallback atmosphere, and lightweight motion. The WebGL layer is dynamically loaded only on capable devices, runs at a restrained 30fps with capped pixel density, and never owns the canonical ocular artwork, flames, or fan motif. It includes no copied anime frames, imported logos, music, franchise fonts, or other ripped assets.

## Experience

The seven data-defined forms are:

1. Dormant Eye
2. One Tomoe Sharingan
3. Two Tomoe Sharingan
4. Three Tomoe Sharingan
5. Mangekyō Sharingan
6. Eternal Mangekyō Sharingan
7. Sasuke's Six Paths Rinnegan

The final state is deliberately labeled **Distinct dōjutsu · Left eye only**. Sasuke's Rinnegan follows the Sharingan sequence in his story, but it is not presented as another Sharingan form.

## Controls

- Select the eye to advance one form with a mouse or touch. Press `Enter` directly from the scene, or use `Enter` or `Space` when the eye has keyboard focus.
- Use `Arrow Right` to advance and `Arrow Left` to step back when focus is not already on a control.
- Read the full seven-form sequence on the progress rail, and revisit any discovered form.
- Select **Restart** at any time, or select the final eye to begin again.

Each form transforms inside the same continuously mounted eye: layered sclera, iris, and full-pattern surfaces dissolve, scale, and turn into place over a deliberate 1.65–2.15 second reveal. During tomoe maturation, three stable SVG slots preserve every earned mark: existing tomoe remain visible and move into their next positions while only the new mark materializes on a tighter 1.2–1.7 second beat. Branching capillaries draw in behind the iris while an uneven sclera flush deepens from the basic Sharingan through Mangekyō and Eternal, replacing decorative strain lines with a distressed-eye treatment. The advanced awakening uses a true shared-element path morph: the same three SVG nodes travel inward as solid forms, then become Sasuke's three Mangekyō lens curves through a delayed ink-line conversion while the iris ring expands and six petals grow behind them. Eternal's inherited blades then extend over the continuously mounted Sasuke framework with the same sustained cadence and no opacity crossfade. Eight original black SVG flame tongues awaken once behind the lid at Mangekyō and remain mounted through Eternal and Rinnegan; reduced-motion mode settles them immediately. Sasuke's Rinnegan is drawn with four concentric ripples and two distinct three-tomoe bands rather than six tomoe sharing one orbit. A large original vector interpretation of the Uchiha uchiwa fan anchors the background with pointer depth but no looping rotation, breathing, or pressure-ring animation; Three.js contributes only restrained particles. The eye uses an asymmetric aperture, softened lid depth, and corneal light instead of a rigid geometric mask. The interface also has visible keyboard focus states, semantic controls, live stage announcements, readable contrast, phone-through-desktop layouts, and a `prefers-reduced-motion` mode that removes continuous particles, WebGL depth, pointer response, and transition travel.

## Local setup

Requires Node.js 22 or newer.

```bash
npm install
npm run dev
```

Open the local address printed by Vite.

## Verification

```bash
npm run lint
npm run typecheck
npm run test
npm run build
npx playwright install chromium
npm run test:e2e
```

`npm run check` runs linting, strict type checking, behavior tests, and the production build in one command. GitHub Actions runs that quality gate and the Chromium smoke suite for pull requests and `main`.

Behavior coverage includes sequential progression, paced in-place eye transformations, static fan-backdrop structure and halo removal, branching sclera-strain structure and reveal timing, Mangekyō-to-Eternal artwork continuity, persistent Amaterasu activation, two-band Rinnegan geometry, organic eye-layer structure, progressive WebGL enhancement and fallback state, pointer and native keyboard activation, direct navigation after discovery, restart, accurate Rinnegan distinction, locked-state accessibility, reduced-motion behavior, real touch input, phone layout, and browser-level keyboard operation.

## Visual proof

Review artifacts are in [`artifacts/visual-proof`](artifacts/visual-proof):

- 12-second WebM showing the fan-backed tomoe-to-Mangekyō morph, Amaterasu awakening, Eternal overlay, and corrected Rinnegan
- 1440×1000 dormant desktop poster
- 1440×1000 corrected two-tomoe, Mangekyō, and Eternal Mangekyō states
- 1440×1000 fully discovered Rinnegan state
- 390×844 touch-sized corrected Mangekyō and Rinnegan states
- before-and-after evidence for the advanced-eye redraw
- before-and-after evidence for the generic halo replacement
- before-and-after evidence for the single-orbit Rinnegan correction and Amaterasu addition
- a concise written verification checklist

## Lore and IP boundary

The short lore lines follow Sasuke's canonical progression: early tomoe maturation, the fully matured Sharingan at the Valley of the End, Mangekyō after the truth of Itachi's sacrifice, Eternal Mangekyō through Itachi's transplanted eyes, and the six-tomoe Rinnegan in Sasuke's left eye after receiving Hagoromo's chakra. Its six marks are placed as two three-tomoe bands on the inner ripples. The Rinnegan distinction is also encoded directly in the UI and tested.

This is an unofficial, non-commercial fan project. Naruto and its characters belong to their respective rights holders. All interface artwork and effects, including the uchiwa fan backdrop and Amaterasu flame silhouettes, are original code-created interpretations and are not official franchise assets.
