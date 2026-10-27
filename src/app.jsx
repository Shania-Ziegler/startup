import React from 'react';
import { NavLink, Route, Routes, useNavigate } from 'react-router-dom';

import { useUser } from './user';
import { Login } from './login/login';
import { Register } from './register/register';
import { Sanctuary } from './sanctuary/sanctuary';
import { Chamber } from './chamber/chamber';
import { Journal } from './journal/journal';
import { About } from './about/about';
import { NotFound } from './notfound/notfound';

export function App() {
  const { userName, signedIn, logout } = useUser();

  const links = signedIn
    ? [
        { to: '/journal', label: 'Journal' },
        { to: '/map', label: 'Map' },
        { to: '/about', label: 'About' },
      ]
    : [
        { to: '/', label: 'Sign in' },
        { to: '/about', label: 'About' },
      ];

  return (
    <>
      <a className="skip-link visually-hidden-focusable" href="#main">Skip to main content</a>

      <div className="shell">

        <header className="site-header">
          <div className="topbar">
            <div className="brand-row">
              <div className="brand-mark" aria-hidden="true"></div>
              <div>
                <h1>Quantum Sanctuary</h1>
                {signedIn ? (
                  <p className="player-line">
                    Signed in as <span className="player-name">{userName}</span>
                  </p>
                ) : (
                  <p className="player-line">Puzzles about quantum hardware</p>
                )}
              </div>
            </div>

            <nav aria-label="Main navigation">
              <ul className="nav-list">
                {links.map(({ to, label }) => (
                  <li key={label}>
                    <NavLink to={to}>{label}</NavLink>
                  </li>
                ))}
                {signedIn && (
                  <li>
                    <button type="button" className="text-btn" onClick={logout}>Logout</button>
                  </li>
                )}
              </ul>
            </nav>
          </div>

          <hr />
        </header>

        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/map" element={<Protected><Sanctuary /></Protected>} />
          <Route path="/chamber/:chamberId" element={<Protected><Chamber /></Protected>} />
          <Route path="/journal" element={<Protected><Journal /></Protected>} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Routes>

        <footer className="site-footer">
          <hr />
          <div className="footer-inner">
            <p>Quantum Sanctuary · Shania Ziegler</p>
            <p>
              <a href="https://github.com/Shania-Ziegler/startup" target="_blank" rel="noopener noreferrer">
                GitHub
              </a>
            </p>
          </div>
        </footer>

      </div>
    </>
  );
}

function Protected({ children }) {
  const { signedIn } = useUser();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!signedIn) navigate('/');
  }, [signedIn, navigate]);

  return signedIn ? children : null;
}