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

  const valid = name.trim() !== '' && password !== '' && confirm !== '';
  const mismatch = confirm.length > 0 && password !== confirm;

  return (
    <main id="main" className="auth-main">
      <style>{`
        .qs-login {
          border: 1px solid var(--line);
          color-scheme: dark;
        }
        .qs-login h2 {
          margin: 0 0 1.5rem;
          text-align: center;
          font-size: clamp(1.6rem, 1.2rem + 1.5vw, 2rem);
        }
        .qs-login input[type='text'],
        .qs-login input[type='password'] {
          border: 1px solid var(--line-strong);
          background: var(--bg);
          color: var(--text);
          caret-color: var(--text);
        }
        .qs-login input:focus {
          outline: none;
          border-color: var(--cyan);
          background: var(--bg);
        }
        .qs-login input:-webkit-autofill,
        .qs-login input:-webkit-autofill:hover,
        .qs-login input:-webkit-autofill:focus {
          -webkit-text-fill-color: var(--text);
          caret-color: var(--text);
          box-shadow: 0 0 0 1000px var(--bg) inset;
        }
        .qs-field-note {
          margin: 0.4rem 0 0;
          color: var(--red);
          font-size: 0.8rem;
        }
        .qs-login input[aria-invalid='true'] { border-color: var(--red); }
        .qs-login-submit {
          width: 100%;
          min-height: 48px;
          margin-top: 0.5rem;
          border: 0;
          border-radius: var(--radius);
          background: var(--cyan);
          color: var(--text-on-light);
          font-weight: 600;
          cursor: pointer;
        }
        .qs-login-submit:hover:not(:disabled) { filter: brightness(1.08); }
        .qs-login-submit:disabled { opacity: 0.45; cursor: not-allowed; }
        .qs-login-error {
          margin: 1rem 0 0;
          padding: 0.7rem 0.9rem;
          border-radius: var(--radius);
          background: rgba(255, 107, 110, 0.1);
          border: 1px solid rgba(255, 107, 110, 0.35);
          color: var(--red);
          font-size: 0.9rem;
        }
        .qs-login-foot {
          margin: 1.25rem 0 0;
          text-align: center;
          color: var(--text-secondary);
          font-size: 0.9rem;
        }
        .qs-login-foot a {
          color: var(--cyan);
          font-weight: 600;
          text-decoration: none;
        }
        .qs-login-foot a:hover { text-decoration: underline; }
      `}</style>

      <section className="panel login-card qs-login" aria-labelledby="register-title">
        <h2 id="register-title">Become an apprentice</h2>

        <form onSubmit={submit} noValidate>
          <div className="field">
            <label htmlFor="new-username">Apprentice name</label>
            <input
              type="text"
              id="new-username"
              autoComplete="username"
              value={name}
              onChange={(event) => setName(event.target.value)}
              autoFocus
              required
            />
          </div>
          <div className="field">
            <label htmlFor="new-password">Password</label>
            <input
              type="password"
              id="new-password"
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
              autoComplete="new-password"
              value={confirm}
              onChange={(event) => setConfirm(event.target.value)}
              aria-invalid={mismatch}
              aria-describedby={mismatch ? 'confirm-password-note' : undefined}
              required
            />
            {mismatch && (
              <p id="confirm-password-note" className="qs-field-note">
                Passwords don’t match yet.
              </p>
            )}
          </div>
          <button type="submit" className="qs-login-submit" disabled={!valid || busy}>
            {busy ? 'Creating…' : 'Create apprentice'}
          </button>
        </form>

        {error && <p className="qs-login-error" role="alert">{error}</p>}

        <p className="qs-login-foot">
          Already have an account? <Link to="/">Sign in</Link>
        </p>
      </section>
    </main>
  );
}
