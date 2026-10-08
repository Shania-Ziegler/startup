import React from 'react';
import { NavLink, Route, Routes, useLocation } from 'react-router-dom';

import { Login } from './login/login';
import { Register } from './register/register';
import { Sanctuary } from './map/map';
import { Chamber } from './chamber/chamber';
import { Journal } from './journal/journal';
import { About } from './about/about';

export default function App() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/' || location.pathname === '/register';

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
              {isAuthPage ? (
                <ul className="nav-list">
                  <li><NavLink to="/about">About</NavLink></li>
                </ul>
              ) : (
                <ul className="nav-list">
                  <li><NavLink to="/journal">Journal</NavLink></li>
                  <li><NavLink to="/map">Sanctuary</NavLink></li>
                  <li><NavLink to="/chamber">Chamber</NavLink></li>
                  <li><NavLink to="/about">About</NavLink></li>
                  <li><NavLink to="/" end>Logout</NavLink></li>
                </ul>
              )}
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

function NotFound() {
  return (
    <main id="main">
      <div className="page-heading">
        <p className="eyebrow">Lost</p>
        <h2>That chamber does not exist.</h2>
      </div>
    </main>
  );
}