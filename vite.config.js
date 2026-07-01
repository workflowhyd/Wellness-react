import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // For local testing: run `php -S localhost:8099 -t hostinger-api`
    // with a dev config.php, then form submissions/search/admin data hit it.
    proxy: {
      '/hostinger-api': {
        target: 'http://localhost:8099',
        rewrite: (path) => path.replace(/^\/hostinger-api/, ''),
      },
    },
  },
})
