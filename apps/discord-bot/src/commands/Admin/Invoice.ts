import { Message, Permissions, TextChannel } from 'discord.js';
import { GuildConfigDto } from 'labmaker-api-wrapper';
import Command from '../../utils/Base/Command';
import DiscordClient from '../../utils/client';
import Payments from '../../utils/GeneratePayment';

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
    // TODO: add this check to button interaction
    if (
      !message.member.roles.cache.find((r) => r.name === 'Tutor') ||
      !message.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)
    ) {
      return message.channel.send(
        'Only a Tutor can create an invoice for you!'
      );
    }

    // Do nothing if NOT ran in a ticket channel
    if (message.channel.type == 'DM') return;
    if (!message.channel.name.includes('ticket-')) return;

    if (!args[0]) {
      // Command requires an argument with the amount of the invoice
      return message.channel.send(
        'You need to pass the invoice total (defaults to USD). \n**Example:** ```!invoice <total>```'
      );
    }

    const payments = await client.API.Discord.getPayments(
      guildConfig.paymentConfigId
    );

    client.setPayments({ serverId: guildConfig.id, payments });

    // pick payment method
    const row = await Payments.GeneratePayments(client, guildConfig);

    if (!row) {
      return message.channel.send('No Payments Available.');
    }

    message.reply({
      content: 'Please Pick A Payment Method',
      components: [row],
    });
  }
}
