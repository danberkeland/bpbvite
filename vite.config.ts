import { defineConfig } from 'vite';
import commonjs from 'vite-plugin-commonjs';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/bpbvite/',
  plugins: [react(), commonjs()], // Fixed array syntax
  define: { global: 'window' },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
    css: true,
    reporters: ['verbose'],
    coverage: {
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*'],
      exclude: [],
    },
  },
  esbuild: {
    loader: 'jsx',
    include: /src\/.*\.js$/, // Apply loader to .js files in src/
  },
});
