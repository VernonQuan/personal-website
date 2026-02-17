import { GithubLink, LinkedInLink } from './SocialLinks';
import ThemeToggle from './ThemeToggle';

import './HeaderActions.css';

export function HeaderActions() {
  return (
    <div className="header-actions">
      <GithubLink />
      <LinkedInLink />
      <ThemeToggle />
    </div>
  );
}
