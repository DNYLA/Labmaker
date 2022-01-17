import { Message } from 'discord.js';
import { getDiscordPayments, GuildConfigDto } from '@labmaker/wrapper';
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
    const { data: payments } = await getDiscordPayments(
      guildConfig.paymentConfigId
    );

    client.setPayments({ serverId: guildConfig.id, payments });

    const row = await Payments.GeneratePayments(
      client,
      guildConfig,
      'anyone',
      'paymentoption'
    );

    if (!row) {
      return message.channel.send('No Payments Available.');
    }

    message.channel.send({
      content: 'Our Payment Methods',
      components: [row],
    });
  }
}
