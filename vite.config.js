import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
  // Absolute base so nested SPA routes (e.g. /trek/:id) resolve assets to
  // /assets/... when Netlify falls through /index.html for client-side routing.
  // A relative base breaks every route except '/'.
  base: '/',
})
