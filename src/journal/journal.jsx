import React from 'react';

import { CHAMBERS } from '../chamber/chambers';
import { loadProgress, levelsDone } from '../progress';

const CONCEPTS = [
  { term: 'State', body: 'Every qubit is in a state, ground or excited. Each chamber has a way to flip it.', unlock: 'carrier' },
  { term: 'Motion', body: 'A trapped ion can also move. Blue and red pulses add or remove motion one step at a time.', unlock: 'blue' },
  { term: 'Sideband cooling', body: 'Alternating blue and red pulses removes motion until the ion is still. Real ions are prepared this way.', unlock: 'red' },
  { term: 'Rydberg blockade', body: 'An excited atom stops its neighbours from being excited.', unlock: 'blockade' },
  { term: 'Superposition', body: 'A beam splitter sends one photon down both paths at once.', unlock: 'splitter' },
  { term: 'Interference', body: 'When the two paths meet again they add up or cancel. The phase decides which detector the photon reaches.', unlock: 'phase' },
  { term: 'Decoherence', body: 'A qubit drifts out of step over time. Waiting makes it worse.', unlock: 'wait' },
  { term: 'Spin echo', body: 'Flipping the drift partway through makes it cancel out by the end.', unlock: 'echo' },
  { term: 'Shuttling', body: 'Silicon qubits are moved between dots with voltage. A noisy dot can flip the spin.', unlock: 'right' },
];

export function Journal() {
  const [progress, setProgress] = React.useState(loadProgress);

  React.useEffect(() => {
    setProgress(loadProgress());
  }, []);

  const concepts = CONCEPTS.map((entry) => ({
    ...entry,
    unlocked: progress.discovered.includes(entry.unlock),
  }));

  const hardware = CHAMBERS.map((chamber, index) => {
    const previous = CHAMBERS[index - 1];
    const visited =
      index === 0 || levelsDone(progress, previous.id) >= previous.levels.length;

    return {
      term: chamber.kind,
      body: `Controlled with ${chamber.medium.toLowerCase()}. ${chamber.idea}`,
      source: chamber.name,
      unlocked: visited,
    };
  });

  const unlocked = [...concepts, ...hardware].filter((entry) => entry.unlocked).length;
  const total = concepts.length + hardware.length;

  return (
    <main id="main">

      <div className="page-heading">
        <h2>Journal</h2>
        <p>{unlocked} of {total} unlocked. Use new controls and open new chambers to unlock more.</p>
      </div>

      <div className="journal-grid">

        <section aria-labelledby="concepts-title">
          <h3 id="concepts-title">Concepts</h3>
          <dl className="journal-list">
            {concepts.map((entry) => <Entry key={entry.term} entry={entry} />)}
          </dl>
        </section>

        <section aria-labelledby="hardware-title">
          <h3 id="hardware-title">Hardware</h3>
          <dl className="journal-list">
            {hardware.map((entry) => <Entry key={entry.term} entry={entry} />)}
          </dl>
        </section>

      </div>

    </main>
  );
}

function Entry({ entry }) {
  if (!entry.unlocked) {
    return (
      <div className="journal-entry is-locked">
        <dt>{entry.term}</dt>
        <dd>Locked</dd>
      </div>
    );
  }

  return (
    <div className="journal-entry">
      <dt>{entry.term}</dt>
      <dd>{entry.body}</dd>
      {entry.source && (
        <dd className="note-source">
          <span className="note-source-label">Chamber</span>
          {entry.source}
        </dd>
      )}
    </div>
  );
}