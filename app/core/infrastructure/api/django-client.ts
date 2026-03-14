/**
 * Cliente HTTP para API de Django
 * Singleton para garantizar una única instancia
 */

import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';

let djangoApiClient: AxiosInstance | null = null;

export const getDjangoApiClient = (): AxiosInstance => {
  if (djangoApiClient) {
    return djangoApiClient;
  }

  const apiUrl = process.env.NEXT_PUBLIC_DJANGO_API_URL;

  if (!apiUrl) {
    throw new Error(
      'La variable de entorno NEXT_PUBLIC_DJANGO_API_URL es requerida'
    );
  }

  djangoApiClient = axios.create({
    baseURL: apiUrl,
    headers: {
      'Content-Type': 'application/json',
    },
    timeout: 30000,
  });

  djangoApiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      if (typeof window !== 'undefined') {
        const session = localStorage.getItem('auth_session');
        if (session) {
          const sessionData = JSON.parse(session);
          if (sessionData?.accessToken) {
            config.headers.Authorization = `Bearer ${sessionData.accessToken}`;
          }
        }
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  djangoApiClient.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth_session');
          localStorage.removeItem('auth_user');
          window.location.href = '/login';
        }
      }
      return Promise.reject(error);
    }
  );

  return djangoApiClient;
};

export const djangoApi = getDjangoApiClient();
