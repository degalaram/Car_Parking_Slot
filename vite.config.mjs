import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import tagger from "@dhiwise/component-tagger";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    // ✅ Let Vite use default "dist" (best for Vercel)
    chunkSizeWarningLimit: 2000,
  },
  plugins: [tsconfigPaths(), react(), tagger()],
  server: {
    port: 5000, // number
    host: "0.0.0.0",
    strictPort: true,
    allowedHosts: true // Allow all hosts for Replit proxy
  }
});
