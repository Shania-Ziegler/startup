import React from 'react';
import { Link } from 'react-router-dom';

export function NotFound() {
  return (
    <main id="main">
      <div className="page-heading">
        <p className="eyebrow">Lost in the sanctuary</p>
        <h2>That chamber does not exist.</h2>
        <p>
          The path you followed leads nowhere.{' '}
          <Link to="/map">Return to the sanctuary map</Link>.
        </p>
      </div>
    </main>
  );
}