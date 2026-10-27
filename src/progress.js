const KEY = 'quantumSanctuary.progress';

function empty() {
  return { levels: {}, best: {}, discovered: [] };
}

export function loadProgress() {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY));
    return saved ? { ...empty(), ...saved } : empty();
  } catch {
    return empty();
  }
}

function save(progress) {
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
  const done = levelsDone(progress, chamberId);

  if (levelIndex + 1 > done) {
    progress.levels[chamberId] = levelIndex + 1;
  }

  const scoreKey = `${chamberId}-${levelIndex}`;
  const previous = progress.best[scoreKey];
  if (previous === undefined || controlsUsed < previous) {
    progress.best[scoreKey] = controlsUsed;
  }

  return save(progress);
}

export function recordDiscovery(controlId) {
  const progress = loadProgress();
  if (!progress.discovered.includes(controlId)) {
    progress.discovered.push(controlId);
    return save(progress);
  }
  return progress;
}

export function resetProgress() {
  return save(empty());
}