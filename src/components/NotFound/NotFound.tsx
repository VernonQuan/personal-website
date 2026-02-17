import React from 'react';
import { Link } from 'react-router-dom';
import '@/components/shared.css';

export default function NotFound() {
  return (
    <section className="wrap section">
      <h2>404 — Not Found</h2>
      <p>The page you are looking for doesn't exist.</p>
      <p>
        <Link className="link-plain" to="/">
          Return home
        </Link>
      </p>
    </section>
  );
}
