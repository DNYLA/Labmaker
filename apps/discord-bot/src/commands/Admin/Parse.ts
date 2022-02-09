import {
  GuildConfig,
  Ticket,
  TicketAction,
  TicketNotif,
} from '@labmaker/shared';
import { parseTicketMessage } from '../../utils/Helpers';
import { Message, Permissions } from 'discord.js';
import Command from '../../utils/Base/Command';
import DiscordClient from '../../utils/client';

export default class Clear extends Command {
  constructor() {
    super('parse', 'Admin', ['']);
  }

  async run(
    client: DiscordClient,
    message: Message,
    args: string[],
    config: GuildConfig
  ) {
    //Only used when you need to test parsing.
    // const ticket: Ticket = {
    //   id: 0,
    //   tutorId: '827212859447705610',
    //   completed: false,
    //   paid: false,
    //   channelId: '937058800089829407',
    //   deleted: false,
    //   serverId: '869998649952833578',
    //   additionalInfo: 'Hi',
    //   creatorId: '863092043249483796',
    //   budget: 50,
    //   due: new Date(),
    //   type: 'exam',
    //   subject: 'maths',
    //   education: 'university',
    // };

    // const toParse =
    //   '{admin_role} {sender} has {action} the ticket. {recipient} has been Notified, close Ticket once verified.';
    // message.reply(
    //   parseTicketMessage(toParse, config, ticket, TicketNotif.Resigned)
    // );

    message.reply('disabled.');
  }
}
