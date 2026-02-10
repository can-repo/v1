import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/pages/HomeView.vue';
import MainMenu from '@/pages/MainMenu.vue';
import CurrentStatus from '@/pages/CurrentStatus.vue';
import RoomSearch from '@/pages/RoomSearch.vue';
import RoomDetail from '@/pages/RoomDetail.vue';

export const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView,
  },
  {
    path: '/menu',
    name: 'Menu',
    component: MainMenu,
  },
  {
    path: '/Status',
    name: 'CurrentStatus',
    component: CurrentStatus,
  },
  {
    path: '/Search',
    name: 'RoomSearch',
    component: RoomSearch,
  },
  {
    path: '/Room/:roomNumber',
    name: 'RoomDetail',
    component: RoomDetail,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
