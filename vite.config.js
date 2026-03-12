import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true, // Listen on all addresses
    port: 5174,
    strictPort: true, // fail if 5174 is already in use
    allowedHosts: ['.ngrok-free.app', '.ngrok-free.dev', '.ngrok.io'],
    hmr: {
      protocol: 'ws',
      host: 'localhost',
      clientPort: 5174
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
