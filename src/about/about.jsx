import React from 'react';

export function About() {
  return (
    <main id="main">

      <article className="about" aria-labelledby="about-title">

        <p className="eyebrow">About</p>

        <p className="lead">
          Quantum Sanctuary is a puzzle game about how quantum computers are
          built. Each chamber is a different kind of quantum hardware, and you
          solve it with that hardware's real controls.
        </p>

        <p>
          In the Quiet Chamber, Lumi is a trapped ion. Laser pulses change her
          state and motion. Try different pulse sequences to learn what each
          one does.
        </p>

        <section className="hardware" aria-labelledby="hardware-title">
          <h3 id="hardware-title">Five chambers</h3>

          <dl className="hardware-list">
            <div>
              <dt>Trapped ions</dt>
              <dd className="chamber-name">Quiet Chamber</dd>
              <dd>Charged atoms held in place by electric fields and controlled with lasers.</dd>
            </div>

            <div>
              <dt>Neutral atoms</dt>
              <dd className="chamber-name">Lantern Grove</dd>
              <dd>Atoms held in a row by focused laser beams.</dd>
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