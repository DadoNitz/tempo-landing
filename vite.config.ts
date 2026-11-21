import { readdirSync } from 'node:fs'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base './' keeps every asset path relative, so the build works on GitHub Pages under /<repo>/
// __IMGS__: the pictures that exist, so src/img.ts can fall back to the current ones (docs/image-briefs.md).
export default defineConfig({
  base: './',
  plugins: [react()],
  define: { __IMGS__: JSON.stringify(readdirSync(new URL('public/img', import.meta.url))) },
})
