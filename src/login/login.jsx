import React from 'react';

import { useUser } from '../user';
import { Authenticated } from './authenticated';
import { Unauthenticated } from './unauthenticated';

export function Login() {
  const { userName, signedIn, login, logout } = useUser();

  return (
    <main id="main" className="auth-main">
      <section className="panel login-card" aria-labelledby="login-title">
        {signedIn ? (
          <Authenticated userName={userName} onLogout={logout} />
        ) : (
          <Unauthenticated onLogin={login} />
        )}
      </section>
    </main>
  );
}