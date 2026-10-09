import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export function Register() {
  const navigate = useNavigate();

  // Placeholder registration: no account is created yet. The Service
  // deliverable replaces this with a POST to the registration endpoint.
  function onSubmit(event) {
    event.preventDefault();
    navigate('/map');
  }

  return (
    <main id="main" className="auth-main">

      <section className="panel login-card" aria-labelledby="register-title">

        <div className="auth-copy">
          <p className="eyebrow">Begin your apprenticeship</p>
          <h2 id="register-title">Join the sanctuary.</h2>
          <p>Your restored chambers and best sequences will be saved here.</p>
        </div>

        <form onSubmit={onSubmit}>

          <div className="field">
            <label htmlFor="new-username">Apprentice name</label>
            <input
              type="text"
              id="new-username"
              name="username"
              placeholder="Username"
              autoComplete="username"
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
              required
            />
          </div>

          <button type="submit" className="primary-btn">
            Begin apprenticeship
          </button>

        </form>

        <p className="auth-switch">
          Already an apprentice?{' '}
          <Link to="/">Sign in</Link>
        </p>

      </section>

    </main>
  );
}