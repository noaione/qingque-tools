import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import Components from "unplugin-vue-components/vite";
import VueRouter from "unplugin-vue-router/vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    VueRouter({
      routesFolder: "src/routes",
      extensions: [".vue"],
      dts: "./src/types/router.d.ts"
    }),
    vue(),
    vueJsx(),
    Components({ dts: "./src/types/components.d.ts" })
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url))
    }
  }
});
