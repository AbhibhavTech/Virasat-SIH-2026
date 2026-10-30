// Ensure native esbuild Go worker processes operate smoothly within OS memory boundaries
process.env.GOMAXPROCS = process.env.GOMAXPROCS || '1';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: '0.0.0.0',
    allowedHosts: true,
  },
  build: {
    sourcemap: false,
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('leaflet')) return 'vendor-leaflet';
            if (id.includes('lucide-react')) return 'vendor-icons';
            if (id.includes('@tanstack')) return 'vendor-query';
            if (id.includes('motion')) return 'vendor-motion';
            if (id.includes('react-markdown') || id.includes('remark-gfm')) return 'vendor-markdown';
          }
          if (id.includes('src/data/') && id.includes('Directory')) {
            const match = id.match(/([a-zA-Z]+)Directory/);
            if (match) {
              const firstChar = match[1][0].toUpperCase();
              if (firstChar <= 'G') return 'data-states-ag';
              if (firstChar <= 'M') return 'data-states-hm';
              if (firstChar <= 'R') return 'data-states-nr';
              return 'data-states-sz';
            }
            return 'data-states-other';
          }
          if (id.includes('src/components/explore-india/')) {
            const match = id.match(/([a-zA-Z]+)DirectorySection/);
            if (match) {
              const firstChar = match[1][0].toUpperCase();
              if (firstChar <= 'G') return 'ui-states-ag';
              if (firstChar <= 'M') return 'ui-states-hm';
              if (firstChar <= 'R') return 'ui-states-nr';
              return 'ui-states-sz';
            }
            return 'explore-india-components';
          }
        },
      },
    },
  },
});
