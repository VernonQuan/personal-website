import path from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: '@', replacement: path.resolve(__dirname, 'src') },
      { find: 'components', replacement: path.resolve(__dirname, 'src/components') },
      { find: 'pages', replacement: path.resolve(__dirname, 'src/pages') },
      { find: 'hooks', replacement: path.resolve(__dirname, 'src/hooks') },
      { find: 'utils', replacement: path.resolve(__dirname, 'src/utils') },
    ],
  },
});
