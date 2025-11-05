import { createApp } from './app';
import { checkLogin, initConfigData } from '@/utils/dataDispose';

const { app, router } = createApp(false);

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
}

bootstrap();
