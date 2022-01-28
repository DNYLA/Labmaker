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

    return;
  }
}
