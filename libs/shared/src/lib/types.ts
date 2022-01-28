//#region Guild
export type GuildData = {
  config: GuildConfig;
  payments: Payment[];
};

export type GuildConfig = {
  id: string;
  name: string;
  icon?: string;
  prefix: string;
  embedImageUrl: string;
  autoSwitcher: boolean;
  autoTicket: boolean;
  autoReact: boolean;
  paymentConfigId: string;
  tickets?: Ticket[];
};

export type Payment = {
  id?: number;
  name: string;
  value: string;
  type: string;
  serverId: string;
  newPayment?: boolean;
  deletedPayment?: boolean;
};

//#region Tickets
export type Ticket = CreateTicket & {
  id: number;
  tutorId: string;
  completed: boolean;
  paid: boolean;
  channelId: string;
  deleted: boolean;
};

export type PartialTicket = {
  id: number;
  serverId: string;
  additionalInfo: string;
  type: string;
  subject: string;
  education: string;
  budget: number;
  due: Date;
};

export type CreateTicket = {
  serverId: string;
  additionalInfo: string;
  creatorId: string;
  budget: number;
  due: Date;
  type: string;
  subject: string;
  education: string;
};

export type Tickets = {
  active: Ticket[];
  completed: Ticket[];
};
//#endregion
//#endregion

export enum TicketAction {
  Accept = 'accept',
  Resign = 'resign',
  Complete = 'completed',
}

export enum Subjects {
  Maths = 'maths',
  CompSci = 'compSci',
  English = 'english',
  Chem = 'chem',
  Physics = 'physics',
  Bio = 'bio',
  Other = 'other',
}

export enum Type {
  Homework = 'hw',
  Exam = 'exam',
  Assignment = 'assignment',
  Other = 'other',
}

export enum Education {
  University = 'uni',
  College = 'college',
  Other = 'other',
}

export enum PaymentAction {
  Create,
  Update,
  Delete,
}

export enum TicketNotif {
  Created,
  Accepted,
  Resigned,
  Deleted,
}

export type TicketInfo = {
  ticket: Ticket;
  type: TicketNotif;
};

export type TicketChannelInfo = {
  id: number;
  channelId: string;
};
