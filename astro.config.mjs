// @ts-check
import { defineConfig, envField } from 'astro/config';
import node from '@astrojs/node';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  site: 'https://aicraft.agency',
  server: {
    host: "0.0.0.0"
  },
  env: {
    schema: {
      // Read at runtime from the environment, never inlined into the build.
      LEADS_API_KEY: envField.string({ context: 'server', access: 'secret', optional: true }),
      LEADS_API_BASE_URL: envField.string({ context: 'server', access: 'secret', optional: true }),
      W1DO_DEFAULT_CITY: envField.string({ context: 'server', access: 'secret', default: 'moscow' }),
      POLZA_AI_API_KEY: envField.string({ context: 'server', access: 'secret', optional: true }),
      POLZA_AI_MODEL: envField.string({ context: 'server', access: 'secret', default: 'openai/gpt-4o-mini' }),
      REDIS_URL: envField.string({ context: 'server', access: 'secret', optional: true }),
      TRUSTED_PROXY_HOPS: envField.number({ context: 'server', access: 'secret', default: 0 }),
      CHAT_LEAD_HASH_SECRET: envField.string({ context: 'server', access: 'secret', optional: true }),
      RAG_API_URL: envField.string({ context: 'server', access: 'secret', optional: true }),
      RAG_API_KEY: envField.string({ context: 'server', access: 'secret', optional: true }),
      RAG_PROJECT_ID: envField.string({ context: 'server', access: 'secret', optional: true }),
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
    // Keep generated assets on the current origin, including after domain changes.
    inlineStylesheets: 'auto'
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
