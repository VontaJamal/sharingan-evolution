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
const RINNEGAN_TOMOE_ANGLES = [0, 60, 120, 180, 240, 300];
const MANGEKYO_PETAL_ANGLES = [0, 60, 120, 180, 240, 300];
const MANGEKYO_LENS_ANGLES = [0, 120, 240];

function Tomoe({
  angle,
  radius = 93,
  slot,
  visible = true,
}: {
  angle: number;
  radius?: number;
  slot?: number;
  visible?: boolean;
}) {
  const orbitStyle = {
    '--tomoe-angle': `${angle}deg`,
    '--tomoe-offset': `${-radius}px`,
  } as CSSProperties;

  return (
    <g
      className={`tomoe-mark${visible ? ' is-visible' : ''}`}
      data-angle={angle}
      data-tomoe-slot={slot}
      style={orbitStyle}
    >
      <g className="tomoe-glyph">
        <circle cx="0" cy="0" r="14" />
        <path d="M -3 12 C 14 20 30 7 32 -12 C 23 -3 15 0 8 -4 C 9 3 5 9 -3 12 Z" />
      </g>
    </g>
  );
}

function TomoePattern({ count }: { count: 0 | 1 | 2 | 3 }) {
  return (
    <g className="tomoe-pattern">
      <circle className="iris-ring" r="91" />
      {TOMOE_ANGLES[count].map((angle, slot) => (
        <Tomoe key={slot} angle={angle} slot={slot} visible={slot < count} />
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
        <g className={`eye-veins${isAwakened ? ' is-visible' : ''}`}>
          <path d="M 73 202 C 119 207 140 225 178 241" />
          <path d="M 79 281 C 122 270 149 271 183 255" />
          <path d="M 566 190 C 522 204 491 220 462 240" />
          <path d="M 559 288 C 513 270 490 268 457 253" />
        </g>

        <g className="iris" transform="translate(325 237) scale(.82)" filter={isAwakened ? 'url(#iris-glow)' : undefined}>
          <circle className="iris-aura" r="153" />
          <circle className={`iris-disc iris-disc--dormant${isDormant ? ' is-active' : ''}`} r="143" />
          <circle className={`iris-disc iris-disc--crimson${isAwakened && !isRinnegan ? ' is-active' : ''}`} r="143" />
          <circle className={`iris-disc iris-disc--rinnegan${isRinnegan ? ' is-active' : ''}`} r="143" />
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
