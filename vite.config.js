import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
  },
  server: {
    proxy: {
      '/r': {
        target: 'https://www.reddit.com',
        changeOrigin: true,
        secure: true,
      },
      '/subreddits': {
        target: 'https://www.reddit.com',
        changeOrigin: true,
        secure: true,
      },
      '/search': {
        target: 'https://www.reddit.com',
        changeOrigin: true,
        secure: true,
      },
    },
  },
})
