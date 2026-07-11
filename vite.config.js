import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        // The main SPA.
        main: resolve(__dirname, "index.html"),
        // Dedicated, message-matched landing page for the Facebook traffic.
        // Its own entry so it gets its own <title> and OG share card. Built as
        // a directory (is-it-a-scam/index.html) to match the other pages, so
        // /is-it-a-scam works with no Vercel rewrite needed.
        "is-it-a-scam": resolve(__dirname, "is-it-a-scam/index.html"),
      },
    },
  },
});
