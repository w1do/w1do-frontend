// @ts-check
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';
import llms from 'astro-llms-md';
import { serializeSitemapItem } from './src/utils/sitemap.js';

// https://astro.build/config
export default defineConfig({
  site: 'https://w1do.ru',
  server: {
    host: "0.0.0.0"
  },
  output: 'static',
  adapter: node({
    mode: 'standalone'
  }),
  trailingSlash: 'never',
  integrations: [react(), sitemap({
    serialize: serializeSitemapItem,
  }), llms({
    name: 'Разработчик ИИ, внедрение и автоматизация',
    description: 'Разработка AI-агентов, автоматизация CRM и создание MVP. Внедряю нейросети в бизнес и сокращаю расходы до 70%.',
    contentSelector: 'body',
    excludeSelectors: ['header', 'footer', 'nav', 'form', 'noscript'],
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