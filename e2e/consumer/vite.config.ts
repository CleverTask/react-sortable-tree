import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['@clevertask/react-sortable-tree'],
  },
  resolve: {
    dedupe: ['react', 'react-dom'],
  },
});
