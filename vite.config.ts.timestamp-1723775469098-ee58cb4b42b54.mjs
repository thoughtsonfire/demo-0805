// vite.config.ts
import path from "path";
import { defineConfig } from "file:///F:/20240426start/vue/demo-0805/node_modules/.pnpm/vite@5.3.5_@types+node@20.14.14_sass@1.77.8/node_modules/vite/dist/node/index.js";
import vue from "file:///F:/20240426start/vue/demo-0805/node_modules/.pnpm/@vitejs+plugin-vue@5.1.2_vite@5.3.5_@types+node@20.14.14_sass@1.77.8__vue@3.4.35_typescript@5.4.5_/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import vueJsx from "file:///F:/20240426start/vue/demo-0805/node_modules/.pnpm/@vitejs+plugin-vue-jsx@4.0.0_vite@5.3.5_@types+node@20.14.14_sass@1.77.8__vue@3.4.35_typescript@5.4.5_/node_modules/@vitejs/plugin-vue-jsx/dist/index.mjs";
import vueDevTools from "file:///F:/20240426start/vue/demo-0805/node_modules/.pnpm/vite-plugin-vue-devtools@7.3.7_rollup@4.20.0_vite@5.3.5_@types+node@20.14.14_sass@1.77.8__vue@3.4.35_typescript@5.4.5_/node_modules/vite-plugin-vue-devtools/dist/vite.mjs";
import AutoImport from "file:///F:/20240426start/vue/demo-0805/node_modules/.pnpm/unplugin-auto-import@0.18.2_@vueuse+core@9.13.0_vue@3.4.35_typescript@5.4.5___rollup@4.20.0/node_modules/unplugin-auto-import/dist/vite.js";
import Icons from "file:///F:/20240426start/vue/demo-0805/node_modules/.pnpm/unplugin-icons@0.19.2_@vue+compiler-sfc@3.4.35/node_modules/unplugin-icons/dist/vite.js";
import IconsResolver from "file:///F:/20240426start/vue/demo-0805/node_modules/.pnpm/unplugin-icons@0.19.2_@vue+compiler-sfc@3.4.35/node_modules/unplugin-icons/dist/resolver.js";
import Components from "file:///F:/20240426start/vue/demo-0805/node_modules/.pnpm/unplugin-vue-components@0.27.3_@babel+parser@7.25.3_rollup@4.20.0_vue@3.4.35_typescript@5.4.5_/node_modules/unplugin-vue-components/dist/vite.js";
import { ElementPlusResolver } from "file:///F:/20240426start/vue/demo-0805/node_modules/.pnpm/unplugin-vue-components@0.27.3_@babel+parser@7.25.3_rollup@4.20.0_vue@3.4.35_typescript@5.4.5_/node_modules/unplugin-vue-components/dist/resolvers.js";
var __vite_injected_original_dirname = "F:\\20240426start\\vue\\demo-0805";
var pathSrc = path.resolve(__vite_injected_original_dirname, "src");
var vite_config_default = defineConfig({
  resolve: {
    alias: {
      "@": pathSrc
    }
  },
  plugins: [
    vue(),
    vueJsx(),
    vueDevTools(),
    AutoImport({
      resolvers: [
        ElementPlusResolver(),
        IconsResolver({
          prefix: "Icon",
          enabledCollections: ["ep"]
        })
      ]
    }),
    Components({
      resolvers: [
        IconsResolver({
          prefix: "Icon",
          enabledCollections: ["ep"]
        }),
        ElementPlusResolver()
      ],
      dts: path.resolve(pathSrc, "components.d.ts")
    }),
    Icons({
      autoInstall: true
    })
  ]
  // resolve: {
  //   alias: {
  //     '@': fileURLToPath(new URL('./src', import.meta.url))
  //   }
  // }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJGOlxcXFwyMDI0MDQyNnN0YXJ0XFxcXHZ1ZVxcXFxkZW1vLTA4MDVcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkY6XFxcXDIwMjQwNDI2c3RhcnRcXFxcdnVlXFxcXGRlbW8tMDgwNVxcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRjovMjAyNDA0MjZzdGFydC92dWUvZGVtby0wODA1L3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHBhdGggZnJvbSAncGF0aCdcbmltcG9ydCB7IGZpbGVVUkxUb1BhdGgsIFVSTCB9IGZyb20gJ25vZGU6dXJsJ1xuXG5pbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJ1xuaW1wb3J0IHZ1ZSBmcm9tICdAdml0ZWpzL3BsdWdpbi12dWUnXG5pbXBvcnQgdnVlSnN4IGZyb20gJ0B2aXRlanMvcGx1Z2luLXZ1ZS1qc3gnXG5pbXBvcnQgdnVlRGV2VG9vbHMgZnJvbSAndml0ZS1wbHVnaW4tdnVlLWRldnRvb2xzJ1xuaW1wb3J0IEF1dG9JbXBvcnQgZnJvbSAndW5wbHVnaW4tYXV0by1pbXBvcnQvdml0ZSdcbmltcG9ydCBJY29ucyBmcm9tICd1bnBsdWdpbi1pY29ucy92aXRlJ1xuaW1wb3J0IEljb25zUmVzb2x2ZXIgZnJvbSAndW5wbHVnaW4taWNvbnMvcmVzb2x2ZXInXG5pbXBvcnQgQ29tcG9uZW50cyBmcm9tICd1bnBsdWdpbi12dWUtY29tcG9uZW50cy92aXRlJ1xuaW1wb3J0IHsgRWxlbWVudFBsdXNSZXNvbHZlciB9IGZyb20gJ3VucGx1Z2luLXZ1ZS1jb21wb25lbnRzL3Jlc29sdmVycydcbmNvbnN0IHBhdGhTcmMgPSBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnc3JjJylcbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICByZXNvbHZlOiB7XG4gICAgYWxpYXM6IHtcbiAgICAgICdAJzogcGF0aFNyYyxcbiAgICB9LFxuICB9LFxuICBwbHVnaW5zOiBbXG4gICAgdnVlKCksXG4gICAgdnVlSnN4KCksXG4gICAgdnVlRGV2VG9vbHMoKSxcbiAgICBBdXRvSW1wb3J0KHtcbiAgICAgIHJlc29sdmVyczogW1xuICAgICAgICBFbGVtZW50UGx1c1Jlc29sdmVyKCksXG4gICAgICAgIEljb25zUmVzb2x2ZXIoe1xuICAgICAgICAgIHByZWZpeDogJ0ljb24nLFxuICAgICAgICAgIGVuYWJsZWRDb2xsZWN0aW9uczogWydlcCddLFxuICAgICAgICB9KSxcbiAgICAgIF0sXG4gICAgfSksXG4gICAgQ29tcG9uZW50cyh7XG4gICAgICByZXNvbHZlcnM6IFtcbiAgICAgICAgSWNvbnNSZXNvbHZlcih7XG4gICAgICAgICAgcHJlZml4OiAnSWNvbicsXG4gICAgICAgICAgZW5hYmxlZENvbGxlY3Rpb25zOiBbJ2VwJ10sXG4gICAgICAgIH0pLFxuICAgICAgICBFbGVtZW50UGx1c1Jlc29sdmVyKCksXG4gICAgICBdLFxuICAgICAgZHRzOiBwYXRoLnJlc29sdmUocGF0aFNyYywgJ2NvbXBvbmVudHMuZC50cycpLFxuICAgIH0pLFxuICAgIEljb25zKHtcbiAgICAgIGF1dG9JbnN0YWxsOiB0cnVlLFxuICAgIH0pLFxuICBdLFxuICAvLyByZXNvbHZlOiB7XG4gIC8vICAgYWxpYXM6IHtcbiAgLy8gICAgICdAJzogZmlsZVVSTFRvUGF0aChuZXcgVVJMKCcuL3NyYycsIGltcG9ydC5tZXRhLnVybCkpXG4gIC8vICAgfVxuICAvLyB9XG59KVxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFvUixPQUFPLFVBQVU7QUFHclMsU0FBUyxvQkFBb0I7QUFDN0IsT0FBTyxTQUFTO0FBQ2hCLE9BQU8sWUFBWTtBQUNuQixPQUFPLGlCQUFpQjtBQUN4QixPQUFPLGdCQUFnQjtBQUN2QixPQUFPLFdBQVc7QUFDbEIsT0FBTyxtQkFBbUI7QUFDMUIsT0FBTyxnQkFBZ0I7QUFDdkIsU0FBUywyQkFBMkI7QUFYcEMsSUFBTSxtQ0FBbUM7QUFZekMsSUFBTSxVQUFVLEtBQUssUUFBUSxrQ0FBVyxLQUFLO0FBRTdDLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMLEtBQUs7QUFBQSxJQUNQO0FBQUEsRUFDRjtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1AsSUFBSTtBQUFBLElBQ0osT0FBTztBQUFBLElBQ1AsWUFBWTtBQUFBLElBQ1osV0FBVztBQUFBLE1BQ1QsV0FBVztBQUFBLFFBQ1Qsb0JBQW9CO0FBQUEsUUFDcEIsY0FBYztBQUFBLFVBQ1osUUFBUTtBQUFBLFVBQ1Isb0JBQW9CLENBQUMsSUFBSTtBQUFBLFFBQzNCLENBQUM7QUFBQSxNQUNIO0FBQUEsSUFDRixDQUFDO0FBQUEsSUFDRCxXQUFXO0FBQUEsTUFDVCxXQUFXO0FBQUEsUUFDVCxjQUFjO0FBQUEsVUFDWixRQUFRO0FBQUEsVUFDUixvQkFBb0IsQ0FBQyxJQUFJO0FBQUEsUUFDM0IsQ0FBQztBQUFBLFFBQ0Qsb0JBQW9CO0FBQUEsTUFDdEI7QUFBQSxNQUNBLEtBQUssS0FBSyxRQUFRLFNBQVMsaUJBQWlCO0FBQUEsSUFDOUMsQ0FBQztBQUFBLElBQ0QsTUFBTTtBQUFBLE1BQ0osYUFBYTtBQUFBLElBQ2YsQ0FBQztBQUFBLEVBQ0g7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBTUYsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
