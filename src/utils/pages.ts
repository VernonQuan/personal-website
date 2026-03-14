export type page = 'home' | 'about' | 'resume' | 'projects' | 'contact' | 'not-found';

export const pages: { name: page; path: string; label: string }[] = [
  { name: 'about', path: '/about', label: 'About' },
  { name: 'resume', path: '/resume', label: 'Resume' },
  { name: 'projects', path: '/projects', label: 'Projects' },
  { name: 'contact', path: '/contact', label: 'Contact' },
];

const isDevelopment = import.meta.env.VITE_APP_ENV === 'development';

export const isPageEnabled = (name: page) => name !== 'projects' || isDevelopment;

export const getVisiblePages = () => pages.filter(({ name }) => isPageEnabled(name));

export const isPathEnabled = (targetPath: string) => {
  if (targetPath === '/') {
    return true;
  }

  return pages.some((page) => page.path === targetPath && isPageEnabled(page.name));
};
