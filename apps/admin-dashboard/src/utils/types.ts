import { LogDto, RedditConfigDto } from '@labmaker/wrapper';

export type RedditConfig = RedditConfigDto & {
  newNode?: boolean;
};

export type User = UserDto & { loading?: boolean };

export type Log = LogDto & { loading?: boolean };

export type UserDto = {
  id: string;
  username: string;
  discriminator: string;
  avatar?: string;
  nodes: RedditConfig[];
  editableNodes: number[];
};
