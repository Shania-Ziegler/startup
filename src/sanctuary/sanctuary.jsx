import React from 'react';
import { Link } from 'react-router-dom';

import { CHAMBERS } from '../chamber/chambers';
import { loadProgress, levelsDone, resetProgress } from '../progress';

export function Sanctuary() {
  const [progress, setProgress] = React.useState(loadProgress);

  React.useEffect(() => {
    setProgress(loadProgress());
  }, []);

  const chambers = CHAMBERS.map((chamber, index) => {
    const done = levelsDone(progress, chamber.id);
    const restored = done >= chamber.levels.length;
    const previous = CHAMBERS[index - 1];
    const open = index === 0 || levelsDone(progress, previous.id) >= previous.levels.length;

    return { ...chamber, done, restored, open, status: restored ? 'Complete' : open ? 'Open' : 'Locked' };
  });

  const restoredCount = chambers.filter((c) => c.restored).length;
  const scores = Object.entries(progress.best);
  const userName = localStorage.getItem('userName') || 'You';

  return (
    <main id="main">

      <div className="page-heading">
        <h2>
          {restoredCount === CHAMBERS.length
            ? 'All chambers complete.'
            : `${restoredCount} of ${CHAMBERS.length} chambers complete.`}
        </h2>
        <p>Each chamber is a different kind of quantum hardware. Finish one to unlock the next.</p>
      </div>

      <section className="panel map-panel" aria-labelledby="map-title">
        <div className="map-heading">
          <h3 id="map-title">Map</h3>
          <p>{chambers.filter((c) => c.open).length} of {CHAMBERS.length} chambers open</p>
        </div>

        <div className="sanctuary-map">
          <svg className="map-path" aria-hidden="true" focusable="false">
            <line x1="10%" y1="78" x2="30%" y2="238" />
            <line x1="30%" y1="238" x2="50%" y2="78" />
            <line x1="50%" y1="78" x2="70%" y2="238" />
            <line x1="70%" y1="238" x2="90%" y2="78" />
          </svg>

          <ol className="map-stops" aria-label="Chambers in order">
            {chambers.map((chamber) => (
              <li className="map-stop" key={chamber.id}>
                {chamber.open ? (
                  <Link className="map-node is-open" to={`/chamber/${chamber.id}`}>
                    <span className="map-node-name">{chamber.name}</span>
                    <span className="map-node-kind">{chamber.kind}</span>
                    <span className="status status-open">{chamber.status}</span>
                  </Link>
                ) : (
                  <div className="map-node">
                    <span className="map-node-name">{chamber.name}</span>
                    <span className="map-node-kind">{chamber.kind}</span>
                    <span className="status">{chamber.status}</span>
                  </div>
                )}
              </li>
            ))}
          </ol>
        </div>
      </section>

      <div className="two-column">

        <section aria-labelledby="chambers-title">
          <h3 id="chambers-title">Chambers</h3>

          <ul className="chamber-list">
            {chambers.map((chamber) => (
              <li key={chamber.id}>
                {chamber.open ? (
                  <Link to={`/chamber/${chamber.id}`}>{chamber.name}</Link>
                ) : (
                  <span>{chamber.name}</span>
                )}
                <span className="kind">{chamber.kind}</span>
                <span className={`status${chamber.open ? ' status-open' : ''}`}>
                  {chamber.open ? `${chamber.done} of ${chamber.levels.length}` : 'Locked'}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="progress-title">
          <h3 id="progress-title">Progress</h3>

          <p id="progress-label" className="progress-count">
            {restoredCount} of {CHAMBERS.length} chambers complete
          </p>

          <meter id="progress" min="0" max={CHAMBERS.length} value={restoredCount} aria-labelledby="progress-label">
            {restoredCount} of {CHAMBERS.length}
          </meter>

          <table>
            <caption>Best scores</caption>
            <thead>
              <tr>
                <th scope="col">Player</th>
                <th scope="col">Level</th>
                <th scope="col">Steps</th>
              </tr>
            </thead>
            <tbody>
              {scores.length === 0 ? (
                <tr>
                  <td colSpan="3">Solve a level to set a score.</td>
                </tr>
              ) : (
                scores.map(([scoreKey, used]) => {
                  const [chamberId, index] = scoreKey.split('-');
                  const chamber = CHAMBERS.find((c) => c.id === chamberId);
                  const level = chamber && chamber.levels[Number(index)];
                  return (
                    <tr key={scoreKey}>
                      <th scope="row">{userName}</th>
                      <td>{level ? level.title : scoreKey}</td>
                      <td>{used}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>

          {scores.length > 0 && (
            <p>
              <button
                type="button"
                className="text-btn"
                onClick={() => setProgress(resetProgress())}
              >
                Reset progress
              </button>
            </p>
          )}
        </section>
      </div>

    </main>
  );
}