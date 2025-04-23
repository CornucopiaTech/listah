import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],

  // Below required to prevent ES module error with material icons.
  ssr: {
    noExternal: [
      '@mui/*',
      '@emotion/*',
    ],
  },
  optimizeDeps:{
    include: [
      '@mui/*',
      '@emotion/*',
    ],
    force: true,
  }
  // Above required to prevent ES module error with material icons.
});
