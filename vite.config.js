import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // GitHub Pages deploys to /<repo-name>/ — update this to match your repo name
  base: '/dbt-fusion-guide/',
})
