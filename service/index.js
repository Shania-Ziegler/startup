const express = require('express');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const uuid = require('uuid');
const DB = require('./database');

const app = express();
const authCookieName = 'token';
const port = process.argv.length > 2 ? process.argv[2] : 4000;

const cookieOptions = {
  secure: true,
  httpOnly: true,
  sameSite: 'strict',
};

app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'));

const apiRouter = express.Router();
app.use('/api', apiRouter);

const run = (handler) => (req, res, next) =>
  Promise.resolve(handler(req, res, next)).catch(next);

async function createUser(username, password) {
  const user = {
    username,
    password: await bcrypt.hash(password, 10),
    token: uuid.v4(),
  };
  await DB.addUser(user);
  await DB.saveProgress(username, emptyProgress());
  return user;
}

function setAuthCookie(res, token) {
  res.cookie(authCookieName, token, cookieOptions);
}

const verifyAuth = run(async (req, res, next) => {
  const user = await DB.getUserByToken(req.cookies[authCookieName]);
  if (!user) {
    res.status(401).send({ msg: 'Unauthorized' });
    return;
  }
  req.user = user;
  next();
});

function emptyProgress() {
  return { levels: {}, best: {}, discovered: [] };
}

function isRecord(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

const CHAMBER_IDS = ['quiet', 'lantern', 'glass', 'spire', 'lattice'];
const LEVEL_KEY = new RegExp(`^(${CHAMBER_IDS.join('|')})-\\d{1,2}$`);

function counts(value, isValidKey) {
  return Object.fromEntries(
    Object.entries(isRecord(value) ? value : {})
      .filter(([key, count]) =>
        typeof key === 'string' && isValidKey(key) &&
        Number.isSafeInteger(count) && count >= 0 && count <= 999)
  );
}

function normalizeProgress(saved) {
  const value = isRecord(saved) ? saved : {};
  return {
    levels: counts(value.levels, (key) => CHAMBER_IDS.includes(key)),
    best: counts(value.best, (key) => LEVEL_KEY.test(key)),
    discovered: [
      ...new Set(
        (Array.isArray(value.discovered) ? value.discovered : [])
          .filter((item) => typeof item === 'string' && item.length <= 64)
      ),
    ].slice(0, 200),
  };
}

function mergeProgress(existing, incoming) {
  const merged = emptyProgress();
  for (const key of new Set([...Object.keys(existing.levels), ...Object.keys(incoming.levels)])) {
    merged.levels[key] = Math.max(existing.levels[key] || 0, incoming.levels[key] || 0);
  }
  for (const key of new Set([...Object.keys(existing.best), ...Object.keys(incoming.best)])) {
    const a = existing.best[key];
    const b = incoming.best[key];
    merged.best[key] = a === undefined ? b : b === undefined ? a : Math.min(a, b);
  }
  merged.discovered = [...new Set([...existing.discovered, ...incoming.discovered])].slice(0, 200);
  return merged;
}

function record(username, text) {
  return DB.addActivity({ username, text, at: new Date().toISOString() });
}

apiRouter.post('/auth/create', run(async (req, res) => {
  const { username, password } = req.body || {};
  if (typeof username !== 'string' || username.trim().length < 2) {
    res.status(400).send({ msg: 'Apprentice name must be at least 2 characters' });
    return;
  }
  if (typeof password !== 'string' || password.length < 8) {
    res.status(400).send({ msg: 'Password must be at least 8 characters' });
    return;
  }
  if (await DB.getUser(username.trim())) {
    res.status(409).send({ msg: 'That apprentice name is already taken' });
    return;
  }

  let user;
  try {
    user = await createUser(username.trim(), password);
  } catch (err) {
    if (err && err.code === 11000) {
      res.status(409).send({ msg: 'That apprentice name is already taken' });
      return;
    }
    throw err;
  }

  setAuthCookie(res, user.token);
  await record(user.username, 'joined the sanctuary');
  res.send({ username: user.username });
}));

apiRouter.post('/auth/login', run(async (req, res) => {
  const { username, password } = req.body || {};
  const user = await DB.getUser(typeof username === 'string' ? username.trim() : '');
  if (user && typeof password === 'string' && (await bcrypt.compare(password, user.password))) {
    const token = uuid.v4();
    await DB.setUserToken(user.username, token);
    setAuthCookie(res, token);
    res.send({ username: user.username });
    return;
  }
  res.status(401).send({ msg: 'Wrong apprentice name or password' });
}));

apiRouter.delete('/auth/logout', run(async (req, res) => {
  const user = await DB.getUserByToken(req.cookies[authCookieName]);
  if (user) await DB.clearUserToken(user.username);
  res.clearCookie(authCookieName, cookieOptions);
  res.status(204).end();
}));

apiRouter.get('/auth/me', verifyAuth, (req, res) => {
  res.send({ username: req.user.username });
});

apiRouter.get('/progress', verifyAuth, run(async (req, res) => {
  const progress = await DB.getProgress(req.user.username);
  res.send(progress || emptyProgress());
}));

const handleProgressSave = run(async (req, res) => {
  const incoming = normalizeProgress(req.body);
  const existing = (await DB.getProgress(req.user.username)) || emptyProgress();
  const merged = mergeProgress(existing, incoming);
  await DB.saveProgress(req.user.username, merged);
  res.send(merged);
});

apiRouter.put('/progress', verifyAuth, handleProgressSave);
apiRouter.post('/progress', verifyAuth, handleProgressSave);

apiRouter.delete('/progress', verifyAuth, run(async (req, res) => {
  const cleared = emptyProgress();
  await DB.saveProgress(req.user.username, cleared);
  res.send(cleared);
}));

apiRouter.get('/activity', verifyAuth, run(async (_req, res) => {
  res.send(await DB.getActivity());
}));

apiRouter.post('/activity', verifyAuth, run(async (req, res) => {
  const text = req.body && req.body.text;
  if (typeof text !== 'string' || !text.trim()) {
    res.status(400).send({ msg: 'An activity entry needs text' });
    return;
  }
  await record(req.user.username, text.trim().slice(0, 120));
  res.send(await DB.getActivity());
}));

apiRouter.get('/leaderboard', verifyAuth, run(async (_req, res) => {
  res.send(await DB.getLeaderboard());
}));

apiRouter.use((_req, res) => {
  res.status(404).send({ msg: 'API endpoint not found' });
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).send({ msg: 'Internal Server Error' });
});

app.use((_req, res) => {
  res.sendFile('index.html', { root: 'public' });
});

DB.ready.then(() => {
  app.listen(port, () => {
    console.log(`Quantum Sanctuary service listening on port ${port}`);
  });
});
