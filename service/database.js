const { MongoClient } = require('mongodb');

try {
  require('dotenv').config({ quiet: true });
} catch {
}

const config = {
  hostname: process.env.MONGO_HOSTNAME,
  userName: process.env.MONGO_USERNAME,
  password: process.env.MONGO_PASSWORD,
  dbName: process.env.MONGO_DBNAME,
};

const REQUIRED = {
  hostname: 'MONGO_HOSTNAME',
  userName: 'MONGO_USERNAME',
  password: 'MONGO_PASSWORD',
};

for (const [field, variable] of Object.entries(REQUIRED)) {
  if (!config[field]) {
    console.log(`${variable} is not set. Put it in service/.env or export it.`);
    process.exit(1);
  }
}

const url = `mongodb+srv://${encodeURIComponent(config.userName)}:${encodeURIComponent(config.password)}@${config.hostname}`;
const client = new MongoClient(url);
const db = client.db(config.dbName || 'sanctuary');

const userCollection = db.collection('user');
const progressCollection = db.collection('progress');
const activityCollection = db.collection('activity');

const ACTIVITY_LIMIT = 50;

const ready = (async function testConnection() {
  try {
    await db.command({ ping: 1 });
    await userCollection.createIndex({ username: 1 }, { unique: true });
    await progressCollection.createIndex({ username: 1 }, { unique: true });
    await activityCollection.createIndex({ at: -1 });
    console.log(`Connected to database at ${config.hostname}`);
  } catch (ex) {
    console.log(`Unable to connect to ${config.hostname} because ${ex.message}`);
    process.exit(1);
  }
})();

function getUser(username) {
  if (!username) return Promise.resolve(null);
  return userCollection.findOne({ username });
}

function getUserByToken(token) {
  if (!token) return Promise.resolve(null);
  return userCollection.findOne({ token }, { projection: { password: 0 } });
}

function addUser(user) {
  return userCollection.insertOne(user);
}

function setUserToken(username, token) {
  return userCollection.updateOne({ username }, { $set: { token } });
}

function clearUserToken(username) {
  return userCollection.updateOne({ username }, { $unset: { token: '' } });
}

async function getProgress(username) {
  const record = await progressCollection.findOne(
    { username },
    { projection: { progress: 1, _id: 0 } }
  );
  return record ? record.progress : null;
}

function saveProgress(username, progress) {
  const solved = Object.values(progress.levels).reduce((sum, n) => sum + n, 0);
  return progressCollection.updateOne(
    { username },
    { $set: { username, progress, solved, discovered: progress.discovered.length } },
    { upsert: true }
  );
}

function addActivity(entry) {
  return activityCollection.insertOne(entry);
}

function getActivity() {
  return activityCollection
    .find({}, { sort: { at: -1 }, limit: ACTIVITY_LIMIT, projection: { _id: 0 } })
    .toArray();
}

function getLeaderboard() {
  return progressCollection
    .find(
      {},
      {
        sort: { solved: -1, discovered: -1 },
        limit: 10,
        projection: { _id: 0, username: 1, solved: 1, discovered: 1 },
      }
    )
    .toArray();
}

let closing = false;
async function shutdown() {
  if (closing) return;
  closing = true;
  try {
    await client.close();
    console.log('Database connection closed.');
  } catch (ex) {
    console.error('Error closing the database connection:', ex.message);
  }
  process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

module.exports = {
  ready,
  getUser,
  getUserByToken,
  addUser,
  setUserToken,
  clearUserToken,
  getProgress,
  saveProgress,
  addActivity,
  getActivity,
  getLeaderboard,
};
