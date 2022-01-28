import { Message, Permissions } from 'discord.js';
import Command from '../../utils/Base/Command';
import DiscordClient from '../../utils/client';

export default class ClearTickets extends Command {
  constructor() {
    super('cleartickets', 'Admin', ['']);
  }

  async run(client: DiscordClient, message: Message, args: string[]) {
    console.log('running');

    if (!message.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR))
      return message.channel.send('Invalid Permission to use command');

    await message.guild.channels.fetch();
    message.guild.channels.cache.forEach(async (c) => {
      if (c.parent?.id === '936715000159043665') {
        await c.delete();
      }
    });
  }
}
