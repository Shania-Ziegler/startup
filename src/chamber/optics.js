const ROOT_HALF = Math.SQRT1_2;

const c = (re = 0, im = 0) => ({ re, im });
const add = (a, b) => c(a.re + b.re, a.im + b.im);
const mulI = (a) => c(-a.im, a.re);
const scale = (a, k) => c(a.re * k, a.im * k);
const negate = (a) => c(-a.re, -a.im);
const probability = (a) => a.re * a.re + a.im * a.im;

export const PARTS = {
  splitter: { id: 'splitter', name: 'Beam splitter', note: 'Sends the photon both ways at once' },
  mirror: { id: 'mirror', name: 'Mirror', note: 'Swaps the upper and lower paths' },
  phaseUpper: { id: 'phaseUpper', name: 'Phase plate, upper', note: 'Delays the upper path by half a wave' },
  phaseLower: { id: 'phaseLower', name: 'Phase plate, lower', note: 'Delays the lower path by half a wave' },
};

export const SLOT_COUNT = 4;

export function emptyBench() {
  return Array(SLOT_COUNT).fill(null);
}

function step(upper, lower, part) {
  if (part === 'splitter') {
    return [
      scale(add(upper, mulI(lower)), ROOT_HALF),
      scale(add(mulI(upper), lower), ROOT_HALF),
    ];
  }
  if (part === 'mirror') return [lower, upper];
  if (part === 'phaseUpper') return [negate(upper), lower];
  if (part === 'phaseLower') return [upper, negate(lower)];
  return [upper, lower];
}

/**
 * Walks the photon through the bench and reports the amplitude on each rail
 * after every slot, plus the odds of each detector clicking at the end.
 */
export function simulate(bench) {
  let upper = c(1, 0);
  let lower = c(0, 0);

  const trail = [{ upper: probability(upper), lower: probability(lower) }];

  for (const part of bench) {
    [upper, lower] = step(upper, lower, part);
    trail.push({ upper: probability(upper), lower: probability(lower) });
  }

  return {
    trail,
    detectorA: probability(upper),
    detectorB: probability(lower),
  };
}

export function fireShot(detectorA) {
  return Math.random() < detectorA ? 'A' : 'B';
}