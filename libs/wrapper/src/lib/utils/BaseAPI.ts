import axios from 'axios';
import { APIOptions } from '../types';
import { refreshToken } from './refreshToken';

enum Methods {
  Get = 'GET',
  Post = 'POST',
  Put = 'PUT',
  Delete = 'DELETE',
}

export class API {
  static _accessToken = '';
  static options: APIOptions = { debug: false, logFullErr: false };
  static gAPIURL: string; //Global Access (Maybe Move LAter?)
  constructor(private APIUrl: string) {
    API.gAPIURL = this.APIUrl;
  }

  public static setAccessToken(s: string) {
    if (!s) return;

    API._accessToken = s;
  }

  public static get accessToken() {
    if (!this._accessToken) throw new Error('Access token not defined!');

    return `Bearer ${API._accessToken}`;
  }

  protected getUrl() {
    return this.APIUrl;
  }

  private LogCalls(url: string, type: Methods, options?: any) {
    if (!API.options.debug) return;

    if (!API.options.logFullErr || !options || options === undefined) {
      console.log(`Sending a ${type} Request to ${url}`);
    } else {
      console.log(
        `Sending a ${type} Request to ${url} with ${JSON.stringify(options)}`
      );
    }
  }

  private LogError(err: any, type: Methods, endpoint: string) {
    console.error(`${type} ${err.message} at ${endpoint}`);
    if (!API.options.logFullErr) return;

    try {
      console.log(err.toJSON());
    } catch {
      console.log(err);
    }
  }

  protected async get(url?: string): Promise<any> {
    const endpoint = url ? url : this.APIUrl;

    try {
      this.LogCalls(endpoint, Methods.Get);
      return (await axios.get(endpoint)).data;
    } catch (err: any) {
      return this.LogError(err, Methods.Get, endpoint);
    }
  }

  protected async post(options: any, url?: string): Promise<any> {
    const endpoint = url ? url : this.APIUrl;

    try {
      this.LogCalls(endpoint, Methods.Post, options);
      return (await axios.post(endpoint, options)).data;
    } catch (err: any) {
      return this.LogError(err, Methods.Post, endpoint);
    }
  }

  protected async put(options: any, url?: string): Promise<any> {
    const endpoint = url ? url : this.APIUrl;

    try {
      this.LogCalls(endpoint, Methods.Put);
      return (await axios.put(endpoint, options)).data;
    } catch (err: any) {
      return this.LogError(err, Methods.Put, endpoint);
    }
  }

  protected async delete(options: any, url?: string): Promise<any> {
    const endpoint = url ? url : this.APIUrl;

    try {
      this.LogCalls(endpoint, Methods.Delete);
      return (await axios.delete(endpoint, { data: options })).data;
    } catch (err: any) {
      return this.LogError(err, Methods.Delete, endpoint);
    }
  }
}

axios.interceptors.request.use((req) => {
  if (!req.headers) return;
  req.headers['Authorization'] = API.accessToken;
  return req;
});

axios.interceptors.response.use(
  (res) => {
    // Important: response interceptors **must** return the response.

    return res;
  },
  async (err) => {
    const originalRequest = err.config;
    // const refreshExpired = originalRequest.url.includes('auth/refresh_token');

    if (err.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const res = await refreshToken(`${API.gAPIURL}/auth/refresh_token`);
      if (res.ok) {
        axios.defaults.headers.common['Authorization'] =
          'Bearer ' + res.accessToken;
      }

      return axios(originalRequest);
    }

    return Promise.reject(err);
  }
);
