import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import vue from "@vitejs/plugin-vue";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: "auto",
      workbox: {
        cleanupOutdatedCaches: false,
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
            src: "manifest/16.png",
            sizes: "16x16",
            type: "image/png",
            purpose: "maskable",
          },
          {
            src: "manifest/20.png",
            sizes: "20x20",
            type: "image/png",
            purpose: "maskable",
          },
          {
            src: "manifest/29.png",
            sizes: "29x29",
            type: "image/png",
            purpose: "maskable",
          },
          {
            src: "manifest/32.png",
            sizes: "32x32",
            type: "image/png",
            purpose: "maskable",
          },
          {
            src: "manifest/40.png",
            sizes: "40x40",
            type: "image/png",
            purpose: "maskable",
          },
          {
            src: "manifest/50.png",
            sizes: "50x50",
            type: "image/png",
            purpose: "maskable",
          },
          {
            src: "manifest/57.png",
            sizes: "57x57",
            type: "image/png",
            purpose: "maskable",
          },
          {
            src: "manifest/58.png",
            sizes: "58x58",
            type: "image/png",
            purpose: "maskable",
          },
          {
            src: "manifest/60.png",
            sizes: "60x60",
            type: "image/png",
            purpose: "maskable",
          },
          {
            src: "manifest/64.png",
            sizes: "64x64",
            type: "image/png",
            purpose: "maskable",
          },
          {
            src: "manifest/72.png",
            sizes: "72x72",
            type: "image/png",
            purpose: "maskable",
          },
          {
            src: "manifest/76.png",
            sizes: "76x76",
            type: "image/png",
            purpose: "maskable",
          },
          {
            src: "manifest/80.png",
            sizes: "80x80",
            type: "image/png",
            purpose: "maskable",
          },
          {
            src: "manifest/87.png",
            sizes: "87x87",
            type: "image/png",
            purpose: "maskable",
          },
          {
            src: "manifest/100.png",
            sizes: "100x100",
            type: "image/png",
            purpose: "maskable",
          },
          {
            src: "manifest/114.png",
            sizes: "114x114",
            type: "image/png",
            purpose: "maskable",
          },
          {
            src: "manifest/120.png",
            sizes: "120x120",
            type: "image/png",
            purpose: "maskable",
          },
          {
            src: "manifest/128.png",
            sizes: "128x128",
            type: "image/png",
            purpose: "maskable",
          },
          {
            src: "manifest/144.png",
            sizes: "144x144",
            type: "image/png",
            purpose: "maskable",
          },
          {
            src: "manifest/152.png",
            sizes: "152x152",
            type: "image/png",
            purpose: "maskable",
          },
          {
            src: "manifest/167.png",
            sizes: "167x167",
            type: "image/png",
            purpose: "maskable",
          },
          {
            src: "manifest/180.png",
            sizes: "180x180",
            type: "image/png",
            purpose: "maskable",
          },
          {
            src: "manifest/192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "maskable",
          },
          {
            src: "manifest/256.png",
            sizes: "256x256",
            type: "image/png",
            purpose: "maskable",
          },
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
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
