import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  root: ".", // keep root as project root since index.html is here
  build: {
    outDir: "dist", // Vercel/Netlify expects this
  },
})
