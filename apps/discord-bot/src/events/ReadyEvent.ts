import { Message } from 'discord.js';
import Event from '../utils/Base/Event';
import DiscordClient from '../utils/client';

export default class MessageEvent extends Event {
  constructor() {
    super('ready');
  }

  async run(client: DiscordClient, message: Message) {
    client.user.setPresence({
      activities: [
        { name: 'Helping students with their work.', type: 'PLAYING' },
      ],
      status: 'online',
    });
    console.log(`${client.user.username} is running.`);
  }
}
