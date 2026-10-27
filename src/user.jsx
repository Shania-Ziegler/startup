import React from 'react';

import { AuthState } from './login/authState';

const UserContext = React.createContext(null);

export function UserProvider({ children }) {
  const [userName, setUserName] = React.useState(() => localStorage.getItem('userName') || '');
  const authState = userName ? AuthState.Authenticated : AuthState.Unauthenticated;

  const value = React.useMemo(() => ({
    userName,
    authState,
    signedIn: authState === AuthState.Authenticated,
    login(name) {
      localStorage.setItem('userName', name);
      setUserName(name);
    },
    logout() {
      localStorage.removeItem('userName');
      setUserName('');
    },
  }), [userName, authState]);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const user = React.useContext(UserContext);
  if (!user) throw new Error('useUser must be used inside <UserProvider>');
  return user;
}
