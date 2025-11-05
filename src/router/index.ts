import { createRouter as createVueRouter, createMemoryHistory, createWebHistory } from 'vue-router';
import routes from './routes';

export function createRouter(isServer = false) {
  const usingMemoryHistory = isServer || typeof window === 'undefined';

  return createVueRouter({
    history: usingMemoryHistory ? createMemoryHistory() : createWebHistory(),
    routes,
  });
}

const router = createRouter();

export default router;
