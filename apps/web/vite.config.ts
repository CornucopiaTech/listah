import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'
import viteReact from '@vitejs/plugin-react'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import { fileURLToPath, URL } from 'node:url'
import path from 'path';
import dotenv from 'dotenv';
import dotenvExpand from 'dotenv-expand';


const currPath = path.resolve(path.dirname(path.dirname(process.cwd())), '.env');
dotenvExpand.expand(dotenv.config({ path: currPath, }));
console.info(`Loaded environment variables from: ${currPath}`);



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
    // port: 5000,
    // watch: {
    //   ignored: ["**/node_modules", "**/.git", "**/.tanstack"],
    // },
    proxy: {
      "/api/": { // The prefix for API requests in your frontend
        target: process.env.API_HOST_URL_ADDRESS, // The URL of your backend server
        changeOrigin: true, // Ensures the request appears to come from the target domain
        rewrite: (path) => path.replace(/^\/api/, ''), // Remove the /api prefix when forwarding the request
        // secure: false, // Set to true for production with valid SSL certificates, false for development with self-signed certificates
      },
    },
  },
  define: {
    'process.env': process.env,
  },
})
