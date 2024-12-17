import axios from 'axios';
import type { AxiosInstance,InternalAxiosRequestConfig, AxiosResponse } from 'axios';

import { userInfoStore } from '@/stores/userInfo';

const axiosInstance: AxiosInstance = axios.create({
  baseURL: 'http://localhost:8081',
  timeout: 10000,
})
// 添加请求拦截器
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    config.headers['Content-Type'] = "application/json"
    // 在发送请求之前做些什么
    const token = localStorage.getItem("Authorization")
    if(token){
      config.headers['Authorization'] = token;
    }
    return config;
  },
  (error: any) => {
    
    // 处理请求错误
    // console.log(error,'requestErr')
    return Promise.reject(error);
  },
)
// 添加响应拦截器
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    // 对响应数据做点什么
    return response;
  },
  (error: any) => {
    // 处理响应错误
    
    if(error.status==401){
      localStorage.removeItem("Authorization")
      localStorage.removeItem("userBaseInfo")

      const userStore=userInfoStore()
      userStore.setIsloading(false)
      userStore.setUserBaseInfo(null)
    }
    return Promise.reject(error);
  },
)
export default axiosInstance;