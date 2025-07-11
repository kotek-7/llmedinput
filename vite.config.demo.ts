import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  root: '.', // プロジェクトルートに戻す
  publicDir: 'public',
  build: {
    outDir: 'dist-demo',
    emptyOutDir: true,
    rollupOptions: {
      input: resolve(__dirname, 'demo/index.html')
    }
  },
  server: {
    port: 3000,
    open: '/demo/', // demoディレクトリを開く
  }
});