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

  const valid = name.trim().length >= 2 && password.length >= 4;

  return (
    <main id="main">
      <style>{`
        .qs-auth { max-width: 24rem; }
        .qs-auth-error { color: #ff9b9b; font-size: 0.85rem; margin: 0.6rem 0 0; }
        .qs-auth-foot { font-size: 0.85rem; margin: 0.9rem 0 0; }
      `}</style>

      <section className="card qs-auth" aria-labelledby="login-title">
        <h2 id="login-title">Enter the sanctuary</h2>

        {!ready ? (
          <p>Checking your apprentice record.</p>
        ) : (
          <>
            <form onSubmit={submit}>
              <div>
                <label htmlFor="username">Apprentice name</label>
                <input
                  type="text"
                  id="username"
                  autoComplete="username"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn-primary" disabled={!valid || busy}>
                {busy ? 'Signing in' : 'Sign in'}
              </button>
            </form>

            {error && <p className="qs-auth-error" role="alert">{error}</p>}

            <p className="qs-auth-foot">
              New apprentice? <Link to="/register">Create an account</Link>
            </p>
          </>
        )}
      </section>
    </main>
  );
}
