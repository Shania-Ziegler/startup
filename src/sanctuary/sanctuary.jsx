import React from 'react';
import { Link } from 'react-router-dom';

export function Sanctuary() {
  return (
    <main id="main">

      <div className="page-heading">
        <p className="eyebrow">Your sanctuary</p>
        <h2>Five chambers have gone quiet.</h2>
        <p>
          Restore each quantum spirit to reopen the path through the sanctuary.
        </p>
      </div>

      <section className="panel map-panel" aria-labelledby="map-title">
        <div className="map-heading">
          <h3 id="map-title">Sanctuary map</h3>
          <p>1 of 5 chambers open</p>
        </div>

        <div className="sanctuary-map">
          <svg className="map-path" aria-hidden="true" focusable="false">
            <line x1="10%" y1="78" x2="30%" y2="238" />
            <line x1="30%" y1="238" x2="50%" y2="78" />
            <line x1="50%" y1="78" x2="70%" y2="238" />
            <line x1="70%" y1="238" x2="90%" y2="78" />
          </svg>

          <ol className="map-stops" aria-label="Path through the sanctuary">
            <li className="map-stop">
              <Link className="map-node is-open" to="/chamber">
                <span className="map-node-name">Quiet Chamber</span>
                <span className="map-node-kind">Trapped ion</span>
                <span className="status status-open">Open</span>
              </Link>
            </li>

            <li className="map-stop">
              <div className="map-node">
                <span className="map-node-name">Lantern Grove</span>
                <span className="map-node-kind">Neutral atoms</span>
                <span className="status">Locked</span>
              </div>
            </li>

            <li className="map-stop">
              <div className="map-node">
                <span className="map-node-name">Glass Halls</span>
                <span className="map-node-kind">Photons</span>
                <span className="status">Locked</span>
              </div>
            </li>

            <li className="map-stop">
              <div className="map-node">
                <span className="map-node-name">Frozen Spire</span>
                <span className="map-node-kind">Superconducting</span>
                <span className="status">Locked</span>
              </div>
            </li>

            <li className="map-stop">
              <div className="map-node">
                <span className="map-node-name">Lattice</span>
                <span className="map-node-kind">Silicon qubits</span>
                <span className="status">Locked</span>
              </div>
            </li>
          </ol>
        </div>
      </section>

      <div className="two-column">

        <section aria-labelledby="chambers-title">
          <h3 id="chambers-title">Chambers</h3>

          <ul className="chamber-list">

            <li>
              <Link to="/chamber">Quiet Chamber</Link>
              <span className="kind">Trapped ion</span>
              <span className="status status-open">Open</span>
            </li>

            <li>
              <span>Lantern Grove</span>
              <span className="kind">Neutral atoms</span>
              <span className="status">Locked</span>
            </li>

            <li>
              <span>Glass Halls</span>
              <span className="kind">Photons</span>
              <span className="status">Locked</span>
            </li>

            <li>
              <span>Frozen Spire</span>
              <span className="kind">Superconducting circuits</span>
              <span className="status">Locked</span>
            </li>

            <li>
              <span>Lattice</span>
              <span className="kind">Silicon spin qubits</span>
              <span className="status">Locked</span>
            </li>

          </ul>
        </section>

        {/* MongoDB data placeholder */}
        <section aria-labelledby="progress-title">
          <h3 id="progress-title">Restoration progress</h3>

          <p id="progress-label" className="progress-count">0 of 5 chambers restored</p>

          <meter id="progress" min="0" max="5" value="0" aria-labelledby="progress-label">
            0 of 5
          </meter>

          <table>
            <caption>Fewest pulses</caption>

            <thead>
              <tr>
                <th scope="col">Apprentice</th>
                <th scope="col">Chamber</th>
                <th scope="col">Pulses</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <th scope="row">Ana</th>
                <td>Quiet Chamber</td>
                <td>3</td>
              </tr>

              <tr>
                <th scope="row">Ben</th>
                <td>Quiet Chamber</td>
                <td>4</td>
              </tr>
            </tbody>
          </table>

        </section>
      </div>

    </main>
  );
}