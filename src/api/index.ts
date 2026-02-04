import axios from 'axios';
import { initData } from '@tma.js/sdk-vue';

const api = axios.create({
  // Jika VITE_API_BASE_URL kosong, gunakan '/api' (proxy mode)
  // Jika terisi, gunakan full URL (direct mode)
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use((config) => {
  try {
    const initDataRaw = initData.raw();
    
    if (initDataRaw) {
      config.headers['X-TgDataInit'] = initDataRaw;
    }
  } catch (e) {
    console.error('Error getting initData:', e);
  }
  return config;
});

// Profile API Types (sesuai backend response)
export interface ProfileResponse {
  userID: string;
  fullName: string;
  account_name: string;
  timeStamp: string;
  Configs?: {
    FOConfig?: Array<{
      FOSysDate: string;
      HotelName: string;
      FOShift: string;
      Address: string;
    }>;
  };
}

// Profile API Function
export const getProfile = async (): Promise<ProfileResponse> => {
  const response = await api.get<ProfileResponse>('/auth/v2/profile');
  return response.data;
};

export default api;