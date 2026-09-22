import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/utoken-api': {
        target: 'https://utoken.gg',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/utoken-api/, ''),
      },
    },
  },
})
