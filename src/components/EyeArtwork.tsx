import type { CSSProperties } from 'react';
import type { EyeStage } from '../stages';

interface EyeArtworkProps {
  stage: EyeStage;
}

const TOMOE_ANGLES = {
  0: [0, 180, 240],
  1: [0, 180, 240],
  2: [0, 180, 240],
  3: [0, 120, 240],
} as const;
const RINNEGAN_TOMOE_BANDS = [
  { angles: [0, 120, 240], name: 'inner', radius: 73 },
  { angles: [60, 180, 300], name: 'outer', radius: 108 },
] as const;
const MANGEKYO_PETAL_ANGLES = [0, 60, 120, 180, 240, 300];
const MANGEKYO_LENS_ANGLES = [0, 120, 240];
const TOMOE_SHAPE = 'M 0 -14 C 8 -14 14 -8 14 0 C 14 5 12 9 8 12 C 15 15 25 9 32 -10 C 34 3 29 15 19 21 C 9 28 -5 26 -13 17 C -19 11 -20 2 -16 -6 C -15 -10 -13 -12 -11 -13 C -7 -15 -3 -15 0 -14 Z';
const MANGEKYO_LENS_SHAPE = 'M 47 0 C 47 31 41 61 31 87 C 22 111 10 128 0 136 C -10 128 -22 111 -31 87 C -41 61 -47 31 -47 0 C -47 -31 -41 -61 -31 -87 C -22 -111 -10 -128 0 -136 C 10 -128 22 -111 31 -87 C 41 -61 47 -31 47 0 Z';
const SCLERA_VEINS = [
  { side: 'left', weight: 'trunk', d: 'M 50 243 C 69 241 75 234 91 233 C 108 232 117 223 134 224 C 151 225 160 218 174 221' },
  { side: 'left', weight: 'trunk', d: 'M 52 253 C 71 256 81 265 99 266 C 116 267 129 276 147 274 C 159 273 168 270 177 269' },
  { side: 'left', weight: 'branch', d: 'M 82 235 C 80 222 75 214 67 207 C 61 201 59 195 56 188' },
  { side: 'left', weight: 'branch', d: 'M 110 229 C 105 218 104 208 96 200 C 91 195 88 190 86 184' },
  { side: 'left', weight: 'branch', d: 'M 139 224 C 134 213 127 207 119 202 C 111 197 108 190 105 182' },
  { side: 'left', weight: 'branch', d: 'M 94 265 C 86 273 81 281 79 290 C 76 300 69 306 62 312' },
  { side: 'left', weight: 'capillary', d: 'M 119 270 C 115 281 107 287 103 297 C 100 305 95 311 89 315' },
  { side: 'left', weight: 'capillary', d: 'M 150 272 C 146 282 140 289 132 294 C 127 298 124 303 121 308' },
  { side: 'right', weight: 'trunk', d: 'M 590 239 C 571 235 560 227 543 226 C 525 225 515 217 499 219 C 486 220 478 216 470 217' },
  { side: 'right', weight: 'trunk', d: 'M 588 254 C 569 259 557 269 539 269 C 522 269 511 279 493 275 C 482 273 475 271 467 270' },
  { side: 'right', weight: 'branch', d: 'M 560 231 C 562 219 568 210 577 203 C 583 198 586 192 589 185' },
  { side: 'right', weight: 'branch', d: 'M 531 224 C 536 213 537 204 545 196 C 551 190 553 184 555 179' },
  { side: 'right', weight: 'branch', d: 'M 502 219 C 507 210 514 203 521 199 C 529 194 532 188 535 181' },
  { side: 'right', weight: 'branch', d: 'M 550 264 C 559 272 564 281 567 290 C 570 300 577 306 584 312' },
  { side: 'right', weight: 'capillary', d: 'M 521 272 C 527 282 535 288 539 297 C 542 305 547 311 553 315' },
  { side: 'right', weight: 'capillary', d: 'M 491 274 C 495 284 502 290 510 295 C 516 299 519 304 522 309' },
] as const;

