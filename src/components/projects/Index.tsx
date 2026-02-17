import React from 'react';
import { Link } from 'react-router-dom';
import './Index.css';

const sampleProjects = [
  { id: 'one', title: 'Project One', desc: 'Short description of project one.' },
  { id: 'two', title: 'Project Two', desc: 'Short description of project two.' },
];

export default function ProjectsIndex() {
  return (
    <section className="wrap section">
      <h2>Projects</h2>
      <p>Browse some sample projects. Click any item for details.</p>
      <ul className="projects-list">
        {sampleProjects.map(({ id, title, desc }) => (
          <li key={id} className="project-card">
            <h3>
              <Link className="project-link" to={id}>
                {title}
              </Link>
            </h3>
            <p>{desc}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
