import React from 'react';
import { Link } from 'react-router-dom';
import './NotFound.css';

export default function NotFound() {
  return (
    <section className="wrap section">
      <h2>404 — Not Found</h2>
      <p>The page you are looking for doesn’t exist.</p>
      <p>
        <Link className="not-found-link" to="/">
          Return home
        </Link>
      </p>
    </section>
  );
}
