import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'https://portfolio-backend-3ame.onrender.com',
      '/uploads': 'https://portfolio-backend-3ame.onrender.com'
    }
  }
})
