//Update Actual API with this if the tests work

import axios, { AxiosRequestConfig } from 'axios';
import { AdminUser, AuthResult, UserDto } from '../types';

const CONFIG: AxiosRequestConfig = { withCredentials: true };
export const AXIOS = axios.create(CONFIG); //Axios Uses .defaults.baseURL to set/call the API this way we can change the API URL outside the library.
let ACCESS_TOKEN = '';

export const setBaseURL = (baseURL: string, accessToken?: string) => {
  AXIOS.defaults.baseURL = baseURL;
  if (accessToken) ACCESS_TOKEN = accessToken;
};

export const loginURL = () => `${AXIOS.defaults.baseURL}/auth/login`;

export const getUser = () => AXIOS.get<UserDto>(`/user/`);

export const getAdminUser = () => AXIOS.get<AdminUser>('/user?admin=true');

const refreshToken = () => {
  const instance = axios.create(CONFIG); //Dont want to use Interceptors when refreshing token
  instance.defaults.baseURL = AXIOS.defaults.baseURL;
  return instance.get<AuthResult>(`/auth/refresh_token`);
};

export const setToken = async () => {
  try {
    const { data: result } = await refreshToken();
    if (!result.ok) {
      return null;
    }
    ACCESS_TOKEN = result.accessToken;
    return result.accessToken;
  } catch (err) {
    console.log(err);
    return null;
  }
};

AXIOS.interceptors.request.use((req) => {
  if (!req.headers) return;
  req.headers['Authorization'] = 'Bearer ' + ACCESS_TOKEN;
  // console.log(req);
  return req;
});

AXIOS.interceptors.response.use(
  (res) => {
    // Important: response interceptors **must** return the response.

    return res;
  },
  async (err) => {
    const originalRequest = err.config;
    // const refreshExpired = originalRequest.url.includes('auth/refresh_token');

    if (err.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await setToken();
        originalRequest.headers['Authorization'] = 'Bearer ' + ACCESS_TOKEN;
        return axios(originalRequest);
      } catch (err) {
        //Force Refresh?? || Clear Cookies/Force Re-Login
        console.log('Failed to Authenticate');
        console.log(err);
      }
    } else {
      //New Token After refreshing Invalid -> Force Refresh || Clear Cookies/Force Re-Login
    }

    return Promise.reject(err);
  }
);

export * from './discord';
export * from './reddit';
export * from './logs';
export * from './GuildConfig';
export * from './ticket';
