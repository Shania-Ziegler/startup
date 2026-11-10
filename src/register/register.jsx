import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../user';

export function Register() {
  const navigate = useNavigate();
  const { register } = useUser();
  const [name, setName] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirm, setConfirm] = React.useState('');
  const [error, setError] = React.useState('');
  const [busy, setBusy] = React.useState(false);

  async function submit(event) {
    event.preventDefault();
    if (busy) return;
    if (password !== confirm) {
      setError('Those two passwords do not match.');
      return;
    }
    setBusy(true);
    setError('');
    try {
      await register(name.trim(), password);
      navigate('/map');
    } catch (failure) {
      setError(failure.message);
    } finally {
      setBusy(false);
    }
  }

  const valid = name.trim().length >= 2 && password.length >= 4 && confirm.length >= 4;

  return (
    <main id="main">
      <style>{`
        .qs-auth { max-width: 24rem; }
        .qs-auth-error { color: #ff9b9b; font-size: 0.85rem; margin: 0.6rem 0 0; }
        .qs-auth-foot { font-size: 0.85rem; margin: 0.9rem 0 0; }
        .qs-auth-hint { font-size: 0.78rem; opacity: 0.7; margin: 0 0 0.75rem; }
      `}</style>

      <section className="card qs-auth" aria-labelledby="register-title">
        <h2 id="register-title">Become an apprentice</h2>
        <p className="qs-auth-hint">
          Your progress through the five chambers is saved to this account.
        </p>

        <form onSubmit={submit}>
          <div>
            <label htmlFor="new-username">Apprentice name</label>
            <input
              type="text"
              id="new-username"
              autoComplete="username"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
              minLength={2}
            />
          </div>
          <div>
            <label htmlFor="new-password">Password</label>
            <input
              type="password"
              id="new-password"
              autoComplete="new-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              minLength={4}
            />
          </div>
          <div>
            <label htmlFor="confirm-password">Confirm password</label>
            <input
              type="password"
              id="confirm-password"
              autoComplete="new-password"
              value={confirm}
              onChange={(event) => setConfirm(event.target.value)}
              required
              minLength={4}
            />
          </div>
          <button type="submit" className="btn-primary" disabled={!valid || busy}>
            {busy ? 'Creating' : 'Create apprentice'}
          </button>
        </form>

        {error && <p className="qs-auth-error" role="alert">{error}</p>}

        <p className="qs-auth-foot">
          Already have an account? <Link to="/">Sign in</Link>
        </p>
      </section>
    </main>
  );
}
