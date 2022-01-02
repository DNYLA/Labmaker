import {
  GuildConfigDto,
  LogDto,
  PaymentDto,
  RedditConfigDto,
  UserDto,
} from '@labmaker/wrapper';

export type RedditConfig = RedditConfigDto & {
  loading?: boolean;
  newNode?: boolean;
};

export type GuildConfig = GuildConfigDto & { loading?: boolean };

export type Payment = PaymentDto & { loading?: boolean };

export type User = UserDto & { loading?: boolean };

export type Log = LogDto & { loading?: boolean };
