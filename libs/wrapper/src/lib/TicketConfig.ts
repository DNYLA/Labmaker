import { API } from './utils/BaseAPI';
import { TicketDto } from './types';

export class TicketAPI extends API {
  constructor(apiUrl: string) {
    super(`${apiUrl}/discord/ticket/`);
  }

  //Allow String Param of Ticketid & Convert to Number
  async getOne(serverId: string, ticketId: number): Promise<TicketDto> {
    const url = this.getUrl();
    const updatedUrl = `${url}${serverId}/${ticketId}`;
    return await this.get(updatedUrl);
  }

  async getAll(serverId: string): Promise<TicketDto[]> {
    const url = this.getUrl() + serverId;
    return await this.get(url);
  }

  async create(
    serverId: string,
    ticketId: number,
    channelId: string
  ): Promise<TicketDto | any> {
    const options = { serverId, ticketId, channelId };
    return await this.post(options);
  }

  async update(updatedTicket: TicketDto): Promise<TicketDto | any> {
    return await this.put(updatedTicket);
  }

  async deleteTicket(ticketId: number): Promise<TicketDto | any> {
    const url = this.getUrl() + ticketId;
    return await this.delete(url);
  }
}
