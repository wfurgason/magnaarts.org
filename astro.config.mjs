// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';

export default defineConfig({
  output: 'server',
  adapter: vercel(),
  site: 'https://magnaarts.org',
  build: {
    inlineStylesheets: 'auto', // inline CSS files under 4 KB to eliminate render-blocking stylesheet requests
  },
});
