import { GuildConfig } from '@labmaker/shared';
import { Message, Permissions } from 'discord.js';
import Command from '../../utils/Base/Command';
import DiscordClient from '../../utils/client';

export default class Clear extends Command {
  constructor() {
    super('ping', 'Admin', ['']);
  }

  async run(
    client: DiscordClient,
    message: Message,
    args: string[],
    guildConfig: GuildConfig
  ) {
    message.reply('Pong');
    // message.reply('pong');
  }
}
