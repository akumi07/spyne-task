import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist', // Ensure this is correct
  },
  server: {
    port: 3000, // Optional: Local dev server port
  },
  base: './', // Important if you’re serving from a subdirectory
});
