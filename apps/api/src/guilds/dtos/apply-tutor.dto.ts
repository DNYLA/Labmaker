import { Subjects } from '@prisma/client';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateApplicationDTO {
  @IsNumber()
  id: number;

  @IsString()
  userId: string;

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
