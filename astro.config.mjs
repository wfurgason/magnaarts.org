// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';

export default defineConfig({
  output: 'server',
  adapter: vercel(),
  site: 'https://magnaarts.org',
  build: {
    inlineStylesheets: 'always', // inline all CSS into HTML to eliminate render-blocking stylesheet requests
  },
});
