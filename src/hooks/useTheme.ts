import { useState } from 'react';

const STORAGE_KEY = 'theme-preference';

function applyTheme(theme: 'dark' | 'light') {
  const root = document.documentElement;
  root.classList.remove('theme-light', 'theme-dark');
  root.classList.add(theme === 'dark' ? 'theme-dark' : 'theme-light');
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {}
}

export function useTheme() {
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'light' || saved === 'dark') {
        applyTheme(saved);
        return saved;
      }
    } catch {}
    // default to dark
    applyTheme('dark');
    return 'dark';
  });

  const toggleTheme = () => {
    setTheme((t) => {
      const newTheme = t === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
      return newTheme;
    });
  };

  return { theme, toggleTheme };
}
