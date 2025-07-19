import { defineConfig } from 'vite';
import viteReact from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import { tanstackRouter } from '@tanstack/router-plugin/vite';
import { resolve } from 'node:path'


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    tanstackRouter({ autoCodeSplitting: true }),
    viteReact(),
    nodePolyfills(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      // 'vite-plugin-node-polyfills/shims/buffer': resolve(
      //     __dirname,
      //     'node_modules',
      //     'vite-plugin-node-polyfills',
      //     'shims',
      //     'buffer',
      //     'dist',
      //     'index.cjs'
      // ),
      // 'vite-plugin-node-polyfills/shims/global': resolve(
      //     __dirname,
      //     'node_modules',
      //     'vite-plugin-node-polyfills',
      //     'shims',
      //     'global',
      //     'dist',
      //     'index.cjs'
      // ),
      // 'vite-plugin-node-polyfills/shims/process': resolve(
      //     __dirname,
      //     'node_modules',
      //     'vite-plugin-node-polyfills',
      //     'shims',
      //     'process',
      //     'dist',
      //     'index.cjs'
      // ),
    },
  }
})
