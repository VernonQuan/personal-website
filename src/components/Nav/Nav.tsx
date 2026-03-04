import { Link } from 'react-router-dom';
import { pages } from '@/utils/pages';
import './Nav.css';

export default function Nav() {
  const isDev = import.meta.env.VITE_APP_ENV === 'development';

  const filteredPages = pages.filter(({ name }) => {
    if (name === 'projects' && !isDev) {
      return false;
    }
    return true;
  });

  return (
    <nav aria-label="Primary navigation">
      <ul className="nav">
        {filteredPages.map(({ name, path, label }) => (
          <li key={name}>
            <Link to={path}>{label}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
