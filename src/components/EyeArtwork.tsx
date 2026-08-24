import type { EyeStage } from '../stages';

interface EyeArtworkProps {
  stage: EyeStage;
}

const TOMOE_ANGLES = [0, 120, 240];
const RINNEGAN_TOMOE_ANGLES = [0, 60, 120, 180, 240, 300];

function Tomoe({ angle, radius = 93 }: { angle: number; radius?: number }) {
  return (
    <g transform={`rotate(${angle}) translate(0 ${-radius})`} className="tomoe-mark">
      <circle cx="0" cy="0" r="13" />
      <path d="M -2 11 C 13 18 26 8 28 -8 C 21 -1 14 1 8 -2 Z" />
    </g>
  );
}

function TomoePattern({ count }: { count: 1 | 2 | 3 }) {
  return (
    <g className="tomoe-pattern">
      <circle className="iris-ring" r="91" />
      {TOMOE_ANGLES.slice(0, count).map((angle) => (
        <Tomoe key={angle} angle={angle} />
      ))}
    </g>
  );
}

function MangekyoPattern() {
  return (
    <g className="mangekyo-pattern">
      {[0, 120, 240].map((angle) => (
        <path
          key={angle}
          transform={`rotate(${angle})`}
          d="M 0 -128 C 14 -91 45 -64 88 -54 C 54 -44 31 -19 16 12 C 20 -39 1 -72 -34 -96 C -20 -103 -9 -113 0 -128 Z"
        />
      ))}
      <circle className="pattern-core" r="29" />
    </g>
  );
}

function EternalMangekyoPattern() {
  return (
    <g className="eternal-pattern">
      <circle className="outer-ring" r="116" />
      {[0, 60, 120, 180, 240, 300].map((angle) => (
        <path
          key={angle}
          transform={`rotate(${angle})`}
          d="M 0 -126 C 9 -93 25 -66 47 -43 C 24 -49 3 -45 -18 -29 C -10 -61 -17 -91 -38 -117 C -23 -110 -10 -113 0 -126 Z"
        />
      ))}
      <MangekyoPattern />
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
        {isAwakened && (
          <g className="eye-veins">
            <path d="M 73 202 C 119 207 140 225 178 241" />
            <path d="M 79 281 C 122 270 149 271 183 255" />
            <path d="M 566 190 C 522 204 491 220 462 240" />
            <path d="M 559 288 C 513 270 490 268 457 253" />
          </g>
        )}

        <g className="iris" transform="translate(320 240)" filter={isAwakened ? 'url(#iris-glow)' : undefined}>
          <circle className="iris-aura" r="153" />
          <circle className="iris-disc" r="143" />
          <circle className="iris-texture" r="132" />

          {stage.kind === 'tomoe' && <TomoePattern count={stage.tomoe} />}
          {stage.kind === 'mangekyo' && <MangekyoPattern />}
          {stage.kind === 'eternal-mangekyo' && <EternalMangekyoPattern />}
          {stage.kind === 'rinnegan' && <RinneganPattern />}

          <circle className="pupil" r={stage.kind === 'dormant' ? 47 : 22} />
          <ellipse className="iris-glint" cx="-45" cy="-53" rx="13" ry="24" />
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
