import { Message, Permissions } from 'discord.js';
import Command from '../utils/Base/Command';
import DiscordClient from '../utils/client';

export default class ClearTickets extends Command {
  constructor() {
    super('flip', 'Admin', ['']);
  }

  async run(client: DiscordClient, message: Message, args: string[]) {
    const x = Math.floor(Math.random() * 2 + 1);
    if (x === 1) return message.reply('Heads');
    else return message.reply('Tails');
  }
}
