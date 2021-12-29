import { TextChannel } from 'discord.js';
import DiscordClient from './client';

export function getArgsFromMsg(
  msg: string,
  prefixLn: number
): { commandName: string; args?: string[] } {
  // Args including the command name
  let args = msg.slice(prefixLn).split(/ +/);

  return {
    commandName: args[0],
    args: args.slice(1),
  };
}

/**
 * Get ticket number from a channel.
 * @param channel Ticket text channel.
 * @returns Ticket number.
 */
export function getTicketNo(channel: TextChannel): number {
  // Channel must be under Open Orders category for it to be a valid ticket.
  if (channel.parent == null || channel.parent.name != 'Open Orders')
    return null;

  const ticketNo = Number(channel.name.toLowerCase().replace('ticket-', ''));

  if (isNaN(ticketNo)) {
    channel.send(`Invalid Ticket ID`);
    return null;
  }

  return ticketNo;
}

/**
 * Get tickets text channel from its number.
 * @param ticketNo Tickets number.
 * @returns Ticket text channel.
 */
export function getChannelFromId(
  client: DiscordClient,
  id: string
): TextChannel {
  if (!id) {
    console.log('Attempted to get channel from undefined id');
    return;
  }

  const channel = client.channels.cache.find((e) =>
    e.isText() ? (e as TextChannel).id == id : null
  ) as TextChannel;

  if (!channel) {
    console.log(`Couldn't find text channel from ticket number: ${id}`);
    return null;
  }

  return channel;
}
