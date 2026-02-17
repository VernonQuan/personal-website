export type page = 'home' | 'about' | 'resume' | 'projects' | 'contact' | 'not-found';

export const pages: { name: page; path: string; label: string }[] = [
  { name: 'about', path: '/about', label: 'About' },
  { name: 'resume', path: '/resume', label: 'Resume' },
  { name: 'contact', path: '/contact', label: 'Contact' },
];
