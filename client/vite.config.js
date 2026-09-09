import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,        // listen on 0.0.0.0 so it's reachable from outside the container
    port: 5173,
    allowedHosts: true, // don't reject requests based on the Host header nginx forwards
  },
})
