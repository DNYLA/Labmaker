import { Message } from 'discord.js';
import { getDiscordPayments } from '@labmaker/wrapper';
import Command from '../../utils/Base/Command';
import DiscordClient from '../../utils/client';
import { GuildConfig } from '@labmaker/shared';

export default class Payment extends Command {
  constructor() {
    super('pay', 'Admin', ['payment']);
  }

  async run(
    client: DiscordClient,
    message: Message,
    args: string[],
    config: GuildConfig
  ) {
    message.reply('Currently Unavailble');
    // const { data: payments } = await getDiscordPayments(config.paymentConfigId);
    // client.setPayments(payments);

    // const row = await Payments.GeneratePayments(
    //   client,
    //   config,
    //   'anyone',
    //   'paymentoption'
    // );

    // if (!row) {
    //   return message.channel.send('No Payments Available.');
    // }

    // message.channel.send({
    //   content: 'Our Payment Methods',
    //   components: [row],
    // });
  }
}
