import { Message, Permissions } from 'discord.js';
import { GuildConfigDto } from '@labmaker/wrapper';
import Command from '../../utils/Base/Command';
import DiscordClient from '../../utils/client';
import Payments from '../../utils/GeneratePayment';
import { hasAnyPerms } from '../../utils/Helpers';

export default class Invoice extends Command {
  constructor() {
    super('invoice', 'Admin', []);
  }

  async run(
    client: DiscordClient,
    message: Message,
    args: string[],
    guildConfig?: GuildConfigDto
  ) {
    // Only tutors/admins can call this command
    if (
      !hasAnyPerms(
        message,
        ['Tutor'],
        [Permissions.FLAGS.ADMINISTRATOR],
        'Only a Tutor can create an invoice for you!'
      )
    )
      return;

    // Do nothing if NOT ran in a ticket channel
    if (message.channel.type == 'DM') return;
    if (!message.channel.name.includes('ticket-')) return;

    const usage = '\n**Example:** ```!invoice <total>```';

    if (!args[0]) {
      // Command requires an argument with the amount of the invoice
      return message.channel.send(
        `You need to pass the invoice total (defaults to USD). ${usage}`
      );
    }

    if (isNaN(Number(args[0]))) {
      return message.channel.send(
        `The invoice total must be a number! **"${args[0]}" is not a number.** ${usage}`
      );
    }

    const payments = await client.API.Discord.getPayments(
      guildConfig.paymentConfigId
    );

    client.setPayments({ serverId: guildConfig.id, payments });

    // pick payment method
    const row = await Payments.GeneratePayments(
      client,
      guildConfig,
      'Tutor',
      'paymentoption'
    );

    if (!row) {
      return message.channel.send('No Payments Available.');
    }

    message.reply({
      content: 'Please Pick A Payment Method',
      components: [row],
    });
  }
}
