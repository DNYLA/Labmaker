import { createTicket, deleteTicket, getTicket } from '@labmaker/wrapper';
import { Message } from 'discord.js';
import Command from '../../utils/Base/Command';
import DiscordClient from '../../utils/client';

export default class Prefix extends Command {
  constructor() {
    super('start', 'Ticket', ['']);
  }

  async run(client: DiscordClient, message: Message, args: string[]) {
    if (message.channel.type == 'DM') return;

    const guildId = message.guild.id;
    const ticketIdMsg = message.channel.name
      .toLowerCase()
      .replace('ticket-', '');
    const channelId = message.channel.id;

    if (isNaN(Number(ticketIdMsg))) return;
    const ticketId = Number(ticketIdMsg);

    const { data: ticketDetails } = await getTicket(guildId, ticketId);

    await deleteTicket(ticketDetails.id);

    message.channel.send(
      `Started New Ticket, if you would like to stop the ticket use !stop`
    );

    await createTicket(guildId, ticketId, channelId);

    message.channel.send(
      `**Is this an exam, assignment or homework sheet?** Include the subject as well.`
    );
  }
}
