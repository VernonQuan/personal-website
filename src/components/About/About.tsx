import React from 'react';
import './About.css';
import { Card } from '@/components/Card/Card';

export default function About() {
  return (
    <div className="wrap section gap-lg flex-col">
      <h2>About</h2>
      <Card>
        <p>
          I’m a frontend engineer focused on building thoughtful, high quality user experiences. I
          specialize in React and TypeScript, with an emphasis on accessibility, performance, and
          maintainable architecture. At Meta, I worked on large scale user facing products where
          reliability and polish mattered. I care about the details that shape how software feels,
          from loading states to interaction patterns to long term code clarity. I enjoy turning
          complex problems into intuitive interfaces and shipping work that feels simple and
          intentional.
        </p>
      </Card>
      <Card>
        <p>
          I care about building software that feels clear and dependable. I prefer simple solutions
          over clever ones, and I value performance and accessibility as core features, not
          afterthoughts. I try to write code that is easy to understand six months later, whether by
          me or someone else on the team.
        </p>
      </Card>
    </div>
  );
}
