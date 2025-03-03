import { createRouter, createWebHistory } from 'vue-router';
import App1Wrapper from '@/apps/app1/Wrapper.vue';
import App2Wrapper from '@/apps/app2/Wrapper.vue';
import App3Wrapper from '@/apps/app3/Wrapper.vue';
import App4Wrapper from '@/apps/app4/Wrapper.vue';
import App5Wrapper from '@/apps/app5/Wrapper.vue';
import App6Wrapper from '@/apps/app6/Wrapper.vue';
import App7Wrapper from '@/apps/app7/Wrapper.vue';
import App8Wrapper from '@/apps/app8/Wrapper.vue';
import App9Wrapper from '@/apps/app9/Wrapper.vue';
import App10Wrapper from '@/apps/app10/Wrapper.vue';
import App11Wrapper from '@/apps/app11/Wrapper.vue';
import App12Wrapper from '@/apps/app12/Wrapper.vue';
import App13Wrapper from '@/apps/app13/Wrapper.vue';
import App14Wrapper from '@/apps/app14/Wrapper.vue';
import App15Wrapper from '@/apps/app15/Wrapper.vue';
import App16Wrapper from '@/apps/app16/Wrapper.vue';
import App17Wrapper from '@/apps/app17/Wrapper.vue';
import App18Wrapper from '@/apps/app18/Wrapper.vue';
import App19Wrapper from '@/apps/app19/Wrapper.vue';
import App20Wrapper from '@/apps/app20/Wrapper.vue';
import App21Wrapper from '@/apps/app21/Wrapper.vue';
import Register from '@/components/Register.vue';
import Login from '@/components/Login.vue';
import Results from '@/components/Results.vue';
import Menu from '@/components/Menu.vue'

const routes = [
  { path: '/', component: Menu, meta: { requiresAuth: true } },
  { path: '/app1', component: App1Wrapper, meta: { requiresAuth: true } },
  { path: '/app2', component: App2Wrapper, meta: { requiresAuth: true } },
  { path: '/app3', component: App3Wrapper, meta: { requiresAuth: true } },
  { path: '/app4', component: App4Wrapper, meta: { requiresAuth: true } },
  { path: '/app5', component: App5Wrapper, meta: { requiresAuth: true } },
  { path: '/app6', component: App6Wrapper, meta: { requiresAuth: true } },
  { path: '/app7', component: App7Wrapper, meta: { requiresAuth: true } },
  { path: '/app8', component: App8Wrapper, meta: { requiresAuth: true } },
  { path: '/app9', component: App9Wrapper, meta: { requiresAuth: true } },
  { path: '/app10', component: App10Wrapper, meta: { requiresAuth: true } },
  { path: '/app11', component: App11Wrapper, meta: { requiresAuth: true } },
  { path: '/app12', component: App12Wrapper, meta: { requiresAuth: true } },
  { path: '/app13', component: App13Wrapper, meta: { requiresAuth: true } },
  { path: '/app14', component: App14Wrapper, meta: { requiresAuth: true } },
  { path: '/app15', component: App15Wrapper, meta: { requiresAuth: true } },
  { path: '/app16', component: App16Wrapper, meta: { requiresAuth: true } },
  { path: '/app17', component: App17Wrapper, meta: { requiresAuth: true } },
  { path: '/app18', component: App18Wrapper, meta: { requiresAuth: true } },
  { path: '/app19', component: App19Wrapper, meta: { requiresAuth: true } },
  { path: '/app20', component: App20Wrapper, meta: { requiresAuth: true } },
  { path: '/app21', component: App21Wrapper, meta: { requiresAuth: true } },
  { path: '/results', component: Results, meta: {requiresAuth: true}  },
  { path: '/register', component: Register },
  { path: '/login', component: Login },
  { path: '/menu', component: Menu },
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