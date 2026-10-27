import { createRouter, createWebHistory } from 'vue-router';
import { STORAGE_KEYS } from '@/config/app';

const routes = [
  { path: '/',                   name: 'showcase',      component: () => import('@/views/Showcase.vue') },
  { path: '/solutions/:slug',    name: 'solution-detail', component: () => import('@/views/SolutionDetail.vue') },
  { path: '/login',              name: 'login',         component: () => import('@/views/Login.vue') },
  {
    path: '/admin',
    name: 'admin',
    component: () => import('@/views/Admin.vue'),
    meta: { requiresAuth: true },
  },
  { path: '/:pathMatch(.*)*', redirect: '/' },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition;
    if (to.hash) return { el: to.hash, behavior: 'smooth', top: 80 };
    return { top: 0 };
  },
});

router.beforeEach((to) => {
  if (to.meta.requiresAuth && !localStorage.getItem(STORAGE_KEYS.ADMIN_KEY)) {
    return { name: 'login', query: { redirect: to.fullPath } };
  }
  return true;
});

export default router;
