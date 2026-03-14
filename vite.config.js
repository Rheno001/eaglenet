import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true, // Listen on all addresses
    port: 5173,
    strictPort: true, // fail if 5174 is already in use
    allowedHosts: ['.ngrok-free.app', '.ngrok-free.dev', '.ngrok.io'],
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
  },
  build: {
    chunkSizeWarningLimit: 2000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('xlsx') || id.includes('file-saver')) return 'vendor-xlsx';
            if (id.includes('docx')) return 'vendor-docx';
            if (id.includes('lucide-react')) return 'vendor-lucide';
            if (id.includes('sweetalert2')) return 'vendor-sweetalert';
            return 'vendor-core';
          }
        }
      }
    }
  }
})
