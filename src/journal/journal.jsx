import React from 'react';

export function Journal() {
  return (
    <main id="main">

      <div className="page-heading">
        <p className="eyebrow">Apprentice journal</p>
        <h2>Field notes</h2>
      </div>

      {/*
        Entries are placeholders. React will unlock notes as the player
        experiments, e.g. carrier transition, red sideband, blue sideband.
      */}
      <div className="journal-grid">

        <section aria-labelledby="concepts-title">
          <h3 id="concepts-title">Concepts</h3>

          <dl className="journal-list">

            <div className="journal-entry">
              <dt>State</dt>
              <dd>
                A quantum system has an internal state. Pulses can change
                which state Lumi occupies.
              </dd>
              <dd className="note-source">
                <span className="note-source-label">Observed in</span>
                Quiet Chamber · Trapped ion
              </dd>
            </div>

            <div className="journal-entry">
              <dt>Measurement</dt>
              <dd>
                Measurement reveals an outcome from the quantum system.
                Repeated measurements do not always have to agree.
              </dd>
            </div>

            <div className="journal-entry is-locked">
              <dt>Motion</dt>
              <dd>Not encountered yet.</dd>
            </div>

            <div className="journal-entry is-locked">
              <dt>Noise</dt>
              <dd>Not encountered yet.</dd>
            </div>

          </dl>
        </section>

        <section aria-labelledby="hardware-title">
          <h3 id="hardware-title">Hardware</h3>

          <dl className="journal-list">

            <div className="journal-entry">
              <dt>Trapped ion</dt>
              <dd>
                A charged atom held by electric fields and controlled using
                carefully tuned laser light.
              </dd>
              <dd className="note-source">
                <span className="note-source-label">Observed in</span>
                Quiet Chamber
              </dd>
            </div>

            <div className="journal-entry is-locked">
              <dt>Neutral atoms</dt>
              <dd>Not encountered yet.</dd>
            </div>

            <div className="journal-entry is-locked">
              <dt>Photons</dt>
              <dd>Not encountered yet.</dd>
            </div>

            <div className="journal-entry is-locked">
              <dt>Superconducting circuits</dt>
              <dd>Not encountered yet.</dd>
            </div>

            <div className="journal-entry is-locked">
              <dt>Silicon spin qubits</dt>
              <dd>Not encountered yet.</dd>
            </div>

          </dl>
        </section>

      </div>

    </main>
  );
}