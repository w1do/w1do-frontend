// @ts-check
import { defineConfig, envField } from 'astro/config';
import node from '@astrojs/node';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  site: 'https://w1do.ru',
  server: {
    host: "0.0.0.0"
  },
  env: {
    schema: {
      // Read at runtime from the environment, never inlined into the build.
      LEADS_API_KEY: envField.string({ context: 'server', access: 'secret', optional: true }),
      LEADS_API_BASE_URL: envField.string({ context: 'server', access: 'secret', optional: true }),
      W1DO_DEFAULT_CITY: envField.string({ context: 'server', access: 'secret', default: 'moscow' }),
    },
  },
  output: 'server',
  adapter: node({
    mode: 'standalone'
  }),
  trailingSlash: 'never',
  integrations: [react()],
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
