import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Proxy /api to the Express server (MERN backend) during development.
export default defineConfig({
  plugins: [react()],
  test: { environment: 'jsdom', setupFiles: './src/test/setup.js', globals: true },
  server: { proxy: { '/api': 'http://localhost:5000' } },
});
