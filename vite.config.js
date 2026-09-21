import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  server: {
    port: 5757,
    // The project lives on the Windows filesystem (/mnt/c), where WSL gets no
    // inotify events - without polling, Vite never picks up file changes.
    watch: {
      usePolling: true,
      interval: 300,
    },
  },
})
