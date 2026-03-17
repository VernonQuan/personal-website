import { Link } from 'react-router-dom';
import { getVisiblePages } from '@/utils/pages';
import './Nav.css';

export default function Nav() {
  const filteredPages = getVisiblePages();

  return (
    <nav aria-label="Primary navigation">
      <ul className="nav">
        {filteredPages.map(({ name, path, label }) => (
          <li key={name}>
            <Link to={path} data-nux-id={`nav-${name}`}>
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
