import { API } from './utils/BaseAPI';
import { LogDto, RedditConfigDto } from './types';

export class LogAPI extends API {
  constructor(apiUrl: string) {
    super(`${apiUrl}/reddit/log/`);
  }

  async getLogs(nodeId: number): Promise<LogDto[]> {
    const url = this.getUrl() + nodeId;

    return await this.get(url);
  }

  async getSubmissionIds(nodeId: number): Promise<string[]> {
    const url = this.getUrl() + `submissions/${nodeId}`;

    return await this.get(url);
  }

  async create(createLogDto: LogDto): Promise<RedditConfigDto> {
    return await this.post(createLogDto);
  }
}
