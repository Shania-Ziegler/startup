import React from 'react';
import { Link } from 'react-router-dom';

export function NotFound() {
  return (
    <main id="main">
      <div className="page-heading">
        <h2>Page not found.</h2>
        <p>
          <Link to="/map">Back to the map</Link>
        </p>
      </div>
    </main>
  );
}