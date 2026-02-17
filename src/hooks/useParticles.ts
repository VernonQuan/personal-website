import { useEffect } from 'react';
import { tsParticles } from 'tsparticles-engine';
import { initParticles } from '@/utils/particleConfig';

export const useParticles = (theme: 'dark' | 'light') => {
  useEffect(() => {
    const color = theme === 'dark' ? { r: 255, g: 255, b: 255 } : { r: 26, g: 26, b: 26 };
    const enableLinks = theme === 'dark';

    const container = tsParticles.domItem(0);
    if (container) {
      container.destroy();
    }

    initParticles(color, enableLinks);
  }, [theme]);
};
