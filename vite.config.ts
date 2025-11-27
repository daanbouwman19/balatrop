import { fileURLToPath, URL } from 'node:url'
import type { UserConfig } from "vite"
import vue from "@vitejs/plugin-vue"

import tailwindcss from '@tailwindcss/vite'

export default {
  plugins: [vue(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
} satisfies UserConfig