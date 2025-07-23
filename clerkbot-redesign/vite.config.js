import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  preview: {
    port: 2169,
      strictPort: true,
  },
  server: {
      port: 2169,
      strictPort: true,
      host: true,
      origin: "http://0.0.0.0:2169",
      allowedHosts: ['clerkbot.krizajzan.com'],
    },
})
