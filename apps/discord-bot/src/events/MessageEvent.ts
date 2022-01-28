import { createGuildConfig, getGuildConfig } from '@labmaker/wrapper';
import { Message } from 'discord.js';
import Event from '../utils/Base/Event';
import DiscordClient from '../utils/client';
import { getArgsFromMsg } from '../utils/Helpers';

export default class MessageEvent extends Event {
  constructor() {
    super('messageCreate');
  }

  async run(client: DiscordClient, message: Message) {
    if (message.author.bot) return;
    const guildId = message.guild.id;

    let config = client.getConfig(guildId);

    if (!config) {
      try {
        config = (await getGuildConfig(guildId)).data;

        if (!config)
          config = (await createGuildConfig(guildId, message.guild.name)).data;

        client.setConfig(config);
      } catch (err) {
        message.channel.send('Unable to fetch Guild Config');
      }
    }

    if (!config) return; //After Two Tries move on.
    console.log('here');
    if (message.content.startsWith(config.prefix)) {
      // If message is only <Prefix>
      if (message.content === config.prefix) return;
      const { commandName, args } = getArgsFromMsg(
        message.content,
        config.prefix.length
      );
      const command = client.commands.get(commandName.toLowerCase());

      if (command) {
        try {
          command.run(client, message, args, config);
        } catch (err) {
          message.channel.send(
            'There was an error when attempting to execute this command'
          );
        }
      }
    }
  }
}
