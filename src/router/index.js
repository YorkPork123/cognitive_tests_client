
import { createRouter, createWebHistory } from 'vue-router';
import App1Wrapper from 'C:/Users/Миша/brain-tests/src/apps/app1/Wrapper.vue';
import App2Wrapper from 'C:/Users/Миша/brain-tests/src/apps/app2/Wrapper.vue';
import App3Wrapper from 'C:/Users/Миша/brain-tests/src/apps/app3/Wrapper.vue';
import App4Wrapper from 'C:/Users/Миша/brain-tests/src/apps/app4/Wrapper.vue';
import App5Wrapper from 'C:/Users/Миша/brain-tests/src/apps/app5/Wrapper.vue';

const routes = [
  { path: '/app1', component: App1Wrapper },
  { path: '/app2', component: App2Wrapper },
  { path: '/app3', component: App3Wrapper },
  { path: '/app4', component: App4Wrapper },
  { path: '/app5', component: App5Wrapper }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
