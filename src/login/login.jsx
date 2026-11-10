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
          border-color: var(--text);
          background: var(--bg);
        }
        .qs-login input:-webkit-autofill,
        .qs-login input:-webkit-autofill:hover,
        .qs-login input:-webkit-autofill:focus {
          -webkit-text-fill-color: var(--text);
          caret-color: var(--text);
          box-shadow: 0 0 0 1000px var(--bg) inset;
        }
        .qs-login-submit {
          width: 100%;
          min-height: 48px;
          margin-top: 0.5rem;
          border: 0;
          border-radius: var(--radius);
          background: var(--text);
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
          color: var(--text);
          font-weight: 600;
          text-decoration: none;
        }
        .qs-login-foot a:hover { text-decoration: underline; }
      `}</style>

      <section className="panel login-card qs-login" aria-labelledby="login-title">
        <h2 id="login-title">Enter the sanctuary</h2>

        {!ready ? (
          <p role="status">Checking your apprentice record…</p>
        ) : (
          <>
            <form onSubmit={submit} noValidate>
              <div className="field">
                <label htmlFor="username">Apprentice name</label>
                <input
                  type="text"
                  id="username"
                  autoComplete="username"
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
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoFocus={!!name}
                  required
                />
              </div>
              <button type="submit" className="qs-login-submit" disabled={!valid || busy}>
                {busy ? 'Signing in…' : 'Sign in'}
              </button>
            </form>

            {error && <p className="qs-login-error" role="alert">{error}</p>}

            <p className="qs-login-foot">
              New apprentice? <Link to="/register">Create an account</Link>
            </p>
          </>
        )}
      </section>
    </main>
  );
}
