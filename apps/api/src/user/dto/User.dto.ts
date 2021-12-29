import { RedditConfig } from '.prisma/client';
import { IsString } from 'class-validator';

export class UserDto {
  @IsString()
  id: string;

  @IsString()
  username: string;

  @IsString()
  discriminator: string;

  @IsString()
  avatar: string | null;

  @IsString({ each: true })
  nodes: RedditConfig[];
}
