import { RedditConfig, User as PrismaUser } from '@prisma/client';
import internal = require('stream');

export enum TokenType {
  User,
  Bot,
  Admin,
}

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

export type User = PrismaUser & {
  nodes?: RedditConfig[];
};
