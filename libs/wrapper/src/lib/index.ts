/* Add Main Class API-MAIN which takes options as an argument
 *  These Options can be URL, TOKEN, ETC.
 *  Make use of Args inside other API calls.
 *  Only Export API-MAIN not other Classes. */

import axios from 'axios';
import { DiscordConfigAPI } from './DiscordConfig';
import { GuildsAPI } from './Guilds';
import { LogAPI } from './Log';
import { RedditConfigAPI } from './RedditConfig';
import { TicketAPI } from './TicketConfig';
import { APIOptions } from './types';
import { UserAPI } from './User';
import { PayAPI } from './Pay';
import { API } from './utils/BaseAPI';
import { refreshToken } from './utils/refreshToken';

export * from './types';
export { DiscordConfigAPI } from './DiscordConfig';
export { RedditConfigAPI } from './RedditConfig';
export { TicketAPI } from './TicketConfig';
export { LogAPI } from './Log';
export { PayAPI } from './Pay';

export class LabmakerAPI {
  constructor(private apiURL: string, private options?: APIOptions) {
    if (this.options) {
      API.options = this.options;
    }

    if (this.apiURL.endsWith('/')) {
      this.apiURL = this.apiURL.slice(0, this.apiURL.length - 2);
    }
  }

  public Discord = new DiscordConfigAPI(this.apiURL);
  public Guild = new GuildsAPI(this.apiURL);
  public Log = new LogAPI(this.apiURL);
  public Reddit = new RedditConfigAPI(this.apiURL);
  public Ticket = new TicketAPI(this.apiURL);
  public User = new UserAPI(this.apiURL);
  public Pay = new PayAPI(this.apiURL);

  public async refreshAccesToken() {
    const url = `${this.apiURL}/auth/refresh_token`;

    return await refreshToken(url);
  }

  public loginURL() {
    return `${this.apiURL}/auth/login`;
  }

  public setAccessToken(s: string) {
    API.setAccessToken(s);
  }

  public get accessToken() {
    return API.accessToken;
  }

  public async fetchUserAvatar(s: string) {
    const page = axios.get(`https://www.reddit.com/user/${s}`);
    console.log(page);
  }
}
