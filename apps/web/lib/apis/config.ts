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
const apiClient: AxiosInstance = axios.create(config);

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
// apiClient.interceptors.response.use(
//   (response: AxiosResponse): any => {
//     return response;
//   },
//   (error) => {
//     if (error.response?.status === 401) {
//       // Xử lý khi token hết hạn
//       if (typeof window !== 'undefined') {
//         // Chuyển hướng đến trang đăng nhập
//         window.location.href = '/login';
//       }
//     }
//     return Promise.reject(error);
//   }
// );

export default apiClient;