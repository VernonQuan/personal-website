import React from 'react';
import './Contact.css';
import { Card } from '../Card/Card';

export default function Contact() {
  return (
    <section className="wrap section">
      <h2>Contact</h2>
      <Card>
        <h3>Vernon Quan</h3>
        <p>
          Email:{' '}
          <a className="contact-link" href="mailto:vernonquan@gmail.com">
            vernonquan@gmail.com
          </a>
        </p>
        <p>
          <a
            className="contact-link"
            href="https://www.linkedin.com/in/vernonquan"
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn
          </a>
        </p>
        <p>
          <a
            className="contact-link"
            href="https://github.com/vernonquan"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
        </p>
      </Card>
    </section>
  );
}
