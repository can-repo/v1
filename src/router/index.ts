import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/pages/HomeView.vue';
import MainMenu from '@/pages/MainMenu.vue';

export const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/menu',
    name: 'menu',
    component: MainMenu,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
