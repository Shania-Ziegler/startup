// Measurement randomness for the Glass Halls photon detector.
//
// Quantum mechanics says the detector a photon lands in is genuinely random,
// Math.random is a deterministic pseudo random, so this module pulls random numbers from a quantum random
// number service and uses those for the measurement instead. If the service is
// rate limited, blocked or down, play falls back to the local generator and the
// game carries on.

const SCALE = 1000000;
const POOL_TARGET = 64;
const POOL_LOW = 16;
const RETRY_AFTER_MS = 60000;

function asArray(value) {
  if (Array.isArray(value)) return value;
  if (Number.isFinite(value)) return [value];
  return [];
}


// `scale` is the upper bound of the integers that service returns.
const SOURCES = [
  {
    name: 'qrandom.io',
    url: (count) => `https://qrandom.io/api/random/int?min=0&max=${SCALE - 1}&n=${count}`,
    read: (data) => asArray(data?.numbers ?? data?.data ?? data?.result ?? data),
    scale: SCALE,
  },
  {
    name: 'ANU quantum RNG',
    url: (count) => `https://qrng.anu.edu.au/API/jsonI.php?length=${count}&type=uint16`,
    read: (data) => (data?.success ? asArray(data.data) : []),
    scale: 65536,
  },
  {
    name: 'csrng.net',
    url: () => `https://csrng.net/csrng/csrng.php?min=0&max=${SCALE - 1}`,
    read: (data) => asArray(data).map((entry) => entry?.random).filter(Number.isFinite),
    scale: SCALE,
  },
];

let pool = [];
let sourceName = null;
let lastFailureAt = 0;
let inFlight = null;

function normalize(values, scale) {
  return values
    .map(Number)
    .filter((value) => Number.isFinite(value) && value >= 0 && value < scale)
    .map((value) => value / scale);
}

async function fetchFrom(source, count) {
  const response = await fetch(source.url(count));
  if (!response.ok) throw new Error(`${source.name} returned ${response.status}`);
  return normalize(source.read(await response.json()), source.scale);
}

async function refill() {
  const needed = POOL_TARGET - pool.length;
  if (needed <= 0) return;
  if (Date.now() - lastFailureAt < RETRY_AFTER_MS) return;

  for (const source of SOURCES) {
    try {
      const values = await fetchFrom(source, needed);
      if (values.length) {
        pool = pool.concat(values);
        sourceName = source.name;
        lastFailureAt = 0;
        return;
      }
    } catch {
    }
  }

  // Every service failed so we wait
  lastFailureAt = Date.now();
  sourceName = null;
}


export function primeQuantumPool() {
  if (inFlight) return inFlight;
  inFlight = refill().finally(() => {
    inFlight = null;
  });
  return inFlight;
}

export function nextRandom() {
  if (pool.length <= POOL_LOW) primeQuantumPool();
  if (pool.length) return pool.pop();
  return Math.random();
}

export function randomSourceLabel() {
  if (!pool.length) return 'local fallback';
  return sourceName || 'local fallback';
}

export function quantumValuesRemaining() {
  return pool.length;
}