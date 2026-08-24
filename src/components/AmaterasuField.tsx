import { useEffect, useRef } from 'react';

interface AmaterasuFieldProps {
  active: boolean;
  reducedMotion: boolean;
}

interface FlameParticle {
  age: number;
  baseX: number;
  baseY: number;
  curl: number;
  drift: number;
  height: number;
  life: number;
  phase: number;
  rise: number;
  width: number;
}

const FIELD_WIDTH = 656;
const FIELD_HEIGHT = 480;
const MAX_PARTICLES = 92;

function seededRandom(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

function lidHeightAt(x: number, width: number, height: number) {
  const distanceFromCenter = Math.abs(x / width - 0.5) * 2;
  return height * (0.35 + 0.28 * Math.pow(distanceFromCenter, 1.55));
}

function createParticle(width: number, height: number, random: () => number): FlameParticle {
  const baseX = width * (0.07 + random() * 0.86);

  return {
    age: 0,
    baseX,
    baseY: lidHeightAt(baseX, width, height),
    curl: random() * 2 - 1,
    drift: (random() - 0.5) * width * 0.1,
    height: height * (0.12 + random() * 0.11),
    life: 900 + random() * 850,
    phase: random() * Math.PI * 2,
    rise: height * (0.045 + random() * 0.07),
    width: width * (0.03 + random() * 0.035),
  };
}

function traceFlame(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  sway: number,
  curl: number,
) {
  const tipX = x + sway;
  const tipY = y - height;
  const bend = curl * width;

  context.beginPath();
  context.moveTo(x - width * 0.64, y);
  context.bezierCurveTo(
    x - width * 0.92,
    y - height * 0.15,
    x - width * 0.14 + bend,
    y - height * 0.28,
    x - width * 0.42 + bend,
    y - height * 0.43,
  );
  context.bezierCurveTo(
    x - width * 0.66 + bend,
    y - height * 0.57,
    tipX - width * 0.17,
    tipY + height * 0.22,
    tipX,
    tipY,
  );
  context.bezierCurveTo(
    tipX + width * 0.08,
    tipY + height * 0.14,
    x + width * 0.28 + bend,
    y - height * 0.57,
    x + width * 0.08 + bend,
    y - height * 0.46,
  );
  context.bezierCurveTo(
    x - width * 0.08 + bend,
    y - height * 0.34,
    x + width * 0.92,
    y - height * 0.2,
    x + width * 0.64,
    y,
  );
  context.bezierCurveTo(
    x + width * 0.25,
    y - height * 0.08,
    x - width * 0.28,
    y - height * 0.08,
    x - width * 0.64,
    y,
  );
  context.closePath();
}

function drawFlame(
  context: CanvasRenderingContext2D,
  particle: FlameParticle,
  time: number,
) {
  const progress = particle.age / particle.life;
  const fadeIn = Math.min(1, progress / 0.14);
  const fadeOut = Math.min(1, (1 - progress) / 0.34);
  const alpha = Math.max(0, Math.min(fadeIn, fadeOut));
  const flicker = 0.88 + Math.sin(time * 0.009 + particle.phase) * 0.12;
  const currentX = particle.baseX
    + particle.drift * progress
    + Math.sin(time * 0.0055 + particle.phase) * particle.width * 0.36;
  const currentY = particle.baseY - particle.rise * (particle.age / 1000);
  const flameHeight = particle.height * flicker * (1 - progress * 0.28);
  const flameWidth = particle.width * (0.82 + Math.sin(time * 0.011 + particle.phase) * 0.18);
  const turbulence = Math.sin(time * 0.0067 + particle.phase)
    + Math.sin(time * 0.011 + particle.phase * 1.7) * 0.38;
  const sway = turbulence * flameWidth * 0.68;
  const curl = particle.curl + Math.sin(time * 0.0043 + particle.phase) * 0.38;

  context.save();
  context.globalAlpha = alpha;
  context.shadowColor = 'rgba(139, 0, 17, 0.82)';
  context.shadowBlur = 22;
  traceFlame(
    context,
    currentX,
    currentY,
    flameWidth * 1.2,
    flameHeight * 1.04,
    sway * 1.08,
    curl,
  );
  context.fillStyle = 'rgba(154, 3, 24, 0.4)';
  context.fill();

  context.shadowBlur = 0;
  traceFlame(
    context,
    currentX,
    currentY + 1,
    flameWidth * 0.88,
    flameHeight * 0.95,
    sway,
    curl,
  );
  context.fillStyle = 'rgba(0, 0, 2, 0.98)';
  context.fill();

  if (Math.abs(particle.curl) > 0.34 && progress < 0.72) {
    const branchDirection = Math.sign(particle.curl);
    const branchX = currentX + flameWidth * branchDirection * 0.42;
    const branchY = currentY - flameHeight * 0.1;
    traceFlame(
      context,
      branchX,
      branchY,
      flameWidth * 0.48,
      flameHeight * 0.52,
      -sway * 0.32,
      -curl * 0.7,
    );
    context.fillStyle = 'rgba(1, 0, 3, 0.94)';
    context.fill();
  }

  if (progress > 0.44) {
    const emberAlpha = alpha * Math.min(1, (progress - 0.44) * 4);
    const emberX = currentX + sway * 1.2;
    const emberY = currentY - flameHeight * 1.08;
    context.globalAlpha = emberAlpha * 0.72;
    context.beginPath();
    context.ellipse(emberX, emberY, 1.1, 2.2, particle.phase, 0, Math.PI * 2);
    context.fillStyle = '#050105';
    context.shadowColor = 'rgba(196, 9, 34, 0.8)';
    context.shadowBlur = 7;
    context.fill();
  }
  context.restore();
}

function drawField(
  context: CanvasRenderingContext2D,
  particles: FlameParticle[],
  width: number,
  height: number,
  time: number,
) {
  context.clearRect(0, 0, width, height);
  particles
    .slice()
    .sort((first, second) => first.height - second.height)
    .forEach((particle) => drawFlame(context, particle, time));
}

export function AmaterasuField({ active, reducedMotion }: AmaterasuFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || typeof CanvasRenderingContext2D === 'undefined') return;

    const context = canvas.getContext('2d');
    if (!context) return;

    let fieldWidth = FIELD_WIDTH;
    let fieldHeight = FIELD_HEIGHT;
    let animationFrame = 0;
    let frameCount = 0;
    let previousTime = performance.now();
    let spawnAccumulator = 0;
    let particles: FlameParticle[] = [];
    const random = seededRandom(0xa6a7e2a5);

    const populate = () => {
      particles = Array.from({ length: reducedMotion ? 58 : 52 }, () => {
        const particle = createParticle(fieldWidth, fieldHeight, random);
        particle.age = particle.life * (0.08 + random() * 0.62);
        return particle;
      });
    };

    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      if (bounds.width === 0) return;

      const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
      fieldWidth = bounds.width;
      fieldHeight = fieldWidth * (FIELD_HEIGHT / FIELD_WIDTH);
      canvas.width = Math.round(fieldWidth * pixelRatio);
      canvas.height = Math.round(fieldHeight * pixelRatio);
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      populate();
    };

    const resizeObserver = typeof ResizeObserver === 'undefined'
      ? null
      : new ResizeObserver(resize);
    resizeObserver?.observe(canvas);
    resize();

    if (!active) {
      context.clearRect(0, 0, fieldWidth, fieldHeight);
      canvas.dataset.frame = '0';
      return () => resizeObserver?.disconnect();
    }

    if (particles.length === 0) populate();

    if (reducedMotion) {
      drawField(context, particles, fieldWidth, fieldHeight, 640);
      canvas.dataset.frame = '1';
      return () => resizeObserver?.disconnect();
    }

    const render = (time: number) => {
      animationFrame = requestAnimationFrame(render);
      const elapsed = Math.min(48, time - previousTime);
      if (elapsed < 1000 / 45) return;

      previousTime = time;
      spawnAccumulator += elapsed * 0.072;
      particles.forEach((particle) => {
        particle.age += elapsed;
      });
      particles = particles.filter((particle) => particle.age < particle.life);

      while (spawnAccumulator >= 1 && particles.length < MAX_PARTICLES) {
        particles.push(createParticle(fieldWidth, fieldHeight, random));
        spawnAccumulator -= 1;
      }

      drawField(context, particles, fieldWidth, fieldHeight, time);
      frameCount += 1;
      canvas.dataset.frame = String(frameCount);
    };

    animationFrame = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrame);
      resizeObserver?.disconnect();
    };
  }, [active, reducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      className={`amaterasu-field${active ? ' is-active' : ''}`}
      data-animation={active ? (reducedMotion ? 'reduced' : 'active') : 'idle'}
      data-frame="0"
      width={FIELD_WIDTH}
      height={FIELD_HEIGHT}
      aria-hidden="true"
    />
  );
}
