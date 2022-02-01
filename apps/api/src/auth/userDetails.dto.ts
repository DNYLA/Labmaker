import { Role, User } from '@prisma/client';

export type UserDetails = {
  id: string;
  username: string;
  discriminator: string;
  avatar?: string;
  accessToken: string;
  refreshToken: string;
  tokenVersion?: number;
  role: Role;
};

export type UserPayload = {
  id: string;
  username: string;
  discriminator: string;
  type: Role;
};

export type Done = (err: Error, user: User) => void;
