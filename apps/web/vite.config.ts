import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'
import viteReact from '@vitejs/plugin-react'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import { fileURLToPath, URL } from 'node:url'


// const config = await fetch('/config.json').then(r => r.json());
// console.info("config", config);


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
    // proxy: {
    //   // "/api/readItem": { // The prefix for API requests in your frontend
    //   //   target: config.apiUrl, // The URL of your backend server
    //   //   changeOrigin: true, // Ensures the request appears to come from the target domain
    //   //   rewrite: config.apiReadItem,
    //   //   // rewrite: (path) => path.replace(/^\/api/, config.apiReadItem), // Remove the /api prefix when forwarding the request
    //   //   // secure: false, // Set to true for production with valid SSL certificates, false for development with self-signed certificates
    //   // },
    //   "/api/readItem": {
    //     target: config.apiUrl,
    //     changeOrigin: true,
    //     rewrite: (path) => config.apiReadItem
    //   },
    //   "/api/updateItem": {
    //     target: config.apiUrl,
    //     changeOrigin: true,
    //   },
    //   "/api/readCategory": {
    //     target: config.apiUrl,
    //     changeOrigin: true,
    //   },
    //   "/api/readTag": {
    //     target: config.apiUrl,
    //     changeOrigin: true,
    //   },
    // },
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
