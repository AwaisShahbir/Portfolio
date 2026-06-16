import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/token': {
        target: 'http://127.0.0.1:5001/portfolio-a63a3/us-central1/getLiveKitToken',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/token/, '')
      }
    }
  }
})
