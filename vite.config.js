import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
// Lo-fi disajikan di /lofi/ — URL utama dipakai hi-fi React (hifi/).
export default defineConfig({
  base: '/lofi/',
  plugins: [react(), tailwindcss()],
  server: {
    port: Number(process.env.PORT) || 5173,
  },
})
