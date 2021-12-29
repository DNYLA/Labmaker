import { DMChannel, NewsChannel, TextChannel } from 'discord.js';
import Event from '../utils/Base/Event';
import DiscordClient from '../utils/client';

export default class MessageEvent extends Event {
  constructor() {
    super('channelCreate');
  }

  async run(
    client: DiscordClient,
    channel: NewsChannel | TextChannel | DMChannel
  ) {
    if (channel.type == 'DM') {
      return;
    }

    const guildId = channel.guild.id;
    const channelId = channel.id;

    let x = channel.guild.me.joinedTimestamp / 1000;
    if (x >= x + 10) return; // if the bot just joined the server the channelcreate event will get activated after 10 sec
    if (
      channel.parent === null ||
      channel.parent.name.toLowerCase() != 'open orders'
    )
      return;

    const ticketIdMsg = channel.name.toLowerCase().replace('ticket-', '');
    if (isNaN(Number(ticketIdMsg))) return;
    const ticketId = Number(ticketIdMsg);

    setTimeout(async () => {
      channel.send(
        `Welcome! I'm going to need some more information before I can find you a suitable tutor. (Enter !stop at Anytime to cancel).`
      );

      await client.API.Ticket.create(guildId, ticketId, channelId);

      channel.send(`**Is this an exam, assignment or homework sheet?**`);
    }, 1500);
  }
}
