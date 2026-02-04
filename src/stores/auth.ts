import { defineStore } from 'pinia';
import { initData } from '@tma.js/sdk-vue';
import { computed } from 'vue';

export const useAuthStore = defineStore('auth', () => {
  const user = computed(() => initData.state()?.user || null);
  const isAuthenticated = computed(() => !!initData.state());

  return { user, isAuthenticated };
});