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
            const match = id.match(/([a-zA-Z]+Directory)/);
            if (match) return `data-${match[1].toLowerCase()}`;
            return 'state-directories-data';
          }
          if (id.includes('src/components/explore-india/')) {
            const match = id.match(/([a-zA-Z]+DirectorySection)/);
            if (match) return `ui-${match[1].toLowerCase()}`;
            return 'explore-india-components';
          }
        },
      },
    },
  },
});
