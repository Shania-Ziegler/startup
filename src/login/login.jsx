import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../user';

export function Login() {
  const navigate = useNavigate();
  const { userName, signedIn, ready, signIn } = useUser();
  const [name, setName] = React.useState(userName || '');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const [busy, setBusy] = React.useState(false);

  React.useEffect(() => {
    if (ready && signedIn) navigate('/map');
  }, [ready, signedIn, navigate]);

  async function submit(event) {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setError('');
    try {
      await signIn(name.trim(), password);
      navigate('/map');
    } catch (failure) {
      setError(failure.message);
    } finally {
      setBusy(false);
    }
  }

  const valid = name.trim() !== '' && password !== '';

  return (
    <main id="main" className="auth-main">
      <style>{`
        .qs-login {
          position: relative;
          overflow: hidden;
          border: 1px solid var(--line);
          animation: qs-rise 420ms cubic-bezier(0.2, 0.8, 0.2, 1) both;
        }
        .qs-login::before {
          content: '';
          position: absolute;
          inset: 0 0 auto 0;
          height: 3px;
          background: linear-gradient(90deg, var(--cyan), var(--blue), var(--magenta));
        }
        .qs-login::after {
          content: '';
          position: absolute;
          top: -140px;
          left: 50%;
          width: 320px;
          height: 220px;
          transform: translateX(-50%);
          background: radial-gradient(closest-side, rgba(90, 214, 230, 0.16), transparent);
          pointer-events: none;
        }
        .qs-login > * { position: relative; z-index: 1; }
        .qs-login-sigil {
          width: 52px;
          height: 52px;
          margin: 0 auto 1rem;
          display: grid;
          place-items: center;
          border-radius: 14px;
          background: var(--surface-raised);
          border: 1px solid var(--line-strong);
          color: var(--cyan);
          font-family: var(--font-display);
          font-size: 1.5rem;
          box-shadow: 0 0 24px rgba(90, 214, 230, 0.18);
        }
        .qs-login .eyebrow {
          color: var(--cyan);
          letter-spacing: 0.08em;
          text-transform: uppercase;
          font-size: 0.75rem;
        }
        .qs-login input[type='text'],
        .qs-login input[type='password'] {
          border: 1px solid transparent;
          transition: background-color 120ms ease, border-color 120ms ease, box-shadow 120ms ease;
        }
        .qs-login input:focus {
          outline: none;
          border-color: var(--cyan);
          box-shadow: 0 0 0 3px rgba(90, 214, 230, 0.2);
        }
        .qs-login-submit {
          width: 100%;
          min-height: 48px;
          margin-top: 0.5rem;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.6rem;
          border: 0;
          border-radius: var(--radius);
          background: var(--cyan);
          color: var(--text-on-light);
          font-weight: 600;
          cursor: pointer;
          transition: transform 120ms ease, filter 120ms ease, opacity 120ms ease;
        }
        .qs-login-submit:hover:not(:disabled) { filter: brightness(1.08); transform: translateY(-1px); }
        .qs-login-submit:active:not(:disabled) { transform: translateY(0); }
        .qs-login-submit:disabled { opacity: 0.45; cursor: not-allowed; }
        .qs-spinner {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          border: 2px solid rgba(13, 15, 18, 0.25);
          border-top-color: var(--text-on-light);
          animation: qs-spin 700ms linear infinite;
        }
        .qs-login-error {
          margin: 1rem 0 0;
          padding: 0.7rem 0.9rem;
          border-radius: var(--radius);
          background: rgba(255, 107, 110, 0.1);
          border: 1px solid rgba(255, 107, 110, 0.35);
          color: var(--red);
          font-size: 0.9rem;
        }
        .qs-login-divider {
          height: 1px;
          margin: 1.5rem 0 1.25rem;
          background: var(--line);
        }
        .qs-login-foot {
          margin: 0;
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
        .qs-login-checking {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          margin: 0.5rem 0;
          color: var(--text-secondary);
        }
        .qs-login-checking .qs-spinner {
          border-color: var(--line-strong);
          border-top-color: var(--cyan);
        }
        @keyframes qs-rise {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes qs-spin { to { transform: rotate(360deg); } }
        @media (prefers-reduced-motion: reduce) {
          .qs-login, .qs-spinner { animation: none; }
          .qs-login-submit { transition: none; }
        }
      `}</style>

      <section className="panel login-card qs-login" aria-labelledby="login-title">
        <div className="qs-login-sigil" aria-hidden="true">✦</div>
        <div className="auth-copy">
          <p className="eyebrow">Welcome back</p>
          <h2 id="login-title">Enter the sanctuary</h2>
          <p>Sign in to continue your journey through the chambers.</p>
        </div>

        {!ready ? (
          <p className="qs-login-checking" role="status">
            <span className="qs-spinner" aria-hidden="true" />
            Checking your apprentice record…
          </p>
        ) : (
          <>
            <form onSubmit={submit} noValidate>
              <div className="field">
                <label htmlFor="username">Apprentice name</label>
                <input
                  type="text"
                  id="username"
                  autoComplete="username"
                  placeholder="Your name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  autoFocus={!name}
                  required
                />
              </div>
              <div className="field">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoFocus={!!name}
                  required
                />
              </div>
              <button type="submit" className="qs-login-submit" disabled={!valid || busy}>
                {busy && <span className="qs-spinner" aria-hidden="true" />}
                {busy ? 'Signing in…' : 'Sign in'}
              </button>
            </form>

            {error && <p className="qs-login-error" role="alert">{error}</p>}

            <div className="qs-login-divider" />

            <p className="qs-login-foot">
              New apprentice? <Link to="/register">Create an account</Link>
            </p>
          </>
        )}
      </section>
    </main>
  );
}
