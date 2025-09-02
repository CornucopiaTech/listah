import { defineConfig } from 'vite';
import viteReact from '@vitejs/plugin-react';
import { TanStackRouterVite } from '@tanstack/router-plugin/vite';
import { resolve } from 'node:path';
import dotenv from 'dotenv';
import dotenvExpand from 'dotenv-expand';
import path from 'node:path';


const currPath = path.resolve(path.dirname(path.dirname(process.cwd())), '.env');
dotenvExpand.expand(dotenv.config({ path: currPath, }));
console.info(`Loaded environment variables from: ${currPath}`);



// https://vitejs.dev/config/
export default defineConfig({
  plugins: [TanStackRouterVite({ autoCodeSplitting: true }), viteReact()],
  test: {
    globals: true,
    environment: 'jsdom',
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    watch: {
      ignored: ["**/node_modules", "**/.git", "**/.tanstack"],
    },
    proxy: {
      "/api/": { // The prefix for API requests in your frontend
        target: process.env.API_HOST_URL_ADDRESS, // The URL of your backend server
        changeOrigin: true, // Ensures the request appears to come from the target domain
        rewrite: (path) => path.replace(/^\/api/, '/'), // Remove the /api prefix when forwarding the request
        // secure: false, // Set to true for production with valid SSL certificates, false for development with self-signed certificates
      },
    },

  },
  define: {
    'process.env': process.env,
  },
})
