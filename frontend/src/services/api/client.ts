import axios, { AxiosError } from 'axios';

// Ensure base URL correctly targets the API v1 namespace
const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export const apiClient = axios.create({
  baseURL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: true,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('talentflow_token') : null;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ success?: boolean; message?: string; error?: { message?: string; code?: string } }>) => {
    // If 401 Unauthorized occurs on client side, gracefully clear stale credentials
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('talentflow_token');
      localStorage.removeItem('talentflow_active_user');
    }
    return Promise.reject(error);
  }
);

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;
    if (data?.error?.message) return data.error.message;
    if (data?.message) return data.message;
    if (error.message) return error.message;
  }
  if (error instanceof Error) return error.message;
  return 'An unexpected error occurred. Please try again.';
}
