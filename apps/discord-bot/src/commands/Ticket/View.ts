import { Message } from 'discord.js';
import Command from '../../utils/Base/Command';
import DiscordClient from '../../utils/client';

export default class Prefix extends Command {
  constructor() {
    super('view', 'Ticket', ['']);
  }

  async run(client: DiscordClient, message: Message, args: string[]) {
    if (message.channel.type == 'DM') return;

    const ticketId = message.channel.name.toLowerCase().replace('ticket-', '');

    if (Number(ticketId) === NaN) {
      return message.channel.send(`Ticket doesnt exist ${message.member}`);
    }

    // message.channel.send(await Logs.GenerateEmbed(ticketId, message));

    // message.channel.send(
    //   `Ticket System is currently disabled sorry for the inconvience`
    // );
  }
}
