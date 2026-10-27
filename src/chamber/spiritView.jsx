import React from 'react';

import { LanternView } from './lanternView';

export function SpiritView({ chamber, state, ghost, lumiRef }) {
  if (!state) return null;
  if (chamber.id === 'lantern') return <LanternView state={state} ghost={ghost} />;

  if (chamber.id === 'quiet') {
    return (
      <div
        ref={lumiRef}
        className={`lumi motion-${Math.min(state.n ?? 0, 3)}${ghost ? ' lumi-target' : ''}`}
        role="img"
        aria-label={ghost ? 'Target ion' : 'Lumi, the trapped ion'}
      />
    );
  }

  if (chamber.id === 'glass') {
    return (
      <div className="beam-box" role="img" aria-label={ghost ? 'Target path' : 'Zip, the photon'}>
        <span className={`beam-line${state.split || state.path === 0 ? ' is-lit' : ''}`} />
        <span className={`beam-line${state.split || state.path === 1 ? ' is-lit' : ''}`} />
        {state.phase ? <span className="beam-phase" aria-hidden="true" /> : null}
      </div>
    );
  }

  if (chamber.id === 'spire') {
    return (
      <div
        className={`frost${state.q ? ' is-excited' : ''}`}
        style={{ '--drift': state.drift }}
        role="img"
        aria-label={ghost ? 'Target state' : 'Frost, the circuit'}
      />
    );
  }

  return (
    <div className="dot-row" role="img" aria-label={ghost ? 'Target dot' : 'Pip, the electron'}>
      {[0, 1, 2].map((dot) => (
        <span key={dot} className={`dot${dot === 1 ? ' is-noisy' : ''}`}>
          {state.pos === dot ? (
            <span className={`pip${state.spin ? ' is-up' : ''}`} />
          ) : null}
        </span>
      ))}
    </div>
  );
}