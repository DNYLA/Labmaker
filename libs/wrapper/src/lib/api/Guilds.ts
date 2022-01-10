import { API } from '../utils/BaseAPI';
import { Guild, GuildConfigPayment } from '../types';

export class GuildsAPI extends API {
  constructor(apiUrl: string) {
    super(`${apiUrl}/discord/guilds/`);
  }

  async Guilds(): Promise<Guild[]> {
    return await this.get();
  }

  async Config(serverId: string): Promise<GuildConfigPayment> {
    const url = this.getUrl() + serverId;

    return await this.get(url);
  }
}
