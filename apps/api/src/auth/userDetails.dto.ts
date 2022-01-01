import { User } from '@prisma/client';

export type UserDetails = {
  id: string;
  username: string;
  discriminator: string;
  avatar: string;
  accessToken: string;
  refreshToken: string;
  tokenVersion?: number;
  type: TokenType;
};

export type Done = (err: Error, user: User) => void;
