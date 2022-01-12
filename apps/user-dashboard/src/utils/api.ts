//Update Actual API with this if the tests work

import axios, { AxiosRequestConfig } from 'axios';
import { AuthResult, UserDto } from '@labmaker/wrapper';

const CONFIG: AxiosRequestConfig = { withCredentials: true };
const API_URL = 'http://localhost:3000';
const AXIOS = axios.create(CONFIG);
let ACCESS_TOKEN = '';

export const getUser = () => {
  return AXIOS.get<UserDto>(`${API_URL}/user/`, CONFIG);
};
export const refreshToken = () => {
  const instance = axios.create(); //Dont want to use Interceptors when refreshing token
  return instance.get<AuthResult>(`${API_URL}/auth/refresh_token`, CONFIG);
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
      refreshToken()
        .then(({ data }) => {
          if (!data.ok) {
            //Redirect to Login URL
            console.log('Authentication Failed');
          }

          axios.defaults.headers.common['Authorization'] =
            'Bearer ' + data.accessToken;
        })
        .catch((err) => {
          console.log('An Error Occured whilst trying to authenticate');
          console.log(err);
        });

      return axios(originalRequest);
    }

    return Promise.reject(err);
  }
);
