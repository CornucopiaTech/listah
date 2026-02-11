import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'
import viteReact from '@vitejs/plugin-react'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import { fileURLToPath, URL } from 'node:url'

import { config } from './src/config';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    devtools(),
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
    }),
    viteReact(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: config.apiUrl,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  // define: {
  //   'process.env': {
  //     SERVER_STATE: {
  //       CATEGORY_READ: process.env.LISTAH_PROXY_CATEGORY_READ,
  //       TAG_READ: process.env.LISTAH_PROXY_TAG_READ,
  //       ITEMS_READ: process.env.LISTAH_PROXY_ITEMS_READ,
  //       ITEMS_UPDATE: process.env.LISTAH_PROXY_ITEMS_UPDATE,
  //       ITEMS_CREATE: process.env.LISTAH_PROXY_ITEMS_CREATE,
  //     },
  //     AUTH_CONFIG: {
  //       CLERK_KEY: process.env.VITE_CLERK_PUBLISHABLE_KEY,
  //       SIGN_IN_URL: process.env.CLERK_SIGN_IN_URL,
  //       SIGN_UP_URL: process.env.CLERK_SIGN_UP_URL,
  //     },
  //   }
  //   // 'process.env': process.env,
  // },
})


// http://localhost:8080/listah.v1.ItemService/Read
// http://localhost:3000/api/listah.v1.ItemService/Read
// http://localhost:8080/api/listah.v1.ItemService/Read
// http://localhost:8080/listah.v1.ItemService/Read
//
