import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
    resolve: {
      alias: [{ find: '@', replacement: path.resolve('./src') }],
    },
    server: {
      host: 'localhost', //  localhost
      port: 8999, 
      strictPort: true 
    },
});

