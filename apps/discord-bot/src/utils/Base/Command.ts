import { Message } from 'discord.js';
import { GuildConfigDto } from 'labmaker-api-wrapper';
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
    args: string[] | null,
    guildConfig: GuildConfigDto | null
  ): Promise<Message> | Promise<void>;
}
