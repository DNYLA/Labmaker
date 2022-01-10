import { Client, ClientOptions, Collection } from 'discord.js';
import { LabmakerAPI, GuildConfigDto, PaymentDto } from '@labmaker/wrapper';
import Command from './Base/Command';
import Event from './Base/Event';

export type PaymentsType = {
  serverId: string;
  payments: PaymentDto[];
};

export default class DiscordClient extends Client {
  private _commands = new Collection<string, Command>();
  private _events = new Collection<string, Event>();
  private _apiHandler = new LabmakerAPI(process.env.API_URL, {
    debug: true,
    logFullErr: true,
    logObject: true,
  });
  // public apiHandler = new LabmakerAPI(process.env.API_URL);
  private _payments = new Array<PaymentsType>();
  private _configs = new Array<GuildConfigDto>();
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

  get API(): LabmakerAPI {
    return this._apiHandler;
  }

  get prefix(): string {
    return this._prefix;
  }

  set prefix(prefix: string) {
    this.prefix = prefix;
  }

  getPayments(id: string): PaymentsType {
    // console.log(this._payments);
    // console.log(id);
    return this._payments.find((payment) => payment.serverId === id);
  }

  setPayments(payment: PaymentsType) {
    if (this._payments.length == 0) {
      //console.log('IS EMPTY');
      return this._payments.push(payment);
    }

    const index = this._payments.findIndex(
      (p) => p.serverId === payment.serverId
    );

    if (index > -1) this._payments[index] = payment;
    else this._payments.push(payment);
  }

  getConfig(id: string): GuildConfigDto {
    return this._configs.find((config) => config.id === id);
  }

  setConfig(config: GuildConfigDto) {
    const index = this._configs.findIndex((c) => c.id === config.id);

    if (index > -1) this._configs[index] = config;
    else this._configs[index] = config;
  }
}
