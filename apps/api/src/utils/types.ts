import {
  RedditConfig,
  Role,
  User as PrismaUser,
  UserLogType,
} from '@prisma/client';

export type UserDto = {
  id: string;
  username: string;
  discriminator: string;
  avatar?: string;
  role: Role;
  subjects: string[];

  //Currently Not Fetched but this might just be an easier way of displaying user
  //Tickets means less fetching?
  // studentTickets: string[];
  // tutorTickets: string[];
};

export type AdminUser = {
  id: string;
  username: string;
  discriminator: string;
  avatar?: string;
  nodes: RedditConfig[];
  role: Role;
};

export type DiscordUser = {
  id: string;
  username: string;
  avatar?: string;
  discriminator: string;
  mfa_enabled: boolean;
  premium_type: number;
};

export type OAuthDiscordUser = {
  id: string;
  username: string;
  discriminator: string;
  avatar?: string;
  accessToken: string;
  refreshToken: string;
};

export type UserDetails = {
  id: string;
  username: string;
  discriminator: string;
  avatar?: string;
  role: Role;
  ipAddress: string;
  userAgent: string;
  referer?: string;
  path: string;
};

export type UserPayload = {
  id: string;
  username: string;
  discriminator: string;
  type: Role;
};

export type CreateLog = {
  fromUserId: string;
  action: UserLogType;
  actionMessage: string;
};

export type LogInfo = {
  componentName: string;
  componentType: string;
  action: UserLogType;
  information?: string;
  numRows: number;
};

// const userWithNodes = Prisma.validator<Prisma.UserArgs>()({
//   include: { nodes: true },
// });

// export type UserWithNodes = Prisma.UserGetPayload<typeof userWithNodes>;
