import { RedditConfig, User as PrismaUser } from '@prisma/client';

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

// const userWithNodes = Prisma.validator<Prisma.UserArgs>()({
//   include: { nodes: true },
// });

// export type UserWithNodes = Prisma.UserGetPayload<typeof userWithNodes>;
