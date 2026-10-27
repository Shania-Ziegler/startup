import React from 'react';

const FIRST_X = 50;
const SPACING = 70;
const ROW_Y = 95;
const BLOCKADE_R = 55;

export function LanternView({ state, ghost }) {
  const atoms = Array.isArray(state?.atoms) ? state.atoms : [0, 0, 0];
  const beam = state?.beam;
  const hasBeam = Number.isInteger(beam) && beam >= 0 && beam < atoms.length;
  const xOf = (index) => FIRST_X + index * SPACING;

  // An atom is blocked when a neighbour is already excited. Same rule the
  // blockade pulse uses, so the halo shows the player why a pulse skipped it.
  const blocked = atoms.map(
    (value, index) => value === 0 && (atoms[index - 1] === 1 || atoms[index + 1] === 1)
  );

  const spoken = atoms
    .map((value, index) => {
      if (value === 1) return `atom ${index + 1} excited`;
      if (blocked[index]) return `atom ${index + 1} blocked by a neighbour`;
      return `atom ${index + 1} ground`;
    })
    .join(', ');

  return (
    <svg
      viewBox="0 0 240 140"
      className="lantern-view"
      role="img"
      aria-label={ghost ? `Target: ${spoken}` : `${spoken}${hasBeam ? `. Tweezer on atom ${beam + 1}` : ''}`}
      style={{ width: '100%', height: 'auto', opacity: ghost ? 0.55 : 1 }}
    >
      <style>{`
        .lg-site { fill: none; stroke: currentColor; stroke-width: 1.2;
          stroke-dasharray: 3 4; opacity: 0.35; }
        .lg-halo { fill: #ffd87a; opacity: 0.16; }
        .lg-halo-edge { fill: none; stroke: #ffc84d; stroke-width: 1;
          stroke-dasharray: 4 5; opacity: 0.5; }
        .lg-atom-ground { fill: #5c6b8a; }
        .lg-atom-excited { fill: #ffd24d; }
        .lg-atom-blocked { fill: #3f4760; }
        .lg-glow { fill: #ffd24d; opacity: 0.3; }
        .lg-bar { stroke: #8d95ad; stroke-width: 2; stroke-linecap: round; }
        .lg-tweezer { stroke: #7fd4ff; stroke-width: 2; stroke-linecap: round; fill: none; }
        .lg-tweezer-cone { fill: #7fd4ff; opacity: 0.18; }
        .lg-label { fill: currentColor; font-size: 9px; opacity: 0.6;
          text-anchor: middle; font-family: inherit; }
        @media (prefers-reduced-motion: no-preference) {
          .lg-pulse { animation: lgPulse 2.4s ease-in-out infinite; }
        }
        @keyframes lgPulse { 0%, 100% { opacity: 0.3; } 50% { opacity: 0.55; } }
      `}</style>

      {atoms.map((value, index) =>
        value === 1 ? (
          <g key={`halo-${index}`}>
            <circle className="lg-halo" cx={xOf(index)} cy={ROW_Y} r={BLOCKADE_R} />
            <circle className="lg-halo-edge" cx={xOf(index)} cy={ROW_Y} r={BLOCKADE_R} />
          </g>
        ) : null
      )}

      {atoms.map((value, index) => (
        <circle key={`site-${index}`} className="lg-site" cx={xOf(index)} cy={ROW_Y} r={17} />
      ))}

      {atoms.map((value, index) => (
        <g key={`atom-${index}`}>
          {value === 1 && (
            <circle className="lg-glow lg-pulse" cx={xOf(index)} cy={ROW_Y} r={18} />
          )}
          <circle
            className={
              value === 1 ? 'lg-atom-excited' : blocked[index] ? 'lg-atom-blocked' : 'lg-atom-ground'
            }
            cx={xOf(index)}
            cy={ROW_Y}
            r={value === 1 ? 11 : 8}
          />
          {blocked[index] && (
            <line
              className="lg-bar"
              x1={xOf(index) - 10}
              y1={ROW_Y + 10}
              x2={xOf(index) + 10}
              y2={ROW_Y - 10}
            />
          )}
          <text className="lg-label" x={xOf(index)} y={ROW_Y + 32}>
            {value === 1 ? 'excited' : blocked[index] ? 'blocked' : 'ground'}
          </text>
        </g>
      ))}

      {!ghost && hasBeam && (
        <g className="lg-tweezer-group">
          <polygon
            className="lg-tweezer-cone"
            points={`${xOf(beam) - 13},18 ${xOf(beam) + 13},18 ${xOf(beam) + 5},${ROW_Y - 20} ${xOf(beam) - 5},${ROW_Y - 20}`}
          />
          <path
            className="lg-tweezer"
            d={`M${xOf(beam) - 13} 18 L${xOf(beam) - 5} ${ROW_Y - 20}
                M${xOf(beam) + 13} 18 L${xOf(beam) + 5} ${ROW_Y - 20}`}
          />
          <line className="lg-tweezer" x1={xOf(beam) - 16} y1={14} x2={xOf(beam) + 16} y2={14} />
          <text className="lg-label" x={xOf(beam)} y={9}>
            tweezer
          </text>
        </g>
      )}
    </svg>
  );
}