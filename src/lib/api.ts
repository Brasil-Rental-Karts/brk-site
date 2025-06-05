import type { VipPreregisterForm } from './validation';

const API_URL = import.meta.env.VITE_API_URL;

export interface VipPreregisterData {
  name: string;
  email: string;
}

export interface ApiResponse<T> {
  message: string;
  data: T;
}

export interface VipPreregister {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${API_URL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async registerVip(data: VipPreregisterForm): Promise<ApiResponse<VipPreregister>> {
    return this.request<VipPreregister>('/vip-preregister', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}

export const apiService = new ApiService(); 