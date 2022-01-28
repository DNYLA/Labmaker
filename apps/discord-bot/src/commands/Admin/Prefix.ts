import { Message, Permissions } from 'discord.js';
import { updateGuildConfig } from '@labmaker/wrapper';
import Command from '../../utils/Base/Command';
import DiscordClient from '../../utils/client';
import { GuildConfig } from '@labmaker/shared';

export default class Prefix extends Command {
  constructor() {
    super('prefix', 'Admin', ['setprefix']);
  }

  async run(
    client: DiscordClient,
    message: Message,
    args: string[],
    guildConfig: GuildConfig
  ) {
    if (!message.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR))
      return message.channel.send('Invalid Permission to use command');

    const prefix = args[0];

    try {
      await updateGuildConfig({
        ...guildConfig,
        prefix,
      });
      message.channel.send(`Updated Prefix to ${prefix}`);
    } catch (err) {
      message.channel.send(
        `An Error Occured Whilst trying to update the Prefix.`
      );
    }
  }
}
