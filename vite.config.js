import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // For local testing: run `npm start` inside server/ (with a local .env,
    // see server/.env.example) and this forwards /api calls to it.
    proxy: {
      '/api': 'http://localhost:4000',
    },
  },
})
