import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Hi-fi = URL utama; build ke dist/ di root repo, lo-fi menyusul ke dist/lofi/.
  build: { outDir: '../dist', emptyOutDir: true },
  server: {
    port: Number(process.env.PORT) || 5173,
  },
})
