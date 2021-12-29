import { Message, TextChannel } from 'discord.js';
import Command from '../../utils/Base/Command';
import DiscordClient from '../../utils/client';
import { getTicketNo } from '../../utils/Helpers';
import Logs from '../../utils/Logs';

export default class Prefix extends Command {
  constructor() {
    super('ticket', 'Ticket', ['']);
  }

  async run(client: DiscordClient, message: Message, args: string[]) {
    const channel = message.channel as TextChannel;
    const ticketId = getTicketNo(channel);
    const guildId = channel.guild.id;

    // If couldn't get ticket id, return. `getTicketNo` handles everything for us.
    if (!ticketId) return;

    let roles = message.member.roles.cache;
    if (roles.find((r) => r.id === '863817773393379358')) return;

    const ticketDetails = await client.API.Ticket.getOne(guildId, ticketId);

    if (ticketDetails.submitted) return;
    if (ticketDetails.channelId != message.channel.id) return;

    if (!ticketDetails.type) {
      ticketDetails.type = message.content;
      message.channel.send(`**What subject is the ${message.content}?**`);
    } else if (!ticketDetails.subject) {
      ticketDetails.subject = message.content;
      message.channel.send(
        `**What date & time is the ${message.content}?** (Include Timezone)`
      );
    } else if (!ticketDetails.time) {
      ticketDetails.time = message.content;
      message.channel.send(
        `**What level of education is this including year?** (University/College)`
      );
    } else if (!ticketDetails.level) {
      ticketDetails.level = message.content;
      message.channel.send(
        `**What is your budget?** (Include currency if isn't \`£ for GBP\` or \`$ for USD\`)`
      );
    } else if (!ticketDetails.budget) {
      ticketDetails.budget = message.content;
      ticketDetails.submitted = true;
      await client.API.Ticket.update(ticketDetails);
      const embeds = [await Logs.GenerateEmbed(ticketDetails, message)];

      message.channel.send({ embeds });

      //Hard Code Send Log to specific Server (Can Edit this into the DB  instead of hardcode if project gets revived)
      const guild = client.guilds.resolve('863423914230546462');
      if (guild) {
        const channel = guild.channels.resolve('863424666052198410');
        if (channel.isText()) {
          channel.send({ embeds });
        }
      }

      message.channel.send(
        `**Your Ticket has been submitted!** A helper will be with you shortly.`
      );
    }

    if (!ticketDetails.submitted) await client.API.Ticket.update(ticketDetails);
  }
}
