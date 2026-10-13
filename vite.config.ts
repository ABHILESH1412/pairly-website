import { defineConfig } from 'vite';
import solid from 'vite-plugin-solid';
import { copyFileSync } from 'node:fs';
import { resolve } from 'node:path';

export default defineConfig({
  // '/' by default; the GitHub Pages workflow sets BASE_PATH to '/<repo>/'.
  base: process.env.BASE_PATH || '/',
  plugins: [
    solid(),
    // Static hosts (GitHub Pages, etc.) serve 404.html for unknown paths, so a copy of the
    // app lets deep links like /download load the SPA.
    {
      name: 'spa-404-fallback',
      apply: 'build',
      closeBundle() {
        copyFileSync(resolve('dist/index.html'), resolve('dist/404.html'));
      },
    },
  ],
});
