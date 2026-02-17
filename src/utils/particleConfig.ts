import { tsParticles } from 'tsparticles-engine';
import { loadSlim } from 'tsparticles-slim';

export const initParticles = async (
  color: { r: number; g: number; b: number },
  enableLinks: boolean = true
) => {
  await loadSlim(tsParticles);
  await tsParticles.load('tsparticles', {
    background: {
      color: {
        value: 'transparent',
      },
    },
    interactivity: {
      events: {
        onHover: {
          enable: enableLinks,
          mode: ['grab', 'connect'],
        },
      },
      modes: {
        grab: {
          distance: 200,
          links: {
            opacity: 1,
          },
        },
      },
    },
    fpsLimit: 60,
    particles: {
      links: {
        enable: true,
        distance: 120,
        opacity: 0.8,
        width: 1,
        color: { value: color },
        blink: true, // ⚡ flicker
        consent: false,
      },
      move: {
        enable: true,
        speed: 2,
        random: true, // subtle jitter
      },
      number: {
        density: {
          enable: true,
          area: 800,
        },
        value: 80,
      },
      opacity: {
        value: { min: 0.3, max: 1 },
        animation: {
          enable: true,
          speed: 3,
          minimumValue: 0.3,
          sync: false,
        },
      },
      shape: {
        type: 'circle',
      },
      size: {
        value: { min: 1, max: 3 },
      },
    },
    detectRetina: true,
  });
};
