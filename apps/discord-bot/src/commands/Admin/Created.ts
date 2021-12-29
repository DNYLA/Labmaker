import { Message } from 'discord.js';
import Command from '../../utils/Base/Command';
import DiscordClient from '../../utils/client';

export default class Clear extends Command {
  constructor() {
    super('created', 'Admin', ['']);
  }

  async run(client: DiscordClient, message: Message, args: string[]) {
    const date2 = message.channel.createdAt;
    message.channel.send(date2.toDateString());
  }
}
