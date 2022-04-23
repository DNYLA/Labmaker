import { Message } from 'discord.js';
import Command from '../../utils/Base/Command';
import DiscordClient from '../../utils/client';
import { showReviewBtns } from '../../utils/Helpers';
import { getApplicationByChannelId } from '@labmaker/wrapper';
import { Applications } from '@prisma/client';

export default class Review extends Command {
  constructor() {
    super('review', 'Admin', ['']);
  }

  async run(client: DiscordClient, message: Message, args: string[]) {
    if (message.channel.type !== 'GUILD_TEXT') return;

    if (message.channel.parent.name !== 'Open Applications') {
      message.channel.send('This command cannot be used here.');
      return;
    }

    const app = (await getApplicationByChannelId(message.channelId))
      .data as Applications;

    if (app) {
      if (app.result === 'ACCEPTED' || app.result == 'REJECTED') {
        message.channel.send(
          `This application has already been ${app.result.toLowerCase()}! It's result cannot be changed.`
        );
        return;
      }

      showReviewBtns(app.id, message.channel);
    } else {
      message.channel.send("Couldn't find application!");
    }
  }
}
