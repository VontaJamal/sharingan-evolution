import { useCallback, useEffect, useState, type PointerEvent } from 'react';
import { ChakraField } from './components/ChakraField';
import { EyeArtwork } from './components/EyeArtwork';
import { usePrefersReducedMotion } from './hooks/usePrefersReducedMotion';
import { SASUKE_STAGES } from './stages';

const LAST_STAGE_INDEX = SASUKE_STAGES.length - 1;

function App() {
  const [stageIndex, setStageIndex] = useState(0);
  const [furthestStage, setFurthestStage] = useState(0);
  const reducedMotion = usePrefersReducedMotion();
  const stage = SASUKE_STAGES[stageIndex];
  const isFinalStage = stageIndex === LAST_STAGE_INDEX;

  const selectStage = useCallback((nextIndex: number) => {
    setStageIndex(nextIndex);
    setFurthestStage((current) => Math.max(current, nextIndex));
  }, []);

  const advanceStage = useCallback(() => {
    if (isFinalStage) {
      setStageIndex(0);
      return;
    }
    selectStage(stageIndex + 1);
  }, [isFinalStage, selectStage, stageIndex]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return;

      const target = event.target;
      if (target instanceof HTMLElement && target.matches('button, a, input, textarea, select')) return;

      if (event.key === 'ArrowRight') {
        event.preventDefault();
        advanceStage();
      }

      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        selectStage(Math.max(0, stageIndex - 1));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [advanceStage, selectStage, stageIndex]);

  const handlePointerMove = (event: PointerEvent<HTMLElement>) => {
    if (reducedMotion) return;
    const x = (event.clientX / window.innerWidth - 0.5) * 2;
    const y = (event.clientY / window.innerHeight - 0.5) * 2;
    event.currentTarget.style.setProperty('--pointer-x', x.toFixed(3));
    event.currentTarget.style.setProperty('--pointer-y', y.toFixed(3));
  };

  return (
    <main
      className={`experience experience--${stage.kind}`}
      data-motion={reducedMotion ? 'reduced' : 'full'}
      data-stage={stage.id}
      onPointerMove={handlePointerMove}
    >
      <a className="skip-link" href="#evolution-controls">Skip to evolution controls</a>
      <ChakraField />
      <div className="ink-atmosphere" aria-hidden="true" />

      <header className="masthead">
        <div className="brand-lockup" aria-label="Sharingan Evolution">
          <span className="brand-mark" aria-hidden="true" />
          <span>Sharingan Evolution</span>
        </div>
        <button
          className="restart-button"
          type="button"
          onClick={() => setStageIndex(0)}
          disabled={stageIndex === 0}
        >
          Restart
          <span aria-hidden="true">↺</span>
        </button>
      </header>

      <section className="awakening" aria-labelledby="stage-name">
        <div className="stage-copy" key={`copy-${stage.id}`}>
          <p className="stage-kicker">
            <span>Form {String(stageIndex + 1).padStart(2, '0')}</span>
            <span aria-hidden="true">/</span>
            <span>{String(SASUKE_STAGES.length).padStart(2, '0')}</span>
          </p>
          <h1 id="stage-name" aria-live="polite">{stage.name}</h1>
          <p className="stage-distinction">{stage.distinction}</p>
        </div>

        <div className="eye-scene" data-eye-stage={stage.id}>
          <div key={`wave-${stage.id}`} className="pressure-ring" aria-hidden="true" />
          <button
            className="eye-trigger"
            type="button"
            onClick={advanceStage}
            aria-label={`${stage.cue}. Current form: ${stage.name}.`}
            aria-describedby="stage-lore interaction-hint"
          >
            <EyeArtwork stage={stage} />
          </button>
        </div>

        <div className="stage-narrative" key={`lore-${stage.id}`}>
          <p id="stage-lore">{stage.lore}</p>
          <p id="interaction-hint" className="interaction-hint">
            <span className="pulse-dot" aria-hidden="true" />
            {stage.cue}
            <span className="key-hint" aria-hidden="true">Enter ↵</span>
          </p>
        </div>
      </section>

      <nav id="evolution-controls" className="evolution-track" aria-label="Discovered eye stages">
        <div className="track-line" aria-hidden="true">
          <span style={{ width: `${(furthestStage / LAST_STAGE_INDEX) * 100}%` }} />
        </div>
        <ol>
          {SASUKE_STAGES.map((item, index) => {
            const isDiscovered = index <= furthestStage;
            return (
              <li key={item.id}>
                <button
                  type="button"
                  className={isDiscovered ? 'is-discovered' : undefined}
                  disabled={!isDiscovered}
                  aria-current={stageIndex === index ? 'step' : undefined}
                  aria-label={isDiscovered ? `View ${item.name}` : `Undiscovered form ${index + 1}`}
                  onClick={() => selectStage(index)}
                >
                  <span className="track-node" aria-hidden="true" />
                  <span className="track-label">{isDiscovered ? item.navName : 'Unknown'}</span>
                </button>
              </li>
            );
          })}
        </ol>
      </nav>

      <footer>
        <p>Unofficial fan project. Naruto and its characters belong to their respective rights holders.</p>
        <p className="keyboard-note">Arrow keys move between available forms.</p>
      </footer>
    </main>
  );
}

export default App;
