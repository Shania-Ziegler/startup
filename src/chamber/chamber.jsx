import React from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';

import { useLookAtPointer } from './useLookAtPointer';
import { Players } from './players';
import { ChamberNotifier } from './chamberNotifier';
import { SpiritView } from './spiritView';
import { OpticalBench } from './opticalBench';
import { delay } from './delay';
import { CHAMBERS, getChamber, statesMatch, describeMismatch } from './chambers';
import { loadProgress, levelsDone, recordLevel, recordDiscovery } from '../progress';
import { useUser } from '../user';

const STYLES = `
.qs-readout { display: grid; gap: 0.15rem; margin: 0.5rem 0 0; text-align: left; }
.qs-readout-row { display: flex; justify-content: space-between; gap: 0.6rem;
  font-size: 0.78rem; line-height: 1.5; }
.qs-readout-key { opacity: 0.65; }
.qs-readout-val { font-weight: 600; }
`;

export function Chamber() {
  const { chamberId } = useParams();
  const chamber = getChamber(chamberId);

  if (!chamber) {
    return (
      <main id="main">
        <h2>Chamber not found.</h2>
        <Link to="/map">Back to the map</Link>
      </main>
    );
  }

  return <ChamberSession key={chamber.id} chamber={chamber} />;
}

function StateReadout({ chamber, state, isTarget }) {
  return (
    <div className="qs-readout">
      {chamber.fields.map(({ key, label, format }) => {
        const value = state ? state[key] : undefined;
        const blank = value === null || value === undefined;
        return (
          <div className="qs-readout-row" key={key}>
            <span className="qs-readout-key">{label}</span>
            <span className="qs-readout-val">
              {blank ? (isTarget ? 'any' : '—') : format(value)}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function ChamberSession({ chamber }) {
  const { userName } = useUser();
  const navigate = useNavigate();
  const lumiRef = useLookAtPointer();
  const [progress, setProgress] = React.useState(loadProgress);
  const [levelIndex, setLevelIndex] = React.useState(() =>
    Math.min(levelsDone(progress, chamber.id), chamber.levels.length - 1)
  );
  const level = chamber.levels[levelIndex];
  const [sequence, setSequence] = React.useState([]);
  const [current, setCurrent] = React.useState(() => level.start || null);
  const [playing, setPlaying] = React.useState(-1);
  const [running, setRunning] = React.useState(false);
  const [benchRunning, setBenchRunning] = React.useState(false);
  const [result, setResult] = React.useState('Not run yet');
  const [solved, setSolved] = React.useState(false);
  const [hint, setHint] = React.useState(() => level.hint);
  const busy = React.useRef(false);
  const mounted = React.useRef(false);
  const runId = React.useRef(0);
  const isBusy = running || benchRunning;

  React.useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      runId.current += 1;
    };
  }, []);

  React.useEffect(() => {
    ChamberNotifier.announce(userName || 'You', `entered the ${chamber.name}`);
  }, [chamber, userName]);

  const unlockedLevels = Math.min(levelsDone(progress, chamber.id) + 1, chamber.levels.length);
  const best = progress.best[`${chamber.id}-${levelIndex}`];
  const chamberIndex = CHAMBERS.findIndex((c) => c.id === chamber.id);
  const nextChamber = CHAMBERS[chamberIndex + 1];
  const chamberComplete = levelsDone(progress, chamber.id) >= chamber.levels.length;
  const full = sequence.length >= (level.slots || 0);

  function openLevel(index) {
    const available = Math.min(levelsDone(progress, chamber.id) + 1, chamber.levels.length);
    if (busy.current || index < 0 || index >= available) return;
    runId.current += 1;
    setLevelIndex(index);
    setSequence([]);
    setCurrent(chamber.levels[index].start || null);
    setPlaying(-1);
    setResult('Not run yet');
    setSolved(false);
    setHint(chamber.levels[index].hint);
  }

  function markSolved(used) {
    const updated = recordLevel(chamber.id, levelIndex, used);
    setProgress(updated);
    setSolved(true);
    setHint(levelIndex + 1 < chamber.levels.length
      ? 'Solved. Next level unlocked.'
      : `${chamber.name} complete.`);
    ChamberNotifier.announce(userName || 'You', `solved ${level.title}`);
  }

  function resetAttempt() {
    setCurrent(level.start || null);
    setPlaying(-1);
    setResult('Not run yet');
    setSolved(false);
    setHint(level.hint);
  }

  function addControl(controlId) {
    if (busy.current || full) return;
    setSequence((previous) => [...previous, controlId]);
    resetAttempt();
  }

  function undo() {
    if (busy.current) return;
    setSequence((previous) => previous.slice(0, -1));
    resetAttempt();
  }

  function clear() {
    if (busy.current) return;
    setSequence([]);
    resetAttempt();
  }

  async function run() {
    if (busy.current || sequence.length === 0) return;
    busy.current = true;
    setRunning(true);
    setSolved(false);
    setResult('Running');
    const ticket = ++runId.current;
    const active = () => mounted.current && runId.current === ticket;
    let state = level.start;
    let failure = null;
    setCurrent(state);

    try {
      for (let i = 0; i < sequence.length; i++) {
        setPlaying(i);
        await delay(600);
        if (!active()) return;
        const outcome = chamber.apply(state, sequence[i]);
        state = outcome.state;
        setCurrent(state);
        setProgress(recordDiscovery(sequence[i]));
        if (!outcome.ok && failure === null) failure = { step: i + 1, why: outcome.why };
      }

      setPlaying(-1);
      await delay(300);
      if (!active()) return;

      if (statesMatch(chamber, state, level.target)) {
        setResult(`Solved in ${sequence.length} ${sequence.length === 1 ? 'step' : 'steps'}.`);
        markSolved(sequence.length);
        return;
      }

      const mismatch = describeMismatch(chamber, state, level.target);
      if (failure) {
        setResult(`Step ${failure.step} did nothing: ${failure.why}.`);
        setHint(mismatch ? `${mismatch}.` : level.hint);
      } else {
        setResult(`Not solved. ${mismatch}.`);
        setHint(level.hint);
      }
    } catch (error) {
      console.error('Run failed:', error);
      if (mounted.current) {
        setResult('Something went wrong. Clear the sequence and try again.');
        setHint(level.hint);
      }
    } finally {
      busy.current = false;
      if (mounted.current) {
        setPlaying(-1);
        setRunning(false);
      }
    }
  }

  return (
    <main id="main">
      <style>{STYLES}</style>
      <div className="layout">

        <section className="chamber" aria-labelledby="chamber-title">
          <div className="chamber-header">
            <p><Link to="/map">← Map</Link></p>
            <p className="eyebrow">Chamber {chamberIndex + 1} · {chamber.kind}</p>
            <h2 id="chamber-title">{chamber.name}</h2>
            <p className="goal-copy">{level.brief}</p>
            {chamber.layout !== 'bench' && (
              <p className="pulse-limit">
                Up to {level.slots} steps. Used {sequence.length}.
                {best !== undefined ? ` Best ${best}.` : ''}
              </p>
            )}
          </div>

          <ul className="level-tabs" aria-label="Levels">
            {chamber.levels.map((item, index) => {
              const locked = index >= unlockedLevels;
              return (
                <li key={item.title}>
                  <button
                    type="button"
                    className={`text-btn${index === levelIndex ? ' is-current' : ''}`}
                    onClick={() => openLevel(index)}
                    disabled={locked || isBusy}
                    aria-current={index === levelIndex ? 'true' : undefined}
                  >
                    {index + 1}. {locked ? 'Locked' : item.title}
                  </button>
                </li>
              );
            })}
          </ul>

          {chamber.layout === 'bench' ? (
            <OpticalBench
              level={level}
              bestParts={best}
              onDiscover={(partId) => setProgress(recordDiscovery(partId))}
              onSolved={markSolved}
              onEdited={() => setSolved(false)}
              onBusyChange={(value) => {
                busy.current = value;
                setBenchRunning(value);
              }}
            />
          ) : (
            <>
              <div className="stage">
                <figure className="state-card" id="particle-sprite">
                  <p className="state-label">{chamber.spirit} now</p>
                  <div className={`lumi-wrap${solved ? ' is-solved' : ''}`}>
                    <SpiritView chamber={chamber} state={current} lumiRef={lumiRef} />
                  </div>
                  <figcaption>
                    <StateReadout chamber={chamber} state={current} />
                  </figcaption>
                </figure>

                <span className="match-arrow" aria-hidden="true">→</span>

                <figure className="state-card" id="target-sprite">
                  <p className="state-label">Target</p>
                  <div className="lumi-wrap">
                    <SpiritView chamber={chamber} state={level.target} ghost />
                  </div>
                  <figcaption>
                    <StateReadout chamber={chamber} state={level.target} isTarget />
                  </figcaption>
                </figure>
              </div>

              <div className="puzzle-area">
                <p className="section-label" id="sequence-label">Your sequence</p>

                <ol className="track" aria-labelledby="sequence-label">
                  {Array.from({ length: level.slots }).map((_, index) => {
                    const controlId = sequence[index];
                    const control = chamber.controls.find((c) => c.id === controlId);
                    const classes = [
                      'slot',
                      control ? 'is-filled' : 'is-empty',
                      playing === index ? 'is-playing' : '',
                    ].filter(Boolean).join(' ');

                    return (
                      <li key={index} className={classes}>
                        <span className="slot-well">{control ? control.name : 'Empty'}</span>
                      </li>
                    );
                  })}
                </ol>

                <p className="section-label" id="controls-label">{chamber.medium}</p>

                <div className="palette" role="group" aria-labelledby="controls-label">
                  {chamber.controls.map((control) => {
                    const known = progress.discovered.includes(control.id);
                    return (
                      <button
                        key={control.id}
                        type="button"
                        className={`pulse pulse-${control.id}`}
                        onClick={() => addControl(control.id)}
                        disabled={running || full}
                      >
                        <span className="pulse-name">{control.name}</span>
                        <span className="pulse-effect">
                          {known ? control.effect : (
                            <>
                              Effect <span aria-hidden="true">?</span>
                              <span className="visually-hidden">unknown until you run it</span>
                            </>
                          )}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="run-row">
                  <button
                    type="button"
                    className="run-btn"
                    onClick={run}
                    disabled={running || sequence.length === 0}
                  >
                    <span aria-hidden="true">{'▶︎'}</span> {running ? 'Running' : 'Run'}
                  </button>
                  <button
                    type="button"
                    className="text-btn"
                    onClick={undo}
                    disabled={running || !sequence.length}
                  >
                    Undo
                  </button>
                  <button type="button" className="text-btn" onClick={clear} disabled={running || !sequence.length}>
                    Clear
                  </button>
                </div>

                <dl className="readout">
                  <div>
                    <dt>Result</dt>
                    <dd><output id="result" aria-live="polite">{result}</output></dd>
                  </div>
                  <div>
                    <dt>Idea</dt>
                    <dd>{chamber.idea}</dd>
                  </div>
                </dl>
              </div>
            </>
          )}

          {solved && !isBusy && (
            <div className="run-row">
              {levelIndex + 1 < chamber.levels.length && (
                <button type="button" className="text-btn" onClick={() => openLevel(levelIndex + 1)}>
                  Next level
                </button>
              )}
              {!nextChamber && levelIndex === chamber.levels.length - 1 && (
                <Link className="text-btn" to="/map">Back to the map</Link>
              )}
              {chamberComplete && nextChamber && (
                <button type="button" className="text-btn" onClick={() => navigate(`/chamber/${nextChamber.id}`)}>
                  Next chamber: {nextChamber.name}
                </button>
              )}
            </div>
          )}
        </section>

        <div className="side-stack">
          <section aria-labelledby="bit-title">
            <h3 id="bit-title">Bit</h3>
            <p id="hint" className="speech" aria-live="polite">{hint}</p>
            <p className="hint-label" id="hint-label">Need a hint?</p>
            <ul className="inline-list hint-links" aria-labelledby="hint-label">
              <li>
                <button type="button" className="text-btn" onClick={() => setHint(level.hint)}>
                  How does this work?
                </button>
              </li>
              <li>
                <button type="button" className="text-btn" onClick={() => setHint(level.brief)}>
                  What is the goal?
                </button>
              </li>
              <li>
                <button type="button" className="text-btn" onClick={() => setHint(chamber.idea)}>
                  What does this chamber teach?
                </button>
              </li>
            </ul>
          </section>

          <Players />
        </div>
      </div>
    </main>
  );
}
