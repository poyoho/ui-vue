import path from 'path'
import { defineConfig } from 'vite'
import Markdown from 'vite-plugin-md'
import vue3 from '@vitejs/plugin-vue'

export default defineConfig({
  resolve: {
    alias: {
      '@shared-ts': path.resolve('../../shared-ts/src/public-api.ts'),
      '@ui-vue': path.resolve('../../packages/'),
      '@lib3': path.resolve('../../dist/vue3/lib/') ,
      '@': path.resolve('./src/') ,
      'vue': 'vue3',
      '@sub': 'http://localhost:3002'
    }
  },
  plugins: [
    vue3({
      include: [/\.vue$/, /\.md$/],
    }),
    Markdown(),
  ],
  server: {
    port: 3001
  },
  cacheDir: path.resolve('.vite', 'entry'),
})
