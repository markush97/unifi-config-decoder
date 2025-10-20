import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
  },
  base: './',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      external: ['electron'],
      output: {
        manualChunks: id => {
          // Vendor chunk for React and core libraries
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
            return 'vendor';
          }
          // BSON and data processing
          if (
            id.includes('node_modules/bson') ||
            id.includes('node_modules/pako') ||
            id.includes('node_modules/jszip') ||
            id.includes('node_modules/crypto')
          ) {
            return 'utils';
          }
          // Other node_modules
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
      },
    },
  },
});
