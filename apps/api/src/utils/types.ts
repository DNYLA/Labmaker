import { RedditConfig, User as PrismaUser } from '@prisma/client';

export enum TokenType {
  User,
  Bot,
  Admin,
}

export type User = PrismaUser & {
  nodes?: RedditConfig[];
};
