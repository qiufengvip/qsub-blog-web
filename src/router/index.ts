import { createRouter, createWebHistory } from 'vue-router';
import routes from './routes';

const router = createRouter({
  history: createWebHistory(), // 使用 history 模式  去掉#号
  routes,
});
export default router;
