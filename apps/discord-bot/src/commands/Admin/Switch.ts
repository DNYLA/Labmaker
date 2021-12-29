import { Message, Permissions } from 'discord.js';
import { GuildConfigDto } from 'labmaker-api-wrapper';
import Command from '../../utils/Base/Command';
import DiscordClient from '../../utils/client';

export default class Payment extends Command {
  constructor() {
    super('switch', 'Admin', ['s']);
  }

  async run(
    client: DiscordClient,
    message: Message,
    args: string[],
    guildConfig: GuildConfigDto
  ) {
    if (!message.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
      return message.channel.send('Invalid Permission to use command');
    }

    return message.channel.send(
      'This method is currently disabled. Go to https://labmaker.vercel.app/ and update manually'
    );

    // let user = message.mentions.users.first();

    // if (!args[0]) {
    //   user = message.author;
    // }

    // //ID was provided
    // if (!user) {
    //   message.channel.send('Invalid user provided');
    // }

    // //Future Update: Get message content frombody and auto append discord tag to correct place
    // const customMessage = `Add me on Discord ${user.username}#${user.discriminator}.`;

    // await client.API.Reddit.updateMessage(
    //   guildConfig.paymentConfigId,
    //   customMessage
    // );

    // message.channel.send(customMessage);
  }
}
