/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// Định nghĩa interface cho response trả về
export interface ApiResponse<T> {
  data: T;
  status: number;
  statusText: string;
  headers: any;
}

// Định nghĩa các config defaults
const config: AxiosRequestConfig = {
  baseURL: process.env.NEXT_PUBLIC_API_URL ,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: true,
};

// Tạo instance của axios
const apiClient: AxiosInstance = axios.create(config);

// Request interceptor
// apiClient.interceptors.request.use(
//   (config) => {
//     // Lấy token từ localStorage hoặc cookies
//     if (typeof window !== 'undefined') {
//       const token = localStorage.getItem('authToken');
//       if (token) {
//         config.headers = config.headers || {};
//         config.headers.Authorization = `Bearer ${token}`;
//       }
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// // Response interceptor
// apiClient.interceptors.response.use(
//   (response: AxiosResponse): any => {
//     return response.data;
//   },
//   (error) => {
//     if (error.response?.status === 401) {
//       // Xử lý khi token hết hạn
//       if (typeof window !== 'undefined') {
//         localStorage.removeItem('authToken');
//         // window.location.href = '/login';
//       }
//     }
//     return Promise.reject(error);
//   }
// );

export default apiClient;