import {
  GuildConfigDto,
  LogDto,
  PaymentDto,
  RedditConfigDto,
  UserDto,
} from '@labmaker/wrapper';

export type Node = RedditConfigDto & {
  loading?: boolean;
  newNode?: boolean;
};

export type GuildConfig = GuildConfigDto & { loading?: boolean };

export type PaymentType = PaymentDto & { loading?: boolean };

export type UserType = UserDto & { loading?: boolean };

export type LogType = LogDto & { loading?: boolean };
