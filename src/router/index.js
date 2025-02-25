import { createRouter, createWebHistory } from 'vue-router';
import App1Wrapper from '@/apps/app1/Wrapper.vue';
import App2Wrapper from '@/apps/app2/Wrapper.vue';
import App3Wrapper from '@/apps/app3/Wrapper.vue';
import App4Wrapper from '@/apps/app4/Wrapper.vue';
import App5Wrapper from '@/apps/app5/Wrapper.vue';
import Register from '@/components/Register.vue';
import Login from '@/components/Login.vue';
import Results from '@/components/Results.vue';

const routes = [
  { path: '/', component: App1Wrapper, meta: { requiresAuth: true } },
  { path: '/app1', component: App1Wrapper, meta: { requiresAuth: true } },
  { path: '/app2', component: App2Wrapper, meta: { requiresAuth: true } },
  { path: '/app3', component: App3Wrapper, meta: { requiresAuth: true } },
  { path: '/app4', component: App4Wrapper, meta: { requiresAuth: true } },
  { path: '/app5', component: App5Wrapper, meta: { requiresAuth: true } },
  { path: '/results', component: Results, meta: {requiresAuth: true}  },
  { path: '/register', component: Register },
  { path: '/login', component: Login },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('user_id');  // Проверка аутентификации
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login');  // Перенаправление на страницу входа
  } else {
    next();
  }
});

export default router;