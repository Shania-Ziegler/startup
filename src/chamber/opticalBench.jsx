import React from 'react';
import { PARTS, emptyBench, simulate, fireShot } from './optics';
import { delay } from './delay';

const SHOT_BATCH = 20;
const SHOT_MS = 110;

const ICONS = {
  splitter: (
    <g>
      <rect x="7" y="7" width="18" height="18" rx="2" transform="rotate(45 16 16)" />
      <line x1="6" y1="16" x2="26" y2="16" strokeDasharray="3 3" />
    </g>
  ),
  mirror: (
    <g>
      <line x1="8" y1="24" x2="24" y2="8" strokeWidth="3.5" />
      <line x1="10" y1="27" x2="12" y2="25" />
      <line x1="14" y1="27" x2="18" y2="23" />
      <line x1="20" y1="25" x2="24" y2="21" />
    </g>
  ),
  phaseUpper: (
    <g>
      <rect x="11" y="4" width="10" height="13" rx="1.5" />
      <path d="M12 10.5 q2.5 -4 5 0 q2.5 4 5 0" transform="translate(-6 0)" />
      <line x1="16" y1="20" x2="16" y2="28" strokeDasharray="2 3" />
    </g>
  ),
  phaseLower: (
    <g>
      <rect x="11" y="15" width="10" height="13" rx="1.5" />
      <path d="M12 21.5 q2.5 -4 5 0 q2.5 4 5 0" transform="translate(-6 0)" />
      <line x1="16" y1="4" x2="16" y2="12" strokeDasharray="2 3" />
    </g>
  ),
};

function PartIcon({ id, size = 32 }) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} aria-hidden="true" className="qs-icon">
      {ICONS[id] || <circle cx="16" cy="16" r="8" />}
    </svg>
  );
}

const STYLES = `
.qs-bench { --rail: #7fd4ff; --warm: #ffd24d; }
.qs-stage { display: flex; align-items: stretch; gap: 0.35rem; margin: 0.75rem 0; }
.qs-end { display: flex; flex-direction: column; justify-content: space-around;
  min-width: 68px; font-size: 0.72rem; line-height: 1.2; opacity: 0.85; }
.qs-end-source { text-align: right; }
.qs-slots { display: flex; flex: 1; gap: 0.35rem; min-width: 0; }
.qs-slot { position: relative; flex: 1; min-width: 0; height: 104px; padding: 0;
  border: 1.5px dashed rgba(127, 212, 255, 0.35); border-radius: 10px;
  background: rgba(127, 212, 255, 0.04); color: inherit; cursor: grab;
  display: grid; place-items: center; transition: border-color .15s, background .15s, transform .15s; }
.qs-slot:focus-visible { outline: 2px solid var(--rail); outline-offset: 2px; }
.qs-slot.is-filled { border-style: solid; border-color: rgba(127, 212, 255, 0.7);
  background: rgba(127, 212, 255, 0.1); }
.qs-slot.is-over { border-color: var(--warm); background: rgba(255, 210, 77, 0.16);
  transform: translateY(-2px); }
.qs-slot.is-source { opacity: 0.4; }
.qs-slot:disabled { cursor: default; }
.qs-rail { position: absolute; left: -0.35rem; right: -0.35rem; height: 3px;
  border-radius: 2px; background: var(--rail); pointer-events: none; }
.qs-rail-upper { top: 30px; }
.qs-rail-lower { top: 71px; }
.qs-slot:first-child .qs-rail { left: 0; }
.qs-slot:last-child .qs-rail { right: 0; }
.qs-icon { stroke: currentColor; fill: none; stroke-width: 1.6;
  stroke-linecap: round; position: relative; z-index: 1; }
.qs-slot.is-filled .qs-icon { color: var(--rail); }
.qs-plus { font-size: 1.4rem; opacity: 0.4; position: relative; z-index: 1; }
.qs-slot-name { position: absolute; bottom: 4px; left: 0; right: 0; z-index: 1;
  font-size: 0.6rem; text-align: center; opacity: 0.7; }
.qs-detectors { display: flex; flex-direction: column; justify-content: space-around;
  min-width: 76px; gap: 0.3rem; }
.qs-detector { display: flex; align-items: baseline; gap: 0.35rem;
  padding: 0.2rem 0.45rem; border: 1.5px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px; font-size: 0.78rem; transition: border-color .12s, background .12s; }
.qs-detector.is-certain { border-color: var(--warm); }
.qs-detector.is-flash { background: var(--warm); color: #14161f; border-color: var(--warm); }
.qs-detector small { opacity: 0.75; font-size: 0.68rem; }
.qs-tray { display: flex; flex-wrap: wrap; gap: 0.4rem; padding: 0.5rem;
  border: 1.5px dashed transparent; border-radius: 10px; transition: border-color .15s, background .15s; }
.qs-tray.is-over { border-color: #ff8f8f; background: rgba(255, 143, 143, 0.1); }
.qs-part { display: flex; align-items: center; gap: 0.45rem; cursor: grab;
  padding: 0.4rem 0.6rem; border: 1.5px solid rgba(255, 255, 255, 0.18);
  border-radius: 10px; background: transparent; color: inherit; text-align: left; }
.qs-part:focus-visible { outline: 2px solid var(--rail); outline-offset: 2px; }
.qs-part.is-held { border-color: var(--rail); background: rgba(127, 212, 255, 0.1); }
.qs-part-text { display: flex; flex-direction: column; }
.qs-part-name { font-size: 0.78rem; }
.qs-part-note { font-size: 0.65rem; opacity: 0.7; }
@media (prefers-reduced-motion: no-preference) {
  .qs-firing .qs-rail { animation: qsSweep 0.5s linear infinite;
    background: linear-gradient(90deg, var(--rail) 0%, #fff 25%, var(--rail) 50%);
    background-size: 200% 100%; }
}
@keyframes qsSweep { from { background-position: 100% 0; } to { background-position: -100% 0; } }
`;

