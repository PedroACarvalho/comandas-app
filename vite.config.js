import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Proxy para redirecionar chamadas /api para o backend Flask
    proxy: {
      '/api': 'http://backend:5001'
    }
  },

  resolve: {
    alias: {
      // Permite importar arquivos usando @/ em vez de caminhos relativos longos
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  }
})

