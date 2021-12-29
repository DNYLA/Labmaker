import { Message, Permissions } from 'discord.js';
import Command from '../../utils/Base/Command';
import DiscordClient from '../../utils/client';

export default class Clear extends Command {
  constructor() {
    super('clear', 'Admin', ['']);
  }

  async run(client: DiscordClient, message: Message, args: string[]) {
    if (!message.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
      return message.channel.send('Invalid Permission to use command');
    }

    if (!args[0]) return message.reply('Please Specify A Number');

    const amount = parseInt(args[0]);

    if (isNaN(amount)) return message.reply('Please Enter a Valid Number');
    if (amount > 100 || amount < 1)
      return message.reply('Number Must Be between 1-100');

    if (message.channel.type == 'GUILD_TEXT') {
      message.channel.bulkDelete(amount);
    }
  }
}
