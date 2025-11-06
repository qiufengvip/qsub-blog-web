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
import { SSR_STATE_KEY, SSRStateBag } from './ssr/state';

export function createApp(isServer = false, initialState: SSRStateBag = {}) {
  const app = (isServer ? createSSRApp : createClientApp)(App);
  const router = createRouter(isServer);
  const store = createStore();
  const state = initialState;

  app.use(store);
  app.use(router);
  app.use(ElementPlus, {
    locale: zhCn,
  });
  app.component('SvgIcon', SvgIcon);
  app.provide(SSR_STATE_KEY, state);

  return { app, router, store, state };
}
