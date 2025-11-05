import { createRouter as createVueRouter, createMemoryHistory, createWebHistory } from 'vue-router';
import routes from './routes';

export function createRouter(isServer = false) {
  return createVueRouter({
    history: isServer ? createMemoryHistory() : createWebHistory(),
    routes,
  });
}

const router = createRouter(false);
export default router;
