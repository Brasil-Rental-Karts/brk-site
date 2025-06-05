import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'html-env-vars',
      transformIndexHtml: {
        enforce: 'pre',
        transform: (html, context) => {
          return html.replace(
            /%VITE_CLARITY_ID%/g,
            process.env.VITE_CLARITY_ID || ''
          )
        }
      }
    }
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5174,
  },
})
