import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: 'src/index.html',
      },
      onwarn(warning, warn) {
        if (warning.code === 'EVAL' && warning.id && warning.id.includes('pdfjs-dist')) {
          return;
        }
        warn(warning);
      },
      output: {
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          pdfjs: ['pdfjs-dist'],
          pdflib: ['pdf-lib'],
          jspdf: ['jspdf', 'html2canvas'],
          icons: ['lucide-react']
        }
      },
    },
  },
});
