export type CreateOrderDto = {
  /**
   * Channel ID to ticket relating to payment.
   */
  channelId: string;

  /**
   * URL to checkout.
   */
  url: string;

  /**
   * Payment breakdown (fees, gross, net profit)
   */
  breakdown: CreateOrderBreakdownDto;
};

export type CreateOrderBreakdownDto = {
  fee: CreateOrderBreakdownAmountDto;
  gross: CreateOrderBreakdownAmountDto;
  net: CreateOrderBreakdownAmountDto;
};

export type CreateOrderBreakdownAmountDto = {
  value: string;
  currencyCode: string;
};

export type RedditConfigDto = {
  id: number;
  clientId: string;
  clientSecret: string;
  username: string;
  password: string;
  userAgent: string;
  title: string;
  pmBody: string;
  subreddits: string[];
  forbiddenWords: string[];
  blockedUsers: string[];
  userId: string;
  nodeEditors: string[];
  creator?: UserDto;
  logs?: LogDto[];
  delay: number;
};

export type LogDto = {
  id: number;
  nodeId: number;
  message: string;
  subId: string;
  username: string;
  subreddit: string;
  createdAt?: string;
  pm: boolean;
  redditConfig?: RedditConfigDto[];
};

export enum UserRole {
  USER,
  TUTOR,
  ADMIN,
  BOT,
}

export type UserDto = {
  id: string;
  username: string;
  discriminator: string;
  avatar?: string;
  nodes: RedditConfigDto[];
  editableNodes: number[];
  role: UserRole;
};

// export type TutorUser = {
//   id: string;
//   username: string;
//   discriminator: string;
//   avatar?: string;
//   nodes: RedditConfigDto[];
//   editableNodes: number[];
//   role: UserRole;
// };

export type Guild = {
  id: string;
  name: string;
  icon: string;
  owner: boolean;
  permissions: string;
  features: string[];
  joined: boolean;
};

export type APIOptions = {
  debug?: boolean;
  logFullErr?: boolean;
  logObject?: boolean;
};

export interface ICallback {
  (event: Events, result?: any): void;
}

export enum Events {
  Config = 'config',
  Delete = 'deleteConfig',
}

export type AuthResult = {
  accessToken: string;
  ok: boolean;
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

export type DiscordUser = {
  id: string;
  username: string;
  avatar?: string;
  discriminator: string;
  mfa_enabled: boolean;
  premium_type: number;
};
