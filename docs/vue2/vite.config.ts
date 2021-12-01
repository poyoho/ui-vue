import path from 'path'
import { defineConfig } from 'vite'
import { createVuePlugin as vue2 } from 'vite-plugin-vue2'

export default defineConfig({
  resolve: {
    alias: {
      '@shared-ts': path.resolve('../../shared-ts/src/public-api.ts'),
      '@ui-vue': path.resolve('../../packages/'),
      '@lib2': path.resolve('../../dist/vue2/lib/'),
      'vue': 'vue2'
    }
  },
  plugins: [
    vue2(),
  ],
  server: {
    port: 3002
  },
  cacheDir: path.resolve('.vite'),
})
