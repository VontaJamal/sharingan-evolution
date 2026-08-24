import { useEffect, useRef, useState } from 'react';
import { ChakraField } from './ChakraField';

interface CinematicFieldProps {
  accent: string;
  reducedMotion: boolean;
}

interface AccentController {
  setAccent: (accent: string) => void;
}

const FAN_RIBS = [
  'M 320 468 L 95 305',
  'M 320 468 L 116 220',
  'M 320 468 L 175 125',
  'M 320 468 L 245 75',
  'M 320 468 L 320 52',
  'M 320 468 L 395 75',
  'M 320 468 L 465 125',
  'M 320 468 L 524 220',
  'M 320 468 L 545 305',
] as const;

function ClanFanBackdrop() {
  return (
    <svg
      className="clan-fan-backdrop"
      viewBox="0 0 640 760"
      preserveAspectRatio="xMidYMid meet"
      focusable="false"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="clan-fan-red" x1="18%" y1="8%" x2="82%" y2="92%">
          <stop offset="0%" stopColor="#ee2635" />
          <stop offset="52%" stopColor="#a70e1b" />
          <stop offset="100%" stopColor="#3f050c" />
        </linearGradient>
        <linearGradient id="clan-fan-bone" x1="22%" y1="12%" x2="80%" y2="88%">
          <stop offset="0%" stopColor="#d8ceca" />
          <stop offset="100%" stopColor="#4a3d40" />
        </linearGradient>
        <filter id="clan-fan-ink" x="-30%" y="-25%" width="160%" height="165%">
          <feGaussianBlur stdDeviation="18" />
        </filter>
      </defs>

      <path
        className="clan-fan-backdrop__shadow"
        d="M 320 32 C 169 32 55 154 55 305 C 55 420 126 513 235 548 L 254 703 C 258 733 283 750 320 750 C 357 750 382 733 386 703 L 405 548 C 514 513 585 420 585 305 C 585 154 471 32 320 32 Z"
      />
      <path
        className="clan-fan-backdrop__handle"
        data-shape="clan-fan-handle"
        d="M 287 433 L 353 433 L 378 694 C 381 716 365 731 344 731 L 296 731 C 275 731 259 716 262 694 Z"
      />
      <path
        className="clan-fan-backdrop__lower"
        d="M 80 305 C 92 408 165 486 263 514 L 279 576 L 361 576 L 377 514 C 475 486 548 408 560 305 Z"
      />
      <path
        className="clan-fan-backdrop__canopy"
        data-shape="clan-fan-canopy"
        d="M 80 305 C 80 164 186 52 320 52 C 454 52 560 164 560 305 Z"
      />
      <g className="clan-fan-backdrop__ribs">
        {FAN_RIBS.map((d) => (
          <path key={d} className="clan-fan-backdrop__rib" d={d} />
        ))}
      </g>
      <path className="clan-fan-backdrop__seam" d="M 80 305 C 202 326 438 326 560 305" />
      <circle className="clan-fan-backdrop__pin" cx="320" cy="468" r="13" />
    </svg>
  );
}

function seededRandom(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

export function CinematicField({ accent, reducedMotion }: CinematicFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const accentRef = useRef(accent);
  const controllerRef = useRef<AccentController | null>(null);
  const [webglReady, setWebglReady] = useState(false);

  useEffect(() => {
    accentRef.current = accent;
    controllerRef.current?.setAccent(accent);
  }, [accent]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (reducedMotion || !canvas || !('WebGL2RenderingContext' in window)) {
      setWebglReady(false);
      return;
    }

    let cancelled = false;
    let cleanup = () => undefined;

    void import('three')
      .then((THREE) => {
        if (cancelled) return;

        const renderer = new THREE.WebGLRenderer({
          alpha: true,
          antialias: false,
          canvas,
          powerPreference: 'low-power',
        });
        renderer.setClearAlpha(0);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.35));

        const scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0x050506, 0.11);

        const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 30);
        camera.position.z = 7;

        const field = new THREE.Group();
        scene.add(field);

        const random = seededRandom(0x5a5a6e);
        const particleCount = 84;
        const positions = new Float32Array(particleCount * 3);

        for (let index = 0; index < particleCount; index += 1) {
          positions[index * 3] = (random() - 0.5) * 13;
          positions[index * 3 + 1] = (random() - 0.5) * 7.2;
          positions[index * 3 + 2] = random() * 5 - 3.2;
        }

        const particleGeometry = new THREE.BufferGeometry();
        particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        const particleMaterial = new THREE.PointsMaterial({
          blending: THREE.AdditiveBlending,
          color: new THREE.Color(accentRef.current),
          depthWrite: false,
          opacity: 0.5,
          size: 0.045,
          sizeAttenuation: true,
          transparent: true,
        });
        const particles = new THREE.Points(particleGeometry, particleMaterial);
        field.add(particles);

        const targetAccent = new THREE.Color(accentRef.current);
        const pointerTarget = new THREE.Vector2();
        const resize = () => {
          const width = canvas.clientWidth;
          const height = canvas.clientHeight;
          if (width === 0 || height === 0) return;
          renderer.setSize(width, height, false);
          camera.aspect = width / height;
          camera.updateProjectionMatrix();
        };
        const handlePointerMove = (event: PointerEvent) => {
          pointerTarget.set(
            (event.clientX / window.innerWidth - 0.5) * 0.44,
            (event.clientY / window.innerHeight - 0.5) * -0.28,
          );
        };

        const resizeObserver = new ResizeObserver(resize);
        resizeObserver.observe(canvas);
        window.addEventListener('pointermove', handlePointerMove, { passive: true });
        window.addEventListener('resize', resize, { passive: true });
        resize();

        let previousFrame = 0;
        renderer.setAnimationLoop((time) => {
          if (time - previousFrame < 1000 / 30) return;
          previousFrame = time;

          const elapsed = time * 0.001;
          camera.position.x += (pointerTarget.x - camera.position.x) * 0.035;
          camera.position.y += (pointerTarget.y - camera.position.y) * 0.035;
          camera.lookAt(0, 0, 0);

          particles.rotation.z = elapsed * 0.018;
          particles.rotation.y = Math.sin(elapsed * 0.18) * 0.08;
          particleMaterial.color.lerp(targetAccent, 0.022);
          renderer.render(scene, camera);
        });

        controllerRef.current = {
          setAccent(nextAccent) {
            targetAccent.set(nextAccent);
          },
        };
        setWebglReady(true);

        cleanup = () => {
          renderer.setAnimationLoop(null);
          resizeObserver.disconnect();
          window.removeEventListener('pointermove', handlePointerMove);
          window.removeEventListener('resize', resize);
          particleGeometry.dispose();
          particleMaterial.dispose();
          renderer.dispose();
          controllerRef.current = null;
        };
      })
      .catch(() => {
        if (!cancelled) setWebglReady(false);
      });

    return () => {
      cancelled = true;
      cleanup();
    };
  }, [reducedMotion]);

  return (
    <div
      className={`cinematic-field${webglReady ? ' is-webgl-ready' : ''}`}
      data-webgl={webglReady ? 'active' : 'fallback'}
      aria-hidden="true"
    >
      <ClanFanBackdrop />
      <ChakraField />
      <canvas ref={canvasRef} className="cinematic-field__canvas" />
    </div>
  );
}
