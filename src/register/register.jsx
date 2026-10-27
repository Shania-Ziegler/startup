import React from 'react';
import { Link } from 'react-router-dom';

import { AuthState } from '../login/authState';

export function Register({ onAuthChange }) {
  const [userName, setUserName] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirm, setConfirm] = React.useState('');

  const mismatch = confirm.length > 0 && password !== confirm;
  const canSubmit = userName.trim() && password && password === confirm;

  function onSubmit(event) {
    event.preventDefault();
    if (!canSubmit) return;
    localStorage.setItem('userName', userName.trim());
    onAuthChange(userName.trim(), AuthState.Authenticated);
  }

  return (
    <main id="main" className="auth-main">
      <section className="panel login-card" aria-labelledby="register-title">

        <div className="auth-copy">
                    <h2 id="register-title">Create an account</h2>
          <p>Your progress and best scores will be saved.</p>
        </div>

        <form onSubmit={onSubmit}>
          <div className="field">
            <label htmlFor="new-username">Username</label>
            <input
              type="text"
              id="new-username"
              name="username"
              placeholder="Username"
              autoComplete="username"
              value={userName}
              onChange={(event) => setUserName(event.target.value)}
              required
            />
          </div>

          <div className="field">
            <label htmlFor="new-password">Password</label>
            <input
              type="password"
              id="new-password"
              placeholder="Password"
              autoComplete="new-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>

          <div className="field">
            <label htmlFor="confirm-password">Confirm password</label>
            <input
              type="password"
              id="confirm-password"
              placeholder="Confirm password"
              autoComplete="new-password"
              value={confirm}
              onChange={(event) => setConfirm(event.target.value)}
              aria-invalid={mismatch}
              aria-describedby={mismatch ? 'confirm-error' : undefined}
              required
            />
            {mismatch && (
              <p id="confirm-error" className="field-error" role="alert">
                Passwords do not match.
              </p>
            )}
          </div>

          <button type="submit" className="primary-btn" disabled={!canSubmit}>
            Create account
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/">Sign in</Link>
        </p>

      </section>
    </main>
  );
}