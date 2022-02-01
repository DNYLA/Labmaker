import { GuildConfig, GuildData, Payment } from '@labmaker/shared';
import { createGuildConfig, getGuildConfig } from '@labmaker/wrapper';
import { Client, ClientOptions, Collection } from 'discord.js';
import Command from './Base/Command';
import Event from './Base/Event';

export default class DiscordClient extends Client {
  private _commands = new Collection<string, Command>();
  private _events = new Collection<string, Event>();
  private _guilds = new Array<GuildData>();
  private _prefix = '?';

  constructor(options?: ClientOptions) {
    super(options);
  }

  get commands(): Collection<string, Command> {
    return this._commands;
  }

  get events(): Collection<string, Event> {
    return this._events;
  }

  get prefix(): string {
    return this._prefix;
  }

  set prefix(prefix: string) {
    this.prefix = prefix;
  }

  getPayments(id: string): Payment[] {
    const g = this.getGuild(id);
    if (!g) return null;
    return g.payments;
  }

  setPayments(payment: Payment[]) {
    if (payment.length === 0) return;
    const i = this.getGuildIndex(payment[0].serverId);
    if (i > -1) this._guilds[i].payments = payment;
    // else callFetchConfig;
  }

  async getConfig(id: string): Promise<GuildConfig> {
    const g = this.getGuild(id);
    if (!g) {
      try {
        const config = (await getGuildConfig(id)).data;

        if (!config) return null;
        this.setConfig(config);
        return config;
      } catch (err) {
        console.log(err);
      }
    }
    return g.config;
  }

  setConfig(config: GuildConfig) {
    const i = this.getGuildIndex(config.id);
    if (i > -1) this._guilds[i].config = config;
    else this._guilds.push({ config, payments: [] });
  }

  getGuild(id: string): GuildData {
    return this._guilds.find((g) => g.config.id === id);
  }

  setGuild(guild: GuildData) {
    const i = this.getGuildIndex(guild.config.id);
    if (i > -1) this._guilds[i] = guild;
    else this._guilds.push(guild);
  }

  private getGuildIndex(id: string): number {
    return this._guilds.findIndex((g) => g.config.id === id);
  }
}
