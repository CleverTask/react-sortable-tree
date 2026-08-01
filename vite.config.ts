import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const consumerRoot = resolve(__dirname, 'e2e/consumer');

// https://vite.dev/config/
export default defineConfig(({ command, isPreview }) => {
  const isDevelopmentServer = command === 'serve' && !isPreview;

  return {
    root: isDevelopmentServer ? consumerRoot : undefined,
    plugins: [react()],
    resolve: isDevelopmentServer
      ? {
          alias: [
            {
              find: /^@clevertask\/react-sortable-tree$/,
              replacement: resolve(__dirname, 'src/index.ts'),
            },
          ],
          dedupe: ['react', 'react-dom'],
        }
      : undefined,
    build: {
      lib: {
        entry: resolve(__dirname, 'src/index.ts'),
        formats: ['es'],
      },
      rollupOptions: {
        external: ['react', 'react/jsx-runtime', 'react-dom', 'react-dom/client'],
      },
      sourcemap: true,
    },
  };
});
