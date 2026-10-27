const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

const signed = (v) => (v > 0 ? `+${v}` : String(v));

const excitedList = (v) => {
  const on = v.map((atom, index) => (atom ? index + 1 : 0)).filter(Boolean);
  if (!on.length) return 'none excited';
  if (on.length === 1) return `${on[0]} excited`;
  return `${on.slice(0, -1).join(', ')} and ${on[on.length - 1]} excited`;
};

export const CHAMBERS = [
  {
    id: 'quiet',
    name: 'Quiet Chamber',
    kind: 'Trapped ion',
    spirit: 'Lumi',
    medium: 'Laser light',
    idea: 'Blue and red pulses always change the state and the motion together.',
    controls: [
      { id: 'carrier', name: 'Carrier', effect: 'Flips the state. Motion stays the same' },
      { id: 'blue', name: 'Blue pulse', effect: 'From ground: excite, +1 motion. From excited: to ground, −1 motion' },
      { id: 'red', name: 'Red pulse', effect: 'From ground: excite, −1 motion. From excited: to ground, +1 motion' },
    ],
    fields: [
      { key: 'q', label: 'State', format: (v) => (v ? 'excited' : 'ground') },
      { key: 'n', label: 'Motion', format: String },
    ],
    apply(state, control) {
      const { q, n } = state;
      if (control === 'carrier') return { state: { q: 1 - q, n }, ok: true };
      if (control === 'blue') {
        if (q === 0) return { state: { q: 1, n: n + 1 }, ok: true };
        if (n === 0) return { state, ok: false, why: 'no motion left to remove' };
        return { state: { q: 0, n: n - 1 }, ok: true };
      }
      if (q === 0) {
        if (n === 0) return { state, ok: false, why: 'no motion left to remove' };
        return { state: { q: 1, n: n - 1 }, ok: true };
      }
      return { state: { q: 0, n: n + 1 }, ok: true };
    },
    levels: [
      {
        title: 'Give her motion',
        brief: 'Lumi is still, in the ground state. Get her to motion 2, back in the ground state.',
        start: { q: 0, n: 0 },
        target: { q: 0, n: 2 },
        slots: 4,
        hint: 'Blue from ground adds 1 motion. Red from excited adds 1 more and brings her back to ground.',
      },
      {
        title: 'Take it back',
        brief: 'She is in the ground state with motion 2. Get her to motion 0, excited.',
        start: { q: 0, n: 2 },
        target: { q: 1, n: 0 },
        slots: 4,
        hint: 'Red removes motion from ground. Blue removes motion from excited. Carrier flips the state only.',
      },
      {
        title: 'Cool her down',
        brief: 'Get her all the way back: ground state, motion 0.',
        start: { q: 1, n: 2 },
        target: { q: 0, n: 0 },
        slots: 6,
        hint: 'Alternate Blue and Red. Blue removes motion when she is excited, Red when she is in ground.',
      },
    ],
  },

  {
    id: 'lantern',
    name: 'Lantern Grove',
    kind: 'Neutral atoms',
    spirit: 'The Flickers',
    medium: 'Optical tweezers',
    idea: 'The tweezer flips one atom at a time. An excited atom blocks its neighbours.',
    controls: [
      { id: 'move', name: 'Move tweezer', effect: 'Moves the tweezer to the next atom' },
      { id: 'excite', name: 'Excite', effect: 'Flips the atom under the tweezer' },
      { id: 'blockade', name: 'Blockade pulse', effect: 'Excites every atom with no excited neighbour' },
    ],
    fields: [
      { key: 'atoms', label: 'Atoms', format: excitedList },
      { key: 'beam', label: 'Tweezer on', format: (v) => `atom ${v + 1}` },
    ],
    apply(state, control) {
      const atoms = [...state.atoms];
      if (control === 'move') {
        return { state: { atoms, beam: (state.beam + 1) % atoms.length }, ok: true };
      }
      if (control === 'excite') {
        atoms[state.beam] = atoms[state.beam] ? 0 : 1;
        return { state: { atoms, beam: state.beam }, ok: true };
      }
      const next = [];
      for (let i = 0; i < atoms.length; i++) {
        const left = i > 0 ? next[i - 1] : 0;
        const right = i < atoms.length - 1 ? atoms[i + 1] : 0;
        next.push(left === 0 && right === 0 ? 1 : 0);
      }
      const changed = next.some((v, i) => v !== atoms[i]);
      return {
        state: { atoms: next, beam: state.beam },
        ok: changed,
        why: 'the atoms were already in that pattern',
      };
    },
    levels: [
      {
        title: 'Light the ends',
        brief: 'Excite the two outer atoms. Leave the middle one in ground.',
        start: { atoms: [0, 0, 0], beam: 0 },
        target: { atoms: [1, 0, 1], beam: null },
        slots: 4,
        hint: 'One blockade pulse does this by itself.',
      },
      {
        title: 'Side by side',
        brief: 'Excite atoms 1 and 2.',
        start: { atoms: [0, 0, 0], beam: 0 },
        target: { atoms: [1, 1, 0], beam: null },
        slots: 4,
        hint: 'The blockade never excites two neighbours. Use Excite and Move instead.',
      },
    ],
  },

  {
    id: 'glass',
    name: 'Glass Halls',
    kind: 'Photons',
    spirit: 'Zip',
    medium: 'Mirrors and beam splitters',
    idea: 'A photon can take both paths at once. When the paths meet again, the phase decides which detector it reaches.',
    layout: 'bench',
    controls: [],
    fields: [],
    apply: (state) => ({ state, ok: true }),
    levels: [
      {
        title: 'Even odds',
        brief: 'Every photon hits detector A. Make A and B fire about equally.',
        hint: 'One beam splitter gives each detector a 50% chance.',
        check: (shareA, physics) => physics.detectorA > 0.4 && physics.detectorA < 0.6,
        miss: (shareA) => `A got ${Math.round(shareA * 100)}%. Aim for about 50%.`,
      },
      {
        title: 'Certainty from two paths',
        requiredParts: { splitter: 2 },
        brief: 'Send every photon to detector B.',
        hint: 'Use two beam splitters in a row. The paths cancel at A, so every photon goes to B.',
        check: (shareA, physics, bench) =>
          physics.detectorB > 0.99 && bench.filter((part) => part === 'splitter').length >= 2,
        miss: (shareA) => `A still got ${Math.round(shareA * 100)}%. It needs 0%.`,
      },
      {
        title: 'Flip the outcome',
        requiredParts: { splitter: 2 },
        brief: 'Keep both splitters, but send every photon to detector A.',
        hint: 'Put one phase plate between the splitters, on one path only.',
        check: (shareA, physics, bench) =>
          physics.detectorA > 0.99 && bench.filter((part) => part === 'splitter').length >= 2,
        miss: (shareA) =>
          `A got ${Math.round(shareA * 100)}%. Use one phase plate, not two. Two cancel each other out.`,
      },
    ],
  },

  {
    id: 'spire',
    name: 'Frozen Spire',
    kind: 'Superconducting circuit',
    spirit: 'Frost',
    medium: 'Microwave pulses',
    idea: 'Gates are fast, but the circuit drifts out of step the whole time.',
    controls: [
      { id: 'pulse', name: 'Microwave', effect: 'Flips the state. +1 drift' },
      { id: 'wait', name: 'Idle', effect: 'Does nothing. +3 drift' },
      { id: 'echo', name: 'Echo', effect: 'Flips the sign of the drift, then +1' },
    ],
    fields: [
      { key: 'q', label: 'State', format: (v) => (v ? 'excited' : 'ground') },
      { key: 'drift', label: 'Drift', format: signed },
    ],
    apply(state, control) {
      if (control === 'pulse') return { state: { q: 1 - state.q, drift: state.drift + 1 }, ok: true };
      if (control === 'wait') return { state: { ...state, drift: state.drift + 3 }, ok: true };
      return { state: { ...state, drift: -state.drift + 1 }, ok: true };
    },
    levels: [
      {
        title: 'Spin echo',
        brief: 'Excite Frost and end with drift 0.',
        start: { q: 0, drift: 0 },
        target: { q: 1, drift: 0 },
        slots: 4,
        hint: 'Echo flips the sign of the drift, then adds 1. Try it right after a Microwave.',
      },
      {
        title: 'Already drifting',
        brief: 'Frost starts at drift +2. Excite him and end at drift 0.',
        start: { q: 0, drift: 2 },
        target: { q: 1, drift: 0 },
        slots: 4,
        hint: 'Echo first. It turns his +2 into −1.',
      },
      {
        title: 'Too far the other way',
        brief: 'Frost starts at drift −4. Excite him and end at drift 0.',
        start: { q: 0, drift: -4 },
        target: { q: 1, drift: 0 },
        slots: 4,
        hint: 'Echo only flips the sign, so it will not help here. Idle adds 3.',
      },
    ],
  },

  {
    id: 'lattice',
    name: 'Lattice',
    kind: 'Silicon spin qubit',
    spirit: 'Pip',
    medium: 'Voltage gates',
    idea: 'Pip moves between dots. Landing on the middle dot flips his spin.',
    controls: [
      { id: 'left', name: 'Shuttle left', effect: 'Moves Pip one dot left' },
      { id: 'right', name: 'Shuttle right', effect: 'Moves Pip one dot right' },
      { id: 'flip', name: 'Spin flip', effect: 'Flips Pip’s spin' },
    ],
    fields: [
      { key: 'pos', label: 'Position', format: (v) => `dot ${v + 1}` },
      { key: 'spin', label: 'Spin', format: (v) => (v ? 'up' : 'down') },
    ],
    apply(state, control) {
      if (control === 'flip') return { state: { ...state, spin: 1 - state.spin }, ok: true };

      const delta = control === 'left' ? -1 : 1;
      const pos = clamp(state.pos + delta, 0, 2);
      if (pos === state.pos) return { state, ok: false, why: 'there is no dot that way' };

      const spin = pos === 1 ? 1 - state.spin : state.spin;
      return { state: { pos, spin }, ok: true };
    },
    levels: [
      {
        title: 'Cross the noise',
        brief: 'Move Pip to dot 3 with his spin still down.',
        start: { pos: 0, spin: 0 },
        target: { pos: 2, spin: 0 },
        slots: 4,
        hint: 'Passing through the middle dot flips his spin once. Flip it back.',
      },
      {
        title: 'Stop in the middle',
        brief: 'Leave Pip on the middle dot with his spin down.',
        start: { pos: 0, spin: 0 },
        target: { pos: 1, spin: 0 },
        slots: 3,
        hint: 'Moving onto the middle dot flips his spin. Flip it back.',
      },
    ],
  },
];

export function getChamber(id) {
  return CHAMBERS.find((chamber) => chamber.id === id);
}

function fieldMatches(key, state, target) {
  if (target[key] === null || target[key] === undefined) return true;
  if (Array.isArray(target[key])) {
    return target[key].every((value, index) => value === state[key][index]);
  }
  return target[key] === state[key];
}

export function statesMatch(chamber, state, target) {
  return chamber.fields.every(({ key }) => fieldMatches(key, state, target));
}

export function describe(chamber, state) {
  return chamber.fields
    .filter(({ key }) => state[key] !== null && state[key] !== undefined)
    .map(({ label, format, key }) => `${label.toLowerCase()} ${format(state[key])}`)
    .join(', ');
}

export function describeMismatch(chamber, state, target) {
  const wrong = chamber.fields.filter(({ key }) => !fieldMatches(key, state, target));
  if (!wrong.length) return '';
  return wrong
    .map(({ key, label, format }) => `${label}: ${format(state[key])}, needs ${format(target[key])}`)
    .join('. ');
}
