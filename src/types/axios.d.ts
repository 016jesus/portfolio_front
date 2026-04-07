import 'axios';

declare module 'axios' {
  export interface AxiosRequestConfig {
    _skipAuthInterceptor?: boolean;
  }
  export interface InternalAxiosRequestConfig {
    _skipAuthInterceptor?: boolean;
  }
}
