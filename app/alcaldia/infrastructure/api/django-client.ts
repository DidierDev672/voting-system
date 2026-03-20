/**
 * Cliente HTTP para API de Alcaldias
 * Singleton para garantizar una única instancia
 */

import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';

let alcaldiaApiClient: AxiosInstance | null = null;

export const getAlcaldiaApiClient = (): AxiosInstance => {
  if (alcaldiaApiClient) {
    return alcaldiaApiClient;
  }

  const apiUrl = process.env.NEXT_PUBLIC_DJANGO_API_URL;

  if (!apiUrl) {
    throw new Error(
      'La variable de entorno NEXT_PUBLIC_DJANGO_API_URL es requerida'
    );
  }

  alcaldiaApiClient = axios.create({
    baseURL: apiUrl,
    headers: {
      'Content-Type': 'application/json',
    },
    timeout: 30000,
  });

  alcaldiaApiClient.interceptors.request.use(
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

  return alcaldiaApiClient;
};

export const alcaldiaApi = getAlcaldiaApiClient();
