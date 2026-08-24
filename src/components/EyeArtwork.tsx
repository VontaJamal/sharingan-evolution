import type { EyeStage } from '../stages';

interface EyeArtworkProps {
  stage: EyeStage;
}

const TOMOE_ANGLES = {
  1: [0],
  2: [0, 180],
  3: [0, 120, 240],
} as const;
const RINNEGAN_TOMOE_ANGLES = [0, 60, 120, 180, 240, 300];
const MANGEKYO_PETAL_ANGLES = [0, 60, 120, 180, 240, 300];
const MANGEKYO_LENS_ANGLES = [0, 120, 240];

function Tomoe({ angle, radius = 93 }: { angle: number; radius?: number }) {
  return (
    <g
      transform={`rotate(${angle}) translate(0 ${-radius})`}
      className="tomoe-mark"
      data-angle={angle}
    >
      <g className="tomoe-glyph">
        <circle cx="0" cy="0" r="14" />
        <path d="M -3 12 C 14 20 30 7 32 -12 C 23 -3 15 0 8 -4 C 9 3 5 9 -3 12 Z" />
      </g>
    </g>
  );
}

function TomoePattern({ count }: { count: 1 | 2 | 3 }) {
  return (
    <g className="tomoe-pattern">
      <circle className="iris-ring" r="91" />
      {TOMOE_ANGLES[count].map((angle) => (
        <Tomoe key={angle} angle={angle} />
      ))}
    </g>
  );
}

function SasukeMangekyoFramework() {
  return (
    <g className="sasuke-mangekyo-framework">
      <circle className="mangekyo-void" r="132" />

      <g className="sasuke-mangekyo-petals">
        {MANGEKYO_PETAL_ANGLES.map((angle) => (
          <path
            key={angle}
            className="sasuke-mangekyo-petal"
            data-shape="sasuke-mangekyo-petal"
            transform={`rotate(${angle})`}
            d="M 0 -132 C -23 -108 -42 -71 -43 -38 C -25 -31 -11 -21 0 -7 C 11 -21 25 -31 43 -38 C 42 -71 23 -108 0 -132 Z"
          />
        ))}
      </g>

      <g className="sasuke-mangekyo-lenses">
        {MANGEKYO_LENS_ANGLES.map((angle) => (
          <path
            key={angle}
            data-shape="sasuke-mangekyo-lens"
            transform={`rotate(${angle})`}
            d="M 47 0 C 47 61 24 112 0 136 C -24 112 -47 61 -47 0 C -47 -61 -24 -112 0 -136 C 24 -112 47 -61 47 0 Z"
          />
        ))}
      </g>
    </g>
  );
}

function ItachiInheritedPattern() {
  return (
    <g className="itachi-inherited-pattern">
      {MANGEKYO_LENS_ANGLES.map((angle) => (
        <path
          key={angle}
          className="itachi-inherited-blade"
          data-shape="itachi-inherited-blade"
          transform={`rotate(${angle})`}
          d="M -18 7 C -15 39 -10 82 0 112 C 10 82 15 39 18 7 L 0 -7 Z"
        />
      ))}
      <circle className="eternal-core" r="22" />
    </g>
  );
}

function RinneganPattern() {
  return (
    <g className="rinnegan-pattern">
      {[38, 73, 108, 143].map((radius) => (
        <circle key={radius} r={radius} />
      ))}
      {RINNEGAN_TOMOE_ANGLES.map((angle) => (
        <Tomoe key={angle} angle={angle} radius={92} />
      ))}
    </g>
  );
}

export function EyeArtwork({ stage }: EyeArtworkProps) {
  const isAwakened = stage.kind !== 'dormant';
  const isTomoe = stage.kind === 'tomoe';
  const isMangekyo = stage.kind === 'mangekyo' || stage.kind === 'eternal-mangekyo';
  const isEternal = stage.kind === 'eternal-mangekyo';
  const isRinnegan = stage.kind === 'rinnegan';
  const tomoeCount = isTomoe ? stage.tomoe : 3;

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
          <path d="M 55 242 C 132 120 230 80 320 80 C 423 80 519 129 585 242 C 503 354 413 400 320 400 C 217 400 125 353 55 242 Z" />
        </clipPath>
        <radialGradient id="sclera-light" cx="50%" cy="50%" r="58%">
          <stop offset="0%" stopColor="#f0e8e2" />
          <stop offset="70%" stopColor="#b9a9a5" />
          <stop offset="100%" stopColor="#35282b" />
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
        <filter id="iris-glow" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="10" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <ellipse className="eye-shadow" cx="320" cy="260" rx="278" ry="172" />

      <g clipPath="url(#eye-clip)" className="eye-surface">
        <rect className="sclera" x="40" y="65" width="560" height="350" />
        <g className={`eye-veins${isAwakened ? ' is-visible' : ''}`}>
          <path d="M 73 202 C 119 207 140 225 178 241" />
          <path d="M 79 281 C 122 270 149 271 183 255" />
          <path d="M 566 190 C 522 204 491 220 462 240" />
          <path d="M 559 288 C 513 270 490 268 457 253" />
        </g>

        <g className="iris" transform="translate(320 240)" filter={isAwakened ? 'url(#iris-glow)' : undefined}>
          <circle className="iris-aura" r="153" />
          <circle className="iris-disc" r="143" />
          <circle className="iris-texture" r="132" />

          <g className={`ocular-pattern-layer ocular-pattern-layer--tomoe${isTomoe ? ' is-active' : ''}`}>
            <TomoePattern count={tomoeCount} />
          </g>
          <g className={`ocular-pattern-layer ocular-pattern-layer--mangekyo${isMangekyo ? ' is-active' : ''}`}>
            <SasukeMangekyoFramework />
          </g>
          <g className={`ocular-pattern-layer ocular-pattern-layer--eternal${isEternal ? ' is-active' : ''}`}>
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

        <path className="lid-shadow lid-shadow--top" d="M 35 232 C 140 66 251 41 325 52 C 451 61 542 145 607 234 C 508 137 417 105 320 106 C 210 106 128 156 35 232 Z" />
        <path className="lid-shadow lid-shadow--bottom" d="M 37 252 C 135 363 224 410 320 414 C 425 414 518 358 606 248 C 516 334 416 373 319 371 C 215 369 132 332 37 252 Z" />
      </g>

      <path className="lid-line" d="M 55 242 C 132 120 230 80 320 80 C 423 80 519 129 585 242" />
      <path className="lid-line lid-line--lower" d="M 55 242 C 125 353 217 400 320 400 C 413 400 503 354 585 242" />
      <path className="ink-stroke" d="M 35 229 C 118 107 229 57 331 65 C 442 71 529 137 606 236" />
    </svg>
  );
}
