import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export function Login() {
  const navigate = useNavigate();

  // Placeholder login: no authentication happens yet. The Service deliverable
  // replaces this with a POST to the login endpoint.
  function onSubmit(event) {
    event.preventDefault();
    navigate('/map');
  }

  return (
    <main id="main" className="auth-main">

      <section className="panel login-card" aria-labelledby="login-title">

        <div className="auth-copy">
          <p className="eyebrow">The sanctuary is waiting</p>
          <h2 id="login-title">Welcome.</h2>
          <p>Sign in</p>
        </div>

        <form onSubmit={onSubmit}>

          <div className="field">
            <label htmlFor="username">Apprentice name</label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Username"
              autoComplete="username"
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
              required
            />
          </div>

          <div className="check">
            <input type="checkbox" id="remember" name="remember" />
            <label htmlFor="remember">Remember me</label>
          </div>

          <button type="submit" className="primary-btn">
            Enter the sanctuary
          </button>

        </form>

        <p className="auth-switch">
          New apprentice?{' '}
          <Link to="/register">Create an account</Link>
        </p>

      </section>

    </main>
  );
}