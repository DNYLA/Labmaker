//#region Guild
export type GuildData = {
  config: GuildConfig;
  channels?: PartialGuildChannel[];
  roles?: PartialRole[];
  payments: Payment[];
};

export type GuildConfig = {
  id: string;
  name: string;
  icon?: string;
  prefix: string;
  embedImageUrl: string;
  paymentConfigId: string;
  ordersCategory?: string;
  notificationChannel?: string;
  tutorRole?: string;
  staffRole?: string;
  channelName: string;
  newMessage?: string;
  acceptedMessage?: string;
  deleteMessage?: string;
  hideChannel: boolean;
  notifyUser: boolean;
  ticketSystem: boolean;
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

export type CreateApplication = {
  applicationMessage: string;
  vouchesLink: string;
  redditUsername?: string;
  subjects: Subjects[];
};

export type TutorApplication = {
  id: number;
  userId: string;
  serverId: string;
  applicationMessage: string;
  createdAt: Date;
  vouchesLink: string;
  redditUsername?: string;
  subjects: Subjects[];
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
  Chem = 'chemistry',
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
  Created = 'created',
  Accepted = 'accepted',
  Resigned = 'resigned',
  Deleted = 'deleted',
}

export type TicketInfo = {
  ticket: Ticket;
  type: TicketNotif;
};

export type TicketChannelInfo = {
  id: number;
  channelId: string;
};

//Discord Types
export type PartialGuild = {
  id: string;
  name: string;
  icon: string;
  owner: boolean;
  permissions: string;
  features: string[];
};

export type PartialRole = {
  id: string;
  name: string;
  color: number;
};

export type PartialGuildChannel = {
  id: string;
  name: string;
  type: ChannelType;
};

export enum ChannelType {
  GUILD_TEXT = 0,
  DM = 1,
  GUILD_VOICE = 2,
  GROUP_DM = 3,
  GUILD_CATEGORY = 4,
  GUILD_NEWS = 5,
  GUILD_STORE = 6,
  GUILD_NEWS_THREAD = 7,
  GUILD_PUBLIC_THREAD = 8,
  GUILD_PRIVATE_THREAD = 9,
  GUILD_STAGE_VOICE = 10,
}
