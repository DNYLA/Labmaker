import { Message, Permissions } from 'discord.js';
import Command from '../../utils/Base/Command';
import DiscordClient from '../../utils/client';
import { hasAnyPerms, showConfirmation } from '../../utils/Helpers';

export default class PayPal extends Command {
  constructor() {
    super('paypal', 'Pay', ['pp']);
  }

  async run(client: DiscordClient, message: Message, args: string[]) {
    // Only tutors/admins can call this command
    if (
      !hasAnyPerms(
        message,
        ['Tutor'],
        [Permissions.FLAGS.ADMINISTRATOR],
        'Only a Tutor can create a PayPal order for you!'
      )
    )
      return;

    // Do nothing if NOT ran in a ticket channel
    if (message.channel.type == 'DM') return;
    if (!message.channel.name.includes('ticket-')) return;

    const usage = '\n**Example:** ```!paypal <total>```';

    if (!args[0]) {
      // Command requires an argument with the amount of the order
      return message.channel.send(
        `You need to pass the order total (defaults to USD). ${usage}`
      );
    }

    if (isNaN(Number(args[0]))) {
      return message.channel.send(
        `The order total must be a number! **"${args[0]}" is not a number.** ${usage}`
      );
    }

    // Show confirmation - handle in InteractionCreated
    showConfirmation(
      message as Message,
      `Create PayPal order for $${Number(args[0])}?`,
      { roleIds: 'Tutor', areaId: 'createpporder' }
    );
  }
}
