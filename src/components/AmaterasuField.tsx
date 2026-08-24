import type { CSSProperties } from 'react';

interface AmaterasuFieldProps {
  active: boolean;
}

const AMATERASU_FLAMES = [
  'M 93 319 C 48 293 25 254 32 210 C 37 178 29 143 14 111 C 50 127 70 156 68 190 C 67 216 77 226 94 207 C 110 188 112 161 108 134 C 139 165 141 207 121 239 C 105 264 103 290 116 315 Z',
  'M 142 239 C 116 210 112 174 126 144 C 138 119 139 91 132 65 C 163 87 176 116 168 145 C 163 165 169 178 182 169 C 195 160 203 139 203 116 C 220 146 216 181 194 203 C 180 217 176 232 180 247 Z',
  'M 221 191 C 203 167 201 138 214 113 C 225 91 226 67 219 45 C 248 66 258 93 250 119 C 245 136 251 146 264 135 C 275 126 281 108 281 87 C 298 114 292 144 272 163 C 258 176 254 188 258 201 Z',
  'M 286 175 C 276 149 281 123 297 102 C 311 84 319 57 317 27 C 342 54 348 83 336 108 C 328 124 331 137 345 129 C 359 121 369 102 374 80 C 382 113 371 142 347 158 C 331 169 325 181 327 195 Z',
  'M 367 190 C 356 161 361 133 379 111 C 394 93 401 68 400 42 C 425 67 431 96 420 121 C 413 138 418 149 432 139 C 445 130 454 111 458 90 C 469 121 460 151 438 170 C 423 182 419 195 422 207 Z',
  'M 439 208 C 426 179 430 149 449 126 C 464 107 471 80 468 55 C 496 80 503 109 491 136 C 483 154 489 165 503 154 C 517 144 526 123 528 101 C 542 134 534 166 510 186 C 495 199 490 213 494 227 Z',
  'M 500 249 C 482 220 485 185 504 159 C 520 137 524 107 517 79 C 549 104 560 137 548 168 C 540 188 548 200 563 187 C 577 175 585 151 584 127 C 605 160 601 198 576 224 C 560 241 556 258 562 275 Z',
  'M 552 315 C 529 283 532 246 553 218 C 570 195 576 165 570 135 C 604 160 616 194 603 226 C 595 247 603 259 619 245 C 634 232 642 207 641 182 C 663 217 659 256 633 282 C 616 300 611 318 618 336 Z',
] as const;

export function AmaterasuField({ active }: AmaterasuFieldProps) {
  return (
    <svg
      className={`amaterasu-field${active ? ' is-active' : ''}`}
      viewBox="0 0 656 480"
      preserveAspectRatio="xMidYMid meet"
      focusable="false"
      aria-hidden="true"
    >
      <defs>
        <filter id="amaterasu-edge-glow" x="-40%" y="-40%" width="180%" height="190%">
          <feDropShadow dx="0" dy="0" stdDeviation="5.5" floodColor="#8c0614" floodOpacity="0.72" />
        </filter>
      </defs>
      <g className="amaterasu-field__flames" filter="url(#amaterasu-edge-glow)">
        {AMATERASU_FLAMES.map((d, index) => (
          <path
            key={d}
            className="amaterasu-flame"
            data-shape="amaterasu-flame"
            d={d}
            style={{ '--flame-index': index } as CSSProperties}
          />
        ))}
      </g>
    </svg>
  );
}
