import React from 'react';
import { NavLink, Route, Routes, useLocation } from 'react-router-dom';

import { Login } from './login/login';
import { Register } from './register/register';
import { Sanctuary } from './map/map';
import { Chamber } from './chamber/chamber';
import { Journal } from './journal/journal';
import { About } from './about/about';
import { NotFound } from './notfound/notfound';

// Signed out, only the About page is reachable. Once the player is in
// thegame the full set of views is available.
const signedOutNav = [{ to: '/about', label: 'About' }];

const signedInNav = [
  { to: '/journal', label: 'Journal' },
  { to: '/map', label: 'Sanctuary' },
  { to: '/chamber', label: 'Chamber' },
  { to: '/about', label: 'About' },
  { to: '/', label: 'Logout', end: true },
];

export default function App() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/' || location.pathname === '/register';
  const navLinks = isAuthPage ? signedOutNav : signedInNav;

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

                {isAuthPage ? (
                  <p className="player-line">A puzzle sanctuary for quantum spirits</p>
                ) : (
                  <p className="player-line">
                    Apprentice <span id="player-name" className="player-name">Guest</span>
                  </p>
                )}
              </div>
            </div>

            <nav aria-label="Main navigation">
              <ul className="nav-list">
                {navLinks.map(({ to, label, end }) => (
                  <li key={label}>
                    <NavLink to={to} end={end}>{label}</NavLink>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <hr />
        </header>

        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/map" element={<Sanctuary />} />
          <Route path="/chamber" element={<Chamber />} />
          <Route path="/journal" element={<Journal />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Routes>

        <footer className="site-footer">
          <hr />
          <div className="footer-inner">
            <p>Quantum Sanctuary · Shania Ziegler</p>
            <p>
              <a
                href="https://github.com/Shania-Ziegler/startup"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
            </p>
          </div>
        </footer>

      </div>
    </>
  );
}