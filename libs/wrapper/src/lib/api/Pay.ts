import { CreateOrderDto } from '../types';
import { API } from '../utils/BaseAPI';

export class PayAPI extends API {
  constructor(apiUrl: string) {
    super(`${apiUrl}/pay/`);
  }

  async createOrder(
    tutorId: string,
    channelId: string,
    price: string
  ): Promise<CreateOrderDto> {
    return await this.get(
      this.getUrl() + `create_order/${tutorId}/${channelId}/${price}`
    );
  }
}
