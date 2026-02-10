import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { ProfileResponse } from '@/types';

export const useProfileStore = defineStore('profile', () => {
  // State
  const profileData = ref<ProfileResponse | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // Actions
  const setProfile = (data: ProfileResponse) => {
    profileData.value = data;
    error.value = null;
  };

  const setError = (errorMessage: string) => {
    error.value = errorMessage;
  };

  const setLoading = (loading: boolean) => {
    isLoading.value = loading;
  };

  const clearProfile = () => {
    profileData.value = null;
    error.value = null;
  };

  // Getters
  const hasProfile = () => profileData.value !== null;

  return {
    // State
    profileData,
    isLoading,
    error,
    // Actions
    setProfile,
    setError,
    setLoading,
    clearProfile,
    // Getters
    hasProfile,
  };
});
