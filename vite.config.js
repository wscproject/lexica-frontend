import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import vue from "@vitejs/plugin-vue";
import path from "path";
import topLevelAwait from "vite-plugin-top-level-await";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      base: "/",
      registerType: "autoUpdate",
      includeAssets: ["img/**/*.*", "fonts/**/*.*"],
      injectRegister: "auto",
      workbox: {
        cleanupOutdatedCaches: true,
        globPatterns: ["**/*.{js,css,html,ico,png,svg,json,vue,txt,woff2}"],
      },
      manifest: {
        name: "Lexica",
        short_name: "Lexica",

        description:
          "Lexica is a web-based tool optimized for mobile users, designed to facilitate microcontributions to lexicographical data on Wikidata. Currently, it allows you to quickly link Lexeme's Senses to Wikidata Items through a responsive card view interface, with more functionalities planned for the future.",
        display: "standalone",
        icons: [
          {
            src: "manifest/512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
          {
            src: "manifest/1024.png",
            sizes: "1024x1024",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
    }),
    topLevelAwait({
      // The export name of top-level await promise for each chunk module
      promiseExportName: "__tla",
      // The function to generate import names of top-level await promise in each chunk module
      promiseImportName: (i) => `__tla_${i}`,
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
