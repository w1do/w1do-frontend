// @ts-check
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import sitemap from '@astrojs/sitemap';
import { serializeSitemapItem } from './src/utils/sitemap.js';

// https://astro.build/config
export default defineConfig({
  site: 'https://w1do.ru',
  server: {
    host: true
  },
  output: 'static',
  adapter: node({
    mode: 'standalone'
  }),
  trailingSlash: 'never',
  integrations: [sitemap({
    serialize: serializeSitemapItem,
  })],
  prefetch: true,
  build: {
    assets: '_astro',
    inlineStylesheets: 'auto',
    assetsPrefix: 'https://w1do.ru'
  },
  vite: {
    build: {
      cssCodeSplit: true,
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
        },
      },
      rollupOptions: {
        output: {
          assetFileNames: 'assets/[name].[hash][extname]',
          chunkFileNames: 'chunks/[name].[hash].js',
          entryFileNames: 'entry/[name].[hash].js'
        }
      }
    },
  },
});