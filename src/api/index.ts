import axios from 'axios';
import { initData } from '@tma.js/sdk-vue';
import type { ProfileResponse, RA_Status, RA_SearchRoom } from '@/types';

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

// Re-export type for convenience
export type { ProfileResponse, RA_Status };

// Profile API Function
export const getProfile = async (): Promise<ProfileResponse> => {
  const response = await api.get<ProfileResponse>('/auth/v2/profile');
  return response.data;
};

// Get Room Attendant Current Status API Function
export const getRAStatus = async (): Promise<RA_Status[]> => {
  const response = await api.get<RA_Status[]>(`/v2/mp/RAStatus`);
  return response.data;
};

// Get Room Attendant Search Room API Function
export const getRASearchRoom = async (Sroom: string, Eroom: string): Promise<RA_SearchRoom[]> => {
  const response = await api.get<RA_SearchRoom[]>(`/v2/mp/RASearchRoom/${Sroom}/${Eroom}`);
  return response.data;
};


interface UpdateRoomPayload {
  Room: string;
  StatusHK: string;
  EditUser: string;
  EditDate: string;
  LogNote: string;
  LogSource: number;
}

interface UpdateRoomResponse {
  Room: string;
  StatusHK: string;
  EditUser: string;
  EditDate: string;
  LogNote: string;
  LogSource: number;
}

// Room Attendant Update Room API Function
export const putUpdateRoom = async (
  Room: string,
  StatusHK: string,
  EditUser: string,
  EditDate: string,
  LogNote: string,
  LogSource: number
): Promise<UpdateRoomResponse[]> => {
  const payload: UpdateRoomPayload = {
    Room,
    StatusHK,
    EditUser,
    EditDate,
    LogNote,
    LogSource
  };
  
  const response = await api.put<UpdateRoomResponse[]>(
    `/v2/mp/RARoomUpdate/${Room}`,
    payload
  );
  return response.data;
};

export default api;