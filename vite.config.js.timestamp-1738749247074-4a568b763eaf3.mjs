// vite.config.js
import { defineConfig } from "file:///D:/Work/lexica-frontend/node_modules/vite/dist/node/index.js";
import { VitePWA } from "file:///D:/Work/lexica-frontend/node_modules/vite-plugin-pwa/dist/index.js";
import vue from "file:///D:/Work/lexica-frontend/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import path from "path";
import topLevelAwait from "file:///D:/Work/lexica-frontend/node_modules/vite-plugin-top-level-await/exports/import.mjs";
var __vite_injected_original_dirname = "D:\\Work\\lexica-frontend";
var vite_config_default = defineConfig({
  plugins: [
    vue(),
    VitePWA({
      base: "/",
      registerType: "autoUpdate",
      includeAssets: ["img/**/*.*", "fonts/**/*.*"],
      injectRegister: "auto",
      workbox: {
        cleanupOutdatedCaches: true,
        globPatterns: ["**/*.{js,css,html,ico,png,svg,json,vue,txt,woff2}"]
      },
      manifest: {
        name: "Lexica",
        short_name: "Lexica",
        description: "Lexica is a web-based tool optimized for mobile users, designed to facilitate microcontributions to lexicographical data on Wikidata. Currently, it allows you to quickly link Lexeme's Senses to Wikidata Items through a responsive card view interface, with more functionalities planned for the future.",
        display: "standalone",
        icons: [
          {
            src: "manifest/512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable"
          },
          {
            src: "manifest/1024.png",
            sizes: "1024x1024",
            type: "image/png",
            purpose: "maskable"
          }
        ]
      }
    }),
    topLevelAwait({
      // The export name of top-level await promise for each chunk module
      promiseExportName: "__tla",
      // The function to generate import names of top-level await promise in each chunk module
      promiseImportName: (i) => `__tla_${i}`
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "./src")
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxXb3JrXFxcXGxleGljYS1mcm9udGVuZFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRDpcXFxcV29ya1xcXFxsZXhpY2EtZnJvbnRlbmRcXFxcdml0ZS5jb25maWcuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0Q6L1dvcmsvbGV4aWNhLWZyb250ZW5kL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInZpdGVcIjtcclxuaW1wb3J0IHsgVml0ZVBXQSB9IGZyb20gXCJ2aXRlLXBsdWdpbi1wd2FcIjtcclxuaW1wb3J0IHZ1ZSBmcm9tIFwiQHZpdGVqcy9wbHVnaW4tdnVlXCI7XHJcbmltcG9ydCBwYXRoIGZyb20gXCJwYXRoXCI7XHJcbmltcG9ydCB0b3BMZXZlbEF3YWl0IGZyb20gXCJ2aXRlLXBsdWdpbi10b3AtbGV2ZWwtYXdhaXRcIjtcclxuXHJcbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXHJcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XHJcbiAgcGx1Z2luczogW1xyXG4gICAgdnVlKCksXHJcbiAgICBWaXRlUFdBKHtcclxuICAgICAgYmFzZTogXCIvXCIsXHJcbiAgICAgIHJlZ2lzdGVyVHlwZTogXCJhdXRvVXBkYXRlXCIsXHJcbiAgICAgIGluY2x1ZGVBc3NldHM6IFtcImltZy8qKi8qLipcIiwgXCJmb250cy8qKi8qLipcIl0sXHJcbiAgICAgIGluamVjdFJlZ2lzdGVyOiBcImF1dG9cIixcclxuICAgICAgd29ya2JveDoge1xyXG4gICAgICAgIGNsZWFudXBPdXRkYXRlZENhY2hlczogdHJ1ZSxcclxuICAgICAgICBnbG9iUGF0dGVybnM6IFtcIioqLyoue2pzLGNzcyxodG1sLGljbyxwbmcsc3ZnLGpzb24sdnVlLHR4dCx3b2ZmMn1cIl0sXHJcbiAgICAgIH0sXHJcbiAgICAgIG1hbmlmZXN0OiB7XHJcbiAgICAgICAgbmFtZTogXCJMZXhpY2FcIixcclxuICAgICAgICBzaG9ydF9uYW1lOiBcIkxleGljYVwiLFxyXG5cclxuICAgICAgICBkZXNjcmlwdGlvbjpcclxuICAgICAgICAgIFwiTGV4aWNhIGlzIGEgd2ViLWJhc2VkIHRvb2wgb3B0aW1pemVkIGZvciBtb2JpbGUgdXNlcnMsIGRlc2lnbmVkIHRvIGZhY2lsaXRhdGUgbWljcm9jb250cmlidXRpb25zIHRvIGxleGljb2dyYXBoaWNhbCBkYXRhIG9uIFdpa2lkYXRhLiBDdXJyZW50bHksIGl0IGFsbG93cyB5b3UgdG8gcXVpY2tseSBsaW5rIExleGVtZSdzIFNlbnNlcyB0byBXaWtpZGF0YSBJdGVtcyB0aHJvdWdoIGEgcmVzcG9uc2l2ZSBjYXJkIHZpZXcgaW50ZXJmYWNlLCB3aXRoIG1vcmUgZnVuY3Rpb25hbGl0aWVzIHBsYW5uZWQgZm9yIHRoZSBmdXR1cmUuXCIsXHJcbiAgICAgICAgZGlzcGxheTogXCJzdGFuZGFsb25lXCIsXHJcbiAgICAgICAgaWNvbnM6IFtcclxuICAgICAgICAgIHtcclxuICAgICAgICAgICAgc3JjOiBcIm1hbmlmZXN0LzUxMi5wbmdcIixcclxuICAgICAgICAgICAgc2l6ZXM6IFwiNTEyeDUxMlwiLFxyXG4gICAgICAgICAgICB0eXBlOiBcImltYWdlL3BuZ1wiLFxyXG4gICAgICAgICAgICBwdXJwb3NlOiBcIm1hc2thYmxlXCIsXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAge1xyXG4gICAgICAgICAgICBzcmM6IFwibWFuaWZlc3QvMTAyNC5wbmdcIixcclxuICAgICAgICAgICAgc2l6ZXM6IFwiMTAyNHgxMDI0XCIsXHJcbiAgICAgICAgICAgIHR5cGU6IFwiaW1hZ2UvcG5nXCIsXHJcbiAgICAgICAgICAgIHB1cnBvc2U6IFwibWFza2FibGVcIixcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgXSxcclxuICAgICAgfSxcclxuICAgIH0pLFxyXG4gICAgdG9wTGV2ZWxBd2FpdCh7XHJcbiAgICAgIC8vIFRoZSBleHBvcnQgbmFtZSBvZiB0b3AtbGV2ZWwgYXdhaXQgcHJvbWlzZSBmb3IgZWFjaCBjaHVuayBtb2R1bGVcclxuICAgICAgcHJvbWlzZUV4cG9ydE5hbWU6IFwiX190bGFcIixcclxuICAgICAgLy8gVGhlIGZ1bmN0aW9uIHRvIGdlbmVyYXRlIGltcG9ydCBuYW1lcyBvZiB0b3AtbGV2ZWwgYXdhaXQgcHJvbWlzZSBpbiBlYWNoIGNodW5rIG1vZHVsZVxyXG4gICAgICBwcm9taXNlSW1wb3J0TmFtZTogKGkpID0+IGBfX3RsYV8ke2l9YCxcclxuICAgIH0pLFxyXG4gIF0sXHJcbiAgcmVzb2x2ZToge1xyXG4gICAgYWxpYXM6IHtcclxuICAgICAgXCJAXCI6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwiLi9zcmNcIiksXHJcbiAgICB9LFxyXG4gIH0sXHJcbn0pO1xyXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQTZQLFNBQVMsb0JBQW9CO0FBQzFSLFNBQVMsZUFBZTtBQUN4QixPQUFPLFNBQVM7QUFDaEIsT0FBTyxVQUFVO0FBQ2pCLE9BQU8sbUJBQW1CO0FBSjFCLElBQU0sbUNBQW1DO0FBT3pDLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVM7QUFBQSxJQUNQLElBQUk7QUFBQSxJQUNKLFFBQVE7QUFBQSxNQUNOLE1BQU07QUFBQSxNQUNOLGNBQWM7QUFBQSxNQUNkLGVBQWUsQ0FBQyxjQUFjLGNBQWM7QUFBQSxNQUM1QyxnQkFBZ0I7QUFBQSxNQUNoQixTQUFTO0FBQUEsUUFDUCx1QkFBdUI7QUFBQSxRQUN2QixjQUFjLENBQUMsbURBQW1EO0FBQUEsTUFDcEU7QUFBQSxNQUNBLFVBQVU7QUFBQSxRQUNSLE1BQU07QUFBQSxRQUNOLFlBQVk7QUFBQSxRQUVaLGFBQ0U7QUFBQSxRQUNGLFNBQVM7QUFBQSxRQUNULE9BQU87QUFBQSxVQUNMO0FBQUEsWUFDRSxLQUFLO0FBQUEsWUFDTCxPQUFPO0FBQUEsWUFDUCxNQUFNO0FBQUEsWUFDTixTQUFTO0FBQUEsVUFDWDtBQUFBLFVBQ0E7QUFBQSxZQUNFLEtBQUs7QUFBQSxZQUNMLE9BQU87QUFBQSxZQUNQLE1BQU07QUFBQSxZQUNOLFNBQVM7QUFBQSxVQUNYO0FBQUEsUUFDRjtBQUFBLE1BQ0Y7QUFBQSxJQUNGLENBQUM7QUFBQSxJQUNELGNBQWM7QUFBQTtBQUFBLE1BRVosbUJBQW1CO0FBQUE7QUFBQSxNQUVuQixtQkFBbUIsQ0FBQyxNQUFNLFNBQVMsQ0FBQztBQUFBLElBQ3RDLENBQUM7QUFBQSxFQUNIO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUEsTUFDTCxLQUFLLEtBQUssUUFBUSxrQ0FBVyxPQUFPO0FBQUEsSUFDdEM7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
