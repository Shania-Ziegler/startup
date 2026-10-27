const KEY = 'quantumSanctuary.progress';

function empty() {
  return { levels: {}, best: {}, discovered: [] };
}

let cache = null;

function read() {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY));
    return saved ? { ...empty(), ...saved } : empty();
  } catch {
    return empty();
  }
}

export function loadProgress() {
  if (!cache) cache = read();
  return cache;
}

function save(progress) {
  cache = progress;
  try {
    localStorage.setItem(KEY, JSON.stringify(progress));
  } catch {
    // Storage disabled or full. The game still plays, it just forgets.
  }
  return progress;
}

export function levelsDone(progress, chamberId) {
  return progress.levels[chamberId] || 0;
}

export function recordLevel(chamberId, levelIndex, controlsUsed) {
  const progress = loadProgress();
  const levels = { ...progress.levels };
  const best = { ...progress.best };

  if (levelIndex + 1 > levelsDone(progress, chamberId)) {
    levels[chamberId] = levelIndex + 1;
  }

  const scoreKey = `${chamberId}-${levelIndex}`;
  const previous = best[scoreKey];
  if (previous === undefined || controlsUsed < previous) {
    best[scoreKey] = controlsUsed;
  }

  return save({ ...progress, levels, best });
}

export function recordDiscovery(controlId) {
  const progress = loadProgress();
  if (progress.discovered.includes(controlId)) return progress;
  return save({ ...progress, discovered: [...progress.discovered, controlId] });
}

export function resetProgress() {
  return save(empty());
}
