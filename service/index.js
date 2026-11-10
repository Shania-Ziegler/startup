const express = require('express');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const uuid = require('uuid');

const app = express();
const authCookieName = 'token';
const authCookieOptions = { secure: true, httpOnly: true, sameSite: 'strict' };
const port = process.argv.length > 2 ? process.argv[2] : 4000;

const users = [];
const progressByUser = {};
const activity = [];
const ACTIVITY_LIMIT = 50;

app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'));

const apiRouter = express.Router();
app.use('/api', apiRouter);

function findUser(field, value) {
  if (!value) return null;
  return users.find((user) => user[field] === value) || null;
}

async function createUser(username, password) {
  const user = {
    username,
    password: await bcrypt.hash(password, 10),
    token: uuid.v4(),
  };
  users.push(user);
  progressByUser[username] = emptyProgress();
  return user;
}

function setAuthCookie(res, token) {
  res.cookie(authCookieName, token, authCookieOptions);
}

function verifyAuth(req, res, next) {
  const user = findUser('token', req.cookies[authCookieName]);
  if (!user) {
    res.status(401).send({ msg: 'Unauthorized' });
    return;
  }
  req.user = user;
  next();
}

function emptyProgress() {
  return { levels: {}, best: {}, discovered: [] };
}

function isRecord(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function counts(value) {
  return Object.fromEntries(
    Object.entries(isRecord(value) ? value : {})
      .filter(([key, count]) =>
        typeof key === 'string' && key.length <= 64 &&
        Number.isSafeInteger(count) && count >= 0 && count <= 999)
  );
}

function normalizeProgress(saved) {
  const value = isRecord(saved) ? saved : {};
  return {
    levels: counts(value.levels),
    best: counts(value.best),
    discovered: [
      ...new Set(
        (Array.isArray(value.discovered) ? value.discovered : [])
          .filter((item) => typeof item === 'string' && item.length <= 64)
      ),
    ].slice(0, 200),
  };
}

function record(username, text) {
  activity.unshift({ username, text, at: new Date().toISOString() });
  if (activity.length > ACTIVITY_LIMIT) activity.length = ACTIVITY_LIMIT;
}

function levelsSolved(progress) {
  return Object.values(progress.levels).reduce((sum, n) => sum + n, 0);
}

apiRouter.post('/auth/create', async (req, res) => {
  const { username, password } = req.body || {};
  if (typeof username !== 'string' || username.trim().length < 2) {
    res.status(400).send({ msg: 'Apprentice name must be at least 2 characters' });
    return;
  }
  if (typeof password !== 'string' || password.length < 4) {
    res.status(400).send({ msg: 'Password must be at least 4 characters' });
    return;
  }
  if (findUser('username', username.trim())) {
    res.status(409).send({ msg: 'That apprentice name is already taken' });
    return;
  }

  const user = await createUser(username.trim(), password);
  setAuthCookie(res, user.token);
  record(user.username, 'joined the sanctuary');
  res.send({ username: user.username });
});

apiRouter.post('/auth/login', async (req, res) => {
  const { username, password } = req.body || {};
  const user = findUser('username', typeof username === 'string' ? username.trim() : '');
  if (user && typeof password === 'string' && (await bcrypt.compare(password, user.password))) {
    user.token = uuid.v4();
    setAuthCookie(res, user.token);
    res.send({ username: user.username });
    return;
  }
  res.status(401).send({ msg: 'Wrong apprentice name or password' });
});

apiRouter.delete('/auth/logout', (req, res) => {
  const user = findUser('token', req.cookies[authCookieName]);
  if (user) delete user.token;
  res.clearCookie(authCookieName, authCookieOptions);
  res.status(204).end();
});

apiRouter.get('/auth/me', verifyAuth, (req, res) => {
  res.send({ username: req.user.username });
});

apiRouter.get('/progress', verifyAuth, (req, res) => {
  const progress = progressByUser[req.user.username] || emptyProgress();
  res.send(progress);
});

function saveProgress(req, res) {
  const incoming = normalizeProgress(req.body);
  const existing = progressByUser[req.user.username] || emptyProgress();

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

  progressByUser[req.user.username] = merged;
  res.send(merged);
}

apiRouter.put('/progress', verifyAuth, saveProgress);
apiRouter.post('/progress', verifyAuth, saveProgress);

apiRouter.delete('/progress', verifyAuth, (req, res) => {
  progressByUser[req.user.username] = emptyProgress();
  res.send(progressByUser[req.user.username]);
});

apiRouter.get('/activity', verifyAuth, (req, res) => {
  res.send(activity);
});

apiRouter.post('/activity', verifyAuth, (req, res) => {
  const text = req.body && req.body.text;
  if (typeof text !== 'string' || !text.trim()) {
    res.status(400).send({ msg: 'An activity entry needs text' });
    return;
  }
  record(req.user.username, text.trim().slice(0, 120));
  res.send(activity);
});

apiRouter.get('/leaderboard', verifyAuth, (req, res) => {
  const board = Object.entries(progressByUser)
    .map(([username, progress]) => ({
      username,
      solved: levelsSolved(progress),
      discovered: progress.discovered.length,
    }))
    .sort((a, b) => b.solved - a.solved || b.discovered - a.discovered)
    .slice(0, 10);
  res.send(board);
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).send({ msg: 'Internal Server Error' });
});

app.use((_req, res) => {
  res.sendFile('index.html', { root: 'public' });
});

app.listen(port, () => {
  console.log(`Quantum Sanctuary service listening on port ${port}`);
});
