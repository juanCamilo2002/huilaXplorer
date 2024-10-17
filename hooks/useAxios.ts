import { useEffect, useCallback } from 'react';
import axios, { AxiosRequestConfig, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { useStorageState } from '@/hooks/useStorageState'; 

const useAxios = () => {
  const [[isLoading, session]] = useStorageState('session'); 


  const axiosInstance = axios.create({
    baseURL: process.env.EXPO_PUBLIC_HOST, 
    headers: {
      'Content-Type': 'application/json',
    },
  });

  
  useEffect(() => {
    const requestInterceptor = axiosInstance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        if (session) {
          config.headers['Authorization'] = `Bearer ${session}`; 
        }
        return config;
      },
      (error: AxiosError) => {
        return Promise.reject(error);
      }
    );
  
    
    return () => {
      axiosInstance.interceptors.request.eject(requestInterceptor);
    };
  }, [session, axiosInstance]);

  
  const get = useCallback(async (url: string, config?: AxiosRequestConfig) => {
    try {
      const response: AxiosResponse = await axiosInstance.get(url, config);
      return { data: response.data, status: response.status };
    } catch (error: any) {
      throw error;
    }
  }, [axiosInstance]);

 
  const post = useCallback(async (url: string, data: any, config?: AxiosRequestConfig) => {
    try {
      const response: AxiosResponse = await axiosInstance.post(url, data, config);
      return { data: response.data, status: response.status };
    } catch (error: any) {
      throw error;
    }
  }, [axiosInstance]);

  const put = useCallback(async (url: string, data: any, config?: AxiosRequestConfig) => {
    try {
      const response: AxiosResponse = await axiosInstance.put(url, data, config);
      return { data: response.data, status: response.status };
    } catch (error: any) {
      throw error;
    }
  }, [axiosInstance]);
  const patch = useCallback(async (url: string, data: any, config?: AxiosRequestConfig) => {
    try {
      const response: AxiosResponse = await axiosInstance.patch(url, data, config);
      return { data: response.data, status: response.status };
    } catch (error: any) {
      throw error;
    }
  }, [axiosInstance]);

  return { get, post, put, patch };
};

export default useAxios;
