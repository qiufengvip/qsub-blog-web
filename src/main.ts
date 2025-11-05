import { createApp } from 'vue';

import App from './App.vue';
import 'element-plus/dist/index.css';
import router from './router/index';
import 'virtual:svg-icons-register';
import SvgIcon from '@/components/common/SvgIcon/index.vue';
import ElementPlus from 'element-plus';
import '@/styles/element/index.scss';
import '@/styles/element/dark.scss';
// 语言
import zhCn from 'element-plus/es/locale/lang/zh-cn';

import { checkLogin, initConfigData } from '@/utils/dataDispose';
async function initializeApp() {
  try {
    // 在组件挂载之前检查配置
    await initConfigData();
    await checkLogin();
  } catch (error) {
    console.error('配置未正常加载:', error);
    // 可以根据需求进行错误处理
  }
}
initializeApp().then(() => {
  const app = createApp(App);
  app.mixin({});
  app.use(router);
  app.use(ElementPlus, {
    locale: zhCn,
  });
  // 将SvgIcon.vue组件注册为全局组件
  app.component('SvgIcon', SvgIcon);
  app.mount('#app');
});
