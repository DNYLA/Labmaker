import { API } from './utils/BaseAPI';
import { UserDto } from './types';

export class UserAPI extends API {
  constructor(apiUrl: string) {
    super(`${apiUrl}/user/`);
  }

  async getUser(): Promise<UserDto> {
    return await this.get();
  }
}
