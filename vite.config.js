import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Sur GitHub Actions, l'application est servie depuis /acquaegiardini/
// (GitHub Pages « project site »). En local, elle reste servie depuis la racine.
const base = process.env.GITHUB_ACTIONS ? '/acquaegiardini/' : '/';

export default defineConfig({
  base,
  plugins: [react()],
  server: {
    port: 5173,
    open: false,
  },
});
