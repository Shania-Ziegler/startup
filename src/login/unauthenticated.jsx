import React from 'react';
import { Link } from 'react-router-dom';

export function Unauthenticated({ onLogin }) {
  const [userName, setUserName] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [remember, setRemember] = React.useState(false);

  function onSubmit(event) {
    event.preventDefault();
    onLogin(userName.trim());
  }

  return (
    <>
      <div className="auth-copy">
                <h2 id="login-title">Sign in</h2>
        <p>Sign in to keep playing.</p>
      </div>

      <form onSubmit={onSubmit}>
        <div className="field">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            placeholder="Username"
            autoComplete="username"
            value={userName}
            onChange={(event) => setUserName(event.target.value)}
            required
          />
        </div>

        <div className="field">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            placeholder="Password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </div>

        <div className="check">
          <input
            type="checkbox"
            id="remember"
            name="remember"
            checked={remember}
            onChange={(event) => setRemember(event.target.checked)}
          />
          <label htmlFor="remember">Remember me</label>
        </div>

        <button type="submit" className="primary-btn" disabled={!userName.trim()}>
          Sign in
        </button>
      </form>

      <p className="auth-switch">
        New here? <Link to="/register">Create an account</Link>
      </p>
    </>
  );
}