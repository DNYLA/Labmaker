import { GuildConfig } from '@labmaker/shared';
import { Message } from 'discord.js';
import DiscordClient from '../client';

export default abstract class Command {
  constructor(
    private name: string,
    private category: string,
    private aliases: string[]
  ) {}

  getName(): string {
    return this.name;
  }
  getCategory(): string {
    return this.category;
  }
  getAliases(): string[] {
    return this.aliases;
  }

  abstract run(
    client: DiscordClient,
    message: Message,
    args: Array<string> | null,
    guildConfig: GuildConfig | null
  ): Promise<Message> | Promise<void>;
}
