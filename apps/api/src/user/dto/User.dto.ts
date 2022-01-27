import { RedditConfig, Role } from '.prisma/client';
import { IsString } from 'class-validator';

export type UserDto = {
  id: string;
  username: string;
  discriminator: string;
  avatar?: string;
  nodes: RedditConfig[];
  role: Role;
};
