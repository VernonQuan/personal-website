import React from 'react';
import { useParams } from 'react-router-dom';
import './ProjectDetail.css';

export default function ProjectDetail() {
  const { id } = useParams() as { id?: string };

  return (
    <section className="wrap section project-detail">
      <h2>Project: {id}</h2>
      <p>
        Details for project <strong>{id}</strong>. Replace this with actual project content and
        images.
      </p>
    </section>
  );
}
