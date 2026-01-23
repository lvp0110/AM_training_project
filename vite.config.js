import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    extensions: ['.js', '.jsx', '.json']
  },
  // Base path для GitHub Pages
  // Для локальной разработки используйте: base: '/'
  // Для GitHub Pages с подпапкой используйте: base: '/имя-репозитория/'
  base: '/AM_training_project/',
  build: {
    sourcemap: false, // Отключаем source maps для production
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  },
  server: {
    port: 5173,
    open: true,
    proxy: {
      '/api': {
        target: 'https://dev3.constrtodo.ru:3005',
        changeOrigin: true,
        secure: false
      }
    }
  }
})