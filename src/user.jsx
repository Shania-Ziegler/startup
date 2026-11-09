import React from 'react';
import { hydrateProgress, clearProgressSession, flushProgress } from './progress';

let state = {
  userName: localStorage.getItem('userName') || '',
  signedIn: false,
  ready: false,
};

const listeners = new Set();

function publish(next) {
  state = { ...state, ...next };
  listeners.forEach((listener) => listener());
}

function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function snapshot() {
  return state;
}

function signedOut() {
  localStorage.removeItem('userName');
  clearProgressSession();
  publish({ userName: '', signedIn: false, ready: true });
}

let restoring = null;

function restoreSession() {
  if (restoring) return restoring;
  restoring = (async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const body = await response.json();
        localStorage.setItem('userName', body.username);
        await hydrateProgress(body.username);
        publish({ userName: body.username, signedIn: true, ready: true });
        return;
      }
    } catch {
    }
    signedOut();
  })();
  return restoring;
}

async function authenticate(endpoint, userName, password) {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: userName, password }),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.msg || 'Could not sign you in. Try again.');
  }

  const body = await response.json();
  localStorage.setItem('userName', body.username);
  await hydrateProgress(body.username);
  publish({ userName: body.username, signedIn: true, ready: true });
  return body.username;
}

export function signIn(userName, password) {
  return authenticate('/api/auth/login', userName, password);
}

export function register(userName, password) {
  return authenticate('/api/auth/create', userName, password);
}

export async function logout() {
  try {
    await flushProgress();
    await fetch('/api/auth/logout', { method: 'DELETE' });
  } catch {
  }
  signedOut();
}

export function useUser() {
  const current = React.useSyncExternalStore(subscribe, snapshot, snapshot);

  React.useEffect(() => {
    restoreSession();
  }, []);

  return { ...current, signIn, register, logout };
}

export function UserProvider({ children }) {
  return children;
}