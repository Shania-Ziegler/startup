import React from 'react';

export function About() {
  return (
    <main id="main">

      <article className="about" aria-labelledby="about-title">

        <p className="eyebrow">About the sanctuary</p>

        <p className="lead">
          You are an apprentice restoring a sanctuary of quantum spirits.
          Each chamber represents a different kind of quantum-computing
          hardware. Instead of moving the spirits directly, you experiment
          with the controls available to that physical system.
        </p>

        <p>
          In the Quiet Chamber, Lumi is a trapped ion. Laser pulses change
          internal state and motion. By experimenting with pulse
          sequences, you gradually discover what those controls mean.
        </p>

        <section className="hardware" aria-labelledby="hardware-title">
          <h3 id="hardware-title">Five chambers</h3>

          <dl className="hardware-list">
            <div>
              <dt>Trapped ions</dt>
              <dd className="chamber-name">Quiet Chamber</dd>
              <dd>Charged atoms suspended by electric fields and steered with lasers.</dd>
            </div>

            <div>
              <dt>Neutral atoms</dt>
              <dd className="chamber-name">Lantern Grove</dd>
              <dd>Arranged in neat rows by tightly focused beams.</dd>
            </div>

            <div>
              <dt>Photons</dt>
              <dd className="chamber-name">Glass Halls</dd>
              <dd>Particles of light routed through mirrors and splitters.</dd>
            </div>

            <div>
              <dt>Superconducting circuits</dt>
              <dd className="chamber-name">Frozen Spire</dd>
              <dd>Cooled near absolute zero so current flows without resistance.</dd>
            </div>

            <div>
              <dt>Silicon qubits</dt>
              <dd className="chamber-name">Lattice</dd>
              <dd>Electron spins in silicon, the material of ordinary chips.</dd>
            </div>
          </dl>
        </section>

      </article>

    </main>
  );
}