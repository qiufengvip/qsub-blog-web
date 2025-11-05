import { createApp as createClientApp, createSSRApp } from 'vue';
import App from './App.vue';
import 'element-plus/dist/index.css';
import ElementPlus from 'element-plus';
import '@/styles/element/index.scss';
import '@/styles/element/dark.scss';
import 'virtual:svg-icons-register';
import SvgIcon from '@/components/common/SvgIcon/index.vue';
import zhCn from 'element-plus/es/locale/lang/zh-cn';
import { createRouter } from './router';
import { createStore } from './store';

export function createApp(isServer = false) {
  const app = (isServer ? createSSRApp : createClientApp)(App);
  const router = createRouter(isServer);
  const store = createStore();

  app.use(store);
  app.use(router);
  app.use(ElementPlus, {
    locale: zhCn,
  });
  app.component('SvgIcon', SvgIcon);

  return { app, router, store };
}