function StrainedSclera({ visible }: { visible: boolean }) {
  return (
    <>
      <g className={`sclera-irritation${visible ? ' is-visible' : ''}`} aria-hidden="true">
        <ellipse
          className="sclera-irritation__bloom"
          data-shape="sclera-irritation"
          cx="72"
          cy="240"
          rx="158"
          ry="76"
        />
        <ellipse
          className="sclera-irritation__bloom"
          data-shape="sclera-irritation"
          cx="575"
          cy="252"
          rx="142"
          ry="84"
        />
      </g>
      <g className={`eye-veins${visible ? ' is-visible' : ''}`} aria-hidden="true">
        {SCLERA_VEINS.map(({ d, side, weight }, index) => (
          <path
            key={`${side}-${weight}-${index}`}
            className={`eye-vein eye-vein--${weight}`}
            data-side={side}
            d={d}
            pathLength="1"
          />
        ))}
      </g>
    </>
  );
}

function Tomoe({
  angle,
  radius = 93,
  slot,
  visible = true,
  morphing = false,
}: {
  angle: number;
  radius?: number;
  slot?: number;
  visible?: boolean;
  morphing?: boolean;
}) {
  const orbitStyle = {
    '--tomoe-angle': `${angle}deg`,
    '--tomoe-offset': `${morphing ? 0 : -radius}px`,
  } as CSSProperties;

  return (
    <g
      className={`tomoe-mark${visible ? ' is-visible' : ''}${morphing ? ' is-morphing' : ''}`}
      data-angle={angle}
      data-tomoe-slot={slot}
      style={orbitStyle}
    >
      <g className="tomoe-glyph">
        <path
          className="tomoe-shape"
          data-morph-source="tomoe"
          data-shape={morphing ? 'sasuke-mangekyo-lens' : undefined}
          d={morphing ? MANGEKYO_LENS_SHAPE : TOMOE_SHAPE}
        />
      </g>
    </g>
  );
}

function TomoePattern({ count, morphing = false }: { count: 0 | 1 | 2 | 3; morphing?: boolean }) {
  return (
    <g className="tomoe-pattern">
      <circle className="iris-ring" r="91" />
      {TOMOE_ANGLES[count].map((angle, slot) => (
        <Tomoe key={slot} angle={angle} slot={slot} visible={slot < count} morphing={morphing} />
      ))}
    </g>
  );
}

function RinneganTomoe({
  angle,
  band,
  radius,
}: {
  angle: number;
  band: 'inner' | 'outer';
  radius: number;
}) {
  return (
    <g
      className="rinnegan-tomoe"
      data-angle={angle}
      data-radius={radius}
      data-rinnegan-band={band}
      transform={`rotate(${angle}) translate(0 -${radius})`}
    >
      <path
        className="rinnegan-tomoe-glyph"
        data-shape="rinnegan-tomoe"
        d="M 0 -9 C 5 -9 9 -5 9 0 C 9 4 7 6 4 8 C 10 9 15 6 18 1 C 18 10 11 16 3 16 C -5 16 -11 9 -10 1 C -9 -5 -5 -9 0 -9 Z"
      />
    </g>
  );
}

function SasukeMangekyoFramework() {
  return (
    <g className="sasuke-mangekyo-framework">
      <circle className="mangekyo-void" r="132" />

      <g className="sasuke-mangekyo-petals">
        {MANGEKYO_PETAL_ANGLES.map((angle) => (
          <g key={angle} className="sasuke-mangekyo-petal-axis" transform={`rotate(${angle})`}>
            <path
              className="sasuke-mangekyo-petal"
              data-shape="sasuke-mangekyo-petal"
              d="M 0 -132 C -23 -108 -42 -71 -43 -38 C -25 -31 -11 -21 0 -7 C 11 -21 25 -31 43 -38 C 42 -71 23 -108 0 -132 Z"
            />
          </g>
        ))}
      </g>

    </g>
  );
}

