import { Subjects } from '@prisma/client';
import { IsOptional, IsString } from 'class-validator';

export class CreateApplicationDTO {
  @IsString()
  applicationMessage: string;

  @IsString()
  vouchesLink: string;

  @IsOptional()
  @IsString()
  redditUsername: string;

  @IsString()
  subjects: Subjects[];
}
