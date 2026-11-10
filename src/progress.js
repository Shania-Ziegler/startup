const KEY = 'quantumSanctuary.progress';

function empty() {
  return { levels: {}, best: {}, discovered: [] };
}

let cache = null;
let session = null;
let pending = false;
let timer = null;

function storageKey() {
  return session ? `${KEY}.${session}` : KEY;
}

function read() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey()));
    return saved ? { ...empty(), ...saved } : empty();
  } catch {
    return empty();
  }
}

export function loadProgress() {
  if (!cache) cache = read();
  return cache;
}

function writeLocal(progress) {
  try {
    localStorage.setItem(storageKey(), JSON.stringify(progress));
  } catch {
  }
}

function save(progress) {
  cache = progress;
  writeLocal(progress);
  if (session) schedulePush();
  return progress;
}

function merge(local, remote) {
  const levels = { ...local.levels };
  for (const [id, done] of Object.entries(remote.levels || {})) {
    levels[id] = Math.max(levels[id] || 0, done);
  }

  const best = { ...local.best };
  for (const [id, score] of Object.entries(remote.best || {})) {
    best[id] = best[id] === undefined ? score : Math.min(best[id], score);
  }

  const discovered = [...new Set([...local.discovered, ...(remote.discovered || [])])];

  return { ...empty(), levels, best, discovered };
}

function schedulePush() {
  pending = true;
  clearTimeout(timer);
  timer = setTimeout(flushProgress, 1000);
}

export async function hydrateProgress(userName) {
  session = userName;
  clearTimeout(timer);
  pending = false;
  cache = read();

  try {
    const response = await fetch('/api/progress');
    if (response.ok) {
      const remote = await response.json();
      cache = merge(cache, remote);
      writeLocal(cache);
    }
  } catch {
  }

  return cache;
}

export async function flushProgress() {
  clearTimeout(timer);
  if (!pending || !session || !cache) return;
  pending = false;

  try {
    const response = await fetch('/api/progress', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cache),
    });
    if (!response.ok) pending = true;
  } catch {
    pending = true;
  }
}

export function clearProgressSession() {
  clearTimeout(timer);
  pending = false;
  session = null;
  cache = null;
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