function ItachiInheritedPattern() {
  return (
    <g className="itachi-inherited-pattern">
      {MANGEKYO_LENS_ANGLES.map((angle) => (
        <g key={angle} className="itachi-inherited-axis" transform={`rotate(${angle})`}>
          <path
            className="itachi-inherited-blade"
            data-shape="itachi-inherited-blade"
            d="M -18 7 C -15 39 -10 82 0 112 C 10 82 15 39 18 7 L 0 -7 Z"
          />
        </g>
      ))}
      <circle className="eternal-core" r="22" />
    </g>
  );
}

function RinneganPattern() {
  return (
    <g className="rinnegan-pattern">
      {[38, 73, 108, 143].map((radius) => (
        <circle key={radius} data-shape="rinnegan-ripple" pathLength="1" r={radius} />
      ))}
      {RINNEGAN_TOMOE_BANDS.map(({ angles, name, radius }) => (
        <g key={name} className={`rinnegan-tomoe-band rinnegan-tomoe-band--${name}`}>
          {angles.map((angle) => (
            <RinneganTomoe key={`${name}-${angle}`} angle={angle} band={name} radius={radius} />
          ))}
        </g>
      ))}
    </g>
  );
}

export function EyeArtwork({ stage }: EyeArtworkProps) {
  const isDormant = stage.kind === 'dormant';
  const isAwakened = !isDormant;
  const isTomoe = stage.kind === 'tomoe';
  const isMangekyo = stage.kind === 'mangekyo' || stage.kind === 'eternal-mangekyo';
  const isEternal = stage.kind === 'eternal-mangekyo';
  const isRinnegan = stage.kind === 'rinnegan';
  const tomoeCount = isTomoe ? stage.tomoe : isDormant ? 0 : 3;

  return (
    <svg
      className={`eye-artwork eye-artwork--${stage.kind}`}
      viewBox="0 0 640 480"
      role="img"
      aria-labelledby={`eye-title-${stage.id} eye-description-${stage.id}`}
    >
      <title id={`eye-title-${stage.id}`}>{stage.name}</title>
      <desc id={`eye-description-${stage.id}`}>{stage.lore}</desc>
      <defs>
        <clipPath id="eye-clip">
          <path d="M 49 244 C 122 158 218 116 323 120 C 430 123 522 168 591 239 C 522 306 430 341 320 345 C 211 347 120 314 49 244 Z" />
        </clipPath>
        <linearGradient id="sclera-light" x1="10%" y1="10%" x2="88%" y2="90%">
          <stop offset="0%" stopColor="#8d7778" />
          <stop offset="36%" stopColor="#f1e8e2" />
          <stop offset="68%" stopColor="#c4b1ae" />
          <stop offset="100%" stopColor="#3a292d" />
        </linearGradient>
        <radialGradient id="dormant-sclera" cx="48%" cy="42%" r="68%">
          <stop offset="0%" stopColor="#50484a" />
          <stop offset="58%" stopColor="#312d2f" />
          <stop offset="100%" stopColor="#171416" />
        </radialGradient>
        <radialGradient id="crimson-iris" cx="44%" cy="40%" r="62%">
          <stop offset="0%" stopColor="#ff443b" />
          <stop offset="48%" stopColor="#c3101b" />
          <stop offset="100%" stopColor="#3a0008" />
        </radialGradient>
        <radialGradient id="violet-iris" cx="45%" cy="40%" r="64%">
          <stop offset="0%" stopColor="#d1b9f1" />
          <stop offset="55%" stopColor="#886cae" />
          <stop offset="100%" stopColor="#2e223d" />
        </radialGradient>
        <linearGradient id="corneal-light" x1="25%" y1="18%" x2="68%" y2="78%">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.2" />
          <stop offset="42%" stopColor="#fff" stopOpacity="0.045" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <filter id="iris-glow" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="10" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="sclera-irritation-soften" x="-25%" y="-45%" width="150%" height="190%">
          <feGaussianBlur stdDeviation="13" />
        </filter>
      </defs>

      <ellipse className="eye-shadow" cx="321" cy="258" rx="286" ry="139" />

      <g clipPath="url(#eye-clip)" className="eye-surface">
        <rect className="sclera sclera--awakened" x="40" y="65" width="560" height="350" />
        <rect
          className={`sclera sclera--dormant${isDormant ? ' is-active' : ''}`}
          x="40"
          y="65"
          width="560"
          height="350"
        />
        <StrainedSclera visible={isAwakened} />

        <g className="iris" transform="translate(325 237) scale(.82)" filter={isAwakened ? 'url(#iris-glow)' : undefined}>
          <circle className="iris-aura" r="153" />
          <circle className={`iris-disc iris-disc--dormant${isDormant ? ' is-active' : ''}`} r="143" />
          <circle className={`iris-disc iris-disc--crimson${isAwakened && !isRinnegan ? ' is-active' : ''}`} r="143" />
          <circle className={`iris-disc iris-disc--rinnegan${isRinnegan ? ' is-active' : ''}`} r="143" />
          <circle className="iris-texture" r="132" />

          <g className={`ocular-pattern-layer ocular-pattern-layer--mangekyo${isMangekyo ? ' is-active is-forming' : ''}`}>
            <SasukeMangekyoFramework />
          </g>
          <g className={`ocular-pattern-layer ocular-pattern-layer--tomoe${isTomoe || isMangekyo ? ' is-active' : ''}${isMangekyo ? ' is-morphing' : ''}`}>
            <TomoePattern count={tomoeCount} morphing={isMangekyo} />
          </g>
          <g className={`ocular-pattern-layer ocular-pattern-layer--eternal${isEternal ? ' is-active is-unfolding' : ''}`}>
            <ItachiInheritedPattern />
          </g>
          <g className={`ocular-pattern-layer ocular-pattern-layer--rinnegan${isRinnegan ? ' is-active' : ''}`}>
            <RinneganPattern />
          </g>

          <circle
            className={`pupil${stage.kind === 'dormant' ? ' pupil--dormant' : ''}${isEternal ? ' pupil--hidden' : ''}`}
            r="22"
          />
          <ellipse
            className={`iris-glint${isMangekyo ? ' iris-glint--hidden' : ''}`}
            cx="-45"
            cy="-53"
            rx="13"
            ry="24"
          />
        </g>

        <path className="corneal-sheen" d="M 109 221 C 188 151 277 132 365 143 C 300 151 231 178 174 230 C 149 230 126 227 109 221 Z" />
        <path className="lid-shadow lid-shadow--top" d="M 34 239 C 111 126 222 94 333 104 C 449 114 542 171 607 237 C 520 179 432 142 328 135 C 223 129 129 166 49 246 Z" />
        <path className="lid-shadow lid-shadow--bottom" d="M 47 253 C 120 319 211 350 320 349 C 431 346 523 309 597 244 C 523 327 431 369 320 373 C 207 375 112 337 47 253 Z" />
      </g>

      <path className="lid-line" data-shape="eye-aperture" d="M 49 244 C 122 158 218 116 323 120 C 430 123 522 168 591 239" />
      <path className="lid-line lid-line--lower" d="M 49 244 C 120 314 211 347 320 345 C 430 341 522 306 591 239" />
      <path className="ink-stroke" d="M 36 236 C 113 133 220 96 332 107 C 449 118 541 173 605 237" />
      <path className="lid-crease lid-crease--top" d="M 96 176 C 170 111 266 88 357 105 C 436 119 498 152 548 190" />
      <path className="lid-crease lid-crease--lower" d="M 124 326 C 209 374 324 384 430 351" />
    </svg>
  );
}
