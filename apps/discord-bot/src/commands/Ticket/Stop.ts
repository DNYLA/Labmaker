import { getTicket, updateTicket } from '@labmaker/wrapper';
import { Message } from 'discord.js';
import Command from '../../utils/Base/Command';
import DiscordClient from '../../utils/client';

export default class Prefix extends Command {
  constructor() {
    super('stop', 'Ticket', ['']);
  }

  async run(client: DiscordClient, message: Message) {
    if (message.channel.type == 'DM') return;

    const ticketIdMsg = message.channel.name
      .toLowerCase()
      .replace('ticket-', '');
    const guildId = message.guild.id;

    if (isNaN(Number(ticketIdMsg))) return;
    const ticketId = Number(ticketIdMsg);

    const { data: ticketDetails } = await getTicket(guildId, ticketId);
    ticketDetails.submitted = true;

    await updateTicket(ticketDetails);

    message.channel.send(
      `Stopped Ticket Creation. If you would like to restart type !start`
    );
  }
}
