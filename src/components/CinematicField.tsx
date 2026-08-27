import { useEffect, useRef, useState } from 'react';
import { ChakraField } from './ChakraField';

interface CinematicFieldProps {
  accent: string;
  reducedMotion: boolean;
}

interface AccentController {
  setAccent: (accent: string) => void;
}

function ClanFanBackdrop() {
  return (
    <svg
      className="clan-fan-backdrop"
      data-composition="peripheral"
      viewBox="0 0 440 640"
      preserveAspectRatio="xMidYMid meet"
      focusable="false"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="clan-fan-red" cx="36%" cy="22%" r="82%">
          <stop offset="0%" stopColor="#f52e3c" />
          <stop offset="48%" stopColor="#9f0c19" />
          <stop offset="100%" stopColor="#310309" />
        </radialGradient>
        <linearGradient id="clan-fan-bone" x1="20%" y1="8%" x2="76%" y2="94%">
          <stop offset="0%" stopColor="#c9bdbc" />
          <stop offset="58%" stopColor="#6e5d61" />
          <stop offset="100%" stopColor="#24181b" />
        </linearGradient>
        <filter id="clan-fan-ink" x="-30%" y="-25%" width="160%" height="165%">
          <feGaussianBlur stdDeviation="15" />
        </filter>
      </defs>

      <path
        className="clan-fan-backdrop__shadow"
        d="M 220 21 C 103 21 29 117 29 267 C 29 352 84 416 157 441 L 143 576 C 138 620 170 638 220 638 C 270 638 302 620 297 576 L 283 441 C 356 416 411 352 411 267 C 411 117 337 21 220 21 Z"
      />
      <path
        className="clan-fan-backdrop__handle"
        data-shape="clan-fan-handle"
        d="M 176 371 L 264 371 L 284 579 C 288 612 264 626 220 626 C 176 626 152 612 156 579 Z"
      />
      <path
        className="clan-fan-backdrop__guard"
        data-shape="clan-fan-guard"
        d="M 48 267 C 63 350 117 398 180 414 C 194 418 206 421 220 421 C 234 421 246 418 260 414 C 323 398 377 350 392 267 Z"
      />
      <path
        className="clan-fan-backdrop__crown"
        data-shape="clan-fan-crown"
        d="M 48 267 C 48 125 119 42 220 42 C 321 42 392 125 392 267 Z"
      />
      <path className="clan-fan-backdrop__seam" d="M 48 267 C 137 284 303 284 392 267" />
      <path className="clan-fan-backdrop__spine" d="M 220 421 L 220 613" />
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
