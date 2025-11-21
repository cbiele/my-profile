import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './', // Use relative paths so it works on https://user.github.io/repo/
  build: {
    outDir: 'dist',
  }
})