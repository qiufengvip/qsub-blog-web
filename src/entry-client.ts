import { createApp } from './app';
import { checkLogin, initConfigData } from '@/utils/dataDispose';

declare global {
  interface Window {
    __INITIAL_STATE__?: Record<string, unknown>;
  }
}

const initialState = typeof window !== 'undefined' ? window.__INITIAL_STATE__ || {} : {};
const { app, router } = createApp(false, initialState);

async function bootstrap() {
  if (typeof window !== 'undefined') {
    try {
      await initConfigData();
      await checkLogin();
    } catch (error) {
      console.error('初始化配置或登录校验失败:', error);
    }
  }

  await router.isReady();
  app.mount('#app', true);

  if (typeof window !== 'undefined') {
    delete window.__INITIAL_STATE__;
  }
}

bootstrap();
