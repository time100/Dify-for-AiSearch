import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ArcoResolver } from 'unplugin-vue-components/resolvers'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ArcoResolver()],
    }),
    Components({
      resolvers: [ArcoResolver({
        sideEffect: true
      })],
    }),
  ],
  resolve: {
    // 路径别名配置，使用绝对路径
    alias: {
      '@': '/Users/one/DEV/AiSearch/ai-search/src' // 使用项目绝对路径
    }
  },
  // 构建配置
  build: {
    target: 'es2015',
    outDir: 'dist',
    assetsDir: 'assets',
    cssCodeSplit: true,
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          arco: ['@arco-design/web-vue'],
          vue: ['vue', 'vue-router', 'pinia']
        }
      }
    }
  }
})
