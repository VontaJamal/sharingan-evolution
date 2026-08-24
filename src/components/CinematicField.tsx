import { useEffect, useRef, useState } from 'react';
import { ChakraField } from './ChakraField';

interface CinematicFieldProps {
  accent: string;
  reducedMotion: boolean;
}

interface AccentController {
  setAccent: (accent: string) => void;
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

        const haloGeometry = new THREE.RingGeometry(1.72, 1.77, 128);
        const haloMaterial = new THREE.MeshBasicMaterial({
          blending: THREE.AdditiveBlending,
          color: new THREE.Color(accentRef.current),
          depthWrite: false,
          opacity: 0.1,
          side: THREE.DoubleSide,
          transparent: true,
        });
        const halo = new THREE.Mesh(haloGeometry, haloMaterial);
        halo.position.z = -0.8;
        halo.scale.set(1.58, 0.76, 1);
        field.add(halo);

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
          halo.rotation.z = elapsed * -0.045;
          halo.scale.x = 1.58 + Math.sin(elapsed * 0.62) * 0.025;
          halo.scale.y = 0.76 + Math.cos(elapsed * 0.62) * 0.012;

          particleMaterial.color.lerp(targetAccent, 0.045);
          haloMaterial.color.lerp(targetAccent, 0.045);
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
          haloGeometry.dispose();
          haloMaterial.dispose();
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
      <ChakraField />
      <canvas ref={canvasRef} className="cinematic-field__canvas" />
    </div>
  );
}
