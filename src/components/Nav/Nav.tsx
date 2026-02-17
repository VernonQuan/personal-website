import { Link } from 'react-router-dom';
import { pages } from '@/utils/pages';
import './Nav.css';

export default function Nav() {
  return (
    <nav aria-label="Primary navigation">
      <ul className="nav">
        {pages.map(({ name, path, label }) => (
          <li key={name}>
            <Link to={path}>{label}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
