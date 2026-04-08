import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ['c0ea-2a02-a471-1c55-0-434-7237-cbbf-9dbe.ngrok-free.app'],
  },
})
