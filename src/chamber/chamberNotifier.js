const handlers = [];
const names = ['Ana', 'Ben', 'Miko', 'Rae'];
const actions = [
  'signed in',
  'ran a sequence',
  'cleared a sequence',
  'finished a chamber',
  'unlocked a journal entry',
];

function pick(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function broadcast(event) {
  for (const handler of handlers) handler(event);
}

setInterval(() => {
  broadcast({ name: pick(names), action: pick(actions), at: new Date().toLocaleTimeString() });
}, 5000);

export const ChamberNotifier = {
  addHandler(handler) {
    handlers.push(handler);
  },
  removeHandler(handler) {
    const index = handlers.indexOf(handler);
    if (index >= 0) handlers.splice(index, 1);
  },
  announce(name, action) {
    broadcast({ name, action, at: new Date().toLocaleTimeString() });
  },
};