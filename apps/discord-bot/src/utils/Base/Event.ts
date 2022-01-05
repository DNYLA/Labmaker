import DiscordClient from '../client';

export default abstract class Event {
  constructor(private name: string) {}

  getName(): string {
    return this.name;
  }

  abstract run(client: DiscordClient, ...args: any): Promise<void>;
}
