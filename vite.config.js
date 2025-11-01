import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true, // Listen on all addresses
    port: 5173,
    strictPort: true, // fail if 5173 is already in use
    hmr: {
      protocol: 'ws',
      host: 'localhost',
      clientPort: 5173
    },
    watch: {
      usePolling: true,
      interval: 1000
    },
    cors: true
  },
  preview: {
    port: 5173
  },
  // Add base URL configuration
  base: '/',
  // Optimize deps
  optimizeDeps: {
    include: ['react', 'react-dom']
  }
})
