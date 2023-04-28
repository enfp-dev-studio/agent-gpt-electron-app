import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'
import { wasm } from '@rollup/plugin-wasm';

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin(), wasm()]
  },
  preload: {
    plugins: [externalizeDepsPlugin(), wasm()]
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src')
      }
    },
    plugins: [react(), wasm()]
  }
})
