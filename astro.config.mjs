// @ts-check
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://xn--d1aiekgbe.xn--p1ai',
  adapter: node({
    mode: 'standalone'
  }),
  integrations: [sitemap()]
});