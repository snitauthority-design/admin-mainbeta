import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Treat React as external - it will be provided by the main app
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/components/ProductDetails.tsx'),
      name: 'ProductDetailsLib',
      formats: ['es'],
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'swiper', 'lucide-react'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          swiper: 'Swiper',
          'lucide-react': 'LucideReact',
        },
      },
    },
  },
});

