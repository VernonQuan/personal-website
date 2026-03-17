import { FiGithub, FiLinkedin } from 'react-icons/fi';

import './SocialLinks.css';

export function GithubLink({ size = 18 }: { size?: number }) {
  return (
    <a
      href="https://github.com/vernonquan"
      target="_blank"
      rel="noopener noreferrer"
      className="social-link github-link"
      data-nux-id="social-github"
      aria-label="GitHub"
    >
      <FiGithub size={size} />
    </a>
  );
}

export function LinkedInLink({ size = 18 }: { size?: number }) {
  return (
    <a
      href="https://www.linkedin.com/in/vernonquan/"
      target="_blank"
      rel="noopener noreferrer"
      className="social-link linkedin-link"
      data-nux-id="social-linkedin"
      aria-label="LinkedIn"
    >
      <FiLinkedin size={size} />
    </a>
  );
}
