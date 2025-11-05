import vue from '@vitejs/plugin-vue';
// 引入svg插件
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';
// 数据mock配置
import prismjs from 'vite-plugin-prismjs';
import { defineConfig } from 'vite';

const path = require('path');
export default defineConfig({
  base: '/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  plugins: [
    vue(),
    createSvgIconsPlugin({
      // 指定需要缓存的svg图标文件夹，即需要识别的svg都应该放在这个文件夹下
      iconDirs: [path.resolve(process.cwd(), 'src/assets/svg')],
      // 或
      // 指定symbolId格式 多级目录使用-分割如: 【home/home.svg】 = 【home-home】
      symbolId: 'icon-[dir]-[name]',
    }),
    prismjs({
      languages: 'all',
    }),
  ],
  server: {
    host: '0.0.0.0', // 监听的IP地址
    port: 3000, //启动端口
    open: true, // 自动打开
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8080/',
        // target: 'https://www.qsub.cn/api/',
        changeOrigin: true,
        rewrite: (path) => path.replace('/api', ''),
      },
    },
  },
});
