import { reactRouter } from "@react-router/dev/vite";
import autoprefixer from "autoprefixer";
import tailwindcss from "tailwindcss";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  css: {
    postcss: {
      plugins: [tailwindcss, autoprefixer],
    },
  },
  plugins: [reactRouter(), tsconfigPaths()],
  ssr: {
    // Necessary for createSVG import
    noExternal: ['@mui/icons-material'],
  },
  optimizeDeps: {
     // Necessary for createSVG import
    include: ['@mui/icons-material'],
  },
});
