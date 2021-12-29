import { Message } from 'discord.js';
import { GuildConfigDto } from 'labmaker-api-wrapper';
import Command from '../utils/Base/Command';
import DiscordClient from '../utils/client';
import Payments from '../utils/GeneratePayment';

export default class Payment extends Command {
  constructor() {
    super('pay', 'Admin', ['payment']);
  }

  async run(
    client: DiscordClient,
    message?: Message,
    args?: string[],
    guildConfig?: GuildConfigDto
  ) {
    const payments = await client.API.Discord.getPayments(
      guildConfig.paymentConfigId
    );

    client.setPayments({ serverId: guildConfig.id, payments });

    const row = await Payments.GeneratePayments(client, guildConfig);

    if (!row) {
      return message.channel.send('No Payments Available.');
    }

    message.channel.send({
      content: 'Our Payment Methods',
      components: [row],
    });
  }
}