export function OpticalBench({ level, onSolved, onDiscover, onEdited, onBusyChange, bestParts }) {
  const [bench, setBench] = React.useState(emptyBench);
  const [held, setHeld] = React.useState('splitter');
  const [counts, setCounts] = React.useState({ A: 0, B: 0 });
  const [firing, setFiring] = React.useState(false);
  const [drag, setDrag] = React.useState(null);
  const [over, setOver] = React.useState(null);
  const [flash, setFlash] = React.useState(null);
  const [verdict, setVerdict] = React.useState('Drag a part onto the table, or click a part and then a slot.');
  const mounted = React.useRef(false);
  const firingNow = React.useRef(false);
  const runId = React.useRef(0);

  const physics = simulate(bench);
  const total = counts.A + counts.B;
  const partsUsed = bench.filter(Boolean).length;
  const required = Object.entries(level.requiredParts || {});

  const entering = React.useMemo(() => {
    const stages = [simulate([])];
    for (let i = 0; i < bench.length; i++) stages.push(simulate(bench.slice(0, i + 1)));
    return stages;
  }, [bench]);

  React.useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      runId.current += 1;
    };
  }, []);

  React.useEffect(() => {
    runId.current += 1;
    setCounts({ A: 0, B: 0 });
    setFlash(null);
    setVerdict('New goal. Set up the table, then fire.');
  }, [level]);

  function edited(message) {
    setCounts({ A: 0, B: 0 });
    setFlash(null);
    setVerdict(message);
    onEdited?.();
  }

  function discover(partId) {
    onDiscover(partId);
    if (partId.startsWith('phase')) onDiscover('phase');
  }

  function commit(next, message) {
    setBench(next);
    edited(message);
  }

  function placeAt(index, partId, from) {
    const next = [...bench];
    if (Number.isInteger(from)) {
      next[from] = bench[index];
      next[index] = partId;
      commit(next, `Moved ${PARTS[partId].name} to slot ${index + 1}.`);
      return;
    }
    next[index] = partId;
    commit(next, `Placed ${PARTS[partId].name} in slot ${index + 1}.`);
    discover(partId);
  }

  function removeAt(index) {
    const partId = bench[index];
    if (!partId) return;
    const next = [...bench];
    next[index] = null;
    commit(next, `Removed ${PARTS[partId].name} from slot ${index + 1}.`);
  }

  function slotClick(index) {
    if (firingNow.current) return;
    if (bench[index] === held) removeAt(index);
    else placeAt(index, held, null);
  }

  function clearBench() {
    if (firingNow.current) return;
    commit(emptyBench(), 'Table cleared.');
  }

  function startDrag(event, partId, from) {
    if (firingNow.current) return;
    setDrag({ partId, from });
    setHeld(partId);
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', partId);
  }

  function allowDrop(event, target) {
    if (!drag || firingNow.current) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
    setOver(target);
  }

  function dropOnSlot(event, index) {
    event.preventDefault();
    setOver(null);
    if (!drag || firingNow.current) return;
    if (drag.from === index) return;
    placeAt(index, drag.partId, drag.from);
    setDrag(null);
  }

  function dropOnTray(event) {
    event.preventDefault();
    setOver(null);
    if (!drag || firingNow.current) return;
    if (Number.isInteger(drag.from)) removeAt(drag.from);
    setDrag(null);
  }

  async function fire() {
    if (firingNow.current) return;
    const missing = required.find(([id, count]) => bench.filter((part) => part === id).length < count);
    if (missing) {
      const [id, count] = missing;
      setVerdict(`This level needs ${count} × ${PARTS[id]?.name || id}.`);
      return;
    }

    firingNow.current = true;
    setFiring(true);
    setFlash(null);
    const ticket = ++runId.current;
    const active = () => mounted.current && runId.current === ticket;

    try {
      onBusyChange?.(true);
      onEdited?.();
      setVerdict('Firing photons.');
      let tally = { A: 0, B: 0 };
      setCounts(tally);
      for (let i = 0; i < SHOT_BATCH; i++) {
        if (!active()) return;
        const hit = fireShot(physics.detectorA);
        tally = { ...tally, [hit]: tally[hit] + 1 };
        setCounts(tally);
        setFlash(hit);
        await delay(SHOT_MS);
      }
      if (!active()) return;
      setFlash(null);
      const shots = tally.A + tally.B;
      const shareA = tally.A / shots;
      if (level.check(shareA, physics, bench)) {
        onSolved(partsUsed);
        setVerdict(`Solved with ${partsUsed} parts. ${tally.A} hit A, ${tally.B} hit B.`);
      } else {
        setVerdict(level.miss(shareA));
      }
    } catch (error) {
      console.error('Firing failed:', error);
      if (mounted.current) setVerdict('Something went wrong. Try firing again.');
    } finally {
      firingNow.current = false;
      if (mounted.current) {
        setFiring(false);
        setFlash(null);
        onBusyChange?.(false);
      }
    }
  }

  return (
    <div className={`bench-area qs-bench${firing ? ' qs-firing' : ''}`}>
      <style>{STYLES}</style>

      <p className="section-label">Optical table</p>
      <p>
        Drag parts onto the slots. Drag a placed part to move it, or back to the tray to remove it.
        You can also click a part, then a slot.
      </p>
      {required.length > 0 && (
        <p>Needs: {required.map(([id, count]) => `${count} × ${PARTS[id]?.name || id}`).join(', ')}.</p>
      )}

      <div className="qs-stage" role="group" aria-label="Optical table">
        <div className="qs-end qs-end-source">
          <span>photon in<br />(upper path)</span>
          <span aria-hidden="true" />
        </div>

        <div className="qs-slots">
          {bench.map((part, index) => {
            const inbound = entering[index];
            return (
              <button
                key={index}
                type="button"
                draggable={!firing && Boolean(part)}
                className={[
                  'qs-slot',
                  part ? 'is-filled' : '',
                  over === index ? 'is-over' : '',
                  drag && drag.from === index ? 'is-source' : '',
                ].filter(Boolean).join(' ')}
                onClick={() => slotClick(index)}
                onDragStart={(event) => part && startDrag(event, part, index)}
                onDragEnd={() => { setDrag(null); setOver(null); }}
                onDragOver={(event) => allowDrop(event, index)}
                onDragLeave={() => setOver((value) => (value === index ? null : value))}
                onDrop={(event) => dropOnSlot(event, index)}
                disabled={firing}
                aria-label={part
                  ? `Slot ${index + 1}, ${PARTS[part].name}. Click to remove, or drag to move.`
                  : `Slot ${index + 1}, empty. Click to place the ${PARTS[held].name}.`}
              >
                <span className="qs-rail qs-rail-upper"
                  style={{ opacity: 0.18 + 0.82 * inbound.detectorA }} />
                <span className="qs-rail qs-rail-lower"
                  style={{ opacity: 0.18 + 0.82 * inbound.detectorB }} />
                {part ? <PartIcon id={part} /> : <span className="qs-plus" aria-hidden="true">+</span>}
                {part && <span className="qs-slot-name">{PARTS[part].name.split(',')[0]}</span>}
              </button>
            );
          })}
        </div>

        <div className="qs-detectors">
          {['A', 'B'].map((id) => {
            const probability = id === 'A' ? physics.detectorA : physics.detectorB;
            return (
              <span
                key={id}
                className={[
                  'qs-detector',
                  probability > 0.99 ? 'is-certain' : '',
                  flash === id ? 'is-flash' : '',
                ].filter(Boolean).join(' ')}
              >
                {id}<small>{Math.round(probability * 100)}%</small>
              </span>
            );
          })}
        </div>
      </div>

      <p>Percentages are the odds for each detector. Counts below are actual hits.</p>

      <p className="section-label">Parts tray</p>
      <div
        className={`qs-tray${over === 'tray' ? ' is-over' : ''}`}
        role="group"
        aria-label="Parts tray. Drop a placed part here to remove it."
        onDragOver={(event) => allowDrop(event, 'tray')}
        onDragLeave={() => setOver((value) => (value === 'tray' ? null : value))}
        onDrop={dropOnTray}
      >
        {Object.values(PARTS).map((part) => (
          <button
            key={part.id}
            type="button"
            draggable={!firing}
            className={`qs-part${held === part.id ? ' is-held' : ''}`}
            onClick={() => setHeld(part.id)}
            onDragStart={(event) => startDrag(event, part.id, null)}
            onDragEnd={() => { setDrag(null); setOver(null); }}
            aria-pressed={held === part.id}
            disabled={firing}
          >
            <PartIcon id={part.id} size={26} />
            <span className="qs-part-text">
              <span className="qs-part-name">{part.name}</span>
              <span className="qs-part-note">{part.note}</span>
            </span>
          </button>
        ))}
      </div>

      <div className="run-row">
        <button type="button" className="run-btn" onClick={fire} disabled={firing}>
          <span aria-hidden="true">▶︎</span> {firing ? 'Firing' : `Fire ${SHOT_BATCH} photons`}
        </button>
        <button type="button" className="text-btn" onClick={clearBench} disabled={firing || !partsUsed}>
          Clear table
        </button>
      </div>

      <div className="shot-counts" aria-label="Photon hits">
        {['A', 'B'].map((id) => (
          <div className="shot-row" key={id}>
            <span className="shot-label">Detector {id}</span>
            <span className="shot-bar">
              <span style={{ width: `${total ? (counts[id] / total) * 100 : 0}%` }} />
            </span>
            <span className="shot-value">{counts[id]}</span>
          </div>
        ))}
      </div>

      <dl className="readout">
        <div><dt>Result</dt><dd><output aria-live="polite">{verdict}</output></dd></div>
        <div><dt>Parts used</dt><dd>{partsUsed}{bestParts !== undefined ? ` · best ${bestParts} parts` : ''}</dd></div>
      </dl>
    </div>
  );
}