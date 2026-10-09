import React from 'react';

export function Chamber() {
  return (
    <main id="main">
      <div className="layout">

        <section className="chamber" aria-labelledby="chamber-title">
          <div className="chamber-header">
            <p className="eyebrow">Chamber I · Trapped ion</p>
            <h2 id="chamber-title">Quiet Chamber</h2>
            <p className="goal-copy">
              Restore Lumi by making her state and motion match the target.
            </p>
            <p className="pulse-limit">Solve using 4 pulses or fewer.</p>
          </div>

          {/*
            Puzzle state placeholder.
            React will eventually update these values and Lumi's motion class.
          */}
          <div className="stage">

            <figure className="state-card" id="particle-sprite">
              <p className="state-label">Lumi now</p>

              <div className="lumi-wrap">
                <div
                  className="lumi motion-0"
                  role="img"
                  aria-label="Lumi, the trapped ion, in her ground state and almost still"
                ></div>
              </div>

              <figcaption className="state-data">
                <span><span className="visually-hidden">State: </span>ground</span>
                <span>motion 0</span>
              </figcaption>
            </figure>

            <span className="match-arrow" aria-hidden="true">→</span>

            <figure className="state-card" id="target-sprite">
              <p className="state-label">Target</p>

              <div className="lumi-wrap">
                <div
                  className="lumi lumi-target"
                  role="img"
                  aria-label="Target: Lumi in her ground state with more motion"
                ></div>
              </div>

              <figcaption className="state-data">
                <span><span className="visually-hidden">State: </span>ground</span>
                <span>motion 2</span>
              </figcaption>
            </figure>

          </div>

          <div className="puzzle-area">

            <p className="section-label" id="sequence-label">Your light sequence</p>

            <ol className="track" aria-labelledby="sequence-label">
              <li className="slot is-empty"><span className="slot-well">Empty</span></li>
              <li className="slot is-empty"><span className="slot-well">Empty</span></li>
              <li className="slot is-empty"><span className="slot-well">Empty</span></li>
              <li className="slot is-empty"><span className="slot-well">Empty</span></li>
            </ol>

            <p className="section-label" id="pulses-label">Available pulses</p>

            <div className="palette" role="group" aria-labelledby="pulses-label">

              <button type="button" className="pulse pulse-carrier">
                <span className="pulse-name">Carrier</span>
                <span className="pulse-effect">State flip</span>
              </button>

              <button type="button" className="pulse pulse-blue">
                <span className="pulse-name">Blue pulse</span>
                <span className="pulse-effect">
                  Effect <span aria-hidden="true">?</span>
                  <span className="visually-hidden">not discovered yet</span>
                </span>
              </button>

              <button type="button" className="pulse pulse-red">
                <span className="pulse-name">Red pulse</span>
                <span className="pulse-effect">
                  Effect <span aria-hidden="true">?</span>
                  <span className="visually-hidden">not discovered yet</span>
                </span>
              </button>

            </div>

            <div className="run-row">
              <button type="button" className="run-btn">
                <span aria-hidden="true">{'▶︎'}</span> Run experiment
              </button>
              <button type="button" className="text-btn">Step</button>
              <button type="button" className="text-btn">Undo</button>
              <button type="button" className="text-btn">Clear</button>
            </div>

            <dl className="readout">
              <div>
                <dt>Result</dt>
                <dd><output id="result" aria-live="polite">Not run yet</output></dd>
              </div>

              <div>
                <dt>Chamber noise</dt>
                <dd id="noise" aria-live="polite">Quiet</dd>
              </div>

              {/* Third-party API placeholder: measurement randomness from qrandom.io */}
              <div>
                <dt>qrandom.io</dt>
                <dd id="qrandom" aria-live="polite">Not requested yet</dd>
              </div>
            </dl>

          </div>
        </section>

        <div className="side-stack">

          <section aria-labelledby="bit-title">
            <h3 id="bit-title">Bit</h3>

            <p id="hint" className="speech" aria-live="polite">
              Lumi responds only to light. Try each pulse once and watch
              what changes.
            </p>

            <p className="hint-label" id="hint-label">Need a hint?</p>

            <ul className="inline-list hint-links" aria-labelledby="hint-label">
              <li><button type="button" className="text-btn">What is motion?</button></li>
              <li><button type="button" className="text-btn">What am I matching?</button></li>
              <li><button type="button" className="text-btn">Why didn&apos;t that work?</button></li>
            </ul>
          </section>

          {/* WebSocket placeholder: live activity from other apprentices */}
          <aside className="together" aria-labelledby="players-title">
            <h3 id="players-title">Experimenting together</h3>

            <ul className="inline-list players" aria-label="Apprentices in this chamber">
              <li>Shania</li>
              <li>Ana</li>
            </ul>

            <p className="hint-label" id="activity-label">Recent activity</p>

            <ul className="feed" aria-labelledby="activity-label" aria-live="polite">
              <li>Ana entered the Quiet Chamber</li>
              <li>Shania added a blue pulse</li>
              <li>Ana cleared pulse 2</li>
            </ul>
          </aside>

        </div>
      </div>
    </main>
  );
}