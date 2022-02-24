import { Message } from 'discord.js';
import Command from '../../utils/Base/Command';
import DiscordClient from '../../utils/client';
import { showReviewBtns } from '../../utils/Helpers';

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

    // showReviewBtns(message.channel);
  }
}
