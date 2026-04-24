import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import basicSsl from '@vitejs/plugin-basic-ssl'

export default defineConfig({
  plugins: [react(), basicSsl()],
  css: {
    preprocessorOptions: {
      scss: {
        silenceDeprecations: ['legacy-js-api'],
      },
    },
  },
  server: {
    https: true,
    allowedHosts: ['7b89-2a02-a471-1c55-0-434-7237-cbbf-9dbe.ngrok-free.app'],
  },
})
