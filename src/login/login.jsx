import React from 'react';

import { AuthState } from './authState';
import { Authenticated } from './authenticated';
import { Unauthenticated } from './unauthenticated';

export function Login({ userName, authState, onAuthChange }) {
  return (
    <main id="main" className="auth-main">
      <section className="panel login-card" aria-labelledby="login-title">
        {authState === AuthState.Authenticated ? (
          <Authenticated
            userName={userName}
            onLogout={() => {
              localStorage.removeItem('userName');
              onAuthChange('', AuthState.Unauthenticated);
            }}
          />
        ) : (
          <Unauthenticated
            onLogin={(name) => {
              localStorage.setItem('userName', name);
              onAuthChange(name, AuthState.Authenticated);
            }}
          />
        )}
      </section>
    </main>
  );
}